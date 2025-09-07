import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test if environment variables are set
    const config = {
      endpoint: process.env.MINIO_ENDPOINT || "not set",
      port: process.env.MINIO_PORT || "not set",
      bucket: process.env.MINIO_BUCKET || "not set",
      hasAccessKey: !!process.env.MINIO_ACCESS_KEY,
      hasSecretKey: !!process.env.MINIO_SECRET_KEY,
    };

    return NextResponse.json({
      message: "MinIO configuration check",
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to check MinIO config",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
