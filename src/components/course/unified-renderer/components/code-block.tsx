"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Play, FileCode } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
  runnable?: boolean;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({
  language,
  code,
  filename,
  runnable = false,
  highlightLines = [],
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    if (!runnable || language !== "javascript") return;
    
    setRunning(true);
    setOutput(null);
    
    try {
      // Create a safe execution environment
      const logs: string[] = [];
      const originalLog = console.log;
      
      // Override console.log to capture output
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" "));
      };
      
      // Execute the code
      const func = new Function(code);
      const result = func();
      
      // Restore original console.log
      console.log = originalLog;
      
      // Set output
      if (logs.length > 0) {
        setOutput(logs.join("\n"));
      } else if (result !== undefined) {
        setOutput(String(result));
      } else {
        setOutput("Code executed successfully (no output)");
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setRunning(false);
    }
  };

  const lines = code.split("\n");

  return (
    <Card className={cn("my-6 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">
            {filename || language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {runnable && language === "javascript" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              disabled={running}
              className="h-8 px-2"
            >
              <Play className="h-3 w-3 mr-1" />
              {running ? "Running..." : "Run"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="overflow-x-auto">
          <code className={`language-${language} block p-4`}>
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);
              
              return (
                <div
                  key={index}
                  className={cn(
                    "table-row",
                    isHighlighted && "bg-yellow-100 dark:bg-yellow-900/20"
                  )}
                >
                  {showLineNumbers && (
                    <span className="table-cell pr-4 text-muted-foreground select-none text-right text-sm">
                      {lineNumber}
                    </span>
                  )}
                  <span className="table-cell">{line || " "}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Output */}
      {output !== null && (
        <div className="border-t">
          <div className="px-4 py-2 bg-muted/50">
            <span className="text-sm font-semibold text-muted-foreground">Output:</span>
          </div>
          <pre className="p-4 bg-black text-green-400 font-mono text-sm overflow-x-auto">
            {output}
          </pre>
        </div>
      )}
    </Card>
  );
}

// Language mapping for better display names
export const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  py: "python",
  rb: "ruby",
  go: "go",
  rs: "rust",
  java: "java",
  cpp: "c++",
  c: "c",
  cs: "c#",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  scala: "scala",
  r: "r",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "shell",
  ps1: "powershell",
  yml: "yaml",
  yaml: "yaml",
  json: "json",
  xml: "xml",
  html: "html",
  css: "css",
  scss: "scss",
  sass: "sass",
  less: "less",
  md: "markdown",
  mdx: "mdx",
};
