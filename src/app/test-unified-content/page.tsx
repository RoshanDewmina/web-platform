"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnifiedLessonRenderer } from "@/components/course/unified-renderer/lesson-renderer";
import { JSONLessonFormat, UnifiedContentBlock } from "@/types/unified-content";
import { serialize } from "next-mdx-remote/serialize";
import { FileUp, Download, Eye, Code, FileJson, FileText } from "lucide-react";

// Sample MDX content
const sampleMDX = `---
title: Introduction to React Hooks
summary: Learn how to use React Hooks to manage state and side effects in functional components.
estimatedMinutes: 15
tags: ["react", "hooks", "javascript"]
level: intermediate
---

# Introduction to React Hooks

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components.

<Callout variant="info" title="Prerequisites">
This lesson assumes you have basic knowledge of React components and JavaScript ES6 syntax.
</Callout>

## What are Hooks?

Hooks are functions that let you "hook into" React features like state and lifecycle methods from functional components.

### The Rules of Hooks

1. **Only call Hooks at the top level** - Don't call Hooks inside loops, conditions, or nested functions
2. **Only call Hooks from React functions** - Either from React functional components or custom Hooks

<Video provider="youtube" videoId="dpw9EHDh2bM" title="React Hooks Explained" />

## Common Hooks

### useState

The \`useState\` Hook lets you add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect

The \`useEffect\` Hook lets you perform side effects in functional components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

<Quiz questions={${JSON.stringify([
  {
    id: "1",
    type: "multiple_choice",
    question: "Which Hook is used to add state to a functional component?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: "useState",
    explanation: "useState is the Hook that allows you to add state to functional components.",
    points: 1
  },
  {
    id: "2",
    type: "true_false",
    question: "Hooks can be called inside conditional statements.",
    correctAnswer: false,
    explanation: "Hooks must be called at the top level of your component, not inside conditionals.",
    points: 1
  }
])}} />

## Summary

React Hooks provide a powerful way to use state and other React features in functional components. Start with \`useState\` and \`useEffect\`, and explore other Hooks as needed.`;

// Sample JSON blocks content
const sampleJSONBlocks: JSONLessonFormat = {
  metadata: {
    title: "Getting Started with TypeScript",
    summary: "Learn the basics of TypeScript and how it enhances JavaScript development.",
    estimatedMinutes: 20,
    tags: ["typescript", "javascript", "programming"],
    level: "beginner",
  },
  blocks: [
    {
      type: "heading",
      level: 1,
      text: "Getting Started with TypeScript",
    },
    {
      type: "paragraph",
      text: "TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and class-based object-oriented programming to the language.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Why TypeScript?",
      content: "TypeScript helps catch errors early through type checking and provides better IDE support with features like auto-completion and refactoring.",
    },
    {
      type: "heading",
      level: 2,
      text: "Basic Types",
    },
    {
      type: "code",
      language: "typescript",
      code: `// Boolean
let isDone: boolean = false;

// Number
let decimal: number = 6;
let hex: number = 0xf00d;

// String
let color: string = "blue";
color = 'red';

// Array
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// Tuple
let x: [string, number];
x = ["hello", 10];`,
      filename: "basic-types.ts",
    },
    {
      type: "heading",
      level: 2,
      text: "Interfaces",
    },
    {
      type: "paragraph",
      text: "Interfaces are a powerful way to define contracts within your code and with code outside of your project.",
    },
    {
      type: "code",
      language: "typescript",
      code: `interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}

function greetUser(user: User) {
  console.log(\`Hello, \${user.name}!\`);
}

const john: User = {
  name: "John Doe",
  age: 30
};

greetUser(john);`,
      showLineNumbers: true,
    },
    {
      type: "accordion",
      items: [
        {
          title: "Type vs Interface",
          content: [
            {
              type: "paragraph",
              text: "Both type aliases and interfaces can be used to describe object shapes, but they have some differences:",
            },
            {
              type: "list",
              ordered: false,
              items: [
                "Interfaces can be extended and implemented",
                "Type aliases can represent union types and primitives",
                "Interfaces create a new name that is used everywhere",
                "Type aliases don't create a new name"
              ],
            },
          ],
        },
        {
          title: "Generics",
          content: [
            {
              type: "paragraph",
              text: "Generics provide a way to create reusable components that work with a variety of types rather than a single one.",
            },
            {
              type: "code",
              language: "typescript",
              code: `function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
let output2 = identity<number>(42);`,
            },
          ],
        },
      ],
    },
    {
      type: "quiz",
      questions: [
        {
          id: "1",
          type: "multiple_choice",
          question: "What is TypeScript?",
          options: [
            "A new programming language",
            "A JavaScript framework",
            "A statically typed superset of JavaScript",
            "A database system"
          ],
          correctAnswer: "A statically typed superset of JavaScript",
          points: 1,
        },
        {
          id: "2",
          type: "short_answer",
          question: "What symbol is used to mark a property as optional in TypeScript?",
          correctAnswer: "?",
          points: 1,
        },
      ],
      passingScore: 70,
    },
  ],
};

