'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();

  // Mock data - will be replaced with real data from API
  const stats = {
    currentStreak: 7,
    totalXP: 2450,
    level: 12,
    coursesInProgress: 3,
    completedLessons: 24,
    studyMinutesToday: 45,
  };

  const recentCourses = [
    {
      id: '1',
      title: 'Introduction to React',
      progress: 75,
      nextLesson: 'State Management with Hooks',
      thumbnail: '/api/placeholder/100/100',
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      progress: 40,
      nextLesson: 'Generic Types',
      thumbnail: '/api/placeholder/100/100',
    },
    {
      id: '3',
      title: 'Data Structures & Algorithms',
      progress: 60,
      nextLesson: 'Binary Search Trees',
      thumbnail: '/api/placeholder/100/100',
    },
  ];

  const upcomingActivities = [
    {
      id: '1',
      type: 'study-group',
      title: 'JavaScript Study Group',
      time: '2:00 PM',
      participants: 8,
    },
    {
      id: '2',
      type: 'quiz',
      title: 'React Fundamentals Quiz',
      time: '4:00 PM',
      difficulty: 'Medium',
    },
    {
      id: '3',
      type: 'live-session',
      title: 'Live Coding Session',
      time: '6:00 PM',
      instructor: 'Prof. Smith',
    },
  ];

  const leaderboard = [
    { id: '1', name: 'Alice Johnson', xp: 5420, avatar: '/api/placeholder/40/40' },
    { id: '2', name: 'Bob Smith', xp: 5180, avatar: '/api/placeholder/40/40' },
    { id: '3', name: 'You', xp: 2450, avatar: user?.imageUrl, isCurrentUser: true },
    { id: '4', name: 'David Lee', xp: 2320, avatar: '/api/placeholder/40/40' },
    { id: '5', name: 'Emma Wilson', xp: 2100, avatar: '/api/placeholder/40/40' },
  ];

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Welcome Section */}
        <div>
          <h1 className='text-3xl font-bold'>
            Welcome back, {user?.firstName || 'Learner'}! 👋
          </h1>
          <p className='text-muted-foreground mt-2'>
            You're doing great! Keep up the momentum.
          </p>
        </div>

        {/* Stats Overview */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Current Streak</CardTitle>
              <Flame className='h-4 w-4 text-orange-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.currentStreak} days</div>
              <p className='text-xs text-muted-foreground'>Keep it going!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total XP</CardTitle>
              <Trophy className='h-4 w-4 text-yellow-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalXP.toLocaleString()}</div>
              <p className='text-xs text-muted-foreground'>Level {stats.level}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Study Time Today</CardTitle>
              <Clock className='h-4 w-4 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.studyMinutesToday} min</div>
              <p className='text-xs text-muted-foreground'>Great progress!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completed Lessons</CardTitle>
              <Target className='h-4 w-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.completedLessons}</div>
              <p className='text-xs text-muted-foreground'>This month</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 lg:grid-cols-7'>
          {/* Recent Courses */}
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {recentCourses.map((course) => (
                <div key={course.id} className='flex items-center space-x-4'>
                  <Avatar className='h-16 w-16 rounded-lg'>
                    <AvatarImage src={course.thumbnail} />
                    <AvatarFallback>{course.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <div>
                      <h3 className='font-semibold'>{course.title}</h3>
                      <p className='text-sm text-muted-foreground'>
                        Next: {course.nextLesson}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Progress value={course.progress} className='flex-1' />
                      <span className='text-sm font-medium'>{course.progress}%</span>
                    </div>
                  </div>
                  <Link href={`/learn/course/${course.id}`}>
                    <Button size='sm'>Continue</Button>
                  </Link>
                </div>
              ))}
              <Link href='/learn'>
                <Button variant='outline' className='w-full'>
                  Browse All Courses
                  <ChevronRight className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Activities */}
          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Upcoming activities and events</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      {activity.type === 'study-group' && <Users className='h-5 w-5 text-primary' />}
                      {activity.type === 'quiz' && <BookOpen className='h-5 w-5 text-primary' />}
                      {activity.type === 'live-session' && <Calendar className='h-5 w-5 text-primary' />}
                    </div>
                    <div>
                      <p className='font-medium text-sm'>{activity.title}</p>
                      <p className='text-xs text-muted-foreground'>
                        {activity.type === 'study-group' && `${activity.participants} participants`}
                        {activity.type === 'quiz' && `Difficulty: ${activity.difficulty}`}
                        {activity.type === 'live-session' && `With ${activity.instructor}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant='outline'>{activity.time}</Badge>
                </div>
              ))}
              <Button variant='outline' className='w-full'>
                View Full Calendar
                <ChevronRight className='h-4 w-4 ml-2' />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard and Achievements */}
        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Leaderboard</CardTitle>
              <CardDescription>Compete with fellow learners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {leaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      user.isCurrentUser ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-lg font-bold text-muted-foreground'>
                        #{index + 1}
                      </span>
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className='font-medium'>
                        {user.isCurrentUser ? 'You' : user.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Trophy className='h-4 w-4 text-yellow-500' />
                      <span className='font-bold'>{user.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href='/progress'>
                <Button variant='outline' className='w-full mt-4'>
                  View Full Leaderboard
                  <ChevronRight className='h-4 w-4 ml-2' />
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
              <div className='grid grid-cols-3 gap-4'>
                {[
                  { name: 'First Steps', icon: '👟', earned: true },
                  { name: 'Quick Learner', icon: '⚡', earned: true },
                  { name: 'Social Butterfly', icon: '🦋', earned: true },
                  { name: 'Marathon Runner', icon: '🏃', earned: false },
                  { name: 'Perfect Score', icon: '💯', earned: false },
                  { name: 'Team Player', icon: '🤝', earned: false },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                      achievement.earned
                        ? 'border-primary bg-primary/5'
                        : 'border-muted opacity-50'
                    }`}
                  >
                    <span className='text-2xl mb-1'>{achievement.icon}</span>
                    <span className='text-xs text-center font-medium'>
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
              <Link href='/progress#achievements'>
                <Button variant='outline' className='w-full mt-4'>
                  View All Achievements
                  <ChevronRight className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
