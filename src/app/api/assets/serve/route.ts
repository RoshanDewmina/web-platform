import { NextRequest, NextResponse } from "next/server";
import { AssetStorage } from "@/lib/storage/minio";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// This route serves assets with proper caching and access control
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const key = searchParams.get("key");
    const download = searchParams.get("download") === "true";
    
    if (!key) {
      return NextResponse.json(
        { error: "Asset key required" },
        { status: 400 }
      );
    }

    // Check if asset exists in database
    const asset = await prisma.enhancedAsset.findFirst({
      where: { url: key },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    if (asset.courseId) {
      // Check if course is public
      const course = await prisma.course.findUnique({
        where: { id: asset.courseId },
        select: { visibility: true },
      });

      if (course?.visibility !== "PUBLIC") {
        // Require authentication for non-public courses
        const { userId } = await auth();
        
        if (!userId) {
          return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        }

        // Check if user has access
        const hasAccess = await prisma.course.findFirst({
          where: {
            id: asset.courseId,
            OR: [
              { createdBy: userId },
              { enrollments: { some: { userId, status: "ACTIVE" } } },
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
    }

    // Generate signed URL with appropriate expiry
    const expirySeconds = asset.mimeType.startsWith("video/") ? 7200 : 3600; // 2 hours for videos, 1 hour for others
    const signedUrl = await AssetStorage.getSignedUrl(key, expirySeconds);

    // Set appropriate headers
    const headers: HeadersInit = {
      "Cache-Control": "public, max-age=3600", // 1 hour cache
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${asset.originalName}"`;
    }

    // For direct serving (not recommended for large files)
    if (searchParams.get("direct") === "true") {
      try {
        const buffer = await AssetStorage.download(key);
        
        return new NextResponse(buffer, {
          headers: {
            ...headers,
            "Content-Type": asset.mimeType,
            "Content-Length": asset.fileSize.toString(),
          },
        });
      } catch (error) {
        console.error("Direct download failed:", error);
        // Fall back to redirect
      }
    }

    // Return signed URL as JSON for client-side fetch
    return NextResponse.json({ 
      url: signedUrl,
      contentType: asset.mimeType,
      filename: asset.originalName,
    }, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Asset serve error:", error);
    return NextResponse.json(
      { error: "Failed to serve asset" },
      { status: 500 }
    );
  }
}

// POST endpoint to get multiple signed URLs at once (batch operation)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { keys } = body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: "Array of keys required" },
        { status: 400 }
      );
    }

    // Limit batch size
    if (keys.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 keys per request" },
        { status: 400 }
      );
    }

    // Fetch all assets
    const assets = await prisma.enhancedAsset.findMany({
      where: {
        url: { in: keys },
      },
      include: {
        course: {
          select: {
            id: true,
            visibility: true,
            createdBy: true,
          },
        },
      },
    });

    // Map assets by key for easy lookup
    const assetMap = new Map(assets.map(a => [a.url, a]));

    // Check access and generate URLs
    const results = await Promise.all(
      keys.map(async (key) => {
        const asset = assetMap.get(key);
        
        if (!asset) {
          return { key, error: "Not found" };
        }

        // Check access
        if (asset.course && asset.course.visibility !== "PUBLIC") {
          if (!userId) {
            return { key, error: "Authentication required" };
          }

          // Simple ownership check (you might want to expand this)
          if (asset.course.createdBy !== userId) {
            const hasEnrollment = await prisma.enrollment.findFirst({
              where: {
                userId,
                courseId: asset.courseId!,
                status: "ACTIVE",
              },
            });

            if (!hasEnrollment) {
              return { key, error: "Access denied" };
            }
          }
        }

        try {
          const url = await AssetStorage.getSignedUrl(key);
          return {
            key,
            url,
            mimeType: asset.mimeType,
            size: asset.fileSize,
            originalName: asset.originalName,
          };
        } catch (error) {
          return { key, error: "Failed to generate URL" };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Batch asset serve error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
