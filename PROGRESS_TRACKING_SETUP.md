# Progress Tracking Setup Guide

## Overview
The comprehensive progress tracking system is now implemented and ready to use. This system tracks:
- User sessions (start/end times, duration)
- Slide views (time spent, scroll depth, completion)
- All interactions (clicks, form submissions, navigation)
- Aggregated analytics (completion rate, patterns, insights)

## Database Setup

### 1. Run Prisma Migration
```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_progress_tracking

# If using existing database, push schema changes
npx prisma db push
```

### 2. New Database Tables
- `CourseSession` - Tracks each course session
- `SlideView` - Records every slide view with metrics
- `InteractionEvent` - Logs all user interactions
- `CourseAnalytics` - Aggregated analytics per user per course

## Features Implemented

### 1. Automatic Progress Tracking
- Sessions start automatically when user opens a course
- Slide views tracked with time spent and scroll depth
- Navigation between slides is tracked
- Sessions end when user leaves or closes the course

### 2. Interaction Tracking
All user interactions are tracked including:
- Form submissions
- Button clicks
- Video plays
- Quiz answers
- Navigation actions

### 3. Real-time Progress Display
- Progress widget in course sidebar shows:
  - Completion percentage
  - Total time spent
  - Number of sessions
  - Last activity time

### 4. Detailed Analytics Dashboard
Access via: `/learn/course/[courseId]/analytics`
- Session history
- Engagement patterns (by hour/day)
- Most viewed slides
- Struggling areas identification
- Interaction statistics

## Usage in Components

### Track Custom Interactions
```typescript
import { useInteractionTracking } from "@/hooks/use-progress-tracking";

function MyComponent() {
  const { track } = useInteractionTracking();
  
  const handleClick = () => {
    track("button_click", "action_name", {
      customData: "value"
    });
  };
}
```

### Access Progress Data
```typescript
import { useCourseProgress } from "@/hooks/use-course-analytics";

function ProgressView({ courseId }) {
  const { progress, isLoading } = useCourseProgress(courseId);
  
  return (
    <div>
      Completion: {progress?.analytics?.completionRate}%
    </div>
  );
}
```

## API Endpoints

### Save Progress
```
POST /api/progress
Body: {
  type: "session_start" | "session_end" | "slide_view" | "interaction",
  data: { ... }
}
```

### Get Progress
```
GET /api/progress?courseId=xxx
Returns: {
  analytics: CourseAnalytics,
  currentSession: CourseSession,
  enrollment: Enrollment
}
```

### Get Detailed Analytics
```
GET /api/analytics/course/[courseId]
Returns: {
  analytics: CourseAnalytics,
  recentSessions: CourseSession[],
  slideStatistics: SlideView[],
  interactionStats: InteractionEvent[],
  insights: { ... }
}
```

## Data for LLM Personalization

The tracking system collects rich data that can be used for AI-powered personalization:

1. **Learning Patterns**
   - Preferred learning times (morning/evening)
   - Session duration preferences
   - Navigation patterns

2. **Content Engagement**
   - Which slides are viewed most
   - Where users spend the most time
   - Which content is skipped

3. **Struggle Indicators**
   - Low scroll depth on certain slides
   - Repeated views of same content
   - Incomplete interactive elements

4. **Success Metrics**
   - Quiz scores
   - Completion rates
   - Time to completion

## Privacy & Data Usage

- All data is stored per user and is private
- Data is used only for:
  - Showing progress to the user
  - Generating personalized recommendations
  - Improving course content
- Users can request their data or deletion at any time

## Testing

1. Open a course: `/learn/course/renewable-energy-ontario`
2. Navigate through slides
3. Check progress in sidebar
4. View detailed analytics: `/learn/course/renewable-energy-ontario/analytics`
5. Check database for tracking records

## Next Steps

1. **Add More Interactive Components**
   - Each interactive component should track specific interactions
   - Use the `useInteractionTracking` hook

2. **Implement AI Recommendations**
   - Use the collected data to generate personalized feedback
   - Create an endpoint that analyzes user patterns

3. **Add Export Functionality**
   - Allow users to export their progress data
   - Generate progress reports

4. **Implement Achievements**
   - Track milestones based on progress data
   - Award badges for completion, streaks, etc.
