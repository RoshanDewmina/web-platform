# Course Content Integration Guide

This guide explains how to integrate the proposed MDX/JSON content standard with your existing slide-based course platform while maintaining all current functionality.

## Executive Summary

Your current system uses a database-driven architecture with a hierarchical structure:
**Course → Module → Lesson → Slide → ContentBlock**

The proposed standard suggests file-based MDX/JSON content with MinIO for assets. Here's how to integrate both approaches:

1. **Keep your existing database structure** for course metadata, progress tracking, and social features
2. **Add MDX/JSON content support** as an alternative content format within lessons
3. **Use MinIO for asset storage** instead of storing URLs directly
4. **Create a unified rendering pipeline** that handles both slide-based and MDX/JSON content
5. **Maintain backward compatibility** with existing courses

## 1. Enhanced Content Model

### 1.1 Database Schema Updates

Add these fields to your existing Lesson model in `prisma/schema.prisma`:

```prisma
model Lesson {
  // ... existing fields ...
  
  // New fields for flexible content
  contentType     ContentType  @default(SLIDES) // SLIDES, MDX, JSON_BLOCKS
  mdxContent      String?      @db.Text // Store MDX directly
  jsonBlocks      Json?        // Store JSON blocks
  contentMetadata Json?        // Additional metadata (tags, level, etc.)
  
  // Asset references
  coverImage      String?      // MinIO object key
  assets          Json[]       // Array of asset references
}

enum ContentType {
  SLIDES      // Your existing slide-based content
  MDX         // MDX content
  JSON_BLOCKS // JSON block-based content
}
```

### 1.2 Unified TypeScript Types

Create `src/types/unified-content.ts`:

```typescript
import { z } from "zod";

// Reuse your existing types
export type { Course, Module, Lesson, Slide } from "./course-builder";

// Add new content types
export const ContentLevel = z.enum(["beginner", "intermediate", "advanced", "expert"]);

export const LessonMetadata = z.object({
  tags: z.array(z.string()).default([]),
  level: ContentLevel.default("beginner"),
  coverImage: z.string().optional(),
  estimatedMinutes: z.number().min(1).max(600),
  objectives: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
});

// Content blocks that can be used in both MDX and JSON
export const ContentBlock = z.discriminatedUnion("type", [
  // Text blocks
  z.object({ type: z.literal("heading"), level: z.number().int().min(1).max(3), text: z.string() }),
  z.object({ type: z.literal("paragraph"), text: z.string() }),
  z.object({ type: z.literal("list"), ordered: z.boolean().default(false), items: z.array(z.string()) }),
  
  // Media blocks
  z.object({ type: z.literal("image"), alt: z.string(), src: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal("video"), provider: z.enum(["youtube", "vimeo", "minio"]), videoId: z.string() }),
  z.object({ type: z.literal("audio"), src: z.string(), title: z.string().optional() }),
  
  // Interactive blocks
  z.object({ type: z.literal("quiz"), questions: z.array(QuizQuestion) }),
  z.object({ type: z.literal("code"), language: z.string(), code: z.string(), runnable: z.boolean().default(false) }),
  z.object({ type: z.literal("interactive"), componentId: z.string(), props: z.record(z.any()) }),
  
  // Layout blocks
  z.object({ type: z.literal("callout"), variant: z.enum(["info", "success", "warning", "danger"]), content: z.string() }),
  z.object({ type: z.literal("columns"), columns: z.array(z.array(ContentBlock)) }),
  z.object({ type: z.literal("divider") }),
  
  // Your existing component types
  z.object({ type: z.literal("chart"), chartType: z.string(), data: z.any() }),
  z.object({ type: z.literal("table"), headers: z.array(z.string()), rows: z.array(z.array(z.string())) }),
]);

export const QuizQuestion = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "true_false", "short_answer"]),
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number(), z.boolean()]),
  explanation: z.string().optional(),
  points: z.number().default(1),
});

export type ContentBlock = z.infer<typeof ContentBlock>;
export type LessonMetadata = z.infer<typeof LessonMetadata>;
```

## 2. MinIO Integration

### 2.1 Environment Setup

Update your `.env` file:

```env
# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=coursekit

# For production
MINIO_PUBLIC_URL=https://assets.yourdomain.com
```