export default function TestUnifiedContentPage() {
  const [contentType, setContentType] = useState<"SLIDES" | "MDX" | "JSON_BLOCKS">("MDX");
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [jsonBlocks, setJsonBlocks] = useState<UnifiedContentBlock[]>(sampleJSONBlocks.blocks);
  const [customMDX, setCustomMDX] = useState(sampleMDX);
  const [customJSON, setCustomJSON] = useState(JSON.stringify(sampleJSONBlocks, null, 2));
  const [previewMode, setPreviewMode] = useState<"sample" | "custom">("sample");
  const [isProcessing, setIsProcessing] = useState(false);

  // Process MDX content
  const processMDX = async (content: string) => {
    try {
      setIsProcessing(true);
      const serialized = await serialize(content);
      setMdxSource(serialized);
    } catch (error) {
      console.error("Failed to process MDX:", error);
      alert("Failed to process MDX content. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Process JSON content
  const processJSON = (content: string) => {
    try {
      setIsProcessing(true);
      const parsed = JSON.parse(content) as JSONLessonFormat;
      setJsonBlocks(parsed.blocks);
    } catch (error) {
      console.error("Failed to process JSON:", error);
      alert("Failed to process JSON content. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize with sample MDX
  React.useEffect(() => {
    processMDX(sampleMDX);
  }, []);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    
    if (file.name.endsWith(".mdx")) {
      setCustomMDX(content);
      setContentType("MDX");
      await processMDX(content);
      setPreviewMode("custom");
    } else if (file.name.endsWith(".json")) {
      setCustomJSON(content);
      setContentType("JSON_BLOCKS");
      processJSON(content);
      setPreviewMode("custom");
    } else {
      alert("Please upload an .mdx or .json file");
    }
  };

  // Handle export
  const handleExport = () => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (contentType === "MDX") {
      content = previewMode === "custom" ? customMDX : sampleMDX;
      filename = "lesson.mdx";
      mimeType = "text/mdx";
    } else {
      content = previewMode === "custom" ? customJSON : JSON.stringify(sampleJSONBlocks, null, 2);
      filename = "lesson.json";
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Unified Content Renderer Test</CardTitle>
          <CardDescription>
            Test the new MDX and JSON blocks content rendering system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="import-export" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Import/Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between">
                <Select
                  value={contentType}
                  onValueChange={(value) => setContentType(value as any)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MDX">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        MDX Content
                      </div>
                    </SelectItem>
                    <SelectItem value="JSON_BLOCKS">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        JSON Blocks
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={previewMode}
                  onValueChange={(value) => setPreviewMode(value as any)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample">Sample Content</SelectItem>
                    <SelectItem value="custom">Custom Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4 min-h-[600px] bg-background">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Processing content...</p>
                  </div>
                ) : (
                  <UnifiedLessonRenderer
                    contentType={contentType}
                    mdxSource={mdxSource}
                    blocks={contentType === "JSON_BLOCKS" ? jsonBlocks : undefined}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Content Type</Label>
                  <Select
                    value={contentType}
                    onValueChange={(value) => setContentType(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MDX">MDX</SelectItem>
                      <SelectItem value="JSON_BLOCKS">JSON Blocks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {contentType === "MDX" ? (
                  <div className="space-y-2">
                    <Label>MDX Content</Label>
                    <Textarea
                      value={customMDX}
                      onChange={(e) => setCustomMDX(e.target.value)}
                      className="font-mono text-sm"
                      rows={20}
                    />
                    <Button
                      onClick={() => {
                        processMDX(customMDX);
                        setPreviewMode("custom");
                      }}
                      disabled={isProcessing}
                    >
                      Process MDX
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>JSON Content</Label>
                    <Textarea
                      value={customJSON}
                      onChange={(e) => setCustomJSON(e.target.value)}
                      className="font-mono text-sm"
                      rows={20}
                    />
                    <Button
                      onClick={() => {
                        processJSON(customJSON);
                        setPreviewMode("custom");
                      }}
                      disabled={isProcessing}
                    >
                      Process JSON
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="import-export" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Import Content</CardTitle>
                    <CardDescription>
                      Upload MDX or JSON files to preview them
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept=".mdx,.json"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Content</CardTitle>
                    <CardDescription>
                      Download the current content as MDX or JSON
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleExport} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Current Content
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>✅ MDX with React components</li>
                      <li>✅ JSON blocks with validation</li>
                      <li>✅ Interactive quizzes</li>
                      <li>✅ Syntax highlighted code blocks</li>
                      <li>✅ YouTube/Vimeo video embeds</li>
                      <li>✅ MinIO asset integration</li>
                      <li>✅ Callouts and alerts</li>
                      <li>✅ Tabs and accordions</li>
                      <li>✅ Tables with sorting</li>
                      <li>✅ Social media embeds</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
