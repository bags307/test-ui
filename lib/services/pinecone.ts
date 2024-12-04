import { Pinecone } from '@pinecone-database/pinecone';

class PineconeService {
  private client: Pinecone;
  private indexName: string;

  constructor() {
    this.client = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || '',
    });
    this.indexName = 'sam-assistant';
  }

  async search(query: string, topK: number = 5) {
    try {
      const index = this.client.index(this.indexName);
      const queryEmbedding = await this.getQueryEmbedding(query);
      
      const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

      return results.matches.map((match) => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata || {},
      }));
    } catch (error) {
      console.error('Pinecone search error:', error);
      throw error;
    }
  }

  async upsert(documents: Array<{ id: string; content: string; metadata?: Record<string, any> }>) {
    try {
      const index = this.client.index(this.indexName);
      const vectors = await Promise.all(
        documents.map(async (doc) => ({
          id: doc.id,
          values: await this.getDocumentEmbedding(doc.content),
          metadata: doc.metadata || {},
        }))
      );

      await index.upsert(vectors);
      return true;
    } catch (error) {
      console.error('Pinecone upsert error:', error);
      throw error;
    }
  }

  private async getQueryEmbedding(query: string): Promise<number[]> {
    // TODO: Replace with actual embedding generation
    // This is a placeholder that returns random embeddings
    return Array.from({ length: 1536 }, () => Math.random() - 0.5);
  }

  private async getDocumentEmbedding(content: string): Promise<number[]> {
    // TODO: Replace with actual embedding generation
    // This is a placeholder that returns random embeddings
    return Array.from({ length: 1536 }, () => Math.random() - 0.5);
  }
}

export const pineconeService = new PineconeService();