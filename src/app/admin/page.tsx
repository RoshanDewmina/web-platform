'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Copy,
  Archive,
  Trash,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  BarChart,
  FileText,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real data from API
  const stats = {
    totalCourses: 24,
    publishedCourses: 18,
    draftCourses: 6,
    totalStudents: 1234,
    activeStudents: 892,
    totalRevenue: 45678,
    completionRate: 78,
    averageRating: 4.6,
  };

  const courses = [
    {
      id: '1',
      title: 'Introduction to React',
      status: 'published',
      students: 234,
      modules: 8,
      lessons: 32,
      lastUpdated: '2 days ago',
      rating: 4.8,
      revenue: 5670,
      completionRate: 82,
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      status: 'published',
      students: 189,
      modules: 10,
      lessons: 45,
      lastUpdated: '1 week ago',
      rating: 4.9,
      revenue: 4890,
      completionRate: 75,
    },
    {
      id: '3',
      title: 'Data Structures & Algorithms',
      status: 'draft',
      students: 0,
      modules: 15,
      lessons: 60,
      lastUpdated: '3 hours ago',
      rating: 0,
      revenue: 0,
      completionRate: 0,
    },
    {
      id: '4',
      title: 'Python for Data Science',
      status: 'published',
      students: 456,
      modules: 12,
      lessons: 48,
      lastUpdated: '2 weeks ago',
      rating: 4.7,
      revenue: 8900,
      completionRate: 68,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Course published',
      course: 'Introduction to React',
      user: 'Admin',
      time: '2 hours ago',
    },
    {
      id: '2',
      action: 'New enrollment',
      course: 'Python for Data Science',
      user: 'John Doe',
      time: '4 hours ago',
    },
    {
      id: '3',
      action: 'Course updated',
      course: 'Advanced TypeScript',
      user: 'Admin',
      time: '1 day ago',
    },
    {
      id: '4',
      action: 'Quiz added',
      course: 'Data Structures & Algorithms',
      user: 'Admin',
      time: '2 days ago',
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
            <p className='text-muted-foreground mt-2'>
              Manage courses, content, and monitor platform performance
            </p>
          </div>
          <Link href='/admin/courses/new'>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Courses</CardTitle>
              <BookOpen className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalCourses}</div>
              <p className='text-xs text-muted-foreground'>
                {stats.publishedCourses} published, {stats.draftCourses} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Students</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalStudents.toLocaleString()}</div>
              <p className='text-xs text-muted-foreground'>
                {stats.activeStudents} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completion Rate</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.completionRate}%</div>
              <p className='text-xs text-muted-foreground'>
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
              <BarChart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.averageRating}</div>
              <p className='text-xs text-muted-foreground'>
                Based on 1,234 reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Management */}
        <Tabs defaultValue='all' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <TabsList>
              <TabsTrigger value='all'>All Courses</TabsTrigger>
              <TabsTrigger value='published'>Published</TabsTrigger>
              <TabsTrigger value='draft'>Drafts</TabsTrigger>
              <TabsTrigger value='archived'>Archived</TabsTrigger>
            </TabsList>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search courses...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-8 w-[250px]'
                />
              </div>
              <Button variant='outline'>
                <Settings className='h-4 w-4 mr-2' />
                Settings
              </Button>
            </div>
          </div>

          <TabsContent value='all' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Course Library</CardTitle>
                <CardDescription>Manage and monitor all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className='flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors'
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-3'>
                          <h3 className='font-semibold'>{course.title}</h3>
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                          <span>{course.modules} modules</span>
                          <span>{course.lessons} lessons</span>
                          <span>{course.students} students</span>
                          {course.rating > 0 && <span>⭐ {course.rating}</span>}
                          <span>Updated {course.lastUpdated}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Link href={`/admin/courses/${course.id}/builder`}>
                          <Button variant='outline' size='sm'>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {course.status === 'published' ? (
                                <>
                                  <EyeOff className='h-4 w-4 mr-2' />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className='h-4 w-4 mr-2' />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className='h-4 w-4 mr-2' />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className='h-4 w-4 mr-2' />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-600'>
                              <Trash className='h-4 w-4 mr-2' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='published'>
            <Card>
              <CardContent className='pt-6'>
                <p className='text-center text-muted-foreground'>
                  {stats.publishedCourses} published courses
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='draft'>
            <Card>
              <CardContent className='pt-6'>
                <p className='text-center text-muted-foreground'>
                  {stats.draftCourses} draft courses
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='archived'>
            <Card>
              <CardContent className='pt-6'>
                <p className='text-center text-muted-foreground'>
                  No archived courses
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <div className='grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>{activity.action}</p>
                      <p className='text-xs text-muted-foreground'>
                        {activity.course} • {activity.user}
                      </p>
                    </div>
                    <span className='text-xs text-muted-foreground'>{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-2'>
                <Link href='/admin/courses/new'>
                  <Button variant='outline' className='w-full justify-start'>
                    <Plus className='h-4 w-4 mr-2' />
                    New Course
                  </Button>
                </Link>
                <Button variant='outline' className='justify-start'>
                  <FileText className='h-4 w-4 mr-2' />
                  Content Library
                </Button>
                <Button variant='outline' className='justify-start'>
                  <Users className='h-4 w-4 mr-2' />
                  Manage Users
                </Button>
                <Button variant='outline' className='justify-start'>
                  <BarChart className='h-4 w-4 mr-2' />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
