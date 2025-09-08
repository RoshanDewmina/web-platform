"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Zap,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ChevronUp,
  Info,
  Crown,
  Star,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface XPTrackerProps {
  currentXP: number;
  currentLevel: number;
  nextLevelXP: number;
  totalXP: number;
  rank?: string;
  recentXP?: {
    amount: number;
    reason: string;
    timestamp: Date;
  }[];
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function XPTracker({
  currentXP,
  currentLevel,
  nextLevelXP,
  totalXP,
  rank,
  recentXP = [],
  compact = false,
  showDetails = true,
  className,
}: XPTrackerProps) {
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGainAmount, setXPGainAmount] = useState(0);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { theme } = useTheme();

  const progressPercentage = (currentXP / nextLevelXP) * 100;
  const xpToNextLevel = nextLevelXP - currentXP;

  // Animate XP gain
  useEffect(() => {
    if (recentXP.length > 0) {
      const latestGain = recentXP[0];
      const timeDiff = Date.now() - new Date(latestGain.timestamp).getTime();
      
      // Show animation if XP was gained in the last 5 seconds
      if (timeDiff < 5000) {
        setXPGainAmount(latestGain.amount);
        setShowXPGain(true);
        setTimeout(() => setShowXPGain(false), 3000);
      }
    }
  }, [recentXP]);

  // Get level color based on tier
  const getLevelColor = (level: number) => {
    if (level >= 100) return "text-yellow-500 dark:text-yellow-400"; // Gold
    if (level >= 50) return "text-purple-500 dark:text-purple-400"; // Purple
    if (level >= 25) return "text-blue-500 dark:text-blue-400"; // Blue
    if (level >= 10) return "text-green-500 dark:text-green-400"; // Green
    return "text-gray-500 dark:text-gray-400"; // Gray
  };

  // Get rank icon
  const getRankIcon = (level: number) => {
    if (level >= 100) return <Crown className="h-4 w-4" />;
    if (level >= 50) return <Star className="h-4 w-4" />;
    if (level >= 25) return <Award className="h-4 w-4" />;
    if (level >= 10) return <Trophy className="h-4 w-4" />;
    return <Target className="h-4 w-4" />;
  };

  // Get rank title
  const getRankTitle = (level: number) => {
    if (level >= 100) return "Master";
    if (level >= 50) return "Expert";
    if (level >= 25) return "Advanced";
    if (level >= 10) return "Intermediate";
    return "Beginner";
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("relative", className)}
              onClick={() => setShowDetailsDialog(true)}
            >
              <div className="flex items-center gap-2">
                <div className={cn("flex items-center", getLevelColor(currentLevel))}>
                  {getRankIcon(currentLevel)}
                  <span className="font-bold">Lv.{currentLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm font-medium">{currentXP.toLocaleString()}</span>
                </div>
              </div>
              <AnimatePresence>
                {showXPGain && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                  >
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      +{xpGainAmount} XP
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-semibold">{getRankTitle(currentLevel)}</p>
              <p className="text-sm">{xpToNextLevel} XP to level {currentLevel + 1}</p>
              <Progress value={progressPercentage} className="h-2 w-32" />
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Card className={cn("relative overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Experience Points
            </CardTitle>
            {showDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailsDialog(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Level and Rank */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center gap-1", getLevelColor(currentLevel))}>
                {getRankIcon(currentLevel)}
                <span className="text-2xl font-bold">Level {currentLevel}</span>
              </div>
              <Badge variant="outline" className="font-medium">
                {getRankTitle(currentLevel)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="text-lg font-bold">{totalXP.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{currentXP.toLocaleString()} XP</span>
              <span className="text-muted-foreground">{nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3" />
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {xpToNextLevel} XP to reach level {currentLevel + 1}
            </p>
          </div>

          {/* Recent XP Gains */}
          {recentXP.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Recent Activity
              </h4>
              <div className="space-y-1">
                {recentXP.slice(0, 3).map((xp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{xp.reason}</span>
                    <Badge variant="secondary" className="text-xs">
                      +{xp.amount} XP
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* XP Gain Animation */}
          <AnimatePresence>
            {showXPGain && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-1" />
                  +{xpGainAmount} XP!
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Experience Points Details</DialogTitle>
            <DialogDescription>
              Track your progress and see how to earn more XP
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Level</span>
                        <span className="font-medium">{currentLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rank</span>
                        <span className="font-medium">{getRankTitle(currentLevel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total XP</span>
                        <span className="font-medium">{totalXP.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Next Milestone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Next Level</span>
                        <span className="font-medium">{currentLevel + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">XP Needed</span>
                        <span className="font-medium">{xpToNextLevel.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(progressPercentage)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">How to Earn XP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16">+10 XP</Badge>
                      <span>Complete a lesson</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16">+25 XP</Badge>
                      <span>Pass a quiz</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16">+50 XP</Badge>
                      <span>Perfect quiz score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16">+100 XP</Badge>
                      <span>Complete a course</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16">Varies</Badge>
                      <span>Unlock achievements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16">+5 XP</Badge>
                      <span>Daily login streak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recent XP Gains</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {recentXP.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No recent XP gains. Start learning to earn XP!
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {recentXP.map((xp, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div>
                              <p className="font-medium">{xp.reason}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(xp.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="secondary">+{xp.amount} XP</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Level Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 10, 25, 50, 100].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          currentLevel >= level
                            ? "bg-primary/5 border-primary/20"
                            : "bg-muted/30 opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={getLevelColor(level)}>
                            {getRankIcon(level)}
                          </div>
                          <div>
                            <p className="font-medium">Level {level}</p>
                            <p className="text-sm text-muted-foreground">
                              {getRankTitle(level)} Rank
                            </p>
                          </div>
                        </div>
                        {currentLevel >= level ? (
                          <Badge variant="secondary" className="text-green-600">
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {(level * 100 - totalXP).toLocaleString()} XP needed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
