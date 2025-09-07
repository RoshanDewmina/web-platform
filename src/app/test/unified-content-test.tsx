"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedLessonRenderer } from "@/components/course/unified-renderer/lesson-renderer";
import { JSONLessonFormat, UnifiedContentBlock } from "@/types/unified-content";

// Sample JSON blocks content
const sampleJSONBlocks: JSONLessonFormat = {
  metadata: {
    title: "Introduction to Next.js",
    summary: "Learn the basics of Next.js framework",
    estimatedMinutes: 10,
    tags: ["nextjs", "react"],
    level: "beginner",
  },
  blocks: [
    {
      type: "heading",
      level: 1,
      text: "Welcome to Next.js",
    },
    {
      type: "paragraph",
      text: "Next.js is a powerful React framework that enables you to build full-stack web applications.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Did you know?",
      content: "Next.js is used by many large companies including Netflix, TikTok, and Uber!",
    },
    {
      type: "code",
      language: "javascript",
      code: `// Create a new Next.js app
npx create-next-app@latest my-app
cd my-app
npm run dev`,
      filename: "setup.sh",
    },
    {
      type: "heading",
      level: 2,
      text: "Key Features",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Server-side rendering (SSR)",
        "Static site generation (SSG)",
        "API routes",
        "Built-in CSS support",
        "TypeScript support",
        "Image optimization",
      ],
    },
  ],
};

export default function UnifiedContentTest() {
  const [contentType] = useState<"JSON_BLOCKS">("JSON_BLOCKS");

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Unified Content Renderer Test</CardTitle>
          <CardDescription>
            Testing the new JSON blocks content rendering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 min-h-[400px] bg-background">
            <UnifiedLessonRenderer
              contentType={contentType}
              blocks={sampleJSONBlocks.blocks}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
