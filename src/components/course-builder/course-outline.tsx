"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  MoreVertical,
  Edit,
  Copy,
  Trash,
  GripVertical,
  BookOpen,
  FileText,
  Layout,
} from "lucide-react";
import { Course, Module, Lesson, Slide } from "@/types/course-builder";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CourseOutlineProps {
  course: Course;
  selectedModule: Module | null;
  selectedLesson: Lesson | null;
  selectedSlide: Slide | null;
  onSelectModule: (module: Module) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectSlide: (slide: Slide) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onAddSlide: (lessonId: string) => void;
  onUpdateCourse: (course: Course) => void;
}

export function CourseOutline({
  course,
  selectedModule,
  selectedLesson,
  selectedSlide,
  onSelectModule,
  onSelectLesson,
  onSelectSlide,
  onAddModule,
  onAddLesson,
  onAddSlide,
  onUpdateCourse,
}: CourseOutlineProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const startEditing = (id: string, currentValue: string) => {
    setEditingItem(id);
    setEditValue(currentValue);
  };

  const finishEditing = () => {
    if (editingItem && editValue.trim()) {
      // Update the item title based on its type
      // This would be handled by the parent component
      console.log("Update item:", editingItem, editValue);
    }
    setEditingItem(null);
    setEditValue("");
  };

  return (
    <div className="h-full flex flex-col border-r bg-muted/30">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-2">Course Structure</h3>
        <Button
          onClick={onAddModule}
          className="w-full justify-start"
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {course.modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No modules yet</p>
              <p className="text-xs">Click "Add Module" to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {course.modules.map((module) => (
                <div key={module.id}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Collapsible
                        open={expandedModules.has(module.id)}
                        onOpenChange={() => toggleModule(module.id)}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-1 p-2 rounded-md hover:bg-accent/50 cursor-pointer",
                            selectedModule?.id === module.id && "bg-accent"
                          )}
                          onClick={() => onSelectModule(module)}
                        >
                          <CollapsibleTrigger className="p-0">
                            {expandedModules.has(module.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </CollapsibleTrigger>
                          <BookOpen className="h-4 w-4" />
                          {editingItem === module.id ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={finishEditing}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") finishEditing();
                                if (e.key === "Escape") setEditingItem(null);
                              }}
                              className="h-6 px-1"
                              autoFocus
                            />
                          ) : (
                            <span className="flex-1 text-sm font-medium truncate">
                              {module.title}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddLesson(module.id);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <CollapsibleContent className="ml-4">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id}>
                              <Collapsible
                                open={expandedLessons.has(lesson.id)}
                                onOpenChange={() => toggleLesson(lesson.id)}
                              >
                                <div
                                  className={cn(
                                    "flex items-center gap-1 p-2 rounded-md hover:bg-accent/50 cursor-pointer",
                                    selectedLesson?.id === lesson.id &&
                                      "bg-accent"
                                  )}
                                  onClick={() => onSelectLesson(lesson)}
                                >
                                  <CollapsibleTrigger className="p-0">
                                    {expandedLessons.has(lesson.id) ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </CollapsibleTrigger>
                                  <FileText className="h-3 w-3" />
                                  {editingItem === lesson.id ? (
                                    <Input
                                      value={editValue}
                                      onChange={(e) =>
                                        setEditValue(e.target.value)
                                      }
                                      onBlur={finishEditing}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") finishEditing();
                                        if (e.key === "Escape")
                                          setEditingItem(null);
                                      }}
                                      className="h-6 px-1"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="flex-1 text-xs truncate">
                                      {lesson.title}
                                    </span>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddSlide(lesson.id);
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <CollapsibleContent className="ml-4">
                                  {lesson.slides.map((slide, index) => (
                                    <div
                                      key={slide.id}
                                      className={cn(
                                        "flex items-center gap-1 p-1.5 rounded-md hover:bg-accent/50 cursor-pointer",
                                        selectedSlide?.id === slide.id &&
                                          "bg-accent"
                                      )}
                                      onClick={() => onSelectSlide(slide)}
                                    >
                                      <Layout className="h-3 w-3" />
                                      {editingItem === slide.id ? (
                                        <Input
                                          value={editValue}
                                          onChange={(e) =>
                                            setEditValue(e.target.value)
                                          }
                                          onBlur={finishEditing}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              finishEditing();
                                            if (e.key === "Escape")
                                              setEditingItem(null);
                                          }}
                                          className="h-5 px-1 text-xs"
                                          autoFocus
                                        />
                                      ) : (
                                        <span className="flex-1 text-xs truncate">
                                          {index + 1}. {slide.title}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => startEditing(module.id, module.title)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
