import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { documentProcessor, ProcessingResult } from '@/lib/document-processor';
import { semanticSearch } from '@/lib/semantic-search-simple';

interface BatchProcessingRequest {
  files: {
    name: string;
    content: string; // Base64 encoded file content
    type: string;
  }[];
  options: {
    extractImages?: boolean;
    generateSlides?: boolean;
    preserveFormatting?: boolean;
    slideTemplate?: string;
    maxSlidesPerSection?: number;
    addToIndex?: boolean;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: BatchProcessingRequest = await req.json();
    const { files, options } = body;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed for batch processing' },
        { status: 400 }
      );
    }

    const results: Array<{
      filename: string;
      success: boolean;
      result?: ProcessingResult;
      error?: string;
    }> = [];

    // Process files sequentially to avoid overwhelming the system
    for (const fileData of files) {
      try {
        // Convert base64 to File object
        const binaryString = atob(fileData.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const file = new File([bytes], fileData.name, { type: fileData.type });

        // Validate file
        const validation = documentProcessor.validateFile(file);
        if (!validation.isValid) {
          results.push({
            filename: fileData.name,
            success: false,
            error: validation.error,
          });
          continue;
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
              `doc-${Date.now()}-${Math.random()}`,
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

        results.push({
          filename: fileData.name,
          success: true,
          result,
        });
      } catch (error) {
        results.push({
          filename: fileData.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: files.length,
        successful: successCount,
        failed: errorCount,
      },
      message: `Processed ${successCount}/${files.length} files successfully`,
    });
  } catch (error) {
    console.error('Batch processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process documents' },
      { status: 500 }
    );
  }
}





