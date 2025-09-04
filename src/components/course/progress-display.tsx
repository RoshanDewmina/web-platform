"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  Calendar,
  Award
} from "lucide-react";
import { useCourseProgress } from "@/hooks/use-course-analytics";
import { formatDistanceToNow } from "date-fns";

interface ProgressDisplayProps {
  courseId: string;
  className?: string;
}

export function ProgressDisplay({ courseId, className }: ProgressDisplayProps) {
  const { progress, isLoading } = useCourseProgress(courseId);

  if (isLoading || !progress) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { analytics, currentSession, enrollment } = progress;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Course Completion</span>
            <span className="font-medium">{Math.round(analytics?.completionRate || 0)}%</span>
          </div>
          <Progress value={analytics?.completionRate || 0} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Total Time</span>
            </div>
            <p className="text-sm font-medium">
              {formatTime(analytics?.totalTimeSpent || 0)}
            </p>
          </div>

          {/* Sessions */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              <span className="text-xs">Sessions</span>
            </div>
            <p className="text-sm font-medium">
              {analytics?.totalSessions || 0}
            </p>
          </div>

          {/* Last Accessed */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Last Active</span>
            </div>
            <p className="text-sm font-medium">
              {analytics?.lastAccessedAt 
                ? formatDistanceToNow(new Date(analytics.lastAccessedAt), { addSuffix: true })
                : "Never"
              }
            </p>
          </div>

          {/* Interactions */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Award className="h-3.5 w-3.5" />
              <span className="text-xs">Activities</span>
            </div>
            <p className="text-sm font-medium">
              {analytics?.totalInteractions || 0}
            </p>
          </div>
        </div>

        {/* Current Session */}
        {currentSession && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Session</span>
              <Badge variant="secondary" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Started {formatDistanceToNow(new Date(currentSession.startedAt), { addSuffix: true })}
            </p>
          </div>
        )}

        {/* Completion Status */}
        {enrollment?.completedAt && (
          <div className="pt-3 border-t">
            <Badge className="w-full justify-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Course Completed
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
