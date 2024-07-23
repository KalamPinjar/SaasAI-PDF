import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validator/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import pinecone, { getMatchesFromEmbeddings, Metadata } from "@/lib/pinecone";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY!,
});

const generateEmbeddings = async (texts: string[]) => {
  const response = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      texts: texts,
      model: "embed-english-v2.0",
    }),
  });

  const data = await response.json();
  return data.embeddings;
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);

  if (!fileId || !message) {
    return new Response("Bad Request", { status: 400 });
  }

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    return new Response("Not Found", { status: 404 });
  }

  await db.message.create({
    data: {
      fileId,
      text: message,
      userId: user.id,
      isUserMessage: true,
    },
  });

  const cohereEmbeddings = await generateEmbeddings([message]);
  const pineconeIndex = pinecone.Index("docquery");

  const matches = await getMatchesFromEmbeddings(
    cohereEmbeddings[0],
    4,
    file.id
  );

  const prevMessage = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessage.map((message) => ({
    role: message.isUserMessage ? "USER" : "CHATBOT",
    message: message.text,
  }));

  const chatHistory = formattedPrevMessages.map((msg) => ({
    role: msg.role as "USER" | "CHATBOT",
    message: msg.message,
  }));

  const resultsContext = matches
    .map((match) => match.metadata?.text)
    .join("\n\n");

  const response = await cohere.chat({
    message: message,
    chatHistory: [
      ...chatHistory,
      {
        role: "USER",
        message: `Use the following context to answer the user's question:\n\n${resultsContext}`,
      },
    ],
    model: "command-r-plus",
    temperature: 0,
  });

  const cohereResponse = response.text;

  await db.message.create({
    data: {
      fileId,
      text: cohereResponse,
      userId: user.id,
      isUserMessage: false,
    },
  });

  return new Response(cohereResponse, { status: 200 });
};
