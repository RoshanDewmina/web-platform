"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  FileAudio,
  Globe,
  List,
  Square,
  HelpCircle,
} from "lucide-react";

// Text Components
export function TitleComponent({
  content = "Title",
  level = 1,
  align = "left",
  fontSize = 48,
  color = "inherit",
  ...props
}: any) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className="w-full font-bold outline-none cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
      style={{ fontSize: `${fontSize}px`, color, textAlign: align as any }}
      contentEditable={false}
      {...props}
    >
      {content}
    </Tag>
  );
}

export function TextComponent({
  content = "Text content",
  fontSize = 18,
  align = "left",
  lineHeight = 1.5,
  ...props
}: any) {
  return (
    <div
      className="w-full outline-none cursor-text hover:bg-muted/50 rounded px-2 py-1 transition-colors"
      style={{ fontSize: `${fontSize}px`, textAlign: align, lineHeight }}
      contentEditable={false}
      {...props}
    >
      {content}
    </div>
  );
}

export function ParagraphComponent({
  content = "Paragraph text...",
  ...props
}: any) {
  return (
    <p className="w-full text-sm leading-relaxed" {...props}>
      {content}
    </p>
  );
}

export function ListComponent({
  items = ["Item 1", "Item 2", "Item 3"],
  type = "bullet",
  ...props
}: any) {
  const ListTag = type === "numbered" ? "ol" : "ul";
  return (
    <ListTag className="w-full space-y-1" {...props}>
      {items.map((item: string, index: number) => (
        <li key={index} className="text-sm">
          {item}
        </li>
      ))}
    </ListTag>
  );
}

// Media Components
export function ImageComponent({
  src = "https://via.placeholder.com/400x300",
  alt = "Image",
  fit = "cover",
  borderRadius = 0,
  ...props
}: any) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
      <div className="text-center">
        <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{alt || "Image"}</p>
      </div>
    </div>
  );
}

export function VideoComponent({ src = "", title = "Video", ...props }: any) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
      <div className="text-center">
        <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{title || "Video"}</p>
      </div>
    </div>
  );
}

export function AudioComponent({ src = "", title = "Audio", ...props }: any) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
      <div className="text-center">
        <FileAudio className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{title || "Audio"}</p>
      </div>
    </div>
  );
}

// Interactive Components
export function QuizComponent({
  question = "Question",
  options = ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswer = 0,
  ...props
}: any) {
  return (
    <Card className="w-full h-full p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium">Quiz</h4>
        </div>
        <p className="text-sm font-medium">{question}</p>
        <div className="space-y-2">
          {options.map((option: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function CodeComponent({
  code = "// Code",
  language = "javascript",
  ...props
}: any) {
  return (
    <div className="w-full h-full bg-muted/20 rounded border">
      <div className="bg-muted px-3 py-1 border-b">
        <span className="text-xs text-muted-foreground">{language}</span>
      </div>
      <pre className="p-3 text-sm overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function IframeComponent({
  src = "",
  title = "Embedded Content",
  ...props
}: any) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
      <div className="text-center">
        <Globe className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {title || "Embedded Content"}
        </p>
      </div>
    </div>
  );
}

// Data Components
export function ChartComponent({ type = "bar", data = [], ...props }: any) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
      <div className="text-center">
        <BarChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{type} Chart</p>
      </div>
    </div>
  );
}

export function TableComponent({
  headers = ["Header 1", "Header 2", "Header 3"],
  rows = [
    ["Row 1", "Data", "Data"],
    ["Row 2", "Data", "Data"],
  ],
  ...props
}: any) {
  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse border border-muted-foreground/20">
        <thead>
          <tr>
            {headers.map((header: string, index: number) => (
              <th
                key={index}
                className="border border-muted-foreground/20 px-2 py-1 text-xs font-medium bg-muted/20"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: string, cellIndex: number) => (
                <td
                  key={cellIndex}
                  className="border border-muted-foreground/20 px-2 py-1 text-xs"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Layout Components
export function ColumnsComponent({
  columns = 2,
  content = ["Column 1", "Column 2"],
  ...props
}: any) {
  return (
    <div
      className="w-full h-full grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          className="bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 p-2"
        >
          <p className="text-xs text-muted-foreground text-center">
            {content[index] || `Column ${index + 1}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CalloutComponent({
  content = "Callout",
  type = "info",
  icon = "info",
  ...props
}: any) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    info: AlertCircle,
    warning: AlertCircle,
    error: AlertCircle,
    success: AlertCircle,
  };

  const Icon = iconMap[icon] || AlertCircle;

  return (
    <Card
      className={cn(
        "w-full h-full p-4",
        type === "warning" && "border-yellow-200 bg-yellow-50",
        type === "error" && "border-red-200 bg-red-50",
        type === "success" && "border-green-200 bg-green-50"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "h-5 w-5 mt-0.5",
            type === "warning" && "text-yellow-600",
            type === "error" && "text-red-600",
            type === "success" && "text-green-600",
            "text-blue-600"
          )}
        />
        <div className="flex-1">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </Card>
  );
}

export function SpacerComponent({ height = 20, ...props }: any) {
  return (
    <div className="w-full" style={{ height: `${height}px` }} {...props} />
  );
}

// Export all components for easy access
export const PlaceholderComponents = {
  title: TitleComponent,
  text: TextComponent,
  paragraph: ParagraphComponent,
  list: ListComponent,
  image: ImageComponent,
  video: VideoComponent,
  audio: AudioComponent,
  quiz: QuizComponent,
  code: CodeComponent,
  iframe: IframeComponent,
  chart: ChartComponent,
  table: TableComponent,
  columns: ColumnsComponent,
  callout: CalloutComponent,
  spacer: SpacerComponent,
};
