"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "BEGINNER",
    estimatedHours: 10,
    tags: "",
    thumbnail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseData.title || !courseData.description || !courseData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create the course
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...courseData,
          tags: courseData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          visibility: "PUBLIC",
          price: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const newCourse = await response.json();

      toast.success("Course created successfully!");

      // Redirect to course builder
      router.push(`/admin/courses/${newCourse.id}/builder`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Course</h1>
        </div>

        {/* Course Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Web Development"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of what students will learn..."
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={courseData.category}
                  onValueChange={(value) =>
                    setCourseData({ ...courseData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Personal Development">
                      Personal Development
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={courseData.difficulty}
                  onValueChange={(value) =>
                    setCourseData({ ...courseData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Hours */}
              <div className="space-y-2">
                <Label htmlFor="hours">Estimated Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={courseData.estimatedHours}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      estimatedHours: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., javascript, react, web development"
                  value={courseData.tags}
                  onChange={(e) =>
                    setCourseData({ ...courseData, tags: e.target.value })
                  }
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={courseData.thumbnail}
                  onChange={(e) =>
                    setCourseData({ ...courseData, thumbnail: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Course & Continue"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              After creating the course, you'll be taken to the Course Builder
              where you can:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add modules to organize your content</li>
              <li>Create lessons within each module</li>
              <li>
                Design interactive slides with text, images, code, and more
              </li>
              <li>Add quizzes to test student knowledge</li>
              <li>Configure course settings and pricing</li>
              <li>Preview and publish your course</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
