"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Type,
  Heading,
  Image,
  Video,
  FileAudio,
  Code,
  HelpCircle,
  BarChart,
  Table,
  Columns,
  AlertCircle,
  Globe,
  FileText,
  List,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentPaletteProps {
  onComponentSelect: (type: string, defaultProps: any) => void;
}

const components = [
  {
    category: "Text",
    items: [
      {
        type: "title",
        name: "Title",
        icon: Heading,
        defaultProps: { content: "Title", level: 1 },
      },
      {
        type: "text",
        name: "Text",
        icon: Type,
        defaultProps: { content: "Enter text..." },
      },
      {
        type: "paragraph",
        name: "Paragraph",
        icon: FileText,
        defaultProps: { content: "Paragraph text..." },
      },
      {
        type: "list",
        name: "List",
        icon: List,
        defaultProps: { items: ["Item 1", "Item 2"] },
      },
    ],
  },
  {
    category: "Media",
    items: [
      {
        type: "image",
        name: "Image",
        icon: Image,
        defaultProps: { alt: "Image" },
      },
      { type: "video", name: "Video", icon: Video, defaultProps: {} },
      { type: "audio", name: "Audio", icon: FileAudio, defaultProps: {} },
    ],
  },
  {
    category: "Interactive",
    items: [
      {
        type: "quiz",
        name: "Quiz",
        icon: HelpCircle,
        defaultProps: { questions: [] },
      },
      {
        type: "code",
        name: "Code",
        icon: Code,
        defaultProps: { code: "// Code", language: "javascript" },
      },
      { type: "iframe", name: "Embed", icon: Globe, defaultProps: { src: "" } },
    ],
  },
  {
    category: "Data",
    items: [
      {
        type: "chart",
        name: "Chart",
        icon: BarChart,
        defaultProps: { type: "bar" },
      },
      {
        type: "table",
        name: "Table",
        icon: Table,
        defaultProps: { rows: [], columns: [] },
      },
    ],
  },
  {
    category: "Layout",
    items: [
      {
        type: "columns",
        name: "Columns",
        icon: Columns,
        defaultProps: { columns: 2 },
      },
      {
        type: "callout",
        name: "Callout",
        icon: AlertCircle,
        defaultProps: { type: "info", content: "" },
      },
      {
        type: "spacer",
        name: "Spacer",
        icon: Square,
        defaultProps: { height: 50 },
      },
    ],
  },
];

export function ComponentPalette({ onComponentSelect }: ComponentPaletteProps) {
  const [draggingType, setDraggingType] = React.useState<string | null>(null);

  const handleDragStart =
    (type: string, defaultProps: any) => (e: React.DragEvent) => {
      setDraggingType(type);
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("component-type", type);
      e.dataTransfer.setData("component-props", JSON.stringify(defaultProps));
    };

  const handleDragEnd = () => {
    setDraggingType(null);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {components.map((category) => (
          <div key={category.category}>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
              {category.category}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.type}
                    className={cn(
                      "p-3 cursor-move hover:bg-muted/50 transition-all",
                      "hover:shadow-md hover:scale-105",
                      draggingType === item.type && "opacity-50 scale-95"
                    )}
                    draggable
                    onDragStart={handleDragStart(item.type, item.defaultProps)}
                    onDragEnd={handleDragEnd}
                    onClick={() =>
                      onComponentSelect(item.type, item.defaultProps)
                    }
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
