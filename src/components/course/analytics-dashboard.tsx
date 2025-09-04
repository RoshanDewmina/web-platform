"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useCourseAnalytics } from "@/hooks/use-course-analytics";
import {
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface AnalyticsDashboardProps {
  courseId: string;
}

export function AnalyticsDashboard({ courseId }: AnalyticsDashboardProps) {
  const { analytics, isLoading } = useCourseAnalytics(courseId);

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { insights, slideStatistics, interactionStats, recentSessions } = analytics;

  // Prepare chart data
  const hourlyData = Object.entries(insights.engagementPatterns.byHour || {}).map(
    ([hour, count]) => ({
      hour: `${hour}:00`,
      sessions: count,
    })
  );

  const dayData = Object.entries(insights.engagementPatterns.byDay || {}).map(
    ([day, count]) => ({
      day,
      sessions: count,
    })
  );

  const interactionData = insights.topInteractions?.slice(0, 5).map((item: any) => ({
    name: item.eventName,
    count: item._count,
  })) || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {insights.completedSessions} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.avgSessionDuration}m</div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.analytics?.totalInteractions || 0}
            </div>
            <p className="text-xs text-muted-foreground">User actions tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.analytics?.completionRate || 0)}%
            </div>
            <Progress
              value={analytics.analytics?.completionRate || 0}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="slides">Slide Analytics</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="sessions">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Activity by Hour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity by Day */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="slides" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Most Viewed Slides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Most Viewed Slides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.mostViewedSlides?.map((slide: any, idx: number) => (
                    <div key={slide.slideId} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">
                        {slide.slideId}
                      </span>
                      <Badge variant="secondary">{slide._count} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Struggling Slides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Slides Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.strugglingSlides?.map((slide: any, idx: number) => (
                    <div key={slide.slideId} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1">
                          {slide.slideId}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          {Math.round(slide._avg.scrollDepth || 0)}% viewed
                        </Badge>
                      </div>
                      <Progress
                        value={slide._avg.scrollDepth || 0}
                        className="h-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={interactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {interactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions?.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {new Date(session.startedAt).toLocaleDateString()} at{" "}
                        {new Date(session.startedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.completedSlides} slides completed • {Math.round(session.totalDuration / 60)}m
                      </p>
                    </div>
                    <Badge variant={session.endedAt ? "default" : "secondary"}>
                      {session.endedAt ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
