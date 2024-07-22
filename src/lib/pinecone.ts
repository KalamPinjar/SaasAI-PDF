import {
  Pinecone,
  type ScoredPineconeRecord,
  type IndexModel,
} from "@pinecone-database/pinecone";

export type Metadata = {
  referenceURL: string;
  text: string;
};

// Initialize Pinecone client with API key
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const dimension = 4096;
const indexName = process.env.PINECONE_INDEX_NAME || "namespace-notes";

// Function to create index if it does not exist
const createIndexIfNotExists = async () => {
  try {
    // Retrieve list of indexes
    const indexList = await pinecone.listIndexes();

    if (indexList && indexList.indexes) {
      // Check if the index already exists
      const indexExists = indexList.indexes.some(
        (index: IndexModel) => index.name === indexName
      );

      if (!indexExists) {
        // Create the index if it does not exist
        console.log(`Creating index ${indexName} with dimension ${dimension}`);
        await pinecone.createIndex({
          name: indexName,
          dimension,
          metric: "cosine",
          spec: {
            serverless: {
              cloud: "aws",
              region: "us-east-1",
            },
          },
          waitUntilReady: true,
        });
        console.log(`Index ${indexName} created successfully.`);
      } else {
        console.log(`Index ${indexName} already exists.`);
      }
    } else {
      throw new Error("Failed to retrieve index list.");
    }
  } catch (error) {
    console.error("Error creating index: ", error);
    throw new Error(`Error creating index: ${error}`);
  }
};


// Ensure the index exists before querying
const ensureIndexExists = async () => {
  try {
    await createIndexIfNotExists();
  } catch (error) {
    console.error("Error ensuring index existence: ", error);
    throw new Error(`Error ensuring index existence: ${error}`);
  }
};

// Function to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
  namespace: string
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Ensure the index exists before querying
  await ensureIndexExists();

  // Get the Pinecone index and namespace
  const pineconeNamespace = pinecone
    .Index<Metadata>(indexName)
    .namespace(namespace ?? "");

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (e) {
    // Log the error and throw it
    console.error("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export { getMatchesFromEmbeddings };

export default pinecone;