### 2.2 MinIO Client

Create `src/lib/storage/minio.ts`:

```typescript
import { Client } from "minio";
import { Readable } from "stream";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const BUCKET = process.env.MINIO_BUCKET!;

export class AssetStorage {
  static async upload(
    key: string,
    buffer: Buffer,
    metadata: Record<string, string> = {}
  ): Promise<string> {
    await minioClient.putObject(BUCKET, key, buffer, buffer.length, metadata);
    return key;
  }

  static async uploadStream(
    key: string,
    stream: Readable,
    size: number,
    metadata: Record<string, string> = {}
  ): Promise<string> {
    await minioClient.putObject(BUCKET, key, stream, size, metadata);
    return key;
  }

  static async getSignedUrl(key: string, expirySeconds = 3600): Promise<string> {
    return await minioClient.presignedGetObject(BUCKET, key, expirySeconds);
  }

  static async delete(key: string): Promise<void> {
    await minioClient.removeObject(BUCKET, key);
  }

  static async copy(sourceKey: string, destKey: string): Promise<void> {
    await minioClient.copyObject(
      BUCKET,
      destKey,
      `/${BUCKET}/${sourceKey}`,
      null
    );
  }

  static generateKey(courseId: string, type: string, filename: string): string {
    const timestamp = Date.now();
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `courses/${courseId}/${type}/${timestamp}-${sanitized}`;
  }
}
```

### 2.3 Asset API Routes

Create `src/app/api/assets/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { AssetStorage } from "@/lib/storage/minio";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;
    const type = formData.get("type") as string || "general";

    if (!file || !courseId) {
      return NextResponse.json(
        { error: "Missing file or courseId" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = AssetStorage.generateKey(courseId, type, file.name);

    await AssetStorage.upload(key, buffer, {
      "Content-Type": file.type,
      "Original-Name": file.name,
    });

    // Store reference in database
    await prisma.enhancedAsset.create({
      data: {
        courseId,
        filename: key,
        originalName: file.name,
        mimeType: file.type,
        fileSize: buffer.length,
        url: key, // Store key, not full URL
        createdBy: userId,
      },
    });

    const signedUrl = await AssetStorage.getSignedUrl(key);

    return NextResponse.json({
      key,
      url: signedUrl,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

## 3. Content Loaders and Parsers

### 3.1 MDX Support

Create `src/lib/content/mdx-loader.ts`:

```typescript
import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import { LessonMetadata } from "@/types/unified-content";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

export async function parseMDXContent(content: string) {
  const { data, content: mdxContent } = matter(content);
  
  // Validate metadata
  const metadata = LessonMetadata.parse(data);
  
  // Serialize MDX
  const mdxSource = await serialize(mdxContent, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeHighlight],
    },
  });
  
  return {
    metadata,
    mdxSource,
  };
}

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

  if (!lesson || lesson.contentType !== "MDX" || !lesson.mdxContent) {
    throw new Error("MDX content not found");
  }

  const { metadata, mdxSource } = await parseMDXContent(lesson.mdxContent);

  return {
    lesson,
    metadata,
    mdxSource,
  };
}
```

### 3.2 JSON Blocks Support

Create `src/lib/content/json-blocks-loader.ts`:

```typescript
import { ContentBlock } from "@/types/unified-content";
import { z } from "zod";

const JsonBlocksSchema = z.object({
  metadata: LessonMetadata,
  blocks: z.array(ContentBlock),
});

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

  if (!lesson || lesson.contentType !== "JSON_BLOCKS" || !lesson.jsonBlocks) {
    throw new Error("JSON blocks content not found");
  }

  const parsed = JsonBlocksSchema.parse(lesson.jsonBlocks);

  return {
    lesson,
    metadata: parsed.metadata,
    blocks: parsed.blocks,
  };
}
```

## 4. Unified Rendering Components

### 4.1 Block Renderer

Create `src/components/course/unified-renderer/block-renderer.tsx`:

```typescript
"use client";

import { ContentBlock } from "@/types/unified-content";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Import your existing components
import { PlaceholderComponents } from "@/components/slide-builder/components/placeholder-components";

