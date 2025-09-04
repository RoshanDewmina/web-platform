"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextComponentProps {
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  fontFamily?: string;
  lineHeight?: number;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
}

export default function TextComponent({
  content = "Enter your text here...",
  fontSize = 16,
  fontWeight = "normal",
  color = "inherit",
  align = "left",
  fontFamily = "inherit",
  lineHeight = 1.5,
  width,
  height,
  previewMode = false,
  className,
}: TextComponentProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [text, setText] = React.useState(content);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setText(content);
  }, [content]);

  const handleDoubleClick = () => {
    if (!previewMode) {
      setIsEditing(true);
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.focus();
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(textRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleInput = () => {
    if (textRef.current) {
      setText(textRef.current.textContent || "");
    }
  };

  return (
    <div
      className={cn("w-full h-full flex items-center p-4", className)}
      style={{
        width,
        height,
        textAlign: align,
      }}
    >
      <div
        ref={textRef}
        contentEditable={isEditing && !previewMode}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onInput={handleInput}
        className={cn(
          "w-full outline-none",
          isEditing && "ring-2 ring-primary rounded px-2 py-1",
          !previewMode &&
            !isEditing &&
            "cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
        )}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          fontFamily,
          lineHeight,
        }}
      >
        {text}
      </div>
    </div>
  );
}
