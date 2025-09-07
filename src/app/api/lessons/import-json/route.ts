import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { importJSONFile } from "@/lib/content/json-blocks-loader";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const moduleId = formData.get("moduleId") as string;

    if (!file || !moduleId) {
      return NextResponse.json(
        { error: "Missing file or moduleId" },
        { status: 400 }
      );
    }

    // Verify module exists and user has access
    const module = await prisma.module.findFirst({
      where: {
        id: moduleId,
        course: {
          createdBy: userId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found or access denied" },
        { status: 403 }
      );
    }

    // Read and parse file content
    const content = await file.text();

    // Import JSON file
    const { lesson, warnings } = await importJSONFile(
      moduleId,
      content,
      file.name
    );

    // Check for asset references that need to be uploaded
    const assetReferences = extractAssetReferences(lesson.jsonBlocks);

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        contentType: lesson.contentType,
      },
      warnings,
      assetReferences: assetReferences.length > 0 ? assetReferences : undefined,
    });
  } catch (error) {
    console.error("JSON import error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Import failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Import from URL endpoint
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, moduleId } = body;

    if (!url || !moduleId) {
      return NextResponse.json(
        { error: "Missing URL or moduleId" },
        { status: 400 }
      );
    }

    // Verify module permissions
    const module = await prisma.module.findFirst({
      where: {
        id: moduleId,
        course: {
          createdBy: userId,
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found or access denied" },
        { status: 403 }
      );
    }

    // Fetch content from URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }

    const content = await response.text();
    const filename = new URL(url).pathname.split("/").pop() || "imported.json";

    // Import JSON content
    const { lesson, warnings } = await importJSONFile(
      moduleId,
      content,
      filename
    );

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
      },
      warnings,
    });
  } catch (error) {
    console.error("JSON URL import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed" },
      { status: 500 }
    );
  }
}

// Helper function to extract asset references from content blocks
function extractAssetReferences(jsonBlocks: any): string[] {
  if (!jsonBlocks?.blocks) return [];

  const assets: string[] = [];
  const blocks = jsonBlocks.blocks;

  function processBlock(block: any) {
    switch (block.type) {
      case "image":
        if (block.src && !block.src.startsWith("http")) {
          assets.push(block.src);
        }
        break;
      case "video":
        if (block.provider === "minio" && block.videoId) {
          assets.push(block.videoId);
        }
        if (block.poster && !block.poster.startsWith("http")) {
          assets.push(block.poster);
        }
        break;
      case "audio":
        if (block.src && !block.src.startsWith("http")) {
          assets.push(block.src);
        }
        break;
      case "columns":
        block.columns?.forEach((col: any[]) => {
          col.forEach(processBlock);
        });
        break;
      case "accordion":
        block.items?.forEach((item: any) => {
          item.content?.forEach(processBlock);
        });
        break;
      case "tabs":
        block.tabs?.forEach((tab: any) => {
          tab.content?.forEach(processBlock);
        });
        break;
    }
  }

  blocks.forEach(processBlock);
  return [...new Set(assets)]; // Remove duplicates
}
