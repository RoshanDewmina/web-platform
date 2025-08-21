'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Clock,
  BookOpen,
  Users,
  Star,
  Filter,
  TrendingUp,
  Award,
  PlayCircle,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock data - will be replaced with real data from API
  const courses = [
    {
      id: '1',
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React including components, state, and props.',
      thumbnail: '/api/placeholder/300/200',
      category: 'Web Development',
      difficulty: 'Beginner',
      duration: '4 hours',
      students: 1234,
      rating: 4.8,
      progress: 75,
      enrolled: true,
      instructor: 'John Doe',
      modules: 8,
      completedModules: 6,
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      description: 'Master TypeScript with advanced patterns and best practices.',
      thumbnail: '/api/placeholder/300/200',
      category: 'Programming',
      difficulty: 'Advanced',
      duration: '6 hours',
      students: 892,
      rating: 4.9,
      progress: 40,
      enrolled: true,
      instructor: 'Jane Smith',
      modules: 10,
      completedModules: 4,
    },
    {
      id: '3',
      title: 'Data Structures & Algorithms',
      description: 'Essential computer science concepts for technical interviews.',
      thumbnail: '/api/placeholder/300/200',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      duration: '12 hours',
      students: 3456,
      rating: 4.7,
      progress: 60,
      enrolled: true,
      instructor: 'Prof. Johnson',
      modules: 15,
      completedModules: 9,
    },
    {
      id: '4',
      title: 'Python for Data Science',
      description: 'Learn Python programming with a focus on data analysis and visualization.',
      thumbnail: '/api/placeholder/300/200',
      category: 'Data Science',
      difficulty: 'Beginner',
      duration: '8 hours',
      students: 5678,
      rating: 4.6,
      progress: 0,
      enrolled: false,
      instructor: 'Dr. Williams',
      modules: 12,
      completedModules: 0,
    },
    {
      id: '5',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML concepts, algorithms, and practical applications.',
      thumbnail: '/api/placeholder/300/200',
      category: 'AI & ML',
      difficulty: 'Intermediate',
      duration: '10 hours',
      students: 2345,
      rating: 4.8,
      progress: 0,
      enrolled: false,
      instructor: 'Dr. Chen',
      modules: 14,
      completedModules: 0,
    },
    {
      id: '6',
      title: 'UI/UX Design Principles',
      description: 'Master the art of creating beautiful and functional user interfaces.',
      thumbnail: '/api/placeholder/300/200',
      category: 'Design',
      difficulty: 'Beginner',
      duration: '5 hours',
      students: 1890,
      rating: 4.5,
      progress: 0,
      enrolled: false,
      instructor: 'Sarah Miller',
      modules: 7,
      completedModules: 0,
    },
  ];

  const categories = [
    'All Categories',
    'Web Development',
    'Programming',
    'Computer Science',
    'Data Science',
    'AI & ML',
    'Design',
  ];

  const learningPaths = [
    {
      id: '1',
      title: 'Full Stack Web Developer',
      description: 'Become a full-stack developer with React, Node.js, and databases.',
      courses: 8,
      duration: '6 months',
      level: 'Beginner to Advanced',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      title: 'Data Scientist',
      description: 'Master data analysis, machine learning, and visualization.',
      courses: 10,
      duration: '8 months',
      level: 'Intermediate',
      color: 'bg-green-500',
    },
    {
      id: '3',
      title: 'Mobile App Developer',
      description: 'Build native and cross-platform mobile applications.',
      courses: 6,
      duration: '4 months',
      level: 'Intermediate',
      color: 'bg-purple-500',
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold'>Learn</h1>
          <p className='text-muted-foreground mt-2'>
            Explore courses and continue your learning journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search courses...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              <SelectItem value='Web Development'>Web Development</SelectItem>
              <SelectItem value='Programming'>Programming</SelectItem>
              <SelectItem value='Computer Science'>Computer Science</SelectItem>
              <SelectItem value='Data Science'>Data Science</SelectItem>
              <SelectItem value='AI & ML'>AI & ML</SelectItem>
              <SelectItem value='Design'>Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Difficulty' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Levels</SelectItem>
              <SelectItem value='Beginner'>Beginner</SelectItem>
              <SelectItem value='Intermediate'>Intermediate</SelectItem>
              <SelectItem value='Advanced'>Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue='courses' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='courses'>All Courses</TabsTrigger>
            <TabsTrigger value='enrolled'>My Courses</TabsTrigger>
            <TabsTrigger value='paths'>Learning Paths</TabsTrigger>
            <TabsTrigger value='recommended'>Recommended</TabsTrigger>
          </TabsList>

          {/* All Courses Tab */}
          <TabsContent value='courses' className='space-y-4'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredCourses.map((course) => (
                <Card key={course.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
                  <div className='aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative'>
                    {course.enrolled && course.progress > 0 && (
                      <div className='absolute top-2 right-2'>
                        <Badge className='bg-green-500'>In Progress</Badge>
                      </div>
                    )}
                    <div className='flex items-center justify-center h-full'>
                      <BookOpen className='h-12 w-12 text-primary/50' />
                    </div>
                  </div>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <Badge variant='secondary'>{course.category}</Badge>
                      <Badge variant='outline'>{course.difficulty}</Badge>
                    </div>
                    <CardTitle className='line-clamp-1'>{course.title}</CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {course.enrolled && course.progress > 0 && (
                        <div className='space-y-1'>
                          <div className='flex justify-between text-sm'>
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                      )}
                      <div className='flex items-center justify-between text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {course.duration}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='h-3 w-3' />
                          {course.students.toLocaleString()}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Star className='h-3 w-3 fill-yellow-500 text-yellow-500' />
                          {course.rating}
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>By {course.instructor}</span>
                        <span className='font-medium'>
                          {course.modules} modules
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {course.enrolled ? (
                      <Link href={`/learn/course/${course.id}`} className='w-full'>
                        <Button className='w-full'>
                          <PlayCircle className='h-4 w-4 mr-2' />
                          Continue Learning
                        </Button>
                      </Link>
                    ) : (
                      <Button className='w-full' variant='outline'>
                        Enroll Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value='enrolled' className='space-y-4'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {courses
                .filter((course) => course.enrolled)
                .map((course) => (
                  <Card key={course.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
                    <div className='aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative'>
                      <Badge className='absolute top-2 right-2 bg-green-500'>
                        {course.completedModules}/{course.modules} Modules
                      </Badge>
                      <div className='flex items-center justify-center h-full'>
                        <BookOpen className='h-12 w-12 text-primary/50' />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className='line-clamp-1'>{course.title}</CardTitle>
                      <CardDescription className='line-clamp-2'>
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        <div className='space-y-1'>
                          <div className='flex justify-between text-sm'>
                            <span>Overall Progress</span>
                            <span className='font-medium'>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Next: Module {course.completedModules + 1}
                          </span>
                          <Badge variant='outline'>
                            {Math.round((course.modules - course.completedModules) * 0.5)} hrs left
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/learn/course/${course.id}`} className='w-full'>
                        <Button className='w-full'>
                          <PlayCircle className='h-4 w-4 mr-2' />
                          Continue
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value='paths' className='space-y-4'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {learningPaths.map((path) => (
                <Card key={path.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
                  <div className={`h-2 ${path.color}`} />
                  <CardHeader>
                    <CardTitle>{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Courses</span>
                        <span className='font-medium'>{path.courses}</span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Duration</span>
                        <span className='font-medium'>{path.duration}</span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Level</span>
                        <span className='font-medium'>{path.level}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full' variant='outline'>
                      <TrendingUp className='h-4 w-4 mr-2' />
                      View Path
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommended Tab */}
          <TabsContent value='recommended' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Based on your learning history and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {courses.slice(3, 6).map((course) => (
                    <Card key={course.id} className='overflow-hidden'>
                      <div className='aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative'>
                        <Badge className='absolute top-2 right-2' variant='secondary'>
                          <Award className='h-3 w-3 mr-1' />
                          Recommended
                        </Badge>
                        <div className='flex items-center justify-center h-full'>
                          <BookOpen className='h-12 w-12 text-primary/50' />
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className='text-base'>{course.title}</CardTitle>
                      </CardHeader>
                      <CardFooter>
                        <Button className='w-full' variant='outline' size='sm'>
                          Learn More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
