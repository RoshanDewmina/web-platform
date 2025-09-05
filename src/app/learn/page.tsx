"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  UserPlus,
  MessageSquare,
  Calendar,
  MapPin,
  Video,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(
  () => import("@/components/ai/chat-widget").then((m) => m.ChatWidget),
  { ssr: false, loading: () => null }
);
import { RecommendationsGrid } from "./_components/recommendations-grid";
import { Roadmap } from "./_components/roadmap";
import { StudyGroups } from "./_components/study-groups";

export default function LearnPage() {
  // Client page: avoid pre-rendering personalized content
  // Mark as dynamic to leverage client-side data fetching
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        
        // Transform API data to match component expectations
        const transformedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail || "/api/placeholder/300/200",
          category: course.category,
          difficulty: course.difficulty,
          duration: `${course.estimatedHours} hours`,
          students: course._count?.enrollments || 0,
          rating: 0, // TODO: Add rating system
          progress: 0, // Will be calculated from user's progress
          enrolled: course.enrollments?.length > 0,
          instructor: "Instructor", // TODO: Add instructor field
          modules: course.modules?.length || 0,
          completedModules: 0, // Will be calculated from progress
        }));
        
        setCoursesData(transformedCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle course enrollment
  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to enroll');
      
      // Update local state
      setCoursesData((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? { ...course, enrolled: true, progress: 0 }
            : course
        )
      );
      
      // Navigate to course
      router.push(`/learn/course/${courseId}`);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      alert('Failed to enroll in course');
    }
  };

  const courses = coursesData;

  // Extract unique categories from courses
  const categories = [
    "All Categories",
    ...Array.from(new Set(courses.map(course => course.category))).filter(Boolean)
  ];

  // Learning paths can be fetched from API in the future
  const learningPaths: any[] = [];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Learn</h1>
          <p className="text-muted-foreground mt-2">
            Explore courses and continue your learning journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Energy & Sustainability">
                Energy & Sustainability
              </SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="AI & ML">AI & ML</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          </TabsList>

          {/* All Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
                    {course.enrolled && course.progress > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500">In Progress</Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 text-primary/50" />
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.difficulty}</Badge>
                    </div>
                    <CardTitle className="line-clamp-1">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.enrolled && course.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {course.rating}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          By {course.instructor}
                        </span>
                        <span className="font-medium">
                          {course.modules} modules
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {course.enrolled ? (
                      <Link
                        href={`/learn/course/${course.id}`}
                        className="w-full"
                      >
                        <Button className="w-full">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/learn/course/${course.id}`} className="w-full">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll Now
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="enrolled" className="space-y-4">
            <Roadmap
              title="Your Course Roadmap"
              totalModules={12}
              completedModules={6}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((course) => course.enrolled)
                .map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        {course.completedModules}/{course.modules} Modules
                      </Badge>
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-12 w-12 text-primary/50" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span className="font-medium">
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Next: Module {course.completedModules + 1}
                          </span>
                          <Badge variant="outline">
                            {Math.round(
                              (course.modules - course.completedModules) * 0.5
                            )}{" "}
                            hrs left
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/learn/course/${course.id}`}
                        className="w-full"
                      >
                        <Button className="w-full">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningPaths.map((path) => (
                <Card
                  key={path.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`h-2 ${path.color}`} />
                  <CardHeader>
                    <CardTitle>{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Courses</span>
                        <span className="font-medium">{path.courses}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{path.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium">{path.level}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Path
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommended Tab */}
          <TabsContent value="recommended" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Based on your learning history and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationsGrid />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="study-groups" className="space-y-4">
            <StudyGroups />
          </TabsContent>
        </Tabs>
      </div>
      {/* AI Assistant floating widget */}
      <ChatWidget />
    </DashboardLayout>
  );
}
