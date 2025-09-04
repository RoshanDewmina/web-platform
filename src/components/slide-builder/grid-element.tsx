"use client";

import React, { useState, useRef, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GridElement as GridElementType } from "@/types/slide-builder";
import { ComponentRenderer } from "./component-renderer";
import {
  GripVertical,
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useSlideBuilderStore from "@/stores/slide-builder-store";

interface GridElementProps {
  element: GridElementType;
  cellSize: number;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  readOnly: boolean;
  onSelect: () => void;
  onResize: (w: number, h: number) => void;
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export function GridElement({
  element,
  cellSize,
  isSelected,
  isHovered,
  isDragging,
  readOnly,
  onSelect,
  onResize,
}: GridElementProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const resizeStartPos = useRef({ x: 0, y: 0, w: element.w, h: element.h });

  const {
    updateElement,
    deleteElement,
    duplicateElement,
    bringToFront,
    sendToBack,
  } = useSlideBuilderStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    disabled: readOnly || element.locked || isResizing,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: element.x * cellSize,
    top: element.y * cellSize,
    width: element.w * cellSize,
    height: element.h * cellSize,
    zIndex: element.zIndex || 0,
  };

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      if (readOnly || element.locked) return;

      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeHandle(handle);
      resizeStartPos.current = {
        x: e.clientX,
        y: e.clientY,
        w: element.w,
        h: element.h,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = (e.clientX - resizeStartPos.current.x) / cellSize;
        const deltaY = (e.clientY - resizeStartPos.current.y) / cellSize;

        let newW = resizeStartPos.current.w;
        let newH = resizeStartPos.current.h;
        let newX = element.x;
        let newY = element.y;

        switch (handle) {
          case "e":
            newW = Math.round(resizeStartPos.current.w + deltaX);
            break;
          case "w":
            newW = Math.round(resizeStartPos.current.w - deltaX);
            newX = Math.round(element.x + deltaX);
            break;
          case "s":
            newH = Math.round(resizeStartPos.current.h + deltaY);
            break;
          case "n":
            newH = Math.round(resizeStartPos.current.h - deltaY);
            newY = Math.round(element.y + deltaY);
            break;
          case "se":
            newW = Math.round(resizeStartPos.current.w + deltaX);
            newH = Math.round(resizeStartPos.current.h + deltaY);
            break;
          case "sw":
            newW = Math.round(resizeStartPos.current.w - deltaX);
            newH = Math.round(resizeStartPos.current.h + deltaY);
            newX = Math.round(element.x + deltaX);
            break;
          case "ne":
            newW = Math.round(resizeStartPos.current.w + deltaX);
            newH = Math.round(resizeStartPos.current.h - deltaY);
            newY = Math.round(element.y + deltaY);
            break;
          case "nw":
            newW = Math.round(resizeStartPos.current.w - deltaX);
            newH = Math.round(resizeStartPos.current.h - deltaY);
            newX = Math.round(element.x + deltaX);
            newY = Math.round(element.y + deltaY);
            break;
        }

        // Ensure minimum size
        newW = Math.max(1, Math.min(newW, 12 - newX));
        newH = Math.max(1, Math.min(newH, 12 - newY));
        newX = Math.max(0, Math.min(newX, 12 - 1));
        newY = Math.max(0, Math.min(newY, 12 - 1));

        if (newX !== element.x || newY !== element.y) {
          updateElement(element.id, { x: newX, y: newY });
        }
        onResize(newW, newH);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        setResizeHandle(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [element, cellSize, readOnly, onResize, updateElement]
  );

  // Render resize handles
  const renderResizeHandles = () => {
    if (!isSelected || readOnly || element.locked) return null;

    const handles: ResizeHandle[] = [
      "nw",
      "n",
      "ne",
      "e",
      "se",
      "s",
      "sw",
      "w",
    ];

    return handles.map((handle) => {
      const getHandleStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = {
          position: "absolute",
          width: "8px",
          height: "8px",
          backgroundColor: "hsl(var(--primary))",
          border: "1px solid white",
          borderRadius: "2px",
          cursor: `${handle}-resize`,
        };

        switch (handle) {
          case "nw":
            return { ...base, top: -4, left: -4 };
          case "n":
            return {
              ...base,
              top: -4,
              left: "50%",
              transform: "translateX(-50%)",
            };
          case "ne":
            return { ...base, top: -4, right: -4 };
          case "e":
            return {
              ...base,
              top: "50%",
              right: -4,
              transform: "translateY(-50%)",
            };
          case "se":
            return { ...base, bottom: -4, right: -4 };
          case "s":
            return {
              ...base,
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
            };
          case "sw":
            return { ...base, bottom: -4, left: -4 };
          case "w":
            return {
              ...base,
              top: "50%",
              left: -4,
              transform: "translateY(-50%)",
            };
          default:
            return base;
        }
      };

      return (
        <div
          key={handle}
          style={getHandleStyle()}
          onMouseDown={(e) => handleResizeStart(e, handle)}
          className="hover:scale-125 transition-transform"
        />
      );
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "absolute group transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isHovered && !isSelected && "ring-1 ring-primary/50",
        isDragging && "opacity-50",
        element.locked && "cursor-not-allowed",
        !readOnly && !element.locked && "cursor-move"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      {...attributes}
      {...listeners}
    >
      {/* Element Toolbar */}
      <div
        className={cn(
          "absolute -top-8 right-0 flex items-center gap-1 bg-background border rounded-md p-1 opacity-0 transition-opacity pointer-events-none",
          (isSelected || isHovered) &&
            !readOnly &&
            "opacity-100 pointer-events-auto"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-move"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            updateElement(element.id, { locked: !element.locked });
          }}
        >
          {element.locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => duplicateElement(element.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => bringToFront(element.id)}>
              Bring to Front
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sendToBack(element.id)}>
              Send to Back
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteElement(element.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resize Handles */}
      {renderResizeHandles()}

      {/* Content */}
      <div className="w-full h-full overflow-hidden rounded-md">
        <ComponentRenderer
          type={element.type}
          props={element.props}
          width={element.w * cellSize}
          height={element.h * cellSize}
          previewMode={readOnly}
        />
      </div>

      {/* Lock Indicator */}
      {element.locked && (
        <div className="absolute top-2 left-2 bg-background/80 rounded p-1">
          <Lock className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
