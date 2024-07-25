import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import pinecone from "@/lib/pinecone";
import { CohereClient } from "cohere-ai";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

// Assuming dimension is a constant that should match the Pinecone index dimension
const dimension = 4096; // Example value, replace with actual dimension

interface MyEmbeddingsInterface {
  embedDocuments(docs: string[]): Promise<number[][]>;
  embedQuery(query: string): Promise<number[]>;
}

class CohereEmbeddings implements MyEmbeddingsInterface {
  async embedDocuments(docs: string[]): Promise<number[][]> {
    return await generateEmbeddings(docs);
  }

  async embedQuery(query: string): Promise<number[]> {
    const [embedding] = await generateEmbeddings([query]);
    return embedding;
  }
}

const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY!,
});

const f = createUploadthing();

const middleware = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new Error("Unauthorized");
    const subscriptionPlan = await getUserSubscriptionPlan();

    return { userId: user.id, subscriptionPlan };
  } catch (error) {
    console.error("Error in middleware:", error);
    throw error;
  }
};

// Generate embeddings using Cohere
const generateEmbeddings = async (texts: string[]) => {
  const response = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      texts,
      model: "embed-english-v2.0",
    }),
  });

  const data = await response.json();
  console.log("Embeddings dimension:", data.embeddings[0].length);
  return data.embeddings;
};

// Handler for upload completion
const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: { key: string; name: string; url: string };
}) => {
  let createdFile;
  console.log("Upload complete triggered for file:", file.key);

  try {
    // Check if the file already exists
    const isFileExist = await db.file.findFirst({
      where: { key: file.key },
    });

    if (isFileExist) {
      console.log("File already exists:", file.key);
      return;
    }

    // Create a new file record
    createdFile = await db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://utfs.io/f/${file.key}`,
        uploadStatus: "PROCESSING",
      },
    });

    console.log("File created in database:", createdFile);

    // Fetch the PDF file
    const response = await fetch(`https://utfs.io/f/${file.key}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch the PDF file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();
    const pageAmt = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const freePlan = PLANS.find((p) => p.name === "Free");
    const proPlan = PLANS.find((p) => p.name === "Pro");

    if (!freePlan || !proPlan) {
      throw new Error("Plan definitions are missing");
    }

    const isExceeded =
      (!isSubscribed && pageAmt > freePlan.pagesPerPdf) ||
      (isSubscribed && pageAmt > proPlan.pagesPerPdf);

    if (isExceeded) {
      await db.file.update({
        where: { id: createdFile.id },
        data: { uploadStatus: "FAILED" },
      });
      console.log(
        `Upload failed: Page limit exceeded for user ${
          isSubscribed ? "Pro" : "Free"
        } plan.`
      );
      return;
    }

    console.log("PDF loaded with pages:", pageAmt);

    // Generate embeddings
    const embeddings = await generateEmbeddings(
      pageLevelDocs.map((doc) => doc.pageContent)
    );

    // Check the embedding dimensions to match with Pinecone index
    if (embeddings[0].length !== dimension) {
      // Ensure this matches Pinecone index dimension
      throw new Error(
        `Embedding dimension (${embeddings[0].length}) does not match Pinecone index dimension (${dimension})`
      );
    }
    console.log("Generated embeddings:", embeddings);

    // Store documents in Pinecone
    const pineconeStore = new PineconeStore(new CohereEmbeddings(), {
      pineconeIndex: pinecone.Index("docquery"),
      namespace: createdFile.id,
    });

    const documents = pageLevelDocs.map((doc, index) => ({
      id: doc.id || "",
      pageContent: doc.pageContent,
      metadata: {
        referenceURL: file.url,
        text: doc.pageContent,
      },
      embedding: embeddings[index],
    }));

    await pineconeStore.addDocuments(documents);
    console.log("Embeddings created and stored in Pinecone.");

    // Update file status
    await db.file.update({
      where: { id: createdFile.id },
      data: { uploadStatus: "SUCCESS" },
    });

    console.log("File status updated to SUCCESS:", createdFile.id);
  } catch (error) {
    console.error("Error during upload processing:", error);

    if (createdFile) {
      await db.file.update({
        where: { id: createdFile.id },
        data: { uploadStatus: "FAILED" },
      });
    }
  }
};


// Define the file router
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
