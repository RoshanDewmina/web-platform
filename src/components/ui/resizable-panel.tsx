"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onResize?: (width: number) => void;
  className?: string;
  isOpen: boolean;
}

export function ResizablePanel({
  children,
  defaultWidth = 320,
  minWidth = 200,
  maxWidth = 500,
  onResize,
  className,
  isOpen,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem("course-sidebar-width");
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (parsedWidth >= minWidth && parsedWidth <= maxWidth) {
        setWidth(parsedWidth);
      }
    }
    console.log('ResizablePanel mounted, width:', savedWidth || defaultWidth);
  }, [minWidth, maxWidth, defaultWidth]);

  // Save width to localStorage
  useEffect(() => {
    if (!isResizing) {
      localStorage.setItem("course-sidebar-width", width.toString());
    }
  }, [width, isResizing]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Resize started');
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      e.preventDefault();
      const newWidth = e.clientX;
      console.log('Resizing to:', newWidth);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
        onResize?.(newWidth);
      }
    },
    [isResizing, minWidth, maxWidth, onResize]
  );

  const handleMouseUp = useCallback(() => {
    console.log('Resize ended');
    setIsResizing(false);
  }, []);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isResizing) return;

      const touch = e.touches[0];
      const newWidth = touch.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
        onResize?.(newWidth);
      }
    },
    [isResizing, minWidth, maxWidth, onResize]
  );

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      // Add event listeners with capture to ensure we get all events
      document.addEventListener("mousemove", handleMouseMove, true);
      document.addEventListener("mouseup", handleMouseUp, true);
      document.addEventListener("touchmove", handleTouchMove, { capture: true, passive: false });
      document.addEventListener("touchend", handleTouchEnd, true);
      
      // Prevent text selection while resizing
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      return () => {
        document.removeEventListener("mousemove", handleMouseMove, true);
        document.removeEventListener("mouseup", handleMouseUp, true);
        document.removeEventListener("touchmove", handleTouchMove, true);
        document.removeEventListener("touchend", handleTouchEnd, true);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <>
      {/* Overlay when resizing - lower z-index than handle */}
      {isResizing && (
        <div className="fixed inset-0 z-40 cursor-col-resize select-none" />
      )}
      
      <div
        ref={panelRef}
        className={cn(
          "relative h-full transition-all duration-300 ease-in-out",
          isResizing && "transition-none",
          className
        )}
        style={{ width: isOpen ? `${width}px` : 0, overflow: 'visible', position: 'relative' }}
      >
        {children}
        
        {/* Resize Handle - Simplified */}
        {isOpen && (
          <div
            className="absolute top-0 -right-1 h-full w-3 bg-blue-500/0 hover:bg-blue-500/20 cursor-col-resize hidden lg:block z-50"
            onMouseDown={handleMouseDown}
            style={{ touchAction: 'none' }}
            title="Drag to resize"
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500" />
          </div>
        )}
      </div>
    </>
  );
}
