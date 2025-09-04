"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PlayCircle,
  FileText,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";
import {
  CourseSlide,
  Module,
  SubModule,
} from "@/lib/course-data/renewable-energy-ontario";
import ReactMarkdown from "react-markdown";

interface SlideRendererProps {
  slide: CourseSlide;
  module: Module;
  subModule: SubModule;
  onNavigate: (direction: "prev" | "next") => void;
}

export function SlideRenderer({
  slide,
  module,
  subModule,
  onNavigate,
}: SlideRendererProps) {
  const getSlideTypeIcon = () => {
    switch (slide.type) {
      case "video":
        return <PlayCircle className="h-5 w-5" />;
      case "interactive":
        return <MessageSquare className="h-5 w-5" />;
      case "quiz":
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getSlideTypeLabel = () => {
    switch (slide.type) {
      case "video":
        return "Video";
      case "interactive":
        return "Interactive";
      case "quiz":
        return "Quiz";
      default:
        return "Content";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{module.title}</span>
        <ChevronRight className="h-4 w-4" />
        <span>{subModule.title}</span>
      </div>

      {/* Slide Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            {getSlideTypeIcon()}
            {getSlideTypeLabel()}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{slide.title}</h1>
      </div>

      <Separator />

      {/* Slide Content */}
      <div className="space-y-6">
        {/* Main Content */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 space-y-2 my-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 space-y-2 my-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed" suppressHydrationWarning>
                      {children}
                    </li>
                  ),
                  p: ({ children }) => (
                    <p className="leading-relaxed my-4">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                }}
              >
                {slide.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Visual Placeholder */}
        {slide.visualPlaceholder && (
          <Card className="border-dashed">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground text-sm max-w-md">
                  {slide.visualPlaceholder}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        {slide.notes && slide.notes.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </h3>
              <ul className="space-y-2">
                {slide.notes.map((note, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Interactive Elements */}
        {slide.type === "interactive" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Interactive Activity</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This is an interactive slide. Complete the activity to continue.
              </p>
              <Button variant="outline" className="w-full">
                Start Activity
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Video Elements */}
        {slide.type === "video" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Video Content</h3>
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-3">
                  <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Video content will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => onNavigate("prev")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={() => onNavigate("next")}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
