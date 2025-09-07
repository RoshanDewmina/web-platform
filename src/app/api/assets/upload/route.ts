import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AssetStorage, getAssetType } from "@/lib/storage/minio";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Configure max file size (50MB)
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout for large uploads

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  
  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  
  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;
    const folder = formData.get("folder") as string | null;
    const altText = formData.get("altText") as string | null;
    const isPublic = formData.get("isPublic") === "true";

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Check if user has access to the course
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        OR: [
          { createdBy: userId },
          { enrollments: { some: { userId } } },
        ],
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 403 }
      );
    }

    // Read file content
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Calculate file hash to detect duplicates
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check if file already exists
    const existingAsset = await prisma.enhancedAsset.findUnique({
      where: { sha256Hash: hash },
    });

    if (existingAsset) {
      // Return existing asset
      const signedUrl = await AssetStorage.getSignedUrl(existingAsset.url);
      return NextResponse.json({
        id: existingAsset.id,
        key: existingAsset.url,
        url: signedUrl,
        size: existingAsset.fileSize,
        existing: true,
      });
    }

    // Generate storage key
    const assetType = getAssetType(file.name);
    const storageKey = AssetStorage.generateKey(courseId, assetType as any, file.name);

    // Upload to MinIO
    await AssetStorage.upload(storageKey, buffer, {
      "Content-Type": file.type,
      "Original-Name": file.name,
      "Course-Id": courseId,
      "Uploaded-By": userId,
    });

    // Extract additional metadata for images
    let width, height, duration;
    if (file.type.startsWith("image/")) {
      // You might want to use sharp or another image library here
      // For now, we'll leave these as null
    }

    // Create database record
    const asset = await prisma.enhancedAsset.create({
      data: {
        courseId,
        filename: storageKey,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        url: storageKey,
        sha256Hash: hash,
        altText,
        folderId: folder,
        width,
        height,
        duration,
        tags: [],
        createdBy: userId,
      },
    });

    // Get signed URL for immediate use
    const signedUrl = await AssetStorage.getSignedUrl(storageKey);

    return NextResponse.json({
      id: asset.id,
      key: storageKey,
      url: signedUrl,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve asset info
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const assetId = searchParams.get("id");
    const key = searchParams.get("key");

    if (!assetId && !key) {
      return NextResponse.json(
        { error: "Asset ID or key required" },
        { status: 400 }
      );
    }

    const asset = await prisma.enhancedAsset.findFirst({
      where: assetId ? { id: assetId } : { url: key },
      include: {
        folder: true,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // Check if user has access to the course
    if (asset.courseId) {
      const hasAccess = await prisma.course.findFirst({
        where: {
          id: asset.courseId,
          OR: [
            { visibility: "PUBLIC" },
            { createdBy: userId },
            { enrollments: { some: { userId } } },
          ],
        },
      });

      if (!hasAccess) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    }

    // Get signed URL
    const signedUrl = await AssetStorage.getSignedUrl(asset.url);

    return NextResponse.json({
      ...asset,
      signedUrl,
    });
  } catch (error) {
    console.error("Get asset error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve asset" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove an asset
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const assetId = searchParams.get("id");

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID required" },
        { status: 400 }
      );
    }

    // Find asset and verify ownership
    const asset = await prisma.enhancedAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // Check if user owns the course
    if (asset.courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: asset.courseId,
          createdBy: userId,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    }

    // Delete from storage
    try {
      await AssetStorage.delete(asset.url);
    } catch (error) {
      console.error("Failed to delete from storage:", error);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await prisma.enhancedAsset.delete({
      where: { id: assetId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete asset error:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
