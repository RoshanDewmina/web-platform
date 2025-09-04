"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";

interface CourseAnalytics {
  analytics: any;
  recentSessions: any[];
  slideStatistics: any[];
  interactionStats: any[];
  enrollment: any;
  insights: any;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCourseAnalytics(courseId: string) {
  const { data, error, isLoading, mutate } = useSWR<CourseAnalytics>(
    courseId ? `/api/analytics/course/${courseId}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    analytics: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useCourseProgress(courseId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    courseId ? `/api/progress?courseId=${courseId}` : null,
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  );

  return {
    progress: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
