import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API!,
});

const indexName = "serverless-index";

(async () => {
  try {
    const indexExists = await pinecone
      .listIndexes()
      .then((indexes: any) =>
        Object.values(indexes).some((name) => name === indexName)
      );

    if (!indexExists) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });
      console.log(`Index "${indexName}" created successfully.`);
    } else {
      console.log(`Index "${indexName}" already exists.`);
    }
  } catch (error) {
    console.error("Error creating index:", error);
  }
})();

export default pinecone;
