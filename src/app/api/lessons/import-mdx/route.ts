import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { importMDXFile } from "@/lib/content/mdx-loader";
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
          OR: [
            { createdBy: userId },
            { visibility: "PUBLIC" },
            { enrollments: { some: { userId } } },
          ],
        },
      },
      include: {
        course: {
          select: {
            id: true,
            createdBy: true,
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

    // Check if user can create lessons (must be course owner)
    if (module.course.createdBy !== userId) {
      return NextResponse.json(
        { error: "Only course owners can import content" },
        { status: 403 }
      );
    }

    // Read file content
    const content = await file.text();

    // Import MDX file
    const { lesson, warnings } = await importMDXFile(
      moduleId,
      content,
      file.name
    );

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        contentType: lesson.contentType,
      },
      warnings,
    });
  } catch (error) {
    console.error("MDX import error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Import failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Batch import endpoint
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const moduleId = formData.get("moduleId") as string;

    if (!files.length || !moduleId) {
      return NextResponse.json(
        { error: "Missing files or moduleId" },
        { status: 400 }
      );
    }

    // Verify module and permissions (same as above)
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

    // Import all files
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const content = await file.text();
        return importMDXFile(moduleId, content, file.name);
      })
    );

    // Separate successful and failed imports
    const successful = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map(r => r.value);
    
    const failed = results
      .map((r, i) => ({ result: r, file: files[i] }))
      .filter(({ result }): result is { result: PromiseRejectedResult; file: File } => 
        result.status === "rejected"
      )
      .map(({ result, file }) => ({
        filename: file.name,
        error: result.reason?.message || "Unknown error",
      }));

    return NextResponse.json({
      imported: successful.length,
      failed: failed.length,
      lessons: successful.map(s => ({
        id: s.lesson.id,
        title: s.lesson.title,
        warnings: s.warnings,
      })),
      errors: failed,
    });
  } catch (error) {
    console.error("Batch MDX import error:", error);
    return NextResponse.json(
      { error: "Batch import failed" },
      { status: 500 }
    );
  }
}
