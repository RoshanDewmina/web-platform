"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CourseContent } from "./_components/course-content";
import { renewableEnergyOntarioCourse } from "@/lib/course-data/renewable-energy-ontario";
import { Course } from "@/lib/course-data/renewable-energy-ontario";

// Mock function to get course data - replace with API call
function getCourseData(courseId: string): Course | null {
  if (courseId === "renewable-energy-ontario") {
    return renewableEnergyOntarioCourse;
  }
  // Add other courses here
  return null;
}

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const courseData = getCourseData(courseId);
    setCourse(courseData);
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <p className="text-muted-foreground">
              The course you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <CourseContent course={course} />
    </DashboardLayout>
  );
}
