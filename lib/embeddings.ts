import { GoogleGenAI } from "@google/genai";

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || "placeholder-key";
  return new GoogleGenAI({ apiKey });
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required to generate embeddings.");
  }

  const ai = getAiClient();
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: { outputDimensionality: 768 },
  });

  const values = response.embeddings![0].values!;

  const magnitude = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  const normalized = values.map((v) => v / magnitude);

  return normalized;
}