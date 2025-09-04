"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Code2, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

interface CodeEditorComponentProps {
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: "light" | "dark" | "auto";
  title?: string;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
  onCodeChange?: (code: string, language: string) => void;
}

const supportedLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
];

export default function CodeEditorComponent({
  code = "// Your code here\nconsole.log('Hello, World!');",
  language = "javascript",
  showLineNumbers = true,
  theme = "auto",
  title,
  width,
  height,
  previewMode = false,
  className,
  onCodeChange,
}: CodeEditorComponentProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme: systemTheme } = useTheme();

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCurrentCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode, currentLanguage);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    if (onCodeChange) {
      onCodeChange(currentCode, newLanguage);
    }
  };

  const getTheme = () => {
    if (theme === "auto") {
      return systemTheme === "dark" ? atomDark : prism;
    }
    return theme === "dark" ? atomDark : prism;
  };

  const getLanguageIcon = () => {
    switch (currentLanguage) {
      case "javascript":
      case "typescript":
      case "jsx":
      case "tsx":
        return "JS";
      case "python":
        return "PY";
      case "java":
        return "JV";
      case "go":
        return "GO";
      case "rust":
        return "RS";
      default:
        return <Code2 className="h-3 w-3" />;
    }
  };

  return (
    <Card
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ width, height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {title && (
            <span className="text-xs font-medium text-muted-foreground">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!previewMode && (
            <Select
              value={currentLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {previewMode && (
            <div className="flex items-center gap-1 px-2 py-1 bg-background rounded text-xs">
              <span className="font-mono font-semibold">
                {getLanguageIcon()}
              </span>
              <span>{currentLanguage}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 relative overflow-auto">
        {isEditing && !previewMode ? (
          <textarea
            value={currentCode}
            onChange={handleCodeEdit}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent resize-none outline-none"
            style={{
              lineHeight: "1.5",
              tabSize: 2,
            }}
            spellCheck={false}
            autoFocus
            aria-label="Code editor"
            title="Code editor"
          />
        ) : (
          <div
            onClick={() => !previewMode && setIsEditing(true)}
            className={cn(
              "h-full",
              !previewMode && "cursor-text hover:bg-muted/10"
            )}
          >
            <SyntaxHighlighter
              language={currentLanguage}
              style={getTheme()}
              showLineNumbers={showLineNumbers}
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "0.875rem",
                height: "100%",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                },
              }}
            >
              {currentCode}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Footer (optional) */}
      {!previewMode && (
        <div className="px-3 py-1 border-t bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Terminal className="h-3 w-3" />
            <span>Click to edit • Tab for indent</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {currentCode.split("\n").length} lines
          </div>
        </div>
      )}
    </Card>
  );
}
