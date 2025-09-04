"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TitleComponentProps {
  content?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: string;
  align?: "left" | "center" | "right";
  fontFamily?: string;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
}

export default function TitleComponent({
  content = "Enter title here...",
  level = 1,
  color = "inherit",
  align = "center",
  fontFamily = "inherit",
  width,
  height,
  previewMode = false,
  className,
}: TitleComponentProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [text, setText] = React.useState(content);
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    setText(content);
  }, [content]);

  const handleDoubleClick = () => {
    if (!previewMode) {
      setIsEditing(true);
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(titleRef.current);
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
    if (titleRef.current) {
      setText(titleRef.current.textContent || "");
    }
  };

  const HeadingTag = `h${level}` as any;

  const getFontSize = () => {
    switch (level) {
      case 1:
        return "2.5rem";
      case 2:
        return "2rem";
      case 3:
        return "1.75rem";
      case 4:
        return "1.5rem";
      case 5:
        return "1.25rem";
      case 6:
        return "1rem";
      default:
        return "2.5rem";
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center p-4",
        className
      )}
      style={{ width, height }}
    >
      <HeadingTag
        ref={titleRef as any}
        contentEditable={isEditing && !previewMode}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onInput={handleInput}
        className={cn(
          "w-full font-bold outline-none",
          isEditing && "ring-2 ring-primary rounded px-2 py-1",
          !previewMode &&
            !isEditing &&
            "cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
        )}
        style={{
          fontSize: getFontSize(),
          color,
          fontFamily,
          textAlign: align,
        }}
      >
        {text}
      </HeadingTag>
    </div>
  );
}
