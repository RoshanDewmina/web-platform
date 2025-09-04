"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AlignmentGuidesProps {
  vertical: number[];
  horizontal: number[];
  cellSize: number;
  className?: string;
}

export function AlignmentGuides({
  vertical,
  horizontal,
  cellSize,
  className,
}: AlignmentGuidesProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none z-50", className)}>
      {/* Vertical alignment guides */}
      {vertical.map((x, index) => (
        <div
          key={`v-${index}`}
          className="absolute top-0 bottom-0 w-px bg-primary animate-pulse"
          style={{ left: x * cellSize }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-primary bg-background px-1 rounded">
            {x}
          </div>
        </div>
      ))}

      {/* Horizontal alignment guides */}
      {horizontal.map((y, index) => (
        <div
          key={`h-${index}`}
          className="absolute left-0 right-0 h-px bg-primary animate-pulse"
          style={{ top: y * cellSize }}
        >
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-primary bg-background px-1 rounded">
            {y}
          </div>
        </div>
      ))}

      {/* Center cross guides when both vertical and horizontal guides exist */}
      {vertical.length > 0 && horizontal.length > 0 && (
        <>
          {vertical.map((x) =>
            horizontal.map((y) => (
              <div
                key={`cross-${x}-${y}`}
                className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full animate-pulse"
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                }}
              />
            ))
          )}
        </>
      )}

      {/* Distance indicators */}
      {vertical.length === 2 && (
        <div
          className="absolute top-4 h-px bg-primary/50"
          style={{
            left: Math.min(...vertical) * cellSize,
            width: (Math.max(...vertical) - Math.min(...vertical)) * cellSize,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-primary bg-background px-2 py-0.5 rounded">
            {Math.abs(vertical[1] - vertical[0])} cells
          </div>
        </div>
      )}

      {horizontal.length === 2 && (
        <div
          className="absolute left-4 w-px bg-primary/50"
          style={{
            top: Math.min(...horizontal) * cellSize,
            height:
              (Math.max(...horizontal) - Math.min(...horizontal)) * cellSize,
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-primary bg-background px-2 py-0.5 rounded whitespace-nowrap">
            {Math.abs(horizontal[1] - horizontal[0])} cells
          </div>
        </div>
      )}
    </div>
  );
}
