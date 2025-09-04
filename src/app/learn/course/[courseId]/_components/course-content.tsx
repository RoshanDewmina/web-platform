"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  Course,
  Module,
  SubModule,
  CourseSlide,
} from "@/lib/course-data/renewable-energy-ontario";
import { SlideRenderer } from "./slide-renderer";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize with first slide
  useState(() => {
    if (
      course.modules.length > 0 &&
      course.modules[0].subModules.length > 0 &&
      course.modules[0].subModules[0].slides.length > 0
    ) {
      setSelectedSlide({
        module: course.modules[0],
        subModule: course.modules[0].subModules[0],
        slide: course.modules[0].subModules[0].slides[0],
      });
      setExpandedModules({ [course.modules[0].id]: true });
      setExpandedSubModules({ [course.modules[0].subModules[0].id]: true });
    }
  });

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
    setSelectedSlide({ module, subModule, slide });

    // Auto-expand the module and submodule if not already expanded
    if (!expandedModules[module.id]) {
      setExpandedModules((prev) => ({ ...prev, [module.id]: true }));
    }
    if (!expandedSubModules[subModule.id]) {
      setExpandedSubModules((prev) => ({ ...prev, [subModule.id]: true }));
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
      selectSlide(prev.module, prev.subModule, prev.slide);
    } else if (direction === "next" && currentIndex < allSlides.length - 1) {
      const next = allSlides[currentIndex + 1];
      selectSlide(next.module, next.subModule, next.slide);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Table of Contents Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-r bg-background",
          isSidebarOpen ? "w-80" : "w-0"
        )}
      >
        {isSidebarOpen && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Table of Contents</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {course.modules.map((module, moduleIndex) => (
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
                      <span className="text-sm font-medium">
                        {module.title}
                      </span>
                    </button>

                    {expandedModules[module.id] && (
                      <div className="ml-4 space-y-1">
                        {module.subModules.map((subModule, subModuleIndex) => (
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
                                {subModule.slides.map((slide, slideIndex) => (
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
                                    <span className="truncate">
                                      {slide.title}
                                    </span>
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
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Course Header */}
        <div className="border-b px-6 py-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(true)}
                  className="h-8 w-8"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.subtitle}
                </p>
              </div>
            </div>
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
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a slide to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
