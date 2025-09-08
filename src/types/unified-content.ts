import { z } from "zod";

// Re-export existing types for backward compatibility
export type { Course, Module, Lesson, Slide, ContentBlock as LegacyContentBlock } from "./course-builder";

// Content type enum
export enum ContentType {
  SLIDES = "SLIDES",
  MDX = "MDX",
  JSON_BLOCKS = "JSON_BLOCKS"
}

// Content level validation
export const ContentLevel = z.enum(["beginner", "intermediate", "advanced", "expert"]);

// Enhanced lesson metadata that works with all content types
export const LessonMetadata = z.object({
  // Required fields
  title: z.string().min(3).max(200),
  summary: z.string().min(10).max(500).optional(),
  estimatedMinutes: z.number().min(1).max(600),
  
  // Organization
  tags: z.array(z.string()).default([]),
  level: ContentLevel.default("beginner"),
  
  // Media
  coverImage: z.string().optional(), // MinIO object key
  
  // Learning objectives
  objectives: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  
  // Additional metadata
  keywords: z.array(z.string()).optional(),
  author: z.string().optional(),
  lastUpdated: z.string().datetime().optional(),
});

// Quiz question types that work across all content formats
export const QuizQuestion = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  type: z.enum(["multiple_choice", "true_false", "short_answer", "fill_blank", "drag_drop"]),
  question: z.string(),
  options: z.array(z.string()).optional(), // For multiple choice
  correctAnswer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  explanation: z.string().optional(),
  points: z.number().default(1),
  hint: z.string().optional(),
});

// Unified content blocks that can be used in both MDX and JSON
export const UnifiedContentBlock: z.ZodType<any> = z.discriminatedUnion("type", [
  // Text blocks
  z.object({ 
    type: z.literal("heading"), 
    level: z.number().int().min(1).max(3), 
    text: z.string(),
    id: z.string().optional(), // For anchoring
  }),
  z.object({ 
    type: z.literal("paragraph"), 
    text: z.string(),
    className: z.string().optional(),
  }),
  z.object({ 
    type: z.literal("list"), 
    ordered: z.boolean().default(false), 
    items: z.array(z.string()),
    className: z.string().optional(),
  }),
  
  // Media blocks
  z.object({ 
    type: z.literal("image"), 
    src: z.string(), // MinIO key or URL
    alt: z.string(),
    caption: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    className: z.string().optional(),
  }),
  z.object({ 
    type: z.literal("video"), 
    provider: z.enum(["youtube", "vimeo", "minio", "external"]).default("youtube"), 
    videoId: z.string(), // YouTube/Vimeo ID or MinIO key
    url: z.string().optional(), // For external videos
    title: z.string().optional(),
    autoplay: z.boolean().default(false),
    controls: z.boolean().default(true),
    poster: z.string().optional(), // Thumbnail
  }),
  z.object({ 
    type: z.literal("audio"), 
    src: z.string(), // MinIO key or URL
    title: z.string().optional(),
    transcript: z.string().optional(),
  }),
  
  // Interactive blocks
  z.object({ 
    type: z.literal("quiz"), 
    questions: z.array(QuizQuestion),
    passingScore: z.number().min(0).max(100).default(70),
    showFeedback: z.boolean().default(true),
    randomizeQuestions: z.boolean().default(false),
    maxAttempts: z.number().optional(),
  }),
  z.object({ 
    type: z.literal("code"), 
    language: z.string().default("javascript"),
    code: z.string(),
    filename: z.string().optional(),
    runnable: z.boolean().default(false),
    highlightLines: z.array(z.number()).optional(),
    showLineNumbers: z.boolean().default(true),
  }),
  z.object({ 
    type: z.literal("interactive"), 
    componentId: z.string(), // Reference to custom component
    props: z.record(z.string(), z.any()),
    fallback: z.string().optional(), // Fallback content
  }),
  
  // Layout blocks
  z.object({ 
    type: z.literal("callout"), 
    variant: z.enum(["info", "success", "warning", "danger", "tip"]).default("info"),
    title: z.string().optional(),
    content: z.string(),
    icon: z.string().optional(),
  }),
  z.object({ 
    type: z.literal("columns"), 
    columns: z.array(z.lazy(() => z.array(UnifiedContentBlock))),
    gap: z.number().default(4),
    responsive: z.boolean().default(true),
  }),
  z.object({ 
    type: z.literal("accordion"),
    items: z.array(z.object({
      title: z.string(),
      content: z.lazy(() => z.array(UnifiedContentBlock)),
      defaultOpen: z.boolean().default(false),
    })),
  }),
  z.object({ 
    type: z.literal("tabs"),
    tabs: z.array(z.object({
      label: z.string(),
      content: z.lazy(() => z.array(UnifiedContentBlock)),
    })),
    defaultTab: z.number().default(0),
  }),
  
  // Data visualization
  z.object({ 
    type: z.literal("chart"), 
    chartType: z.enum(["line", "bar", "pie", "scatter", "area"]),
    data: z.any(), // Chart.js compatible data
    options: z.any().optional(),
    height: z.number().default(400),
  }),
  z.object({ 
    type: z.literal("table"), 
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
    responsive: z.boolean().default(true),
    sortable: z.boolean().default(false),
  }),
  
  // Embeds
  z.object({ 
    type: z.literal("iframe"), 
    src: z.string().url(),
    title: z.string(),
    height: z.number().default(400),
    sandbox: z.array(z.string()).optional(),
  }),
  z.object({ 
    type: z.literal("embed"), 
    platform: z.enum(["twitter", "instagram", "codepen", "codesandbox", "github"]),
    id: z.string(),
    height: z.number().optional(),
  }),
  
  // Utility
  z.object({ type: z.literal("divider"), className: z.string().optional() }),
  z.object({ 
    type: z.literal("spacer"), 
    height: z.number().default(20),
  }),
]);

