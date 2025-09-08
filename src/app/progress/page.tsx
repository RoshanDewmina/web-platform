"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Flame,
  Target,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Zap,
  Medal,
  Crown,
  Shield,
  Heart,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useUser } from "@clerk/nextjs";
import { LeaderboardCard } from "./_components/leaderboard";
import { Heatmap } from "./_components/heatmap";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const { user } = useUser();
  const [daily, setDaily] = useState<{ date: string; minutes: number }[]>([]);
  const [byDow, setByDow] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [progressData, setProgressData] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const loadAllData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load analytics data
        const analyticsRes = await fetch("/api/analytics/progress?rangeDays=120");
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          if (mounted) {
            setDaily(
              (analyticsData.daily || []).map((d: any) => ({
                date: d.date,
                minutes: d.minutes,
              }))
            );
            setByDow(analyticsData.byDow || []);
          }
        }

        // Load progress data
        const progressRes = await fetch("/api/progress");
        if (progressRes.ok) {
          const progress = await progressRes.json();
          if (mounted) {
            setProgressData(progress);
          }
        }

        // Load enrolled courses with progress
        const coursesRes = await fetch("/api/courses?enrolled=true");
        if (coursesRes.ok) {
          const courses = await coursesRes.json();
          if (mounted) {
            setEnrolledCourses(courses);
          }
        }

        // Load achievements
        const achievementsRes = await fetch("/api/achievements");
        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json();
          if (mounted) {
            setAchievements(achievementsData);
          }
        }

        // Load user stats
        const statsRes = await fetch("/api/users/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (mounted) {
            setStats(statsData);
          }
        }
      } catch (err) {
        console.error("Error loading progress data:", err);
        if (mounted) {
          setError("Failed to load progress data. Please try again later.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingAnalytics(false);
        }
      }
    };

    loadAllData();
    
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Process data for charts
  const weeklyData = byDow.map((d) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.dow],
    minutes: d.minutes,
    xp: Math.round(d.minutes * 2.5), // Approximate XP based on time
  }));

  // Calculate course progress from enrolled courses
  const courseProgress = enrolledCourses.map((course) => ({
    name: course.title,
    value: course.enrollment?.progress || 0,
    color: [
      "#3B82F6",
      "#8B5CF6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#6366F1",
    ][enrolledCourses.indexOf(course) % 6],
  }));

  // Calculate skills from course categories
  const skillsData = enrolledCourses.reduce((acc: any[], course) => {
    const existing = acc.find((s) => s.subject === course.category);
    if (existing) {
      existing.level = Math.min(
        100,
        existing.level + (course.enrollment?.progress || 0) / 2
      );
    } else {
      acc.push({
        subject: course.category,
        level: (course.enrollment?.progress || 0) / 2,
      });
    }
    return acc;
  }, []);

  // Use actual stats or defaults
  const displayStats = stats || {
    totalXP: 0,
    currentLevel: 1,
    nextLevelXP: 100,
    currentStreak: 0,
    longestStreak: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    perfectQuizzes: 0,
    totalMinutes: 0,
    averageDaily: 0,
    friendsCount: 0,
    groupsJoined: 0,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Progress & Achievements</h1>
            <p className="text-muted-foreground mt-2">
              Track your learning journey and celebrate milestones
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Progress & Achievements</h1>
          <p className="text-muted-foreground mt-2">
            Track your learning journey and celebrate milestones
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.totalXP.toLocaleString()}
              </div>
              <Progress
                value={(displayStats.totalXP / displayStats.nextLevelXP) * 100}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {displayStats.nextLevelXP - displayStats.totalXP} XP to level{" "}
                {displayStats.currentLevel + 1}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.currentStreak} days
              </div>
              <p className="text-xs text-muted-foreground">
                Longest: {displayStats.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lessons Completed
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.totalLessons}</div>
              <p className="text-xs text-muted-foreground">
                {displayStats.totalQuizzes} quizzes passed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(displayStats.totalMinutes / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                ~{displayStats.averageDaily} min/day average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>
                    Your learning activity this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="minutes"
                        fill="hsl(var(--primary))"
                        name="Minutes"
                      />
                      <Bar
                        dataKey="xp"
                        fill="hsl(var(--chart-2))"
                        name="XP Earned"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skills Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Overview</CardTitle>
                  <CardDescription>
                    Your proficiency across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={skillsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Skill Level"
                        dataKey="level"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap */}
            <Heatmap title="Last 13 Weeks" daily={daily} />

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>
                  Your progress in enrolled courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseProgress.map((course) => (
                    <div key={course.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{course.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {course.value}%
                        </span>
                      </div>
                      <Progress value={course.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  {achievements.filter((a) => a.earned).length} of{" "}
                  {achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievements.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">
                        No achievements yet. Keep learning to earn your first achievement!
                      </p>
                    </div>
                  ) : (
                    achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`relative p-4 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                          achievement.earned
                            ? "border-primary bg-primary/5"
                            : "border-muted opacity-50 grayscale"
                        }`}
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h3 className="font-semibold text-sm">
                          {achievement.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <Badge
                          className="mt-2"
                          variant={achievement.earned ? "default" : "secondary"}
                        >
                          {achievement.xpReward} XP
                        </Badge>
                        {achievement.earned && achievement.earnedDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(
                              achievement.earnedDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <LeaderboardCard />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Study Time
                      </span>
                      <span className="font-medium">
                        {Math.round(displayStats.totalMinutes / 60)} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Daily Time
                      </span>
                      <span className="font-medium">
                        {displayStats.averageDaily} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lessons Completed
                      </span>
                      <span className="font-medium">{displayStats.totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quizzes Passed
                      </span>
                      <span className="font-medium">{displayStats.totalQuizzes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Perfect Scores
                      </span>
                      <span className="font-medium">
                        {displayStats.perfectQuizzes}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Friends
                      </span>
                      <span className="font-medium">{displayStats.friendsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Study Groups
                      </span>
                      <span className="font-medium">{displayStats.groupsJoined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Streak
                      </span>
                      <span className="font-medium">
                        {displayStats.currentStreak} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Longest Streak
                      </span>
                      <span className="font-medium">
                        {displayStats.longestStreak} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Achievements
                      </span>
                      <span className="font-medium">
                        {achievements.filter((a) => a.earned).length}/
                        {achievements.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
