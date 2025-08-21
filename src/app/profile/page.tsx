'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trophy,
  Flame,
  Star,
  Clock,
  BookOpen,
  Users,
  Settings,
  Camera,
  Mail,
  Globe,
  Lock,
  Bell,
  Shield,
  Heart,
  Award,
  Target,
  Zap,
  Edit,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Passionate learner exploring new technologies and expanding my knowledge every day.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://myportfolio.com');
  const [learningGoal, setLearningGoal] = useState('Master full-stack development');

  // Mock data - will be replaced with real data from API
  const profileStats = {
    level: 12,
    totalXP: 2450,
    nextLevelXP: 3000,
    currentStreak: 7,
    longestStreak: 14,
    coursesCompleted: 3,
    coursesInProgress: 4,
    totalLessons: 48,
    certificatesEarned: 2,
    achievementsUnlocked: 12,
    totalAchievements: 25,
    friendsCount: 23,
    studyGroups: 3,
    joinedDate: 'January 2024',
    studyTime: '58 hours',
    averageScore: 87,
  };

  const recentAchievements = [
    { id: '1', name: 'Quick Learner', icon: '⚡', date: '2 days ago' },
    { id: '2', name: 'Week Warrior', icon: '🔥', date: '1 week ago' },
    { id: '3', name: 'Social Butterfly', icon: '🦋', date: '2 weeks ago' },
    { id: '4', name: 'Perfect Score', icon: '💯', date: '3 weeks ago' },
  ];

  const certificates = [
    {
      id: '1',
      course: 'Introduction to React',
      issueDate: '2024-01-15',
      instructor: 'John Doe',
      grade: 'A+',
    },
    {
      id: '2',
      course: 'JavaScript Fundamentals',
      issueDate: '2024-01-01',
      instructor: 'Jane Smith',
      grade: 'A',
    },
  ];

  const skills = [
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 70 },
    { name: 'JavaScript', level: 90 },
    { name: 'Node.js', level: 60 },
    { name: 'CSS', level: 75 },
    { name: 'Python', level: 45 },
  ];

  const privacySettings = {
    profileVisibility: 'public',
    showActivity: true,
    showAchievements: true,
    showProgress: true,
    allowFriendRequests: true,
    showOnlineStatus: true,
  };

  const notificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    socialActivity: true,
    achievements: true,
    weeklyReport: true,
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Profile Header */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
              <div className='relative'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <Button
                  size='icon'
                  variant='secondary'
                  className='absolute bottom-0 right-0 h-8 w-8 rounded-full'
                >
                  <Camera className='h-4 w-4' />
                </Button>
              </div>
              
              <div className='flex-1 text-center md:text-left'>
                <div className='flex items-center justify-center md:justify-start gap-3 mb-2'>
                  <h1 className='text-2xl font-bold'>
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <Badge>Level {profileStats.level}</Badge>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className='space-y-3 max-w-2xl'>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder='Tell us about yourself...'
                      className='min-h-[80px]'
                    />
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='Location'
                      />
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder='Website'
                      />
                      <Input
                        value={learningGoal}
                        onChange={(e) => setLearningGoal(e.target.value)}
                        placeholder='Learning goal'
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                      <Button variant='outline' onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className='text-muted-foreground mb-3 max-w-2xl'>{bio}</p>
                    <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Globe className='h-4 w-4' />
                        {location}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Mail className='h-4 w-4' />
                        {user?.primaryEmailAddress?.emailAddress}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Target className='h-4 w-4' />
                        {learningGoal}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        Joined {profileStats.joinedDate}
                      </div>
                    </div>
                  </>
                )}
                
                <div className='mt-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Level Progress</span>
                    <span className='text-sm text-muted-foreground'>
                      {profileStats.totalXP} / {profileStats.nextLevelXP} XP
                    </span>
                  </div>
                  <Progress value={(profileStats.totalXP / profileStats.nextLevelXP) * 100} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
              <div className='text-center p-3 rounded-lg bg-secondary'>
                <Flame className='h-6 w-6 mx-auto mb-1 text-orange-500' />
                <div className='text-xl font-bold'>{profileStats.currentStreak}</div>
                <div className='text-xs text-muted-foreground'>Day Streak</div>
              </div>
              <div className='text-center p-3 rounded-lg bg-secondary'>
                <Trophy className='h-6 w-6 mx-auto mb-1 text-yellow-500' />
                <div className='text-xl font-bold'>{profileStats.achievementsUnlocked}</div>
                <div className='text-xs text-muted-foreground'>Achievements</div>
              </div>
              <div className='text-center p-3 rounded-lg bg-secondary'>
                <BookOpen className='h-6 w-6 mx-auto mb-1 text-blue-500' />
                <div className='text-xl font-bold'>{profileStats.coursesCompleted}</div>
                <div className='text-xs text-muted-foreground'>Courses Done</div>
              </div>
              <div className='text-center p-3 rounded-lg bg-secondary'>
                <Users className='h-6 w-6 mx-auto mb-1 text-green-500' />
                <div className='text-xl font-bold'>{profileStats.friendsCount}</div>
                <div className='text-xs text-muted-foreground'>Friends</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='achievements'>Achievements</TabsTrigger>
            <TabsTrigger value='certificates'>Certificates</TabsTrigger>
            <TabsTrigger value='skills'>Skills</TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Total Study Time</span>
                    <span className='font-medium'>{profileStats.studyTime}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Lessons Completed</span>
                    <span className='font-medium'>{profileStats.totalLessons}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Average Quiz Score</span>
                    <span className='font-medium'>{profileStats.averageScore}%</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Courses in Progress</span>
                    <span className='font-medium'>{profileStats.coursesInProgress}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Study Groups</span>
                    <span className='font-medium'>{profileStats.studyGroups}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span className='text-2xl'>{achievement.icon}</span>
                          <span className='font-medium'>{achievement.name}</span>
                        </div>
                        <span className='text-sm text-muted-foreground'>{achievement.date}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant='outline' className='w-full mt-4'>
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value='achievements' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Achievement Collection</CardTitle>
                <CardDescription>
                  {profileStats.achievementsUnlocked} of {profileStats.totalAchievements} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-3 md:grid-cols-5 gap-4'>
                  {[
                    { name: 'First Steps', icon: '👟', earned: true },
                    { name: 'Quick Learner', icon: '⚡', earned: true },
                    { name: 'Social Butterfly', icon: '🦋', earned: true },
                    { name: 'Week Warrior', icon: '🔥', earned: true },
                    { name: 'Perfect Score', icon: '💯', earned: true },
                    { name: 'Night Owl', icon: '🦉', earned: true },
                    { name: 'Early Bird', icon: '🐦', earned: true },
                    { name: 'Team Player', icon: '🤝', earned: false },
                    { name: 'Marathon Runner', icon: '🏃', earned: false },
                    { name: 'Course Master', icon: '🎓', earned: false },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 text-center ${
                        achievement.earned
                          ? 'border-primary bg-primary/5'
                          : 'border-muted opacity-50'
                      }`}
                    >
                      <span className='text-3xl mb-2'>{achievement.icon}</span>
                      <span className='text-xs font-medium'>{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value='certificates' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Earned Certificates</CardTitle>
                <CardDescription>Your course completion certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4'>
                  {certificates.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className='pt-6'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <Award className='h-12 w-12 text-primary' />
                            <div>
                              <h3 className='font-semibold'>{cert.course}</h3>
                              <p className='text-sm text-muted-foreground'>
                                Instructor: {cert.instructor}
                              </p>
                              <div className='flex items-center gap-2 mt-1'>
                                <Badge variant='secondary'>Grade: {cert.grade}</Badge>
                                <span className='text-xs text-muted-foreground'>
                                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant='outline'>
                            <Globe className='h-4 w-4 mr-2' />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value='skills' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Skill Proficiency</CardTitle>
                <CardDescription>Your expertise across different technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='font-medium'>{skill.name}</span>
                        <span className='text-sm text-muted-foreground'>{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} />
                    </div>
                  ))}
                </div>
                <Button className='w-full mt-6'>
                  <Zap className='h-4 w-4 mr-2' />
                  Take Skill Assessment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value='settings' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your profile and activity</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Profile Visibility</Label>
                    <p className='text-sm text-muted-foreground'>Who can see your profile</p>
                  </div>
                  <Select defaultValue={privacySettings.profileVisibility}>
                    <SelectTrigger className='w-32'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='public'>Public</SelectItem>
                      <SelectItem value='friends'>Friends Only</SelectItem>
                      <SelectItem value='private'>Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Show Learning Activity</Label>
                    <p className='text-sm text-muted-foreground'>Display your recent activity</p>
                  </div>
                  <Switch defaultChecked={privacySettings.showActivity} />
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Show Achievements</Label>
                    <p className='text-sm text-muted-foreground'>Display earned badges</p>
                  </div>
                  <Switch defaultChecked={privacySettings.showAchievements} />
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Allow Friend Requests</Label>
                    <p className='text-sm text-muted-foreground'>Let others send you requests</p>
                  </div>
                  <Switch defaultChecked={privacySettings.allowFriendRequests} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Email Notifications</Label>
                    <p className='text-sm text-muted-foreground'>Receive email updates</p>
                  </div>
                  <Switch defaultChecked={notificationSettings.emailNotifications} />
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Course Updates</Label>
                    <p className='text-sm text-muted-foreground'>New lessons and content</p>
                  </div>
                  <Switch defaultChecked={notificationSettings.courseUpdates} />
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Social Activity</Label>
                    <p className='text-sm text-muted-foreground'>Friend requests and messages</p>
                  </div>
                  <Switch defaultChecked={notificationSettings.socialActivity} />
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Weekly Progress Report</Label>
                    <p className='text-sm text-muted-foreground'>Summary of your learning</p>
                  </div>
                  <Switch defaultChecked={notificationSettings.weeklyReport} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
