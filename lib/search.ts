import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

interface SearchResult {
  chunkId: string;
  documentId: string;
  fileName: string;
  content: string;
  distance: number;
}

export async function searchChunks(
  query: string,
  userId: string,
  limit: number = 5,
  documentId?: string
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      "Chunk".id AS "chunkId",
      "Chunk"."documentId",
      "Document"."fileName",
      "Chunk".content,
      "Chunk".embedding <=> ${vectorString}::vector AS distance
    FROM "Chunk"
    JOIN "Document" ON "Chunk"."documentId" = "Document".id
    WHERE "Document"."userId" = ${userId}
      AND (${documentId}::text IS NULL OR "Document".id = ${documentId})
    ORDER BY distance ASC
    LIMIT ${limit}
  `;

  return results;
}