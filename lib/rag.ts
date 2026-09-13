import { GoogleGenAI } from "@google/genai";
import { searchChunks } from "@/lib/search";

const CHAT_MODEL = "gemini-3.8-flash";

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || "placeholder-key";
  return new GoogleGenAI({ apiKey });
}

interface RAGResponse {
  answer: string;
  sources: { fileName: string; content: string; cited: boolean }[];
}

export async function generateAnswer(
  question: string,
  userId: string,
  documentId?: string
): Promise<RAGResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required for AI question answering.");
  }

  const chunks = await searchChunks(question, userId, 5, documentId);

  if (chunks.length === 0) {
    return {
      answer: "I couldn't find any relevant information in your documents to answer that.",
      sources: [],
    };
  }

  const context = chunks
    .map((chunk, i) => `[${i + 1}] From "${chunk.fileName}":\n${chunk.content}`)
    .join("\n\n");

  const prompt = `You are a helpful assistant answering questions based only on the provided document excerpts. If the excerpts don't contain enough information to answer, say so clearly rather than guessing.

Cite your sources inline using the bracketed numbers shown below (e.g. [1], [2]) immediately after any claim drawn from that excerpt. Only cite excerpts you actually use.

Context:
${context}

Question: ${question}

Answer:`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: prompt,
  });

  const answer = response.text ?? "No response generated.";

  const citedNumbers = new Set(
    [...answer.matchAll(/\[(\d+)\]/g)].map((match) => parseInt(match[1], 10))
  );

  const sources = chunks.map((chunk, i) => ({
    fileName: chunk.fileName,
    content: chunk.content,
    cited: citedNumbers.has(i + 1),
  }));

  return { answer, sources };
}