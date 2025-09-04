"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragOverlay,
  Modifier,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import {
  GridElement,
  GridConfig,
  checkCollision,
  snapToGrid,
} from "@/types/slide-builder";
import useSlideBuilderStore from "@/stores/slide-builder-store";
import { GridElement as GridElementComponent } from "./grid-element";
import { GridOverlay } from "./grid-overlay";
import { AlignmentGuides } from "./alignment-guides";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Grid3x3,
  Magnet,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

interface GridCanvasProps {
  className?: string;
  readOnly?: boolean;
}

export function GridCanvas({ className, readOnly = false }: GridCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [ghostPosition, setGhostPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [draggedElement, setDraggedElement] = useState<GridElement | null>(
    null
  );
  const [alignmentGuides, setAlignmentGuides] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });

  const {
    currentSlide,
    selectedElementId,
    hoveredElementId,
    multiSelectIds,
    gridConfig,
    showGuides,
    magneticSnap,
    zoom,
    previewMode,
    isDragging,
    isResizing,
    selectElement,
    moveElement,
    resizeElement,
    setGridConfig,
    toggleGrid,
    toggleSnap,
    toggleGuides,
    setZoom,
    resetZoom,
    moveSelectedElements,
  } = useSlideBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Calculate cell size based on canvas dimensions
  const cellSize = canvasSize.width / gridConfig.columns;

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Convert pixel coordinates to grid coordinates
  const pixelToGrid = useCallback(
    (x: number, y: number) => {
      const gridX = Math.round(x / cellSize);
      const gridY = Math.round(y / cellSize);
      return {
        x: Math.max(0, Math.min(gridX, gridConfig.columns - 1)),
        y: Math.max(0, Math.min(gridY, gridConfig.rows - 1)),
      };
    },
    [cellSize, gridConfig]
  );

  // Convert grid coordinates to pixel coordinates
  const gridToPixel = useCallback(
    (gridX: number, gridY: number) => {
      return {
        x: gridX * cellSize,
        y: gridY * cellSize,
      };
    },
    [cellSize]
  );

  // Calculate alignment guides for magnetic snapping
  const calculateAlignmentGuides = useCallback(
    (element: GridElement) => {
      if (!currentSlide || !showGuides) {
        return { vertical: [], horizontal: [] };
      }

      const vertical: number[] = [];
      const horizontal: number[] = [];
      const threshold = 0.5; // Half grid cell threshold for snapping

      currentSlide.elements.forEach((other) => {
        if (other.id === element.id) return;

        // Vertical alignment (left, center, right)
        if (Math.abs(other.x - element.x) < threshold) {
          vertical.push(other.x);
        }
        if (Math.abs(other.x + other.w - (element.x + element.w)) < threshold) {
          vertical.push(other.x + other.w);
        }
        if (
          Math.abs(other.x + other.w / 2 - (element.x + element.w / 2)) <
          threshold
        ) {
          vertical.push(other.x + other.w / 2);
        }

        // Horizontal alignment (top, middle, bottom)
        if (Math.abs(other.y - element.y) < threshold) {
          horizontal.push(other.y);
        }
        if (Math.abs(other.y + other.h - (element.y + element.h)) < threshold) {
          horizontal.push(other.y + other.h);
        }
        if (
          Math.abs(other.y + other.h / 2 - (element.y + element.h / 2)) <
          threshold
        ) {
          horizontal.push(other.y + other.h / 2);
        }
      });

      return { vertical, horizontal };
    },
    [currentSlide, showGuides]
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const elementId = event.active.id as string;
    const element = currentSlide?.elements.find((el) => el.id === elementId);
    if (element) {
      setDraggedElement(element);
      selectElement(elementId);
    }
  };

  // Handle drag move for ghost preview
  const handleDragMove = (event: DragMoveEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.delta.x / zoom;
    const y = event.delta.y / zoom;

    const gridPos = pixelToGrid(
      draggedElement.x * cellSize + x,
      draggedElement.y * cellSize + y
    );

    // Apply magnetic snapping
    if (magneticSnap && currentSlide) {
      const testElement = { ...draggedElement, ...gridPos };
      const guides = calculateAlignmentGuides(testElement);
      setAlignmentGuides(guides);

      // Snap to guides if close enough
      guides.vertical.forEach((guideX) => {
        if (Math.abs(gridPos.x - guideX) < 0.5) {
          gridPos.x = guideX;
        }
      });
      guides.horizontal.forEach((guideY) => {
        if (Math.abs(gridPos.y - guideY) < 0.5) {
          gridPos.y = guideY;
        }
      });
    }

    setGhostPosition(gridPos);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    if (!draggedElement) return;

    const delta = {
      x: event.delta.x / zoom / cellSize,
      y: event.delta.y / zoom / cellSize,
    };

    let newX = Math.round(draggedElement.x + delta.x);
    let newY = Math.round(draggedElement.y + delta.y);

    // Apply grid snapping
    if (gridConfig.snapToGrid) {
      newX = Math.round(newX);
      newY = Math.round(newY);
    }

    // Apply magnetic snapping to alignment guides
    if (magneticSnap && alignmentGuides.vertical.length > 0) {
      const closestVertical = alignmentGuides.vertical.reduce((prev, curr) =>
        Math.abs(curr - newX) < Math.abs(prev - newX) ? curr : prev
      );
      if (Math.abs(closestVertical - newX) < 0.5) {
        newX = closestVertical;
      }
    }

    if (magneticSnap && alignmentGuides.horizontal.length > 0) {
      const closestHorizontal = alignmentGuides.horizontal.reduce(
        (prev, curr) =>
          Math.abs(curr - newY) < Math.abs(prev - newY) ? curr : prev
      );
      if (Math.abs(closestHorizontal - newY) < 0.5) {
        newY = closestHorizontal;
      }
    }

    // Ensure within bounds
    newX = Math.max(0, Math.min(newX, gridConfig.columns - draggedElement.w));
    newY = Math.max(0, Math.min(newY, gridConfig.rows - draggedElement.h));

    moveElement(draggedElement.id, newX, newY, true);

    // Clean up
    setDraggedElement(null);
    setGhostPosition(null);
    setAlignmentGuides({ vertical: [], horizontal: [] });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readOnly || previewMode || !selectedElementId) return;

      const step = e.shiftKey ? 2 : 1; // Shift for faster movement

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          moveSelectedElements(0, -step);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveSelectedElements(0, step);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveSelectedElements(-step, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          moveSelectedElements(step, 0);
          break;
        case "Delete":
        case "Backspace":
          if (e.target === document.body) {
            e.preventDefault();
            // Delete selected elements
            const store = useSlideBuilderStore.getState();
            if (store.selectedElementId) {
              store.deleteElement(store.selectedElementId);
            }
            store.multiSelectIds.forEach((id) => store.deleteElement(id));
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, readOnly, previewMode, moveSelectedElements]);

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <Grid3x3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Slide Selected</h3>
          <p className="text-muted-foreground">
            Select or create a slide to start editing
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full bg-muted/10", className)}>
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant={gridConfig.showGrid ? "default" : "outline"}
          size="icon"
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={magneticSnap ? "default" : "outline"}
          size="icon"
          onClick={toggleSnap}
          title="Toggle Magnetic Snap"
        >
          <Magnet className="h-4 w-4" />
        </Button>
        <Button
          variant={showGuides ? "default" : "outline"}
          size="icon"
          onClick={toggleGuides}
          title="Toggle Alignment Guides"
        >
          {showGuides ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        <div className="border-l mx-1" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom(zoom - 0.1)}
          disabled={zoom <= 0.5}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="flex items-center px-2 text-sm">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom(zoom + 0.1)}
          disabled={zoom >= 2}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetZoom}
          title="Reset Zoom"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="h-full flex items-center justify-center p-8">
        <div
          ref={canvasRef}
          className="relative bg-white shadow-lg rounded-lg overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "1000px",
            aspectRatio: "16 / 9",
            transform: `scale(${zoom})`,
            transformOrigin: "center",
          }}
        >
          {/* Grid Overlay */}
          {gridConfig.showGrid && !previewMode && (
            <GridOverlay
              columns={gridConfig.columns}
              rows={gridConfig.rows}
              cellSize={cellSize}
            />
          )}

          {/* Alignment Guides */}
          {showGuides && alignmentGuides && (
            <AlignmentGuides
              vertical={alignmentGuides.vertical}
              horizontal={alignmentGuides.horizontal}
              cellSize={cellSize}
            />
          )}

          {/* Ghost Position Indicator */}
          {ghostPosition && draggedElement && (
            <div
              className="absolute border-2 border-primary/50 bg-primary/10 rounded pointer-events-none z-50"
              style={{
                left: ghostPosition.x * cellSize,
                top: ghostPosition.y * cellSize,
                width: draggedElement.w * cellSize,
                height: draggedElement.h * cellSize,
              }}
            />
          )}

          {/* Elements */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            {currentSlide.elements.map((element) => (
              <GridElementComponent
                key={element.id}
                element={element}
                cellSize={cellSize}
                isSelected={
                  selectedElementId === element.id ||
                  multiSelectIds.includes(element.id)
                }
                isHovered={hoveredElementId === element.id}
                isDragging={draggedElement?.id === element.id}
                readOnly={readOnly || previewMode}
                onSelect={() => selectElement(element.id)}
                onResize={(w, h) => resizeElement(element.id, w, h)}
              />
            ))}

            <DragOverlay>
              {draggedElement && (
                <div
                  className="bg-primary/20 border-2 border-primary rounded"
                  style={{
                    width: draggedElement.w * cellSize,
                    height: draggedElement.h * cellSize,
                  }}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
