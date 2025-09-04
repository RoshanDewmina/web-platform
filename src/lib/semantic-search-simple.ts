// Simplified semantic search for testing
export interface SearchResult {
  id: string;
  score: number;
  payload: Record<string, any>;
  vector?: number[];
}

export interface SearchQuery {
  text: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
  threshold?: number;
}

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

export interface SearchIndex {
  name: string;
  description: string;
  vectorSize: number;
  distance: 'Cosine' | 'Euclidean' | 'Dot';
}

// Collection names for different content types
export const COLLECTIONS = {
  SLIDES: 'slides',
  ASSETS: 'assets',
  COMPONENTS: 'components',
  COURSES: 'courses',
  CONTENT: 'content',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export class SemanticSearch {
  private openaiApiKey: string;
  private mockData: Map<string, SearchResult[]> = new Map();

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.initializeMockData();
  }

  /**
   * Initialize mock data for testing
   */
  private initializeMockData(): void {
    // Mock data for components
    this.mockData.set(COLLECTIONS.COMPONENTS, [
      {
        id: 'counter-1',
        score: 0.95,
        payload: {
          title: 'Interactive Counter',
          description: 'A simple counter with increment/decrement buttons',
          type: 'component',
          category: 'interactive',
          tags: ['counter', 'interactive', 'simple'],
          created_by: 'user-1',
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'timer-1',
        score: 0.92,
        payload: {
          title: 'Countdown Timer',
          description: 'A countdown timer with start/pause/reset controls',
          type: 'component',
          category: 'interactive',
          tags: ['timer', 'countdown', 'controls'],
          created_by: 'user-1',
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'progress-1',
        score: 0.88,
        payload: {
          title: 'Progress Bar',
          description: 'A customizable progress bar component',
          type: 'component',
          category: 'visualization',
          tags: ['progress', 'bar', 'visualization'],
          created_by: 'user-2',
          created_at: new Date().toISOString(),
        },
      },
    ]);

    // Mock data for slides
    this.mockData.set(COLLECTIONS.SLIDES, [
      {
        id: 'slide-1',
        score: 0.90,
        payload: {
          title: 'Introduction Slide',
          description: 'Welcome slide with title and subtitle',
          type: 'slide',
          category: 'presentation',
          tags: ['introduction', 'welcome', 'title'],
          created_by: 'user-1',
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'slide-2',
        score: 0.85,
        payload: {
          title: 'Data Visualization',
          description: 'Slide with charts and graphs',
          type: 'slide',
          category: 'data',
          tags: ['charts', 'graphs', 'visualization'],
          created_by: 'user-2',
          created_at: new Date().toISOString(),
        },
      },
    ]);

    // Mock data for assets
    this.mockData.set(COLLECTIONS.ASSETS, [
      {
        id: 'asset-1',
        score: 0.87,
        payload: {
          title: 'Business Icons',
          description: 'Professional business icon set',
          type: 'image',
          category: 'icons',
          tags: ['business', 'icons', 'professional'],
          created_by: 'user-1',
          created_at: new Date().toISOString(),
        },
      },
    ]);
  }

  /**
   * Initialize the semantic search system
   */
  async initialize(): Promise<void> {
    console.log('Semantic search system initialized successfully (mock mode)');
  }

  /**
   * Generate embeddings for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (!this.openaiApiKey) {
      // Return mock embedding for testing
      return {
        embedding: Array.from({ length: 1536 }, () => Math.random()),
        tokens: text.length,
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-3-small',
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        embedding: data.data[0].embedding,
        tokens: data.usage.total_tokens,
      };
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      // Return mock embedding as fallback
      return {
        embedding: Array.from({ length: 1536 }, () => Math.random()),
        tokens: text.length,
      };
    }
  }

  /**
   * Search for similar content (mock implementation)
   */
  async search(
    collection: CollectionName,
    query: SearchQuery
  ): Promise<SearchResult[]> {
    try {
      const mockResults = this.mockData.get(collection) || [];
      
      // Simple text-based filtering for mock data
      const filteredResults = mockResults.filter(result => {
        const searchText = query.text.toLowerCase();
        const title = result.payload.title?.toLowerCase() || '';
        const description = result.payload.description?.toLowerCase() || '';
        const tags = result.payload.tags?.join(' ').toLowerCase() || '';
        
        return title.includes(searchText) || 
               description.includes(searchText) || 
               tags.includes(searchText);
      });

      // Apply filters if provided
      let finalResults = filteredResults;
      if (query.filters) {
        finalResults = filteredResults.filter(result => {
          for (const [key, value] of Object.entries(query.filters!)) {
            if (result.payload[key] !== value) {
              return false;
            }
          }
          return true;
        });
      }

      // Apply limit
      const limit = query.limit || 10;
      return finalResults.slice(0, limit);
    } catch (error) {
      console.error(`Search failed in ${collection}:`, error);
      return [];
    }
  }

  /**
   * Search across multiple collections
   */
  async searchAll(query: SearchQuery, collections: CollectionName[] = Object.values(COLLECTIONS)): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const collection of collections) {
      try {
        const collectionResults = await this.search(collection, query);
        results.push(...collectionResults);
      } catch (error) {
        console.error(`Search failed for collection ${collection}:`, error);
      }
    }

    // Sort by score and remove duplicates
    const uniqueResults = this.deduplicateResults(results);
    return uniqueResults.sort((a, b) => b.score - a.score);
  }

  /**
   * Remove duplicate results based on ID
   */
  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter((result) => {
      if (seen.has(result.id)) {
        return false;
      }
      seen.add(result.id);
      return true;
    });
  }

  /**
   * Index content in the vector database (mock implementation)
   */
  async indexContent(
    collection: CollectionName,
    id: string,
    content: string,
    metadata: Record<string, any>
  ): Promise<void> {
    console.log(`Mock indexed content in ${collection}: ${id}`);
  }

  /**
   * Delete content from index (mock implementation)
   */
  async deleteContent(collection: CollectionName, id: string): Promise<void> {
    console.log(`Mock deleted content from ${collection}: ${id}`);
  }

  /**
   * Update indexed content (mock implementation)
   */
  async updateContent(
    collection: CollectionName,
    id: string,
    content: string,
    metadata: Record<string, any>
  ): Promise<void> {
    console.log(`Mock updated content in ${collection}: ${id}`);
  }

  /**
   * Get collection statistics (mock implementation)
   */
  async getCollectionInfo(collection: CollectionName): Promise<any> {
    const mockResults = this.mockData.get(collection) || [];
    return {
      name: collection,
      points_count: mockResults.length,
      status: 'ok',
    };
  }

  /**
   * Search for similar components
   */
  async searchComponents(query: string, filters?: Record<string, any>): Promise<SearchResult[]> {
    return this.search(COLLECTIONS.COMPONENTS, {
      text: query,
      filters,
      limit: 20,
    });
  }

  /**
   * Search for similar assets
   */
  async searchAssets(query: string, filters?: Record<string, any>): Promise<SearchResult[]> {
    return this.search(COLLECTIONS.ASSETS, {
      text: query,
      filters,
      limit: 20,
    });
  }

  /**
   * Search for similar slides
   */
  async searchSlides(query: string, filters?: Record<string, any>): Promise<SearchResult[]> {
    return this.search(COLLECTIONS.SLIDES, {
      text: query,
      filters,
      limit: 20,
    });
  }

  /**
   * Get recommendations based on content (mock implementation)
   */
  async getRecommendations(
    contentId: string,
    collection: CollectionName,
    limit: number = 5
  ): Promise<SearchResult[]> {
    const mockResults = this.mockData.get(collection) || [];
    return mockResults
      .filter(result => result.id !== contentId)
      .slice(0, limit);
  }

  /**
   * Batch index multiple items (mock implementation)
   */
  async batchIndex(
    collection: CollectionName,
    items: Array<{
      id: string;
      content: string;
      metadata: Record<string, any>;
    }>
  ): Promise<void> {
    console.log(`Mock batch indexed ${items.length} items in ${collection}`);
  }
}

// Export singleton instance
export const semanticSearch = new SemanticSearch();





