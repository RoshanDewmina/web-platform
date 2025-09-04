import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { semanticSearch, SearchQuery, CollectionName } from '@/lib/semantic-search-simple';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { collection, query }: { collection: CollectionName; query: SearchQuery } = body;

    if (!collection || !query?.text) {
      return NextResponse.json(
        { error: 'Missing required fields: collection and query.text' },
        { status: 400 }
      );
    }

    // Validate collection
    const validCollections = ['slides', 'assets', 'components', 'courses', 'content'];
    if (!validCollections.includes(collection)) {
      return NextResponse.json(
        { error: 'Invalid collection name' },
        { status: 400 }
      );
    }

    // Perform search
    const results = await semanticSearch.search(collection, query);

    return NextResponse.json({
      results,
      query: query.text,
      collection,
      total: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const collection = searchParams.get('collection') as CollectionName;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    const searchQuery: SearchQuery = {
      text: query,
      limit: 20,
    };

    // Add filters if provided
    const filters: Record<string, any> = {};
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');

    if (type) filters.type = type;
    if (category) filters.category = category;
    if (tags) filters.tags = tags.split(',');

    if (Object.keys(filters).length > 0) {
      searchQuery.filters = filters;
    }

    // Perform search
    const results = collection
      ? await semanticSearch.search(collection, searchQuery)
      : await semanticSearch.searchAll(searchQuery);

    return NextResponse.json({
      results,
      query,
      collection: collection || 'all',
      total: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