// Import new MDX-style components
const Video = dynamic(() => import("./components/video"));
const Callout = dynamic(() => import("./components/callout"));
const InteractiveQuiz = dynamic(() => import("./components/interactive-quiz"));

const blockComponents = {
  heading: ({ level, text }: any) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag className={cn("font-bold", level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl")}>{text}</Tag>;
  },
  paragraph: ({ text }: any) => <p className="text-base leading-relaxed">{text}</p>,
  list: ({ ordered, items }: any) => {
    const List = ordered ? "ol" : "ul";
    return (
      <List className={cn("space-y-1", ordered ? "list-decimal" : "list-disc", "pl-6")}>
        {items.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </List>
    );
  },
  image: ({ src, alt, caption }: any) => (
    <figure className="my-6">
      <img src={src} alt={alt} className="rounded-lg shadow-md w-full" />
      {caption && <figcaption className="text-sm text-muted-foreground mt-2 text-center">{caption}</figcaption>}
    </figure>
  ),
  video: Video,
  callout: Callout,
  quiz: InteractiveQuiz,
  code: PlaceholderComponents.code,
  chart: PlaceholderComponents.chart,
  table: PlaceholderComponents.table,
  divider: () => <hr className="my-8 border-border" />,
};

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
      {blocks.map((block, index) => {
        const Component = blockComponents[block.type as keyof typeof blockComponents];
        if (!Component) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }
        return <Component key={index} {...block} />;
      })}
    </div>
  );
}
```

### 4.2 Unified Lesson Renderer

Create `src/components/course/unified-renderer/lesson-renderer.tsx`:

```typescript
"use client";

import { MDXRemote } from "next-mdx-remote";
import { Lesson } from "@prisma/client";
import { BlockRenderer } from "./block-renderer";
import { SlideRenderer } from "@/components/course/slide-renderer";
import * as MDXComponents from "./mdx-components";

interface UnifiedLessonRendererProps {
  lesson: Lesson & {
    slides?: any[];
    module: {
      course: any;
    };
  };
  mdxSource?: any;
  blocks?: any[];
}

export function UnifiedLessonRenderer({
  lesson,
  mdxSource,
  blocks,
}: UnifiedLessonRendererProps) {
  // Render based on content type
  switch (lesson.contentType) {
    case "SLIDES":
      // Use your existing slide renderer
      return <SlideRenderer slides={lesson.slides || []} />;
      
    case "MDX":
      if (!mdxSource) return null;
      return (
        <article className="container max-w-4xl mx-auto py-8">
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </article>
      );
      
    case "JSON_BLOCKS":
      if (!blocks) return null;
      return (
        <article className="container max-w-4xl mx-auto py-8">
          <BlockRenderer blocks={blocks} />
        </article>
      );
      
    default:
      return <div>Unknown content type</div>;
  }
}
```

## 5. Content Import/Export

### 5.1 MDX Import

Create `src/app/api/lessons/import-mdx/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { parseMDXContent } from "@/lib/content/mdx-loader";

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

    const content = await file.text();
    const { metadata, mdxSource } = await parseMDXContent(content);

    // Create lesson with MDX content
    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title: metadata.title || "Untitled Lesson",
        description: metadata.summary,
        contentType: "MDX",
        mdxContent: content,
        contentMetadata: metadata,
        duration: metadata.estimatedMinutes,
        orderIndex: 0, // You may want to calculate this
      },
    });

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}
```

### 5.2 Content Export

Create `src/app/api/lessons/[lessonId]/export/route.ts`:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        slides: {
          include: {
            blocks: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    let content: string;
    let filename: string;

    switch (lesson.contentType) {
      case "MDX":
        content = lesson.mdxContent || "";
        filename = `${lesson.title.toLowerCase().replace(/\s+/g, "-")}.mdx`;
        break;
        
      case "JSON_BLOCKS":
        content = JSON.stringify(lesson.jsonBlocks, null, 2);
        filename = `${lesson.title.toLowerCase().replace(/\s+/g, "-")}.json`;
        break;
        
      case "SLIDES":
        // Convert slides to JSON blocks format
        const blocks = convertSlidesToBlocks(lesson.slides);
        content = JSON.stringify({
          metadata: {
            title: lesson.title,
            description: lesson.description,
            estimatedMinutes: lesson.duration,
          },
          blocks,
        }, null, 2);
        filename = `${lesson.title.toLowerCase().replace(/\s+/g, "-")}.json`;
        break;
        
      default:
        return NextResponse.json({ error: "Unknown content type" }, { status: 400 });
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${filename}"`,
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
```

## 6. Course Builder Integration

### 6.1 Enhanced Lesson Creator

Update your course builder to support content type selection:

```typescript
// In your course builder component
import { ContentType } from "@prisma/client";

