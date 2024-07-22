import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import pinecone from "@/lib/pinecone";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY!,
});
const f = createUploadthing();

const middleware = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new Error("Unauthorized");

    return { userId: user.id };
  } catch (error) {
    console.error("Error in middleware:", error);
    throw error;
  }
};

const generateEmbeddings = async (texts: string[]) => {
  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      texts: texts,
      model: "embed-english-v2.0",
    }),
  });

  const data = await response.json();
  return data.embeddings;
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  let createdFile;
  console.log("Upload complete triggered for file:", file.key);

  try {
    const isFileExist = await db.file.findFirst({
      where: {
        key: file.key,
      },
    });

    if (isFileExist) {
      console.log("File already exists:", file.key);
      return;
    }

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

    const response = await fetch(`https://utfs.io/f/${file.key}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch the PDF file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const loader = new PDFLoader(blob, {
      splitPages: false,
    });
    const pageLevelDocs = await loader.load();
    const pageAmt = pageLevelDocs.length;

    console.log("PDF loaded with pages:", pageAmt);

    const pineconeIndex = pinecone.Index("docquery");
    const texts = pageLevelDocs.map((doc) => doc.pageContent);
    const embeddings = await generateEmbeddings(texts);

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    console.log("Embeddings created and stored in Pinecone.");

    await db.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "SUCCESS",
      },
    });

    console.log("File status updated to SUCCESS:", createdFile.id);
  } catch (error) {
    if (createdFile) {
      await db.file.update({
        where: {
          id: createdFile.id,
        },
        data: {
          uploadStatus: "FAILED",
        },
      });
    }

    console.error("Error during upload processing:", error);
  }
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
