"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  PlayCircle,
  FileText,
  MessageSquare,
  ArrowLeft,
  GripVertical,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import {
  Course,
  Module,
  SubModule,
  CourseSlide,
} from "@/lib/course-data/renewable-energy-ontario";
import { SlideRenderer } from "./slide-renderer";
import { useProgressTracking } from "@/hooks/use-progress-tracking";
import { ProgressDisplay } from "@/components/course/progress-display";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CourseContentProps {
  course: Course;
}

export function CourseContent({ course }: CourseContentProps) {
  const [selectedSlide, setSelectedSlide] = useState<{
    module: Module;
    subModule: SubModule;
    slide: CourseSlide;
  } | null>(null);
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [expandedSubModules, setExpandedSubModules] = useState<
    Record<string, boolean>
  >({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Calculate total slides
  const totalSlides = course.modules.reduce(
    (total, module) =>
      total +
      module.subModules.reduce(
        (subTotal, subModule) => subTotal + subModule.slides.length,
        0
      ),
    0
  );

  // Initialize progress tracking
  const { trackSlideView, trackInteraction, markSlideCompleted, getProgress } =
    useProgressTracking({
      courseId: course.id,
      totalSlides,
    });

  // Initialize with first slide
  useState(() => {
    if (
      course.modules.length > 0 &&
      course.modules[0].subModules.length > 0 &&
      course.modules[0].subModules[0].slides.length > 0
    ) {
      const firstModule = course.modules[0];
      const firstSubModule = firstModule.subModules[0];
      const firstSlide = firstSubModule.slides[0];

      setSelectedSlide({
        module: firstModule,
        subModule: firstSubModule,
        slide: firstSlide,
      });
      setExpandedModules({ [firstModule.id]: true });
      setExpandedSubModules({ [firstSubModule.id]: true });
    }
  });

  // Track slide view when slide changes
  useEffect(() => {
    if (selectedSlide) {
      trackSlideView(
        selectedSlide.slide.id,
        selectedSlide.module.id,
        selectedSlide.subModule.id
      );
    }
  }, [selectedSlide, trackSlideView]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleSubModule = (subModuleId: string) => {
    setExpandedSubModules((prev) => ({
      ...prev,
      [subModuleId]: !prev[subModuleId],
    }));
  };

  const selectSlide = (
    module: Module,
    subModule: SubModule,
    slide: CourseSlide
  ) => {
    // Track navigation interaction
    trackInteraction("navigation", "slide_select", {
      slideId: slide.id,
      moduleId: module.id,
      subModuleId: subModule.id,
      method: "sidebar",
    });

    setSelectedSlide({ module, subModule, slide });

    // Auto-expand the module and submodule if not already expanded
    if (!expandedModules[module.id]) {
      setExpandedModules((prev) => ({ ...prev, [module.id]: true }));
    }
    if (!expandedSubModules[subModule.id]) {
      setExpandedSubModules((prev) => ({ ...prev, [subModule.id]: true }));
    }

    // Close mobile sidebar after selection
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const getSlideIcon = (type?: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "interactive":
        return <MessageSquare className="h-4 w-4" />;
      case "quiz":
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const navigateSlide = (direction: "prev" | "next") => {
    if (!selectedSlide) return;

    const allSlides: {
      module: Module;
      subModule: SubModule;
      slide: CourseSlide;
    }[] = [];

    course.modules.forEach((module) => {
      module.subModules.forEach((subModule) => {
        subModule.slides.forEach((slide) => {
          allSlides.push({ module, subModule, slide });
        });
      });
    });

    const currentIndex = allSlides.findIndex(
      (item) => item.slide.id === selectedSlide.slide.id
    );

    if (direction === "prev" && currentIndex > 0) {
      const prev = allSlides[currentIndex - 1];

      // Track navigation
      trackInteraction("navigation", "slide_navigate", {
        from: selectedSlide.slide.id,
        to: prev.slide.id,
        direction: "previous",
        method: "button",
      });

      selectSlide(prev.module, prev.subModule, prev.slide);
    } else if (direction === "next" && currentIndex < allSlides.length - 1) {
      const next = allSlides[currentIndex + 1];

      // Mark current slide as completed when navigating forward
      if (direction === "next") {
        markSlideCompleted(selectedSlide.slide.id);
      }

      // Track navigation
      trackInteraction("navigation", "slide_navigate", {
        from: selectedSlide.slide.id,
        to: next.slide.id,
        direction: "next",
        method: "button",
      });

      selectSlide(next.module, next.subModule, next.slide);
    }
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Table of Contents</h2>
      </div>

      {/* Progress Display */}
      <div className="p-4 border-b">
        <ProgressDisplay courseId={course.id} className="shadow-sm" />
        <Link href={`/learn/course/${course.id}/analytics`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            View Detailed Analytics
          </Button>
        </Link>
      </div>

      {/* Course Modules */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-1">
              <button
                onClick={() => toggleModule(module.id)}
                className="flex items-center gap-2 w-full p-2 text-left hover:bg-accent rounded-lg transition-colors"
              >
                {expandedModules[module.id] ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <span className="text-sm font-medium">{module.title}</span>
              </button>

              {expandedModules[module.id] && (
                <div className="ml-4 space-y-1">
                  {module.subModules.map((subModule) => (
                    <div key={subModule.id} className="space-y-1">
                      <button
                        onClick={() => toggleSubModule(subModule.id)}
                        className="flex items-center gap-2 w-full p-2 text-left hover:bg-accent rounded-lg transition-colors"
                      >
                        {expandedSubModules[subModule.id] ? (
                          <ChevronDown className="h-3 w-3 shrink-0" />
                        ) : (
                          <ChevronRight className="h-3 w-3 shrink-0" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {subModule.title}
                        </span>
                      </button>

                      {expandedSubModules[subModule.id] && (
                        <div className="ml-4 space-y-0.5">
                          {subModule.slides.map((slide) => (
                            <button
                              key={slide.id}
                              onClick={() =>
                                selectSlide(module, subModule, slide)
                              }
                              className={cn(
                                "flex items-center gap-2 w-full p-2 text-left rounded-lg transition-colors text-sm",
                                selectedSlide?.slide.id === slide.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent"
                              )}
                            >
                              {getSlideIcon(slide.type)}
                              <span className="truncate">{slide.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <div className="flex h-screen relative bg-background overflow-hidden">
        {/* Mobile Sheet */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <SheetHeader className="sr-only">
              <SheetTitle>Course Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Course Header */}
          <div className="border-b px-6 py-4 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(true)}
                  className="h-8 w-8"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.subtitle}
                  </p>
                </div>
              </div>
              <Link href="/learn">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Slide Content */}
          <div className="flex-1 overflow-auto">
            {selectedSlide ? (
              <SlideRenderer
                slide={selectedSlide.slide}
                module={selectedSlide.module}
                subModule={selectedSlide.subModule}
                onNavigate={navigateSlide}
                onInteraction={trackInteraction}
                onSlideComplete={() =>
                  markSlideCompleted(selectedSlide.slide.id)
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select a slide to begin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop resizable layout
  const savedSize =
    typeof window !== "undefined"
      ? localStorage.getItem("course-sidebar-size")
      : null;
  const defaultSidebarSize = savedSize ? JSON.parse(savedSize) : 25;

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full"
        onLayout={(sizes: number[]) => {
          localStorage.setItem("course-sidebar-size", JSON.stringify(sizes[0]));
        }}
      >
        <ResizablePanel
          defaultSize={defaultSidebarSize}
          minSize={15}
          maxSize={40}
          className="bg-background"
        >
          <SidebarContent />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75} minSize={60}>
          <div className="flex flex-col h-full">
            {/* Course Header */}
            <div className="border-b px-6 py-4 bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.subtitle}
                  </p>
                </div>
                <Link href="/learn">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* Slide Content */}
            <div className="flex-1 overflow-auto">
              {selectedSlide ? (
                <SlideRenderer
                  slide={selectedSlide.slide}
                  module={selectedSlide.module}
                  subModule={selectedSlide.subModule}
                  onNavigate={navigateSlide}
                  onInteraction={trackInteraction}
                  onSlideComplete={() =>
                    markSlideCompleted(selectedSlide.slide.id)
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a slide to begin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