interface LessonCreatorProps {
  moduleId: string;
  onLessonCreated: (lesson: any) => void;
}

export function EnhancedLessonCreator({ moduleId, onLessonCreated }: LessonCreatorProps) {
  const [contentType, setContentType] = useState<ContentType>("SLIDES");
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Content Type</Label>
            <RadioGroup value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SLIDES" id="slides" />
                <Label htmlFor="slides">Slides (Visual Builder)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MDX" id="mdx" />
                <Label htmlFor="mdx">MDX (Rich Text)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="JSON_BLOCKS" id="json" />
                <Label htmlFor="json">JSON Blocks (Structured)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {contentType === "MDX" && (
            <div>
              <Label>Import MDX File</Label>
              <Input type="file" accept=".mdx" onChange={handleMDXUpload} />
            </div>
          )}
          
          {contentType === "JSON_BLOCKS" && (
            <div>
              <Label>Import JSON File</Label>
              <Input type="file" accept=".json" onChange={handleJSONUpload} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## 7. Migration Strategy

### 7.1 Gradual Migration

1. **Phase 1**: Add new fields to database schema (non-breaking)
2. **Phase 2**: Deploy MinIO and update asset upload flows
3. **Phase 3**: Add MDX/JSON import capabilities
4. **Phase 4**: Update lesson renderer to handle all content types
5. **Phase 5**: Migrate existing content gradually

### 7.2 Backward Compatibility

Keep your existing slide-based system working while adding new capabilities:

```typescript
// In your lesson page
export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      slides: {
        include: { blocks: true },
      },
      module: {
        include: { course: true },
      },
    },
  });

  // Load additional content based on type
  let mdxSource = null;
  let blocks = null;

  if (lesson.contentType === "MDX" && lesson.mdxContent) {
    const parsed = await parseMDXContent(lesson.mdxContent);
    mdxSource = parsed.mdxSource;
  } else if (lesson.contentType === "JSON_BLOCKS" && lesson.jsonBlocks) {
    blocks = lesson.jsonBlocks.blocks;
  }

  return (
    <UnifiedLessonRenderer
      lesson={lesson}
      mdxSource={mdxSource}
      blocks={blocks}
    />
  );
}
```

## 8. Docker Compose Update

Update your `docker-compose.yml` to include MinIO:

```yaml
version: '3.9'

services:
  # Your existing services...
  
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"  # S3 API
      - "9001:9001"  # Console UI
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  # MinIO Client to create bucket
  minio-mc:
    image: minio/mc:latest
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c "
      mc alias set local http://minio:9000 ${MINIO_ACCESS_KEY:-minioadmin} ${MINIO_SECRET_KEY:-minioadmin} &&
      mc mb -p local/${MINIO_BUCKET:-coursekit} &&
      mc policy set public local/${MINIO_BUCKET:-coursekit}
      "

volumes:
  minio_data:
```

## 9. Next Steps

1. **Start with MinIO integration** - This provides immediate value for asset management
2. **Add MDX import/export** - Enable content creators to work with familiar formats
3. **Enhance validation** - Use Zod schemas throughout for data integrity
4. **Build content preview** - Add preview capabilities in the course builder
5. **Create migration tools** - Convert existing slides to MDX/JSON formats

## Key Benefits of This Approach

1. **Preserves existing functionality** - All current features continue to work
2. **Gradual migration** - No big-bang rewrites needed
3. **Flexible content** - Authors can choose their preferred format
4. **Better asset management** - MinIO provides scalable storage
5. **Standards compliance** - MDX and JSON formats are portable
6. **Enhanced authoring** - LLMs can generate content in standard formats

This integration gives you the best of both worlds: your sophisticated slide-based builder for visual content creation, plus standards-based MDX/JSON for text-heavy or LLM-generated content.
