import {
  Pinecone,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
export type Metadata = {
  referenceURL: string;
  text: string;
};

const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
  namespace: string
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  let indexName: string = process.env.PINECONE_INDEX_NAME || "";
  if (indexName === "") {
    indexName = "docquery";
    console.warn("PINECONE_INDEX_NAME environment variable not set");
  }
  // Retrieve list of indexes to check if expected index exists
  const indexes = (await pinecone.listIndexes())?.indexes;
  if (!indexes || indexes.filter((i) => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist. 
    Create an index called "${indexName}" in your project.`);
  }

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
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

// await pinecone.createIndex({
//   name: process.env.PINECONE_INDEX_NAME!,
//   dimension: 1536,
//   metric: "cosine",
//   spec: {
//     serverless: {
//       cloud: "aws",
//       region: "us-east-1",
//     },
//   },
// });

export { getMatchesFromEmbeddings };

export default pinecone;