// Type exports
export type UnifiedContentBlock = z.infer<typeof UnifiedContentBlock>;
export type LessonMetadata = z.infer<typeof LessonMetadata>;
export type QuizQuestion = z.infer<typeof QuizQuestion>;
export type ContentLevel = z.infer<typeof ContentLevel>;

// JSON lesson format
export const JSONLessonFormat = z.object({
  metadata: LessonMetadata,
  blocks: z.array(UnifiedContentBlock),
});

export type JSONLessonFormat = z.infer<typeof JSONLessonFormat>;

// MDX frontmatter format (subset of metadata)
export const MDXFrontmatter = LessonMetadata.extend({
  contentType: z.literal("MDX").default("MDX"),
});

export type MDXFrontmatter = z.infer<typeof MDXFrontmatter>;

// Unified lesson content that can handle all formats
export interface UnifiedLessonContent {
  id: string;
  moduleId: string;
  contentType: ContentType;
  metadata: LessonMetadata;
  
  // Content variants
  slides?: any[]; // Legacy slide format
  mdxContent?: string; // Raw MDX content
  jsonBlocks?: UnifiedContentBlock[]; // JSON blocks
  
  // Common fields
  orderIndex: number;
  xpReward?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to validate content blocks
export function validateContentBlocks(blocks: unknown[]): UnifiedContentBlock[] {
  return z.array(UnifiedContentBlock).parse(blocks);
}

// Helper function to convert legacy slides to unified blocks
export function convertSlidesToBlocks(slides: any[]): UnifiedContentBlock[] {
  const blocks: UnifiedContentBlock[] = [];
  
  slides.forEach((slide, slideIndex) => {
    // Add slide title as heading
    if (slide.title) {
      blocks.push({
        type: "heading",
        level: 2,
        text: slide.title,
      });
    }
    
    // Convert slide blocks to unified blocks
    slide.blocks?.forEach((block: any) => {
      switch (block.type) {
        case "text":
        case "title":
          blocks.push({
            type: block.type === "title" ? "heading" : "paragraph",
            level: block.type === "title" ? 1 : undefined,
            text: block.content?.content || block.content || "",
          });
          break;
          
        case "image":
          blocks.push({
            type: "image",
            src: block.content?.src || block.content || "",
            alt: block.content?.alt || "Image",
          });
          break;
          
        case "video":
          blocks.push({
            type: "video",
            provider: "youtube",
            videoId: block.content?.videoId || block.content || "",
          });
          break;
          
        case "code":
          blocks.push({
            type: "code",
            language: block.content?.language || "javascript",
            code: block.content?.code || block.content || "",
          });
          break;
          
        case "quiz":
          if (block.content?.questions) {
            blocks.push({
              type: "quiz",
              questions: block.content.questions,
            });
          }
          break;
          
        default:
          // For unknown types, try to extract text content
          if (block.content?.content || block.content) {
            blocks.push({
              type: "paragraph",
              text: String(block.content?.content || block.content),
            });
          }
      }
    });
    
    // Add divider between slides (except last)
    if (slideIndex < slides.length - 1) {
      blocks.push({ type: "divider" });
    }
  });
  
  return blocks;
}

// Helper to extract text content from blocks (for search, etc.)
export function extractTextFromBlocks(blocks: UnifiedContentBlock[]): string {
  const textParts: string[] = [];
  
  blocks.forEach(block => {
    switch (block.type) {
      case "heading":
      case "paragraph":
        textParts.push(block.text);
        break;
      case "list":
        textParts.push(...block.items);
        break;
      case "callout":
        if (block.title) textParts.push(block.title);
        textParts.push(block.content);
        break;
      case "image":
        textParts.push(block.alt);
        if (block.caption) textParts.push(block.caption);
        break;
      case "quiz":
        block.questions.forEach((q: QuizQuestion) => {
          textParts.push(q.question);
          if (q.options) textParts.push(...q.options);
          if (q.explanation) textParts.push(q.explanation);
        });
        break;
      case "columns":
        block.columns.forEach((col: any) => {
          textParts.push(extractTextFromBlocks(col));
        });
        break;
      case "accordion":
        block.items.forEach((item: any) => {
          textParts.push(item.title);
          textParts.push(extractTextFromBlocks(item.content));
        });
        break;
      case "tabs":
        block.tabs.forEach((tab: any) => {
          textParts.push(tab.label);
          textParts.push(extractTextFromBlocks(tab.content));
        });
        break;
      case "table":
        textParts.push(...block.headers);
        block.rows.forEach((row: any) => textParts.push(...row));
        break;
    }
  });
  
  return textParts.filter(Boolean).join(" ");
}
