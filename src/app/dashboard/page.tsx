"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Trophy,
  Flame,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  ChevronRight,
  Star,
  Target,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XPTracker } from "@/components/ui/xp-tracker";

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[120px]" />
        <Skeleton className="h-3 w-[80px] mt-2" />
      </CardContent>
    </Card>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 flex-1" />
          <Skeleton className="h-4 w-[40px]" />
        </div>
      </div>
      <Skeleton className="h-9 w-[90px]" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalXP: 0,
    level: 1,
    currentLevel: 1,
    nextLevelXP: 100,
    coursesInProgress: 0,
    completedLessons: 0,
    studyMinutesToday: 0,
  });
  const [recentXP, setRecentXP] = useState<any[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user stats
      const [coursesResponse, progressResponse, userStatsResponse] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/progress"),
        fetch("/api/users/stats"),
      ]);

      if (coursesResponse.ok && progressResponse.ok) {
        const courses = await coursesResponse.json();
        const progress = await progressResponse.json();

        // Calculate stats from real data
        const enrolledCourses = courses.filter(
          (c: any) => c.enrollments?.length > 0
        );
        const completedLessons = progress.filter(
          (p: any) => p.isCompleted
        ).length;

        let userStats = null;
        if (userStatsResponse.ok) {
          userStats = await userStatsResponse.json();
        }

        setStats({
          currentStreak: userStats?.currentStreak || 0,
          totalXP: userStats?.totalXP || 0,
          level: userStats?.currentLevel || 1,
          currentLevel: userStats?.currentLevel || 1,
          nextLevelXP: userStats?.nextLevelXP || 100,
          coursesInProgress: enrolledCourses.length,
          completedLessons: userStats?.totalLessons || completedLessons,
          studyMinutesToday: userStats?.averageDaily || 0,
        });

        // Set recent XP gains (mock data for now - you can implement actual tracking)
        setRecentXP([
          { amount: 10, reason: "Completed Lesson", timestamp: new Date() },
          { amount: 25, reason: "Passed Quiz", timestamp: new Date(Date.now() - 3600000) },
          { amount: 50, reason: "Achievement Unlocked", timestamp: new Date(Date.now() - 7200000) },
        ]);

        // Get recent courses with progress
        const recentCoursesData = enrolledCourses
          .slice(0, 3)
          .map((course: any) => {
            const courseProgress = progress.filter((p: any) =>
              course.modules?.some((m: any) =>
                m.lessons?.some((l: any) => l.id === p.lessonId)
              )
            );

            const totalLessons =
              course.modules?.reduce(
                (acc: number, m: any) => acc + (m.lessons?.length || 0),
                0
              ) || 0;

            const completedLessons = courseProgress.filter(
              (p: any) => p.isCompleted
            ).length;

            return {
              id: course.id,
              title: course.title,
              progress:
                totalLessons > 0
                  ? Math.round((completedLessons / totalLessons) * 100)
                  : 0,
              nextLesson: "Continue learning",
              thumbnail: course.thumbnail || "/api/placeholder/100/100",
            };
          });

        setRecentCourses(recentCoursesData);
      }

      // TODO: Fetch real activities and leaderboard data
      setUpcomingActivities([]);
      setLeaderboard([]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="animate-in fade-in-50 duration-500">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Welcome back, {user?.firstName || "Learner"}!
              <span className="text-4xl animate-in spin-in-90 duration-700">
                👋
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              You're doing great! Keep up the momentum.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Current Streak
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You're on fire! 🔥</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.currentStreak} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep it going!
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total XP
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Level {stats.level} Champion!</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalXP.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Level {stats.level}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Study Time Today
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Clock className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You're doing amazing!</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.studyMinutesToday} min
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Great progress!
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed Lessons
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Target className="h-4 w-4 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Target: 30 lessons</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.completedLessons}
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* XP Tracker Widget */}
          <div className="grid gap-6 lg:grid-cols-7 mb-6">
            <div className="lg:col-span-3">
              {!loading && (
                <XPTracker
                  currentXP={stats.totalXP % 100}
                  currentLevel={stats.currentLevel}
                  nextLevelXP={stats.nextLevelXP}
                  totalXP={stats.totalXP}
                  recentXP={recentXP}
                  showDetails={true}
                />
              )}
            </div>
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievement Progress</CardTitle>
                  <CardDescription>
                    Your journey to unlock new achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Level Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((stats.totalXP % 100) / 100 * 100)}%
                        </span>
                      </div>
                      <Progress value={(stats.totalXP % 100) / 100 * 100} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Next Achievement</p>
                        <p className="font-medium">Week Warrior (3 days to go)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Upcoming Reward</p>
                        <p className="font-medium">+150 XP</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-7">
            {/* Recent Courses */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Continue Learning
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </>
                ) : (
                  <>
                    {recentCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                      >
                        <Avatar className="h-16 w-16 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                          <AvatarImage src={course.thumbnail} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                            {course.title[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Next: {course.nextLesson}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={course.progress}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <Link href={`/learn/course/${course.id}`}>
                          <Button
                            size="sm"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            Continue
                          </Button>
                        </Link>
                      </div>
                    ))}
                    <Link href="/learn">
                      <Button variant="outline" className="w-full group">
                        Browse All Courses
                        <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Activities */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Upcoming activities and events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.type === "study-group" && (
                          <Users className="h-5 w-5 text-primary" />
                        )}
                        {activity.type === "quiz" && (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                        {activity.type === "live-session" && (
                          <Calendar className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.type === "study-group" &&
                            `${activity.participants} participants`}
                          {activity.type === "quiz" &&
                            `Difficulty: ${activity.difficulty}`}
                          {activity.type === "live-session" &&
                            `With ${activity.instructor}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.time}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View Full Calendar
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard and Achievements */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Leaderboard</CardTitle>
                <CardDescription>Compete with fellow learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        user.isCurrentUser ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {user.isCurrentUser ? "You" : user.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">
                          {user.xp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/progress">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Leaderboard
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "First Steps", icon: "👟", earned: true },
                    { name: "Quick Learner", icon: "⚡", earned: true },
                    { name: "Social Butterfly", icon: "🦋", earned: true },
                    { name: "Marathon Runner", icon: "🏃", earned: false },
                    { name: "Perfect Score", icon: "💯", earned: false },
                    { name: "Team Player", icon: "🤝", earned: false },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                        achievement.earned
                          ? "border-primary bg-primary/5"
                          : "border-muted opacity-50"
                      }`}
                    >
                      <span className="text-2xl mb-1">{achievement.icon}</span>
                      <span className="text-xs text-center font-medium">
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/progress#achievements">
                  <Button variant="outline" className="w-full mt-4">
                    View All Achievements
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
