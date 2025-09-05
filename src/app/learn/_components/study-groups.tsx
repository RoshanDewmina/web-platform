"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Video,
  Globe,
  MessageSquare,
  UserPlus,
  Star,
  TrendingUp,
  BookOpen,
  Target,
  CheckCircle2,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  members: number;
  maxMembers: number;
  meetingSchedule: string;
  nextMeeting: Date;
  isOnline: boolean;
  location?: string;
  language: string;
  topics: string[];
  admin: {
    name: string;
    avatar?: string;
  };
  joined: boolean;
  featured?: boolean;
  rating?: number;
}

function StudyGroupSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

export function StudyGroups() {
  const [loading, setLoading] = useState(true);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "programming",
    level: "intermediate",
    maxMembers: 10,
    meetingSchedule: "weekly",
    isOnline: true,
    location: "",
    language: "English",
    topics: [] as string[],
  });

  // Mock data
  const mockGroups: StudyGroup[] = [
    {
      id: "1",
      name: "React Masters",
      description: "Deep dive into React patterns, hooks, and best practices. We meet weekly to discuss advanced topics and work on projects together.",
      category: "Web Development",
      level: "Advanced",
      members: 12,
      maxMembers: 15,
      meetingSchedule: "Wednesdays 6PM EST",
      nextMeeting: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      isOnline: true,
      language: "English",
      topics: ["React", "Redux", "TypeScript", "Next.js"],
      admin: { name: "Sarah Chen", avatar: "/api/placeholder/40/40" },
      joined: true,
      featured: true,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Algorithm Study Group",
      description: "Practice LeetCode problems together and prepare for technical interviews. Focus on data structures and algorithms.",
      category: "Computer Science",
      level: "Intermediate",
      members: 8,
      maxMembers: 10,
      meetingSchedule: "Tuesdays & Thursdays 7PM EST",
      nextMeeting: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      isOnline: true,
      language: "English",
      topics: ["Algorithms", "Data Structures", "LeetCode", "Interview Prep"],
      admin: { name: "Mike Johnson", avatar: "/api/placeholder/40/40" },
      joined: false,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Python for Data Science",
      description: "Learn Python with a focus on data analysis, pandas, numpy, and machine learning basics.",
      category: "Data Science",
      level: "Beginner",
      members: 20,
      maxMembers: 25,
      meetingSchedule: "Saturdays 2PM EST",
      nextMeeting: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isOnline: false,
      location: "Toronto Public Library",
      language: "English",
      topics: ["Python", "Pandas", "NumPy", "Data Analysis"],
      admin: { name: "Dr. Emily Wang", avatar: "/api/placeholder/40/40" },
      joined: false,
      featured: true,
      rating: 4.7,
    },
    {
      id: "4",
      name: "Mobile Dev Collective",
      description: "Build mobile apps using React Native and Flutter. Share knowledge and collaborate on projects.",
      category: "Mobile Development",
      level: "Intermediate",
      members: 15,
      maxMembers: 20,
      meetingSchedule: "Mondays 8PM EST",
      nextMeeting: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isOnline: true,
      language: "English",
      topics: ["React Native", "Flutter", "Mobile UI", "App Development"],
      admin: { name: "Alex Rivera", avatar: "/api/placeholder/40/40" },
      joined: false,
      rating: 4.6,
    },
    {
      id: "5",
      name: "Web3 & Blockchain Study",
      description: "Explore blockchain technology, smart contracts, and decentralized applications.",
      category: "Blockchain",
      level: "Advanced",
      members: 6,
      maxMembers: 10,
      meetingSchedule: "Fridays 7PM EST",
      nextMeeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isOnline: true,
      language: "English",
      topics: ["Ethereum", "Solidity", "Web3.js", "DeFi"],
      admin: { name: "Chris Thompson", avatar: "/api/placeholder/40/40" },
      joined: true,
      rating: 4.5,
    },
    {
      id: "6",
      name: "UI/UX Design Workshop",
      description: "Learn design principles, Figma, and create beautiful user interfaces together.",
      category: "Design",
      level: "Beginner",
      members: 18,
      maxMembers: 20,
      meetingSchedule: "Sundays 3PM EST",
      nextMeeting: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      isOnline: true,
      language: "English",
      topics: ["UI Design", "UX", "Figma", "Design Systems"],
      admin: { name: "Lisa Park", avatar: "/api/placeholder/40/40" },
      joined: false,
      rating: 4.8,
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStudyGroups(mockGroups);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(
      studyGroups.map((group) =>
        group.id === groupId
          ? { ...group, joined: true, members: group.members + 1 }
          : group
      )
    );
    toast.success("Successfully joined the study group!");
  };

  const handleLeaveGroup = (groupId: string) => {
    setStudyGroups(
      studyGroups.map((group) =>
        group.id === groupId
          ? { ...group, joined: false, members: group.members - 1 }
          : group
      )
    );
    toast.success("You have left the study group.");
  };

  const handleCreateGroup = () => {
    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      category: newGroup.category,
      level: newGroup.level,
      members: 1,
      maxMembers: newGroup.maxMembers,
      meetingSchedule: newGroup.meetingSchedule,
      nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isOnline: newGroup.isOnline,
      location: newGroup.location,
      language: newGroup.language,
      topics: newGroup.topics,
      admin: { name: "You" },
      joined: true,
    };

    setStudyGroups([group, ...studyGroups]);
    setShowCreateDialog(false);
    setNewGroup({
      name: "",
      description: "",
      category: "programming",
      level: "intermediate",
      maxMembers: 10,
      meetingSchedule: "weekly",
      isOnline: true,
      location: "",
      language: "English",
      topics: [],
    });
    toast.success("Study group created successfully!");
  };

  const filteredGroups = studyGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || group.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || group.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const myGroups = studyGroups.filter((group) => group.joined);
  const featuredGroups = studyGroups.filter((group) => group.featured);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Study Groups</h2>
            <p className="text-muted-foreground mt-1">
              Join study groups to learn together with peers
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
                <DialogDescription>
                  Start a new study group and invite others to learn together
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, name: e.target.value })
                    }
                    placeholder="e.g., React Study Group"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGroup.description}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, description: e.target.value })
                    }
                    placeholder="What will your group focus on?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newGroup.category}
                      onValueChange={(value) =>
                        setNewGroup({ ...newGroup, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="web-development">
                          Web Development
                        </SelectItem>
                        <SelectItem value="mobile-development">
                          Mobile Development
                        </SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={newGroup.level}
                      onValueChange={(value) =>
                        setNewGroup({ ...newGroup, level: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Max Members</Label>
                    <Input
                      id="maxMembers"
                      type="number"
                      value={newGroup.maxMembers}
                      onChange={(e) =>
                        setNewGroup({
                          ...newGroup,
                          maxMembers: parseInt(e.target.value),
                        })
                      }
                      min="2"
                      max="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={newGroup.language}
                      onValueChange={(value) =>
                        setNewGroup({ ...newGroup, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Mandarin">Mandarin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Meeting Schedule</Label>
                  <Input
                    id="schedule"
                    value={newGroup.meetingSchedule}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, meetingSchedule: e.target.value })
                    }
                    placeholder="e.g., Wednesdays 6PM EST"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meeting Type</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={newGroup.isOnline}
                        onChange={() => setNewGroup({ ...newGroup, isOnline: true })}
                        className="text-primary"
                      />
                      <span className="text-sm">Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!newGroup.isOnline}
                        onChange={() => setNewGroup({ ...newGroup, isOnline: false })}
                        className="text-primary"
                      />
                      <span className="text-sm">In-Person</span>
                    </label>
                  </div>
                </div>
                {!newGroup.isOnline && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newGroup.location}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, location: e.target.value })
                      }
                      placeholder="Where will you meet?"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name || !newGroup.description}
                >
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search study groups..."
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
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Mobile Development">Mobile Development</SelectItem>
              <SelectItem value="Blockchain">Blockchain</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Level" />
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
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Groups
            </TabsTrigger>
            <TabsTrigger value="my-groups" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              My Groups ({myGroups.length})
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Featured
            </TabsTrigger>
          </TabsList>

          {/* All Groups */}
          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <StudyGroupSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {group.name}
                            {group.featured && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                </TooltipTrigger>
                                <TooltipContent>Featured Group</TooltipContent>
                              </Tooltip>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{group.category}</Badge>
                            <Badge variant="outline">{group.level}</Badge>
                          </div>
                        </div>
                        {group.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{group.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1">
                        {group.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {group.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{group.topics.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Group Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {group.members}/{group.maxMembers} members
                            </span>
                          </div>
                          <Progress
                            value={(group.members / group.maxMembers) * 100}
                            className="w-20 h-2"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{group.meetingSchedule}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Next: {new Date(group.nextMeeting).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          {group.isOnline ? (
                            <>
                              <Video className="h-4 w-4" />
                              <span>Online</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4" />
                              <span>{group.location}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <span>{group.language}</span>
                        </div>
                      </div>

                      {/* Admin */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={group.admin.avatar} />
                          <AvatarFallback>{group.admin.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          Led by {group.admin.name}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {group.joined ? (
                        <div className="flex items-center gap-2 w-full">
                          <Button className="flex-1" variant="default">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Open Group
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleLeaveGroup(group.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          variant={
                            group.members >= group.maxMembers
                              ? "secondary"
                              : "outline"
                          }
                          disabled={group.members >= group.maxMembers}
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          {group.members >= group.maxMembers ? (
                            "Group Full"
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Join Group
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Groups */}
          <TabsContent value="my-groups" className="space-y-4">
            {myGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No groups yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Join study groups to collaborate with other learners and
                    accelerate your learning journey.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{group.category}</Badge>
                        <Badge variant="outline">{group.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {group.members}/{group.maxMembers} members
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Next: {new Date(group.nextMeeting).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Open Group
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Featured Groups */}
          <TabsContent value="featured" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-yellow-200 dark:border-yellow-900"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {group.name}
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      </CardTitle>
                      {group.rating && (
                        <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900">
                          <Star className="h-3 w-3 mr-1" />
                          {group.rating}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{group.category}</Badge>
                      <Badge variant="outline">{group.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {group.members}/{group.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{group.meetingSchedule}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {group.joined ? (
                      <Button className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Open Group
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Join Featured Group
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
