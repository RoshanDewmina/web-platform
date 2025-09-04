"use client";

import { useEffect, useCallback, useRef } from "react";
import { progressTracker } from "@/lib/progress-tracker";
import { useAuth } from "@clerk/nextjs";

interface UseProgressTrackingOptions {
  courseId: string;
  totalSlides: number;
}

export function useProgressTracking({
  courseId,
  totalSlides,
}: UseProgressTrackingOptions) {
  const { isSignedIn } = useAuth();
  const sessionRef = useRef<string | null>(null);
  const isTrackingRef = useRef(false);

  // Start session when component mounts
  useEffect(() => {
    if (!isSignedIn || isTrackingRef.current) return;

    const startTracking = async () => {
      isTrackingRef.current = true;
      const sessionId = await progressTracker.startSession(courseId, totalSlides);
      sessionRef.current = sessionId;
    };

    startTracking();

    // Cleanup on unmount
    return () => {
      if (isTrackingRef.current) {
        progressTracker.endSession();
        isTrackingRef.current = false;
      }
    };
  }, [courseId, totalSlides, isSignedIn]);

  // Track slide view
  const trackSlideView = useCallback(
    (slideId: string, moduleId: string, subModuleId: string, completed = false) => {
      if (!isSignedIn || !sessionRef.current) return;
      progressTracker.trackSlideView(slideId, moduleId, subModuleId, completed);
    },
    [isSignedIn]
  );

  // Track user interaction
  const trackInteraction = useCallback(
    (eventType: string, eventName: string, eventData?: any) => {
      if (!isSignedIn || !sessionRef.current) return;
      progressTracker.trackInteraction(eventType, eventName, eventData);
    },
    [isSignedIn]
  );

  // Mark slide as completed
  const markSlideCompleted = useCallback(
    (slideId: string) => {
      if (!isSignedIn || !sessionRef.current) return;
      progressTracker.markSlideCompleted(slideId);
    },
    [isSignedIn]
  );

  // Get current progress
  const getProgress = useCallback(() => {
    return progressTracker.getProgress();
  }, []);

  return {
    trackSlideView,
    trackInteraction,
    markSlideCompleted,
    getProgress,
    sessionId: sessionRef.current,
  };
}

// Hook for tracking specific interactions
export function useInteractionTracking() {
  const { isSignedIn } = useAuth();

  const track = useCallback(
    (eventType: string, eventName: string, eventData?: any) => {
      if (!isSignedIn) return;
      progressTracker.trackInteraction(eventType, eventName, eventData);
    },
    [isSignedIn]
  );

  return { track };
}
