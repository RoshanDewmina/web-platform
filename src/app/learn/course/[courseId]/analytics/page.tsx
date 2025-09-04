"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnalyticsDashboard } from "@/components/course/analytics-dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CourseAnalyticsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Detailed insights into your learning progress
            </p>
          </div>
          <Link href={`/learn/course/${courseId}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
          </Link>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard courseId={courseId} />
      </div>
    </DashboardLayout>
  );
}
