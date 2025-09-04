"use client";

import React, { Suspense, lazy } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  FileText,
  Image,
  Video,
  Code,
  Type,
  BarChart,
  Table,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import { CustomComponentRenderer } from "./custom-component-renderer";
import { useCustomComponent } from "./custom-component-renderer";
import { PlaceholderComponents } from "./components/placeholder-components";

// Component Registry - Maps component types to their implementations
const componentRegistry: Record<string, React.ComponentType<any>> = {
  // Text Components
  text: PlaceholderComponents.text,
  title: PlaceholderComponents.title,
  paragraph: PlaceholderComponents.paragraph,
  list: PlaceholderComponents.list,

  // Media Components
  image: PlaceholderComponents.image,
  video: PlaceholderComponents.video,
  audio: PlaceholderComponents.audio,

  // Interactive Components
  quiz: PlaceholderComponents.quiz,
  code: PlaceholderComponents.code,
  iframe: PlaceholderComponents.iframe,

  // Data Components
  chart: PlaceholderComponents.chart,
  table: PlaceholderComponents.table,

  // Layout Components
  columns: PlaceholderComponents.columns,
  callout: PlaceholderComponents.callout,
  spacer: PlaceholderComponents.spacer,
};

interface ComponentRendererProps {
  type: string;
  props: Record<string, any>;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
  customComponentId?: string;
  slideId?: string;
  elementId?: string;
  isEditing?: boolean;
  theme?: Record<string, any>;
}

export function ComponentRenderer({
  type,
  props,
  width,
  height,
  previewMode = false,
  className,
  customComponentId,
  slideId = "",
  elementId = "",
  isEditing = false,
  theme,
}: ComponentRendererProps) {
  // Handle custom components
  if (customComponentId) {
    return (
      <CustomComponentRenderer
        componentId={customComponentId}
        props={props}
        width={width}
        height={height}
        previewMode={previewMode}
        className={className}
        slideId={slideId}
        elementId={elementId}
        isEditing={isEditing}
        theme={theme}
      />
    );
  }

  // Get component from registry
  const Component = componentRegistry[type];

  if (!Component) {
    // Fallback for unknown component types
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20",
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Unknown Component: {type}
          </p>
        </div>
      </div>
    );
  }

  // Render the component with proper props
  return (
    <div className={cn("w-full h-full", className)} style={{ width, height }}>
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <Component
          {...props}
          width={width}
          height={height}
          previewMode={previewMode}
          isEditing={isEditing}
          theme={theme}
        />
      </Suspense>
    </div>
  );
}

// Export the component registry for external use
export { componentRegistry };
