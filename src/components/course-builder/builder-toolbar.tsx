"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Eye,
  ChevronLeft,
  Undo,
  Redo,
  Settings,
  Upload,
  Download,
  Rocket,
  MoreVertical,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Course } from "@/types/course-builder";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface BuilderToolbarProps {
  course: Course;
  onSave: () => Promise<void> | void;
  onPublish: () => Promise<void> | void;
  onPreview: () => void;
  onTogglePreviewMode?: (mode: "desktop" | "mobile") => void;
}

export function BuilderToolbar({
  course,
  onSave,
  onPublish,
  onPreview,
  onTogglePreviewMode,
}: BuilderToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [course]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setLastSaved(new Date());
      toast.success("Course saved successfully");
    } catch (error) {
      toast.error("Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!course.title || course.modules.length === 0) {
      toast.error(
        "Please add a title and at least one module before publishing"
      );
      return;
    }

    try {
      await onPublish();
      toast.success("Course published successfully");
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  return (
    <div className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <h2 className="font-semibold">
              {course.title || "Untitled Course"}
            </h2>
            <Badge
              variant={
                course.settings.status === "published" ? "default" : "secondary"
              }
            >
              {course.settings.status}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Redo className="h-4 w-4" />
            </Button>
            {onTogglePreviewMode && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTogglePreviewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTogglePreviewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={course.settings.status === "published"}
          >
            <Rocket className="h-4 w-4 mr-2" />
            Publish
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Import Content
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Course Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
