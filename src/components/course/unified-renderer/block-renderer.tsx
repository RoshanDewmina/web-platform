"use client";

import React from "react";
import { UnifiedContentBlock } from "@/types/unified-content";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { PlaceholderComponents } from "@/components/slide-builder/components/placeholder-components";

// Import new content components dynamically
const Video = dynamic(() => import("./components/video"));
const Callout = dynamic(() => import("./components/callout"));
const InteractiveQuiz = dynamic(() => import("./components/interactive-quiz"));
const CodeBlock = dynamic(() => import("./components/code-block"));
const ImageWithCaption = dynamic(() => import("./components/image-with-caption"));
const Accordion = dynamic(() => import("./components/accordion"));
const Tabs = dynamic(() => import("./components/tabs"));
const DataTable = dynamic(() => import("./components/data-table"));
const EmbedComponent = dynamic(() => import("./components/embed"));

interface BlockRendererProps {
  blocks: UnifiedContentBlock[];
  className?: string;
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  const renderBlock = (block: UnifiedContentBlock, index: number) => {
    switch (block.type) {
      // Text blocks
      case "heading":
        const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            id={block.id}
            className={cn(
              "font-bold",
              block.level === 1 && "text-4xl mt-8 mb-4",
              block.level === 2 && "text-3xl mt-6 mb-3",
              block.level === 3 && "text-2xl mt-4 mb-2"
            )}
          >
            {block.text}
          </HeadingTag>
        );

      case "paragraph":
        return (
          <p key={index} className={cn("text-base leading-relaxed mb-4", block.className)}>
            {block.text}
          </p>
        );

      case "list":
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag
            key={index}
            className={cn(
              "mb-4 space-y-1",
              block.ordered ? "list-decimal" : "list-disc",
              "pl-6",
              block.className
            )}
          >
            {block.items.map((item: string, i: number) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );

      // Media blocks
      case "image":
        return (
          <ImageWithCaption
            key={index}
            src={block.src}
            alt={block.alt}
            caption={block.caption}
            width={block.width}
            height={block.height}
            className={block.className}
          />
        );

      case "video":
        return (
          <Video
            key={index}
            provider={block.provider}
            videoId={block.videoId}
            url={block.url}
            title={block.title}
            autoplay={block.autoplay}
            controls={block.controls}
            poster={block.poster}
          />
        );

      case "audio":
        return (
          <div key={index} className="my-6">
            <audio
              controls
              className="w-full"
              title={block.title}
            >
              <source src={block.src} />
              Your browser does not support the audio element.
            </audio>
            {block.transcript && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  View transcript
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-lg text-sm">
                  {block.transcript}
                </div>
              </details>
            )}
          </div>
        );

      // Interactive blocks
      case "quiz":
        return (
          <InteractiveQuiz
            key={index}
            questions={block.questions}
            passingScore={block.passingScore}
            showFeedback={block.showFeedback}
            randomizeQuestions={block.randomizeQuestions}
            maxAttempts={block.maxAttempts}
          />
        );

      case "code":
        return (
          <CodeBlock
            key={index}
            language={block.language}
            code={block.code}
            filename={block.filename}
            runnable={block.runnable}
            highlightLines={block.highlightLines}
            showLineNumbers={block.showLineNumbers}
          />
        );

      case "interactive":
        // Use the existing custom component renderer
        const CustomComponent = PlaceholderComponents[block.componentId as keyof typeof PlaceholderComponents];
        if (CustomComponent) {
          return <CustomComponent key={index} {...block.props} />;
        }
        return (
          <div key={index} className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              {block.fallback || `Interactive component: ${block.componentId}`}
            </p>
          </div>
        );

      // Layout blocks
      case "callout":
        return (
          <Callout
            key={index}
            variant={block.variant}
            title={block.title}
            icon={block.icon}
          >
            {block.content}
          </Callout>
        );

      case "columns":
        return (
          <div
            key={index}
            className={cn(
              "grid gap-6 mb-6",
              block.responsive && "md:grid-cols-2 lg:grid-cols-3",
              !block.responsive && `grid-cols-${block.columns.length}`
            )}
            style={{ gap: `${block.gap}rem` }}
          >
            {block.columns.map((column: UnifiedContentBlock[], colIndex: number) => (
              <div key={colIndex}>
                <BlockRenderer blocks={column} />
              </div>
            ))}
          </div>
        );

      case "accordion":
        return <Accordion key={index} items={block.items} />;

      case "tabs":
        return (
          <Tabs
            key={index}
            tabs={block.tabs}
            defaultTab={block.defaultTab}
          />
        );

      // Data visualization
      case "chart":
        // Use existing chart component from slide builder
        return (
          <div key={index} style={{ height: block.height }}>
            <PlaceholderComponents.chart
              type={block.chartType}
              data={block.data}
              options={block.options}
              height={block.height}
            />
          </div>
        );

      case "table":
        return (
          <DataTable
            key={index}
            headers={block.headers}
            rows={block.rows}
            responsive={block.responsive}
            sortable={block.sortable}
          />
        );

      // Embeds
      case "iframe":
        return (
          <div key={index} className="my-6">
            <iframe
              src={block.src}
              title={block.title}
              height={block.height}
              className="w-full rounded-lg border"
              sandbox={block.sandbox?.join(" ")}
            />
          </div>
        );

      case "embed":
        return (
          <EmbedComponent
            key={index}
            platform={block.platform}
            id={block.id}
            height={block.height}
          />
        );

      // Utility
      case "divider":
        return (
          <hr
            key={index}
            className={cn("my-8 border-border", block.className)}
          />
        );

      case "spacer":
        return (
          <div
            key={index}
            style={{ height: `${block.height}px` }}
            aria-hidden="true"
          />
        );

      default:
        console.warn(`Unknown block type: ${(block as any).type}`);
        return null;
    }
  };

  return (
    <div className={cn("prose prose-lg dark:prose-invert max-w-none", className)}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
