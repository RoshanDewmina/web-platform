"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CourseOutline } from "@/components/course-builder/course-outline";
import { ContentCanvas } from "@/components/course-builder/content-canvas";
import { PropertiesPanel } from "@/components/course-builder/properties-panel";
import { BuilderToolbar } from "@/components/course-builder/builder-toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useParams } from "next/navigation";
import {
  Course,
  Module,
  Lesson,
  Slide,
  ContentBlock,
} from "@/types/course-builder";

export default function CourseBuilder() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourse(updatedCourse);
  };

  const handleAddModule = () => {
    if (!course) return;
    const newModule: Module = {
      id: `module-${Date.now()}`,
      courseId: course.id,
      title: "New Module",
      description: "",
      lessons: [],
      order: course.modules.length,
    };

    const updatedCourse = {
      ...course,
      modules: [...course.modules, newModule],
    };

    setCourse(updatedCourse);
    setSelectedModule(newModule);
  };

  const handleAddLesson = (moduleId: string) => {
    if (!course) return;
    const module = course.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId: moduleId,
      title: "New Lesson",
      description: "",
      slides: [],
      order: module.lessons.length,
      settings: {},
    };

    const updatedModules = course.modules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, newLesson],
        };
      }
      return m;
    });

    setCourse({ ...course, modules: updatedModules });
    setSelectedLesson(newLesson);
  };

  const handleAddSlide = (lessonId: string) => {
    if (!course) return;
    const lesson = selectedModule?.lessons.find((l) => l.id === lessonId);
    if (!lesson || !selectedModule) return;

    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: "New Slide",
      blocks: [],
      order: lesson.slides.length,
    };

    const updatedModules = course.modules.map((m) => {
      if (m.id === selectedModule.id) {
        return {
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id === lessonId) {
              return {
                ...l,
                slides: [...l.slides, newSlide],
              };
            }
            return l;
          }),
        };
      }
      return m;
    });

    setCourse({ ...course, modules: updatedModules });
    setSelectedSlide(newSlide);
  };

  // Load course for builder
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!courseId || courseId === "new") {
        setCourse({
          id: "",
          title: "New Course",
          description: "",
          modules: [],
          metadata: {
            difficulty: "beginner",
            duration: 0,
            objectives: [],
            prerequisites: [],
            tags: [],
            category: "",
          },
          settings: { status: "draft", visibility: "private" },
          createdBy: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return;
      }
      const res = await fetch(`/api/courses/${courseId}/builder`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (isMounted) setCourse(data);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const save = useCallback(async () => {
    if (!course || !courseId) return;
    await fetch(`/api/courses/${courseId}/builder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course }),
    });
  }, [course, courseId]);

  const publish = useCallback(async () => {
    if (!courseId) return;
    await fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: true }),
    });
  }, [courseId]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      {course && (
        <BuilderToolbar
          course={course}
          onSave={save}
          onPublish={publish}
          onPreview={() => console.log("Preview mode...")}
          onTogglePreviewMode={(mode) => setPreviewMode(mode)}
        />
      )}

      {/* Main Builder Interface */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Course Outline */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          {course && (
            <CourseOutline
              course={course}
              selectedModule={selectedModule}
              selectedLesson={selectedLesson}
              selectedSlide={selectedSlide}
              onSelectModule={setSelectedModule}
              onSelectLesson={setSelectedLesson}
              onSelectSlide={setSelectedSlide}
              onAddModule={handleAddModule}
              onAddLesson={handleAddLesson}
              onAddSlide={handleAddSlide}
              onUpdateCourse={handleCourseUpdate}
            />
          )}
        </ResizablePanel>

        <ResizableHandle />

        {/* Center - Content Canvas */}
        <ResizablePanel defaultSize={55}>
          <ContentCanvas
            slide={selectedSlide}
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
            onUpdateSlide={(updatedSlide) => {
              if (!course || !selectedModule || !selectedLesson) return;

              const updatedModules = course.modules.map((m) => {
                if (m.id === selectedModule.id) {
                  return {
                    ...m,
                    lessons: m.lessons.map((l) => {
                      if (l.id === selectedLesson.id) {
                        return {
                          ...l,
                          slides: l.slides.map((s) =>
                            s.id === updatedSlide.id ? updatedSlide : s
                          ),
                        };
                      }
                      return l;
                    }),
                  };
                }
                return m;
              });

              setCourse({ ...course, modules: updatedModules });
              setSelectedSlide(updatedSlide);
            }}
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel - Properties */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          {course && (
            <PropertiesPanel
              selectedItem={
                selectedBlock ||
                selectedSlide ||
                selectedLesson ||
                selectedModule ||
                course
              }
              onUpdate={(updatedItem) => {
                // Handle updates based on item type
                console.log("Updating item:", updatedItem);
              }}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
