import { JSONLessonFormat, UnifiedContentBlock, validateContentBlocks, extractTextFromBlocks } from "@/types/unified-content";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Parse and validate JSON blocks content
 */
export function parseJSONBlocksContent(content: string | object): JSONLessonFormat {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    return JSONLessonFormat.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join(", ");
      throw new Error(`Invalid JSON blocks format: ${issues}`);
    }
    throw new Error(`Failed to parse JSON blocks: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Load JSON blocks lesson from database
 */
export async function loadJSONBlocksLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.contentType !== "JSON_BLOCKS" || !lesson.jsonBlocks) {
    throw new Error("Lesson does not contain JSON blocks content");
  }

  // Ensure jsonBlocks is an object or string (Prisma Json type can be other types)
  if (typeof lesson.jsonBlocks !== "string" && typeof lesson.jsonBlocks !== "object") {
    throw new Error("Invalid JSON blocks format");
  }

  const parsed = parseJSONBlocksContent(lesson.jsonBlocks as string | object);

  return {
    lesson,
    metadata: parsed.metadata,
    blocks: parsed.blocks,
  };
}

/**
 * Validate JSON blocks without fully parsing
 */
export function validateJSONBlocks(content: string | object): { valid: boolean; error?: string } {
  try {
    parseJSONBlocksContent(content);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid JSON blocks",
    };
  }
}

/**
 * Create a new JSON blocks lesson
 */
export async function createJSONBlocksLesson(
  moduleId: string,
  content: string | JSONLessonFormat,
  orderIndex?: number
) {
  const parsed = typeof content === "string" ? parseJSONBlocksContent(content) : content;
  
  // Calculate order index if not provided
  if (orderIndex === undefined) {
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true },
    });
    orderIndex = (lastLesson?.orderIndex ?? -1) + 1;
  }
  
  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title: parsed.metadata.title,
      description: parsed.metadata.summary,
      content: {}, // Legacy field, required but not used for JSON_BLOCKS
      contentType: "JSON_BLOCKS",
      jsonBlocks: parsed as any,
      contentMetadata: parsed.metadata as any,
      duration: parsed.metadata.estimatedMinutes,
      orderIndex,
      coverImage: parsed.metadata.coverImage,
      assets: [],
    },
  });
  
  return lesson;
}

/**
 * Update an existing lesson with JSON blocks content
 */
export async function updateJSONBlocksLesson(
  lessonId: string,
  content: string | JSONLessonFormat
) {
  const parsed = typeof content === "string" ? parseJSONBlocksContent(content) : content;
  
  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: parsed.metadata.title,
      description: parsed.metadata.summary,
      contentType: "JSON_BLOCKS",
      jsonBlocks: parsed as any,
      contentMetadata: parsed.metadata as any,
      duration: parsed.metadata.estimatedMinutes,
      coverImage: parsed.metadata.coverImage,
    },
  });
  
  return lesson;
}

/**
 * Convert JSON blocks to preview text
 */
export function generateJSONBlocksPreview(blocks: UnifiedContentBlock[], maxLength = 300): string {
  const fullText = extractTextFromBlocks(blocks);
  
  if (fullText.length <= maxLength) {
    return fullText;
  }
  
  // Truncate intelligently
  const truncated = fullText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return fullText.slice(0, lastSpace) + "...";
}

/**
 * Import JSON file and create lesson
 */
export async function importJSONFile(
  moduleId: string,
  fileContent: string,
  filename: string
): Promise<{ lesson: any; warnings: string[] }> {
  const warnings: string[] = [];
  
  try {
    // Validate content
    const validation = validateJSONBlocks(fileContent);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Parse content
    const parsed = parseJSONBlocksContent(fileContent);
    
    // Create lesson
    const lesson = await createJSONBlocksLesson(moduleId, parsed);
    
    // Check for potential issues
    if (!parsed.metadata.coverImage) {
      warnings.push("No cover image specified");
    }
    
    if (!parsed.metadata.objectives || parsed.metadata.objectives.length === 0) {
      warnings.push("No learning objectives specified");
    }
    
    // Check for empty blocks
    if (parsed.blocks.length === 0) {
      warnings.push("No content blocks found");
    }
    
    // Check for missing alt text on images
    const imageBlocks = parsed.blocks.filter(b => b.type === "image") as any[];
    const missingAlt = imageBlocks.filter(img => !img.alt || img.alt === "Image");
    if (missingAlt.length > 0) {
      warnings.push(`${missingAlt.length} image(s) missing proper alt text`);
    }
    
    return { lesson, warnings };
  } catch (error) {
    throw new Error(`Failed to import JSON file ${filename}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Analyze content blocks for statistics
 */
export function analyzeContentBlocks(blocks: UnifiedContentBlock[]) {
  const stats = {
    totalBlocks: blocks.length,
    blockTypes: {} as Record<string, number>,
    textLength: 0,
    imageCount: 0,
    videoCount: 0,
    quizQuestions: 0,
    codeBlocks: 0,
    estimatedReadingTime: 0,
  };
  
  blocks.forEach(block => {
    // Count block types
    stats.blockTypes[block.type] = (stats.blockTypes[block.type] || 0) + 1;
    
    // Specific counters
    switch (block.type) {
      case "image":
        stats.imageCount++;
        break;
      case "video":
        stats.videoCount++;
        break;
      case "quiz":
        stats.quizQuestions += block.questions.length;
        break;
      case "code":
        stats.codeBlocks++;
        break;
    }
  });
  
  // Calculate text length and reading time
  const text = extractTextFromBlocks(blocks);
  stats.textLength = text.length;
  
  // Average reading speed: 200-250 words per minute
  const words = text.split(/\s+/).length;
  stats.estimatedReadingTime = Math.ceil(words / 225);
  
  return stats;
}

/**
 * Merge multiple JSON lessons into one
 */
export function mergeJSONLessons(lessons: JSONLessonFormat[]): JSONLessonFormat {
  if (lessons.length === 0) {
    throw new Error("No lessons to merge");
  }
  
  if (lessons.length === 1) {
    return lessons[0];
  }
  
  // Merge metadata (take first lesson's metadata as base)
  const mergedMetadata = { ...lessons[0].metadata };
  
  // Combine tags from all lessons
  const allTags = new Set<string>();
  lessons.forEach(lesson => {
    lesson.metadata.tags?.forEach(tag => allTags.add(tag));
  });
  mergedMetadata.tags = Array.from(allTags);
  
  // Sum up duration
  mergedMetadata.estimatedMinutes = lessons.reduce(
    (sum, lesson) => sum + lesson.metadata.estimatedMinutes,
    0
  );
  
  // Update title to indicate merged content
  mergedMetadata.title = `${mergedMetadata.title} (Combined)`;
  
  // Merge blocks with dividers between lessons
  const mergedBlocks: UnifiedContentBlock[] = [];
  lessons.forEach((lesson, index) => {
    if (index > 0) {
      mergedBlocks.push({ type: "divider" });
    }
    mergedBlocks.push(...lesson.blocks);
  });
  
  return {
    metadata: mergedMetadata,
    blocks: mergedBlocks,
  };
}
