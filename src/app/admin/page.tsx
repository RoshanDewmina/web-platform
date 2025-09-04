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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  BarChart,
  FileText,
  Settings,
  Shield,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AdminUserManager } from "@/components/admin/admin-user-manager";
import { useRouter } from "next/navigation";

type ApiCourse = {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  modules: { id: string; lessons: { id: string }[] }[];
  _count?: { enrollments?: number };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "BEGINNER",
    estimatedHours: 1,
    price: 0,
    visibility: "PUBLIC",
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses?admin=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load courses");
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async () => {
    if (!courseData.title.trim()) {
      toast.error("Course title is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create course");
      }

      const course = await response.json();
      toast.success("Course created successfully!");

      // Reset form
      setCourseData({
        title: "",
        description: "",
        category: "",
        difficulty: "BEGINNER",
        estimatedHours: 1,
        price: 0,
        visibility: "PUBLIC",
      });

      setShowCreateDialog(false);

      // Reload courses
      await loadCourses();

      // Redirect to the course builder
      router.push(`/admin/courses/${course.id}/builder`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.isPublished).length;
    const draftCourses = totalCourses - publishedCourses;
    const totalStudents = courses.reduce(
      (sum, c) => sum + (c._count?.enrollments || 0),
      0
    );
    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalStudents,
      activeStudents: 0,
      totalRevenue: 0,
      completionRate: 0,
      averageRating: 0,
    };
  }, [courses]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock recent activity data
  const recentActivity = [
    {
      id: "1",
      action: "Course published",
      course: "Introduction to React",
      user: "John Doe",
      time: "2 hours ago",
    },
    {
      id: "2",
      action: "New enrollment",
      course: "Advanced TypeScript",
      user: "Jane Smith",
      time: "4 hours ago",
    },
    {
      id: "3",
      action: "Course updated",
      course: "Web Development Basics",
      user: "Mike Johnson",
      time: "6 hours ago",
    },
    {
      id: "4",
      action: "User registered",
      course: "N/A",
      user: "Sarah Wilson",
      time: "1 day ago",
    },
  ];

  const doAction = async (
    action: "publish" | "unpublish" | "archive" | "duplicate",
    courseId: string
  ) => {
    try {
      const res = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, courseIds: [courseId] }),
      });
      if (!res.ok) throw new Error("Action failed");
      toast.success(action === "duplicate" ? "Duplicated" : "Updated");
      await loadCourses();
    } catch (e) {
      toast.error("Operation failed");
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      await loadCourses();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage courses, content, and monitor platform performance
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Set up the basic information for your new course
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData({ ...courseData, title: e.target.value })
                    }
                    placeholder="Enter course title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what students will learn in this course"
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={courseData.category}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={courseData.difficulty}
                      onValueChange={(value) =>
                        setCourseData({ ...courseData, difficulty: value })
                      }
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={courseData.estimatedHours}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          estimatedHours: parseFloat(e.target.value) || 1,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={courseData.price}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={courseData.visibility}
                    onValueChange={(value) =>
                      setCourseData({ ...courseData, visibility: value })
                    }
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="RESTRICTED">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCourse}
                    disabled={loading || !courseData.title.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Creating..." : "Create Course"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedCourses} published, {stats.draftCourses} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalStudents.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activeStudents} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Based on 1,234 reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Management */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Library</CardTitle>
                <CardDescription>
                  Manage and monitor all courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading && (
                    <div className="text-center text-muted-foreground py-8">
                      Loading...
                    </div>
                  )}
                  {!loading && filteredCourses.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No courses found
                    </div>
                  )}
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge
                            variant={
                              course.isPublished ? "default" : "secondary"
                            }
                          >
                            {course.isPublished ? "published" : "draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{course.modules.length} modules</span>
                          <span>
                            {course.modules.reduce(
                              (a, m) => a + m.lessons.length,
                              0
                            )}{" "}
                            lessons
                          </span>
                          <span>
                            {course._count?.enrollments || 0} students
                          </span>
                          <span>
                            Updated{" "}
                            {new Date(course.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/courses/${course.id}/builder`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                doAction(
                                  course.isPublished ? "unpublish" : "publish",
                                  course.id
                                )
                              }
                            >
                              {course.isPublished ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => doAction("duplicate", course.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => doAction("archive", course.id)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => deleteCourse(course.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
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

          <TabsContent value="published">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {stats.publishedCourses} published courses
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {stats.draftCourses} draft courses
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No archived courses
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.course} • {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
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
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Content Library
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin User Management
            </CardTitle>
            <CardDescription>Manage admin privileges for users</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminUserManager />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
