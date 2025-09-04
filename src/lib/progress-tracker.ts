import { debounce } from "@/lib/utils";

export interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  platform: string;
  language: string;
  timezone: string;
}

export interface ProgressSnapshot {
  currentSlideId: string;
  completedSlides: string[];
  totalTimeSpent: number;
  lastInteraction: Date;
}

class ProgressTracker {
  private sessionId: string | null = null;
  private courseId: string | null = null;
  private currentSlideId: string | null = null;
  private slideStartTime: number = 0;
  private sessionStartTime: number = 0;
  private completedSlides: Set<string> = new Set();
  private totalSlides: number = 0;
  private interactionQueue: any[] = [];
  private isProcessingQueue = false;

  // Debounced functions
  private debouncedSlideUpdate = debounce(this.sendSlideUpdate.bind(this), 5000);
  private debouncedInteraction = debounce(this.processInteractionQueue.bind(this), 1000);

  // Get device information
  private getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  // Start a new course session
  async startSession(courseId: string, totalSlides: number) {
    this.courseId = courseId;
    this.totalSlides = totalSlides;
    this.sessionStartTime = Date.now();
    this.completedSlides.clear();

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "session_start",
          data: {
            courseId,
            deviceInfo: this.getDeviceInfo(),
            totalSlides,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.sessionId = data.sessionId;
        
        // Set up event listeners
        this.setupEventListeners();
        
        return this.sessionId;
      }
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  }

  // End the current session
  async endSession() {
    if (!this.sessionId) return;

    // Send any pending slide update
    if (this.currentSlideId) {
      await this.sendSlideUpdate();
    }

    // Process any remaining interactions
    await this.processInteractionQueue();

    const completionRate = (this.completedSlides.size / this.totalSlides) * 100;

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "session_end",
          data: {
            sessionId: this.sessionId,
            completedSlides: this.completedSlides.size,
            completionRate,
            progressSnapshot: {
              currentSlideId: this.currentSlideId,
              completedSlides: Array.from(this.completedSlides),
              totalTimeSpent: Date.now() - this.sessionStartTime,
              lastInteraction: new Date(),
            },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to end session:", error);
    }

    this.cleanup();
  }

  // Track slide view
  trackSlideView(
    slideId: string,
    moduleId: string,
    subModuleId: string,
    completed: boolean = false
  ) {
    if (!this.sessionId) return;

    // Send update for previous slide if exists
    if (this.currentSlideId && this.currentSlideId !== slideId) {
      this.sendSlideUpdate();
    }

    this.currentSlideId = slideId;
    this.slideStartTime = Date.now();

    if (completed) {
      this.completedSlides.add(slideId);
    }

    // Track the new slide view
    this.debouncedSlideUpdate({
      slideId,
      moduleId,
      subModuleId,
      initialView: true,
    });
  }

  // Track user interactions
  trackInteraction(
    eventType: string,
    eventName: string,
    eventData: any = {}
  ) {
    if (!this.sessionId) return;

    this.interactionQueue.push({
      sessionId: this.sessionId,
      slideId: this.currentSlideId,
      eventType,
      eventName,
      eventData: {
        ...eventData,
        timestamp: new Date().toISOString(),
      },
    });

    this.debouncedInteraction();
  }

  // Mark current slide as completed
  markSlideCompleted(slideId: string) {
    this.completedSlides.add(slideId);
    if (this.currentSlideId === slideId) {
      this.sendSlideUpdate(true);
    }
  }

  // Get current progress
  getProgress() {
    return {
      sessionId: this.sessionId,
      courseId: this.courseId,
      completedSlides: Array.from(this.completedSlides),
      completionRate: (this.completedSlides.size / this.totalSlides) * 100,
      totalTimeSpent: Date.now() - this.sessionStartTime,
    };
  }

  // Private methods
  private async sendSlideUpdate(completed: boolean = false) {
    if (!this.sessionId || !this.currentSlideId) return;

    const timeSpent = Math.floor((Date.now() - this.slideStartTime) / 1000);
    const scrollDepth = this.calculateScrollDepth();

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "slide_view",
          data: {
            sessionId: this.sessionId,
            slideId: this.currentSlideId,
            moduleId: "", // Will be passed from trackSlideView
            subModuleId: "", // Will be passed from trackSlideView
            timeSpent,
            scrollDepth,
            completed: completed || this.completedSlides.has(this.currentSlideId),
          },
        }),
      });
    } catch (error) {
      console.error("Failed to update slide view:", error);
    }
  }

  private async processInteractionQueue() {
    if (this.isProcessingQueue || this.interactionQueue.length === 0) return;

    this.isProcessingQueue = true;
    const interactions = [...this.interactionQueue];
    this.interactionQueue = [];

    try {
      await Promise.all(
        interactions.map((interaction) =>
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "interaction",
              data: interaction,
            }),
          })
        )
      );
    } catch (error) {
      console.error("Failed to send interactions:", error);
      // Re-add failed interactions to queue
      this.interactionQueue.unshift(...interactions);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private calculateScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (documentHeight <= windowHeight) return 100;
    
    return Math.min(100, Math.round(((scrollTop + windowHeight) / documentHeight) * 100));
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    
    // Track before unload
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    
    // Track scroll depth
    window.addEventListener("scroll", this.handleScroll);
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      // Page is hidden, pause tracking
      this.sendSlideUpdate();
      this.processInteractionQueue();
    }
  };

  private handleBeforeUnload = () => {
    // Try to send remaining data before page unload
    this.endSession();
  };

  private handleScroll = debounce(() => {
    // Update scroll depth periodically
    if (this.currentSlideId) {
      this.debouncedSlideUpdate();
    }
  }, 1000);

  private cleanup() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    window.removeEventListener("scroll", this.handleScroll);
    
    this.sessionId = null;
    this.courseId = null;
    this.currentSlideId = null;
    this.completedSlides.clear();
  }
}

// Export singleton instance
export const progressTracker = new ProgressTracker();
