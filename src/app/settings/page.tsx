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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Mail,
  Volume2,
  Eye,
  Clock,
  Calendar,
  Upload,
  Save,
  AlertCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    bio: "",
    learningGoals: "",
    preferredSubjects: [] as string[],
    timezone: "America/Toronto",
    language: "en",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    achievementAlerts: true,
    socialUpdates: true,
    weeklyReports: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showProgress: true,
    showAchievements: true,
    allowFriendRequests: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    compactMode: false,
    showAnimations: true,
    fontSize: "medium",
  });

  useEffect(() => {
    // Simulate loading settings
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Profile settings saved successfully!");
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Notification preferences updated!");
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Privacy settings updated!");
  };

  const handleSaveAppearance = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Appearance settings updated!");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile details and learning preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile
                    </p>
                  </div>

                  {/* Learning Goals */}
                  <div className="space-y-2">
                    <Label htmlFor="goals">Learning Goals</Label>
                    <Textarea
                      id="goals"
                      placeholder="What do you want to achieve?"
                      value={profile.learningGoals}
                      onChange={(e) =>
                        setProfile({ ...profile, learningGoals: e.target.value })
                      }
                    />
                  </div>

                  {/* Preferred Subjects */}
                  <div className="space-y-2">
                    <Label>Preferred Subjects</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Web Development",
                        "Data Science",
                        "AI/ML",
                        "Mobile Development",
                        "DevOps",
                        "UI/UX Design",
                        "Cybersecurity",
                        "Cloud Computing",
                      ].map((subject) => (
                        <Badge
                          key={subject}
                          variant={
                            profile.preferredSubjects.includes(subject)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            if (profile.preferredSubjects.includes(subject)) {
                              setProfile({
                                ...profile,
                                preferredSubjects:
                                  profile.preferredSubjects.filter(
                                    (s) => s !== subject
                                  ),
                              });
                            } else {
                              setProfile({
                                ...profile,
                                preferredSubjects: [
                                  ...profile.preferredSubjects,
                                  subject,
                                ],
                              });
                            }
                          }}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Timezone & Language */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Timezone
                      </Label>
                      <Select
                        value={profile.timezone}
                        onValueChange={(value) =>
                          setProfile({ ...profile, timezone: value })
                        }
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Toronto">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="America/Chicago">
                            Central Time (CT)
                          </SelectItem>
                          <SelectItem value="America/Denver">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            Pacific Time (PT)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Language
                      </Label>
                      <Select
                        value={profile.language}
                        onValueChange={(value) =>
                          setProfile({ ...profile, language: value })
                        }
                      >
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="ml-auto"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <Label htmlFor="push-notifications">
                          Push Notifications
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get notifications on your device
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Study Reminders */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <Label htmlFor="study-reminders">Study Reminders</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Daily reminders to continue learning
                      </p>
                    </div>
                    <Switch
                      id="study-reminders"
                      checked={notifications.studyReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          studyReminders: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Achievement Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <Label htmlFor="achievement-alerts">
                          Achievement Alerts
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Notify when you unlock achievements
                      </p>
                    </div>
                    <Switch
                      id="achievement-alerts"
                      checked={notifications.achievementAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          achievementAlerts: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Social Updates */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label htmlFor="social-updates">Social Updates</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Friend requests and study group invites
                      </p>
                    </div>
                    <Switch
                      id="social-updates"
                      checked={notifications.socialUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          socialUpdates: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Summary of your weekly progress
                      </p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          weeklyReports: checked,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="ml-auto"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Visibility */}
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Profile Visibility</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) =>
                        setPrivacy({ ...privacy, profileVisibility: value })
                      }
                    >
                      <SelectTrigger id="visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Public - Anyone can view
                          </div>
                        </SelectItem>
                        <SelectItem value="friends">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Friends Only
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Private - Only you
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Show Progress */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-progress">Show Progress</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your learning progress on profile
                      </p>
                    </div>
                    <Switch
                      id="show-progress"
                      checked={privacy.showProgress}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showProgress: checked })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Show Achievements */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-achievements">Show Achievements</Label>
                      <p className="text-sm text-muted-foreground">
                        Display earned achievements on profile
                      </p>
                    </div>
                    <Switch
                      id="show-achievements"
                      checked={privacy.showAchievements}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, showAchievements: checked })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Allow Friend Requests */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="friend-requests">
                        Allow Friend Requests
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Let others send you friend requests
                      </p>
                    </div>
                    <Switch
                      id="friend-requests"
                      checked={privacy.allowFriendRequests}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, allowFriendRequests: checked })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSavePrivacy}
                    disabled={saving}
                    className="ml-auto"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize how the app looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={appearance.theme}
                      onValueChange={(value) =>
                        setAppearance({ ...appearance, theme: value })
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Compact Mode */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing for more content
                      </p>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) =>
                        setAppearance({ ...appearance, compactMode: checked })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Animations */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Show Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and effects
                      </p>
                    </div>
                    <Switch
                      id="animations"
                      checked={appearance.showAnimations}
                      onCheckedChange={(checked) =>
                        setAppearance({ ...appearance, showAnimations: checked })
                      }
                    />
                  </div>

                  <Separator />

                  {/* Font Size */}
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={(value) =>
                        setAppearance({ ...appearance, fontSize: value })
                      }
                    >
                      <SelectTrigger id="font-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveAppearance}
                    disabled={saving}
                    className="ml-auto"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Appearance
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
