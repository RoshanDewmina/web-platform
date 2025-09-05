"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Trophy,
  TrendingUp,
  Clock,
  Edit,
  Trash2,
  Flag,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
  status: "active" | "completed" | "paused";
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "learning",
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    priority: "medium" as const,
    milestones: [] as { title: string }[],
  });

  // Mock data
  const mockGoals: Goal[] = [
    {
      id: "1",
      title: "Master React Development",
      description: "Complete advanced React courses and build 3 production-ready projects",
      category: "learning",
      targetDate: new Date("2024-06-30"),
      progress: 65,
      status: "active",
      priority: "high",
      createdAt: new Date("2024-01-15"),
      milestones: [
        { id: "1-1", title: "Complete React fundamentals course", completed: true, completedAt: new Date("2024-02-01") },
        { id: "1-2", title: "Build todo app with hooks", completed: true, completedAt: new Date("2024-02-15") },
        { id: "1-3", title: "Learn Redux and state management", completed: true, completedAt: new Date("2024-03-01") },
        { id: "1-4", title: "Build e-commerce project", completed: false },
        { id: "1-5", title: "Deploy projects to production", completed: false },
      ],
    },
    {
      id: "2",
      title: "Complete 100 LeetCode Problems",
      description: "Improve algorithmic thinking and prepare for technical interviews",
      category: "practice",
      targetDate: new Date("2024-12-31"),
      progress: 35,
      status: "active",
      priority: "medium",
      createdAt: new Date("2024-01-01"),
      milestones: [
        { id: "2-1", title: "Complete 25 easy problems", completed: true, completedAt: new Date("2024-02-01") },
        { id: "2-2", title: "Complete 25 medium problems", completed: false },
        { id: "2-3", title: "Complete 10 hard problems", completed: false },
        { id: "2-4", title: "Review and optimize solutions", completed: false },
      ],
    },
    {
      id: "3",
      title: "Learn Machine Learning Basics",
      description: "Understand ML fundamentals and implement basic algorithms",
      category: "learning",
      targetDate: new Date("2024-09-30"),
      progress: 20,
      status: "active",
      priority: "low",
      createdAt: new Date("2024-03-01"),
      milestones: [
        { id: "3-1", title: "Complete ML course introduction", completed: true, completedAt: new Date("2024-03-15") },
        { id: "3-2", title: "Learn Python for data science", completed: false },
        { id: "3-3", title: "Implement first neural network", completed: false },
        { id: "3-4", title: "Complete a ML project", completed: false },
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setGoals(mockGoals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      progress: 0,
      status: "active",
      createdAt: new Date(),
      milestones: newGoal.milestones.map((m, index) => ({
        id: `${Date.now()}-${index}`,
        title: m.title,
        completed: false,
      })),
    };

    setGoals([...goals, goal]);
    setShowNewGoalDialog(false);
    setNewGoal({
      title: "",
      description: "",
      category: "learning",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      priority: "medium",
      milestones: [],
    });
    toast.success("Goal created successfully!");
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((m) => {
            if (m.id === milestoneId) {
              return {
                ...m,
                completed: !m.completed,
                completedAt: !m.completed ? new Date() : undefined,
              };
            }
            return m;
          });

          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const progress = Math.round((completedCount / updatedMilestones.length) * 100);

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            status: progress === 100 ? "completed" : goal.status,
          };
        }
        return goal;
      })
    );
    toast.success("Progress updated!");
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
    toast.success("Goal deleted successfully!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return null;
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                Goals
                <Target className="h-8 w-8 text-primary" />
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your learning goals and milestones
              </p>
            </div>
            <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new learning goal with milestones to track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Master React Development"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What do you want to achieve?"
                      value={newGoal.description}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newGoal.category}
                        onValueChange={(value) =>
                          setNewGoal({ ...newGoal, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newGoal.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setNewGoal({ ...newGoal, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-red-500" />
                              High
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-yellow-500" />
                              Medium
                            </div>
                          </SelectItem>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-green-500" />
                              Low
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Date</Label>
                    <Calendar
                      mode="single"
                      selected={newGoal.targetDate}
                      onSelect={(date) =>
                        date && setNewGoal({ ...newGoal, targetDate: date })
                      }
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Milestones</Label>
                    <div className="space-y-2">
                      {newGoal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={milestone.title}
                            onChange={(e) => {
                              const updated = [...newGoal.milestones];
                              updated[index].title = e.target.value;
                              setNewGoal({ ...newGoal, milestones: updated });
                            }}
                            placeholder="Milestone title"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const updated = newGoal.milestones.filter(
                                (_, i) => i !== index
                              );
                              setNewGoal({ ...newGoal, milestones: updated });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewGoal({
                            ...newGoal,
                            milestones: [...newGoal.milestones, { title: "" }],
                          })
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewGoalDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGoal}
                    disabled={!newGoal.title || newGoal.milestones.length === 0}
                  >
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeGoals.length}</div>
                <p className="text-xs text-muted-foreground">
                  Currently working on
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Goals
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedGoals.length}</div>
                <p className="text-xs text-muted-foreground">Successfully achieved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Progress
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeGoals.length > 0
                    ? Math.round(
                        activeGoals.reduce((acc, g) => acc + g.progress, 0) /
                          activeGoals.length
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Across all goals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {goals.filter(
                    (g) =>
                      g.milestones.some(
                        (m) =>
                          m.completedAt &&
                          m.completedAt.getMonth() === new Date().getMonth()
                      )
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">Milestones completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Goals Tabs */}
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeGoals.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedGoals.length})
              </TabsTrigger>
              <TabsTrigger value="all">All Goals ({goals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(goal.status)}
                            <Tooltip>
                              <TooltipTrigger>
                                <Flag
                                  className={cn(
                                    "h-4 w-4",
                                    getPriorityColor(goal.priority)
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {goal.priority} priority
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGoal(goal.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due {goal.targetDate.toLocaleDateString()}
                        </div>
                        <div>
                          {goal.milestones.filter((m) => m.completed).length}/
                          {goal.milestones.length} done
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="opacity-75">
                    <CardHeader>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      {getStatusBadge(goal.status)}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                        <Trophy className="h-4 w-4" />
                        Completed on {goal.targetDate.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <Card
                    key={goal.id}
                    className={cn(
                      "hover:shadow-lg transition-shadow cursor-pointer",
                      goal.status === "completed" && "opacity-75"
                    )}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          {getStatusBadge(goal.status)}
                        </div>
                        <Flag
                          className={cn("h-4 w-4", getPriorityColor(goal.priority))}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                      <div className="space-y-2">
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{goal.progress}% complete</span>
                          <span>
                            {goal.milestones.filter((m) => m.completed).length}/
                            {goal.milestones.length} milestones
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Goal Details Dialog */}
          {selectedGoal && (
            <Dialog
              open={!!selectedGoal}
              onOpenChange={() => setSelectedGoal(null)}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedGoal.title}</span>
                    <Flag
                      className={cn("h-5 w-5", getPriorityColor(selectedGoal.priority))}
                    />
                  </DialogTitle>
                  <DialogDescription>{selectedGoal.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold">{selectedGoal.progress}%</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-muted-foreground">Target Date</p>
                      <p className="text-lg font-medium">
                        {selectedGoal.targetDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Progress value={selectedGoal.progress} className="h-3" />
                  <div className="space-y-3">
                    <h4 className="font-medium">Milestones</h4>
                    {selectedGoal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                        onClick={() =>
                          toggleMilestone(selectedGoal.id, milestone.id)
                        }
                      >
                        <Checkbox
                          checked={milestone.completed}
                          onCheckedChange={() =>
                            toggleMilestone(selectedGoal.id, milestone.id)
                          }
                        />
                        <span
                          className={cn(
                            "flex-1",
                            milestone.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {milestone.title}
                        </span>
                        {milestone.completedAt && (
                          <span className="text-xs text-muted-foreground">
                            {milestone.completedAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
