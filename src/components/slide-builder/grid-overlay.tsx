"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GridOverlayProps {
  columns: number;
  rows: number;
  cellSize: number;
  className?: string;
}

export function GridOverlay({
  columns,
  rows,
  cellSize,
  className,
}: GridOverlayProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    >
      {/* Major grid lines every 3 cells */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern
            id="majorGrid"
            width={cellSize * 3}
            height={cellSize * 3}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cellSize * 3} 0 L 0 0 0 ${cellSize * 3}`}
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#majorGrid)" />
      </svg>

      {/* Grid cell coordinates (shown on hover) */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: columns * rows }).map((_, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          return (
            <div
              key={index}
              className="relative group hover:bg-primary/5 transition-colors"
              data-grid-x={col}
              data-grid-y={row}
            >
              <span className="absolute top-0 left-0 text-[8px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity p-0.5">
                {col},{row}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
