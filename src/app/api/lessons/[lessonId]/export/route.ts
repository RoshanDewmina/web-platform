import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { convertSlidesToBlocks } from "@/types/unified-content";
import matter from "gray-matter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;
    const { searchParams } = request.nextUrl;
    const format = searchParams.get("format") || "auto"; // auto, mdx, json

    // Fetch lesson with all related data
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                createdBy: true,
                visibility: true,
              },
            },
          },
        },
        slides: {
          include: {
            blocks: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check access permissions
    const hasAccess = 
      lesson.module.course.visibility === "PUBLIC" ||
      lesson.module.course.createdBy === userId ||
      await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: lesson.module.course.id,
          status: "ACTIVE",
        },
      });

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    let content: string;
    let filename: string;
    let contentType: string;

    // Determine export format
    const exportFormat = format === "auto" ? 
      (lesson.contentType === "MDX" ? "mdx" : "json") : 
      format;

    switch (exportFormat) {
      case "mdx":
        content = await exportToMDX(lesson);
        filename = `${sanitizeFilename(lesson.title)}.mdx`;
        contentType = "text/mdx";
        break;
        
      case "json":
        content = await exportToJSON(lesson);
        filename = `${sanitizeFilename(lesson.title)}.json`;
        contentType = "application/json";
        break;
        
      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // Return file
    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}

// Export multiple lessons
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lessonIds, format = "json" } = body;

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid lesson IDs" },
        { status: 400 }
      );
    }

    // Fetch all lessons
    const lessons = await prisma.lesson.findMany({
      where: {
        id: { in: lessonIds },
      },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                createdBy: true,
              },
            },
          },
        },
        slides: {
          include: {
            blocks: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    // Check if user has access to all lessons
    const courseIds = [...new Set(lessons.map(l => l.module.course.id))];
    const isOwner = lessons.every(l => l.module.course.createdBy === userId);

    if (!isOwner) {
      return NextResponse.json(
        { error: "You can only export lessons from courses you own" },
        { status: 403 }
      );
    }

    // Create export package
    const exportData = {
      exportDate: new Date().toISOString(),
      courseInfo: {
        ids: courseIds,
        titles: [...new Set(lessons.map(l => l.module.course.title))],
      },
      lessons: await Promise.all(
        lessons.map(async (lesson) => {
          if (format === "mdx") {
            return {
              filename: `${sanitizeFilename(lesson.title)}.mdx`,
              content: await exportToMDX(lesson),
            };
          } else {
            const jsonContent = await exportToJSON(lesson);
            return {
              filename: `${sanitizeFilename(lesson.title)}.json`,
              content: JSON.parse(jsonContent),
            };
          }
        })
      ),
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Batch export error:", error);
    return NextResponse.json(
      { error: "Batch export failed" },
      { status: 500 }
    );
  }
}

// Helper function to export lesson to MDX format
async function exportToMDX(lesson: any): Promise<string> {
  const metadata = lesson.contentMetadata || {};
  
  // Build frontmatter
  const frontmatter = {
    title: lesson.title,
    summary: lesson.description,
    estimatedMinutes: lesson.duration || 10,
    tags: metadata.tags || [],
    level: metadata.level || "beginner",
    coverImage: lesson.coverImage,
    objectives: metadata.objectives || [],
    prerequisites: metadata.prerequisites || [],
  };

  let content = "";

  // If already MDX, return as is
  if (lesson.contentType === "MDX" && lesson.mdxContent) {
    // Update frontmatter in existing MDX
    const { content: mdxBody } = matter(lesson.mdxContent);
    return matter.stringify(mdxBody, frontmatter);
  }

  // Convert other formats to MDX
  if (lesson.contentType === "JSON_BLOCKS" && lesson.jsonBlocks) {
    content = convertJSONBlocksToMDX(lesson.jsonBlocks.blocks || []);
  } else if (lesson.contentType === "SLIDES" && lesson.slides) {
    const blocks = convertSlidesToBlocks(lesson.slides);
    content = convertJSONBlocksToMDX(blocks);
  }

  return matter.stringify(content, frontmatter);
}

// Helper function to export lesson to JSON format
async function exportToJSON(lesson: any): Promise<string> {
  const metadata = {
    title: lesson.title,
    summary: lesson.description,
    estimatedMinutes: lesson.duration || 10,
    tags: lesson.contentMetadata?.tags || [],
    level: lesson.contentMetadata?.level || "beginner",
    coverImage: lesson.coverImage,
    objectives: lesson.contentMetadata?.objectives || [],
    prerequisites: lesson.contentMetadata?.prerequisites || [],
  };

  let blocks = [];

  // Get blocks based on content type
  if (lesson.contentType === "JSON_BLOCKS" && lesson.jsonBlocks) {
    blocks = lesson.jsonBlocks.blocks || [];
  } else if (lesson.contentType === "SLIDES" && lesson.slides) {
    blocks = convertSlidesToBlocks(lesson.slides);
  } else if (lesson.contentType === "MDX" && lesson.mdxContent) {
    // For MDX, we can't easily convert back to blocks
    // So we'll export as a single markdown block
    const { content } = matter(lesson.mdxContent);
    blocks = [{
      type: "paragraph",
      text: `[MDX Content]\n\n${content}`,
    }];
  }

  return JSON.stringify({ metadata, blocks }, null, 2);
}

// Helper function to convert JSON blocks to MDX
function convertJSONBlocksToMDX(blocks: any[]): string {
  const mdxParts: string[] = [];

  blocks.forEach(block => {
    switch (block.type) {
      case "heading":
        mdxParts.push(`${"#".repeat(block.level)} ${block.text}`);
        break;
        
      case "paragraph":
        mdxParts.push(block.text);
        break;
        
      case "list":
        const listMarker = block.ordered ? "1." : "-";
        block.items.forEach((item: string) => {
          mdxParts.push(`${listMarker} ${item}`);
        });
        break;
        
      case "image":
        mdxParts.push(`<Image src="${block.src}" alt="${block.alt}" ${block.caption ? `caption="${block.caption}"` : ""} />`);
        break;
        
      case "video":
        mdxParts.push(`<Video provider="${block.provider}" videoId="${block.videoId}" ${block.title ? `title="${block.title}"` : ""} />`);
        break;
        
      case "callout":
        mdxParts.push(`<Callout variant="${block.variant}" ${block.title ? `title="${block.title}"` : ""}>\n${block.content}\n</Callout>`);
        break;
        
      case "code":
        mdxParts.push(`\`\`\`${block.language}${block.filename ? ` filename="${block.filename}"` : ""}\n${block.code}\n\`\`\``);
        break;
        
      case "quiz":
        // Convert quiz to MDX component
        const quizProps = JSON.stringify({
          questions: block.questions,
          passingScore: block.passingScore,
          showFeedback: block.showFeedback,
        });
        mdxParts.push(`<Quiz {...${quizProps}} />`);
        break;
        
      case "divider":
        mdxParts.push("---");
        break;
        
      default:
        // For unsupported blocks, add a comment
        mdxParts.push(`{/* Unsupported block type: ${block.type} */}`);
    }
    
    mdxParts.push(""); // Add empty line between blocks
  });

  return mdxParts.join("\n");
}

// Helper function to sanitize filename
function sanitizeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100); // Limit length
}
