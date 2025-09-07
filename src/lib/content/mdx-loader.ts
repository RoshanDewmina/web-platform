import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import { LessonMetadata, MDXFrontmatter } from "@/types/unified-content";
import { prisma } from "@/lib/prisma";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// MDX serialization options
const mdxOptions = {
  remarkPlugins: [
    remarkGfm, // GitHub Flavored Markdown
  ],
  rehypePlugins: [
    rehypeSlug, // Add IDs to headings
    [rehypeAutolinkHeadings, { behavior: "wrap" }], // Add links to headings
    rehypeHighlight, // Syntax highlighting
  ],
};

/**
 * Parse MDX content and extract frontmatter
 */
export async function parseMDXContent(content: string) {
  try {
    // Extract frontmatter
    const { data, content: mdxContent } = matter(content);
    
    // Validate frontmatter
    const metadata = MDXFrontmatter.parse(data);
    
    // Serialize MDX content
    const mdxSource = await serialize(mdxContent, {
      mdxOptions,
      parseFrontmatter: false, // We already parsed it
    });
    
    return {
      metadata,
      mdxSource,
      rawContent: mdxContent,
    };
  } catch (error) {
    console.error("Failed to parse MDX content:", error);
    throw new Error(`Invalid MDX content: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Load MDX lesson from database
 */
export async function loadMDXLesson(lessonId: string) {
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

  if (lesson.contentType !== "MDX" || !lesson.mdxContent) {
    throw new Error("Lesson does not contain MDX content");
  }

  const { metadata, mdxSource, rawContent } = await parseMDXContent(lesson.mdxContent);

  return {
    lesson,
    metadata,
    mdxSource,
    rawContent,
  };
}

/**
 * Validate MDX content without fully parsing
 */
export async function validateMDXContent(content: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const { data } = matter(content);
    MDXFrontmatter.parse(data);
    
    // Basic MDX syntax validation could be added here
    // For now, we just check if frontmatter is valid
    
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : "Invalid MDX content"
    };
  }
}

/**
 * Extract text content from MDX for search indexing
 */
export function extractTextFromMDX(mdxContent: string): string {
  // Remove frontmatter
  const { content } = matter(mdxContent);
  
  // Remove MDX/JSX components
  const withoutComponents = content.replace(/<[^>]+>/g, "");
  
  // Remove markdown formatting
  const plainText = withoutComponents
    .replace(/#{1,6}\s/g, "") // Headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/```[^`]*```/gs, "") // Code blocks
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/^\s*[-*+]\s/gm, "") // List markers
    .replace(/^\s*\d+\.\s/gm, "") // Numbered lists
    .replace(/\n{3,}/g, "\n\n") // Multiple newlines
    .trim();
  
  return plainText;
}

/**
 * Convert MDX to preview HTML (for quick previews without full rendering)
 */
export async function generateMDXPreview(mdxContent: string, maxLength = 300): Promise<string> {
  const plainText = extractTextFromMDX(mdxContent);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete sentence within maxLength
  const truncated = plainText.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastQuestion = truncated.lastIndexOf("?");
  const lastExclamation = truncated.lastIndexOf("!");
  
  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
  
  if (lastSentenceEnd > maxLength * 0.5) {
    return plainText.slice(0, lastSentenceEnd + 1);
  }
  
  // If no sentence end found, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(" ");
  return plainText.slice(0, lastSpace) + "...";
}

/**
 * Create a new MDX lesson
 */
export async function createMDXLesson(
  moduleId: string,
  mdxContent: string,
  orderIndex?: number
) {
  const { metadata } = await parseMDXContent(mdxContent);
  
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
      title: metadata.title,
      description: metadata.summary,
      contentType: "MDX",
      mdxContent,
      contentMetadata: metadata as any,
      duration: metadata.estimatedMinutes,
      orderIndex,
      coverImage: metadata.coverImage,
    },
  });
  
  return lesson;
}

/**
 * Update an existing lesson with MDX content
 */
export async function updateMDXLesson(
  lessonId: string,
  mdxContent: string
) {
  const { metadata } = await parseMDXContent(mdxContent);
  
  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: metadata.title,
      description: metadata.summary,
      contentType: "MDX",
      mdxContent,
      contentMetadata: metadata as any,
      duration: metadata.estimatedMinutes,
      coverImage: metadata.coverImage,
    },
  });
  
  return lesson;
}

/**
 * Import MDX file and create lesson
 */
export async function importMDXFile(
  moduleId: string,
  fileContent: string,
  filename: string
): Promise<{ lesson: any; warnings: string[] }> {
  const warnings: string[] = [];
  
  try {
    // Validate content
    const validation = await validateMDXContent(fileContent);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Parse and create lesson
    const lesson = await createMDXLesson(moduleId, fileContent);
    
    // Check for potential issues
    if (!lesson.coverImage) {
      warnings.push("No cover image specified in frontmatter");
    }
    
    if (!lesson.contentMetadata?.objectives || lesson.contentMetadata.objectives.length === 0) {
      warnings.push("No learning objectives specified");
    }
    
    return { lesson, warnings };
  } catch (error) {
    throw new Error(`Failed to import MDX file ${filename}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
