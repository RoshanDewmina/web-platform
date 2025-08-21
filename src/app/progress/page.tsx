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

export default function ProgressPage() {
  const { user } = useUser();
  const [daily, setDaily] = useState<{ date: string; minutes: number }[]>([]);
  const [byDow, setByDow] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingAnalytics(true);
      try {
        const res = await fetch("/api/analytics/progress?rangeDays=120");
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setDaily(
              (data.daily || []).map((d: any) => ({
                date: d.date,
                minutes: d.minutes,
              }))
            );
            setByDow(data.byDow || []);
          }
        }
      } finally {
        setLoadingAnalytics(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Mock data - will be replaced with real data from API
  const weeklyData = [
    { day: "Mon", minutes: 45, xp: 120 },
    { day: "Tue", minutes: 60, xp: 150 },
    { day: "Wed", minutes: 30, xp: 80 },
    { day: "Thu", minutes: 90, xp: 200 },
    { day: "Fri", minutes: 75, xp: 180 },
    { day: "Sat", minutes: 120, xp: 300 },
    { day: "Sun", minutes: 60, xp: 150 },
  ];

  const skillsData = [
    { subject: "React", level: 85 },
    { subject: "TypeScript", level: 70 },
    { subject: "Node.js", level: 60 },
    { subject: "Python", level: 45 },
    { subject: "Data Science", level: 30 },
    { subject: "UI/UX", level: 55 },
  ];

  const courseProgress = [
    { name: "React", value: 75, color: "#3B82F6" },
    { name: "TypeScript", value: 40, color: "#8B5CF6" },
    { name: "Algorithms", value: 60, color: "#10B981" },
    { name: "Python", value: 25, color: "#F59E0B" },
  ];

  const achievements = [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "👟",
      category: "progress",
      earned: true,
      earnedDate: "2024-01-15",
      xpReward: 50,
    },
    {
      id: "2",
      name: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: "⚡",
      category: "progress",
      earned: true,
      earnedDate: "2024-01-18",
      xpReward: 100,
    },
    {
      id: "3",
      name: "Social Butterfly",
      description: "Add 5 friends",
      icon: "🦋",
      category: "social",
      earned: true,
      earnedDate: "2024-01-20",
      xpReward: 75,
    },
    {
      id: "4",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      category: "streak",
      earned: true,
      earnedDate: "2024-01-22",
      xpReward: 150,
    },
    {
      id: "5",
      name: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "💯",
      category: "skill",
      earned: true,
      earnedDate: "2024-01-25",
      xpReward: 200,
    },
    {
      id: "6",
      name: "Marathon Runner",
      description: "Study for 5 hours in one day",
      icon: "🏃",
      category: "time",
      earned: false,
      xpReward: 300,
    },
    {
      id: "7",
      name: "Course Master",
      description: "Complete an entire course",
      icon: "🎓",
      category: "progress",
      earned: false,
      xpReward: 500,
    },
    {
      id: "8",
      name: "Team Player",
      description: "Join 3 study groups",
      icon: "🤝",
      category: "social",
      earned: false,
      xpReward: 150,
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Alice Johnson",
      xp: 5420,
      level: 25,
      avatar: "/api/placeholder/40/40",
      trend: "up",
    },
    {
      rank: 2,
      name: "Bob Smith",
      xp: 5180,
      level: 24,
      avatar: "/api/placeholder/40/40",
      trend: "up",
    },
    {
      rank: 3,
      name: "Carol White",
      xp: 4950,
      level: 23,
      avatar: "/api/placeholder/40/40",
      trend: "down",
    },
    {
      rank: 4,
      name: "David Lee",
      xp: 4720,
      level: 22,
      avatar: "/api/placeholder/40/40",
      trend: "same",
    },
    {
      rank: 5,
      name: "Emma Wilson",
      xp: 4500,
      level: 21,
      avatar: "/api/placeholder/40/40",
      trend: "up",
    },
    {
      rank: 15,
      name: "You",
      xp: 2450,
      level: 12,
      avatar: user?.imageUrl,
      trend: "up",
      isCurrentUser: true,
    },
  ];

  const stats = {
    totalXP: 2450,
    currentLevel: 12,
    nextLevelXP: 3000,
    currentStreak: 7,
    longestStreak: 14,
    totalLessons: 48,
    totalQuizzes: 23,
    perfectQuizzes: 5,
    totalMinutes: 1380,
    averageDaily: 45,
    friendsCount: 12,
    groupsJoined: 2,
  };

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
                {stats.totalXP.toLocaleString()}
              </div>
              <Progress
                value={(stats.totalXP / stats.nextLevelXP) * 100}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.nextLevelXP - stats.totalXP} XP to level{" "}
                {stats.currentLevel + 1}
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
                {stats.currentStreak} days
              </div>
              <p className="text-xs text-muted-foreground">
                Longest: {stats.longestStreak} days
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
              <div className="text-2xl font-bold">{stats.totalLessons}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalQuizzes} quizzes passed
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
                {Math.round(stats.totalMinutes / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                ~{stats.averageDaily} min/day average
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
                  {achievements.map((achievement) => (
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
                  ))}
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
                        {Math.round(stats.totalMinutes / 60)} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Daily Time
                      </span>
                      <span className="font-medium">
                        {stats.averageDaily} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lessons Completed
                      </span>
                      <span className="font-medium">{stats.totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quizzes Passed
                      </span>
                      <span className="font-medium">{stats.totalQuizzes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Perfect Scores
                      </span>
                      <span className="font-medium">
                        {stats.perfectQuizzes}
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
                      <span className="font-medium">{stats.friendsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Study Groups
                      </span>
                      <span className="font-medium">{stats.groupsJoined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Streak
                      </span>
                      <span className="font-medium">
                        {stats.currentStreak} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Longest Streak
                      </span>
                      <span className="font-medium">
                        {stats.longestStreak} days
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
