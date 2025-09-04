import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { documentProcessor } from '@/lib/document-processor';
import { semanticSearch } from '@/lib/semantic-search-simple';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const options = JSON.parse(formData.get('options') as string || '{}');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = documentProcessor.validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Process document
    const result = await documentProcessor.processDocument(file, {
      extractImages: options.extractImages || false,
      generateSlides: options.generateSlides || false,
      preserveFormatting: options.preserveFormatting || true,
      slideTemplate: options.slideTemplate || 'professional',
      maxSlidesPerSection: options.maxSlidesPerSection || 3,
    });

    // Index content if requested
    if (options.addToIndex && result.document) {
      try {
        await semanticSearch.indexContent(
          'content',
          `doc-${Date.now()}`,
          result.document.content,
          {
            title: result.document.title,
            type: 'document',
            category: 'imported',
            sections: result.document.sections.length,
            wordCount: result.document.metadata.wordCount,
            created_by: userId,
            created_at: new Date().toISOString(),
          }
        );
      } catch (indexError) {
        console.error('Failed to index document:', indexError);
        // Don't fail the entire request if indexing fails
      }
    }

    return NextResponse.json({
      success: true,
      result,
      message: 'Document processed successfully',
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
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

    // Return supported formats and limits
    return NextResponse.json({
      supportedFormats: documentProcessor.getSupportedFormats(),
      maxFileSize: 50 * 1024 * 1024, // 50MB
      maxFiles: 5,
      features: {
        extractImages: true,
        generateSlides: true,
        preserveFormatting: true,
        semanticIndexing: true,
      },
    });
  } catch (error) {
    console.error('Document info error:', error);
    return NextResponse.json(
      { error: 'Failed to get document info' },
      { status: 500 }
    );
  }
}





