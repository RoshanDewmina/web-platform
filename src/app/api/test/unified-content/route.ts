import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simple test response to verify our content types are working
    const testData = {
      message: "Unified content system is ready!",
      features: {
        mdx: "MDX content with React components",
        jsonBlocks: "Structured JSON block content",
        slides: "Legacy slide-based content",
        minio: "MinIO asset storage configured",
      },
      contentTypes: ["SLIDES", "MDX", "JSON_BLOCKS"],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(testData);
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
