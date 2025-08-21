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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  UserPlus,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  MoreHorizontal,
  Send,
  CheckCircle,
  XCircle,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function SocialPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [friendsLive, setFriendsLive] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/social/friends");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setRequests(data.requests || []);
          setFriendsLive(
            (data.friends || []).map((f: any) => {
              const other = f.user?.clerkId === user?.id ? f.friend : f.user;
              return {
                id: other?.id,
                name: other?.username || "Friend",
                avatar: other?.avatarUrl,
                level: 1,
                xp: 0,
                status: "online",
                streak: 0,
              };
            })
          );
        }
      } catch {}
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;
    const loadFeed = async () => {
      setFeedLoading(true);
      try {
        const res = await fetch("/api/social/activity?scope=friends&limit=50");
        if (res.ok) {
          const data = await res.json();
          if (mounted) setFeed(data.items || []);
        }
      } finally {
        setFeedLoading(false);
      }
    };
    loadFeed();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Mock data - will be replaced with real data from API
  const activityFeed = [
    {
      id: "1",
      user: {
        name: "Alice Johnson",
        avatar: "/api/placeholder/40/40",
        level: 15,
      },
      type: "achievement",
      content: 'earned the "Week Warrior" badge',
      icon: "🔥",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 3,
    },
    {
      id: "2",
      user: {
        name: "Bob Smith",
        avatar: "/api/placeholder/40/40",
        level: 12,
      },
      type: "course_complete",
      content: 'completed "Introduction to React"',
      courseName: "Introduction to React",
      timestamp: "4 hours ago",
      likes: 24,
      comments: 5,
    },
    {
      id: "3",
      user: {
        name: "Carol White",
        avatar: "/api/placeholder/40/40",
        level: 18,
      },
      type: "streak",
      content: "reached a 30-day learning streak!",
      streakCount: 30,
      timestamp: "6 hours ago",
      likes: 45,
      comments: 8,
    },
    {
      id: "4",
      user: {
        name: "David Lee",
        avatar: "/api/placeholder/40/40",
        level: 10,
      },
      type: "quiz",
      content: 'scored 100% on "JavaScript Fundamentals Quiz"',
      quizName: "JavaScript Fundamentals",
      timestamp: "8 hours ago",
      likes: 18,
      comments: 2,
    },
    {
      id: "5",
      user: {
        name: "Emma Wilson",
        avatar: "/api/placeholder/40/40",
        level: 14,
      },
      type: "level_up",
      content: "reached Level 14!",
      newLevel: 14,
      timestamp: "1 day ago",
      likes: 32,
      comments: 6,
    },
  ];

  const friends = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/api/placeholder/40/40",
      level: 15,
      xp: 3240,
      status: "online",
      currentActivity: "Learning React Hooks",
      streak: 12,
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/api/placeholder/40/40",
      level: 12,
      xp: 2890,
      status: "online",
      currentActivity: "Taking a quiz",
      streak: 7,
    },
    {
      id: "3",
      name: "Carol White",
      avatar: "/api/placeholder/40/40",
      level: 18,
      xp: 4150,
      status: "offline",
      lastSeen: "2 hours ago",
      streak: 30,
    },
    {
      id: "4",
      name: "David Lee",
      avatar: "/api/placeholder/40/40",
      level: 10,
      xp: 2100,
      status: "away",
      currentActivity: "In study group",
      streak: 5,
    },
  ];

  const friendRequests = [
    {
      id: "1",
      name: "Frank Miller",
      avatar: "/api/placeholder/40/40",
      level: 8,
      mutualFriends: 3,
      timestamp: "2 days ago",
    },
    {
      id: "2",
      name: "Grace Chen",
      avatar: "/api/placeholder/40/40",
      level: 11,
      mutualFriends: 5,
      timestamp: "3 days ago",
    },
  ];

  const studyGroups = [
    {
      id: "1",
      name: "JavaScript Masters",
      description: "Advanced JavaScript concepts and best practices",
      members: 24,
      maxMembers: 30,
      isPublic: true,
      lastActivity: "10 minutes ago",
      topics: ["JavaScript", "React", "Node.js"],
    },
    {
      id: "2",
      name: "Data Science Beginners",
      description: "Learn data science from scratch together",
      members: 18,
      maxMembers: 25,
      isPublic: true,
      lastActivity: "1 hour ago",
      topics: ["Python", "Data Analysis", "Machine Learning"],
    },
    {
      id: "3",
      name: "Algorithm Study Group",
      description: "Practice algorithms and data structures for interviews",
      members: 32,
      maxMembers: 40,
      isPublic: false,
      lastActivity: "3 hours ago",
      topics: ["Algorithms", "Data Structures", "Problem Solving"],
    },
  ];

  const suggestedFriends = [
    {
      id: "1",
      name: "Hannah Park",
      avatar: "/api/placeholder/40/40",
      level: 13,
      mutualFriends: 8,
      commonCourses: 3,
    },
    {
      id: "2",
      name: "Ian Rodriguez",
      avatar: "/api/placeholder/40/40",
      level: 9,
      mutualFriends: 4,
      commonCourses: 2,
    },
    {
      id: "3",
      name: "Julia Thompson",
      avatar: "/api/placeholder/40/40",
      level: 16,
      mutualFriends: 6,
      commonCourses: 4,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Social</h1>
          <p className="text-muted-foreground mt-2">
            Connect with fellow learners and track their progress
          </p>
        </div>

        {/* Friend Requests */}
        {requests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Friend Requests</CardTitle>
              <CardDescription>
                {requests.length} pending request
                {requests.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback>
                          {(request.sender?.username || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {request.sender?.username || "User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sent a request
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await fetch("/api/social/friends", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              senderClerkId: request.sender?.clerkId,
                              action: "reject",
                            }),
                          });
                          const res = await fetch("/api/social/friends");
                          const data = await res.json();
                          setRequests(data.requests || []);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          await fetch("/api/social/friends", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              senderClerkId: request.sender?.clerkId,
                              action: "accept",
                            }),
                          });
                          const res = await fetch("/api/social/friends");
                          const data = await res.json();
                          setRequests(data.requests || []);
                          setFriendsLive(
                            (data.friends || []).map((f: any) => {
                              const other =
                                f.user?.clerkId === user?.id
                                  ? f.friend
                                  : f.user;
                              return {
                                id: other?.id,
                                name: other?.username || "Friend",
                                avatar: other?.avatarUrl,
                                level: 1,
                                xp: 0,
                                status: "online",
                                streak: 0,
                              };
                            })
                          );
                        }}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="feed" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Activity Feed</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          {/* Activity Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  See what your friends are up to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {(feed.length ? feed : activityFeed).map(
                      (activity: any) => (
                        <div key={activity.id} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  activity.user?.avatarUrl ||
                                  activity.user?.avatar
                                }
                              />
                              <AvatarFallback>
                                {
                                  (activity.user?.username ||
                                    activity.user?.name ||
                                    "U")[0]
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">
                                  {activity.user?.username ||
                                    activity.user?.name ||
                                    "User"}
                                </span>
                                {(activity.user?.level ||
                                  activity.user?.level === 0) && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Level {activity.user.level}
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {activity.description || activity.content}
                                </span>
                              </div>
                              {activity.type === "COURSE_ENROLLED" &&
                                activity.courseName && (
                                  <Card className="mt-2 p-3">
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="h-4 w-4 text-primary" />
                                      <span className="font-medium">
                                        {activity.courseName}
                                      </span>
                                    </div>
                                  </Card>
                                )}
                              {activity.type === "STREAK_MILESTONE" && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Flame className="h-5 w-5 text-orange-500" />
                                  {activity.streakCount && (
                                    <span className="text-2xl font-bold text-orange-500">
                                      {activity.streakCount}
                                    </span>
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    days
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-3">
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4 mr-1" />
                                  {activity.likes || 0}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {activity.comments || 0}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {activity.timestamp ||
                                    (activity.createdAt
                                      ? new Date(
                                          activity.createdAt
                                        ).toLocaleString()
                                      : "")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {feedLoading && (
                      <div className="text-sm text-muted-foreground">
                        Loading...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(friendsLive.length ? friendsLive : friends).map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={friend.avatar} />
                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                              friend.status === "online"
                                ? "bg-green-500"
                                : friend.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{friend.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              Level {friend.level}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {friend.xp.toLocaleString()} XP
                            </span>
                          </div>
                          {friend.currentActivity && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {friend.currentActivity}
                            </p>
                          )}
                          {friend.lastSeen && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Last seen {friend.lastSeen}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">
                              {friend.streak} day streak
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search groups..." className="pl-9" />
              </div>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid gap-4">
              {studyGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {group.name}
                          {!group.isPublic && (
                            <Badge variant="secondary">Private</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <Button>Join Group</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {group.topics.map((topic) => (
                        <Badge key={topic} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members}/{group.maxMembers} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Active {group.lastActivity}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Friends</CardTitle>
                <CardDescription>
                  People you might know based on your courses and connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {suggestedFriends.map((suggestion) => (
                    <Card key={suggestion.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="h-16 w-16 mb-3">
                            <AvatarImage src={suggestion.avatar} />
                            <AvatarFallback>
                              {suggestion.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">{suggestion.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            Level {suggestion.level}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-2">
                            {suggestion.mutualFriends} mutual friends
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {suggestion.commonCourses} courses in common
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Friend
                          </Button>
                        </div>
                      </CardContent>
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
