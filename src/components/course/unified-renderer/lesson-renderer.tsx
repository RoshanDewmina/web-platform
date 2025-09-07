"use client";

import React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { UnifiedContentBlock } from "@/types/unified-content";
import { BlockRenderer } from "./block-renderer";
import { cn } from "@/lib/utils";

// Import all MDX components
import Video from "./components/video";
import Callout from "./components/callout";
import InteractiveQuiz from "./components/interactive-quiz";
import CodeBlock from "./components/code-block";
import ImageWithCaption from "./components/image-with-caption";
import Accordion from "./components/accordion";
import Tabs from "./components/tabs";
import DataTable from "./components/data-table";
import EmbedComponent, { TwitterEmbed, InstagramEmbed } from "./components/embed";

// MDX components mapping
const mdxComponents = {
  // Enhanced HTML elements
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="text-base leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-4" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  
  // Code blocks
  pre: (props: any) => {
    const language = props.children?.props?.className?.replace("language-", "") || "text";
    const code = props.children?.props?.children || "";
    return <CodeBlock language={language} code={code} />;
  },
  code: (props: any) => (
    <code className="px-1 py-0.5 rounded bg-muted font-mono text-sm" {...props} />
  ),
  
  // Images
  img: (props: any) => <ImageWithCaption {...props} />,
  Image: ImageWithCaption,
  
  // Custom components
  Video,
  Callout,
  Quiz: InteractiveQuiz,
  CodeBlock,
  Accordion,
  Tabs,
  Table: DataTable,
  Embed: EmbedComponent,
  Tweet: TwitterEmbed,
  Instagram: InstagramEmbed,
};

interface UnifiedLessonRendererProps {
  contentType: "SLIDES" | "MDX" | "JSON_BLOCKS";
  
  // Content variants
  slides?: any[]; // Legacy slide format
  mdxSource?: MDXRemoteSerializeResult; // Serialized MDX
  blocks?: UnifiedContentBlock[]; // JSON blocks
  
  // Options
  className?: string;
  onSlideChange?: (slideIndex: number) => void;
}

export function UnifiedLessonRenderer({
  contentType,
  slides,
  mdxSource,
  blocks,
  className,
  onSlideChange,
}: UnifiedLessonRendererProps) {
  // Import slide renderer dynamically to avoid circular dependencies
  const [SlideRenderer, setSlideRenderer] = React.useState<any>(null);
  
  React.useEffect(() => {
    if (contentType === "SLIDES") {
      import("@/app/learn/course/[courseId]/_components/slide-renderer").then((module) => {
        setSlideRenderer(() => module.default);
      });
    }
  }, [contentType]);

  switch (contentType) {
    case "SLIDES":
      if (!slides || slides.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            No slides available
          </div>
        );
      }
      
      if (!SlideRenderer) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            Loading slides...
          </div>
        );
      }
      
      return (
        <SlideRenderer
          slides={slides}
          onSlideChange={onSlideChange}
          className={className}
        />
      );
      
    case "MDX":
      if (!mdxSource) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            No MDX content available
          </div>
        );
      }
      
      return (
        <article className={cn("container max-w-4xl mx-auto py-8", className)}>
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </article>
      );
      
    case "JSON_BLOCKS":
      if (!blocks || blocks.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            No content blocks available
          </div>
        );
      }
      
      return (
        <article className={cn("container max-w-4xl mx-auto py-8", className)}>
          <BlockRenderer blocks={blocks} />
        </article>
      );
      
    default:
      return (
        <div className="text-center py-12 text-destructive">
          Unknown content type: {contentType}
        </div>
      );
  }
}

// Export all components for external use
export {
  BlockRenderer,
  Video,
  Callout,
  InteractiveQuiz,
  CodeBlock,
  ImageWithCaption,
  Accordion,
  Tabs,
  DataTable,
  EmbedComponent,
};
