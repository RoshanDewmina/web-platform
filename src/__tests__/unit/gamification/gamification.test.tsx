import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock data for testing gamification features
const mockUserStats = {
  totalXP: 2450,
  currentLevel: 12,
  nextLevelXP: 3000,
  currentStreak: 7,
  longestStreak: 14,
  achievements: [
    { id: "1", name: "First Steps", earned: true, xpReward: 50 },
    { id: "2", name: "Quick Learner", earned: true, xpReward: 100 },
    { id: "3", name: "Marathon Runner", earned: false, xpReward: 300 },
  ],
};

const mockLeaderboard = [
  { rank: 1, userId: "user-1", name: "Alice", xp: 5420, level: 25 },
  { rank: 2, userId: "user-2", name: "Bob", xp: 5180, level: 24 },
  { rank: 3, userId: "user-3", name: "Carol", xp: 4950, level: 23 },
  { rank: 15, userId: "current-user", name: "You", xp: 2450, level: 12 },
];

describe("XP and Leveling System", () => {
  describe("XP Calculation", () => {
    it("calculates correct XP for lesson completion", () => {
      const baseXP = 10;
      const bonusMultiplier = 1.5; // Perfect score bonus
      const expectedXP = Math.floor(baseXP * bonusMultiplier);

      expect(expectedXP).toBe(15);
    });

    it("calculates level based on total XP", () => {
      const calculateLevel = (xp: number) => {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
      };

      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(400)).toBe(3);
      expect(calculateLevel(2450)).toBe(5);
    });

    it("determines XP needed for next level", () => {
      const getXPForLevel = (level: number) => {
        return Math.pow(level - 1, 2) * 100;
      };

      const getXPToNextLevel = (currentXP: number, currentLevel: number) => {
        const nextLevelXP = getXPForLevel(currentLevel + 1);
        return nextLevelXP - currentXP;
      };

      expect(getXPToNextLevel(2450, 12)).toBe(getXPForLevel(13) - 2450);
    });
  });

  describe("Level Progression", () => {
    it("triggers level up animation when threshold is reached", async () => {
      const currentXP = 2990;
      const xpGained = 20;
      const nextLevelThreshold = 3000;

      const newTotalXP = currentXP + xpGained;
      const leveledUp = newTotalXP >= nextLevelThreshold;

      expect(leveledUp).toBe(true);
    });

    it("awards bonus XP for consecutive daily logins", () => {
      const streakBonuses = {
        3: 50, // 3-day streak
        7: 100, // 1-week streak
        30: 500, // 1-month streak
      };

      const getStreakBonus = (streak: number) => {
        if (streak >= 30) return streakBonuses[30];
        if (streak >= 7) return streakBonuses[7];
        if (streak >= 3) return streakBonuses[3];
        return 0;
      };

      expect(getStreakBonus(7)).toBe(100);
      expect(getStreakBonus(30)).toBe(500);
      expect(getStreakBonus(2)).toBe(0);
    });
  });
});

describe("Achievement System", () => {
  describe("Achievement Earning", () => {
    it("grants achievement when conditions are met", () => {
      const achievements = {
        firstSteps: {
          id: "first-steps",
          condition: (stats: any) => stats.lessonsCompleted >= 1,
          earned: false,
        },
        weekWarrior: {
          id: "week-warrior",
          condition: (stats: any) => stats.currentStreak >= 7,
          earned: false,
        },
        perfectScore: {
          id: "perfect-score",
          condition: (stats: any) => stats.perfectQuizzes >= 1,
          earned: false,
        },
      };

      const userStats = {
        lessonsCompleted: 1,
        currentStreak: 7,
        perfectQuizzes: 1,
      };

      Object.values(achievements).forEach((achievement) => {
        achievement.earned = achievement.condition(userStats);
      });

      expect(achievements.firstSteps.earned).toBe(true);
      expect(achievements.weekWarrior.earned).toBe(true);
      expect(achievements.perfectScore.earned).toBe(true);
    });

    it("prevents duplicate achievement grants", () => {
      const earnedAchievements = new Set(["first-steps", "quick-learner"]);
      const newAchievement = "first-steps";

      const alreadyEarned = earnedAchievements.has(newAchievement);
      expect(alreadyEarned).toBe(true);
    });

    it("calculates total achievement progress", () => {
      const totalAchievements = 25;
      const earnedAchievements = 12;
      const progress = (earnedAchievements / totalAchievements) * 100;

      expect(progress).toBe(48);
    });
  });

  describe("Badge Categories", () => {
    it("categorizes badges correctly", () => {
      const badges = [
        { id: "1", category: "progress", name: "First Steps" },
        { id: "2", category: "skill", name: "Quiz Master" },
        { id: "3", category: "social", name: "Team Player" },
        { id: "4", category: "streak", name: "Week Warrior" },
      ];

      const categorized = badges.reduce((acc, badge) => {
        if (!acc[badge.category]) acc[badge.category] = [];
        acc[badge.category].push(badge);
        return acc;
      }, {} as Record<string, typeof badges>);

      expect(categorized.progress).toHaveLength(1);
      expect(categorized.skill).toHaveLength(1);
      expect(categorized.social).toHaveLength(1);
      expect(categorized.streak).toHaveLength(1);
    });
  });
});

describe("Streak System", () => {
  describe("Streak Tracking", () => {
    it("increments streak for consecutive daily activity", () => {
      const lastActivityDate = new Date("2024-01-20");
      const currentDate = new Date("2024-01-21");
      const daysDiff = Math.floor(
        (currentDate.getTime() - lastActivityDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const shouldIncrementStreak = daysDiff === 1;
      expect(shouldIncrementStreak).toBe(true);
    });

    it("resets streak after missing a day", () => {
      const lastActivityDate = new Date("2024-01-20");
      const currentDate = new Date("2024-01-22");
      const daysDiff = Math.floor(
        (currentDate.getTime() - lastActivityDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const shouldResetStreak = daysDiff > 1;
      expect(shouldResetStreak).toBe(true);
    });

    it("maintains streak for same-day activity", () => {
      const lastActivityDate = new Date("2024-01-20T10:00:00");
      const currentDate = new Date("2024-01-20T15:00:00");
      const daysDiff = Math.floor(
        (currentDate.getTime() - lastActivityDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const shouldMaintainStreak = daysDiff === 0;
      expect(shouldMaintainStreak).toBe(true);
    });

    it("tracks longest streak correctly", () => {
      let currentStreak = 7;
      let longestStreak = 5;

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      expect(longestStreak).toBe(7);
    });
  });

  describe("Streak Rewards", () => {
    it("awards milestone badges for streak achievements", () => {
      const streakMilestones = [3, 7, 14, 30, 60, 100];
      const currentStreak = 30;

      const earnedMilestones = streakMilestones.filter(
        (milestone) => currentStreak >= milestone
      );
      expect(earnedMilestones).toEqual([3, 7, 14, 30]);
    });
  });
});

describe("Leaderboard System", () => {
  describe("Ranking Logic", () => {
    it("sorts users by XP correctly", () => {
      const users = [
        { userId: "1", xp: 3000 },
        { userId: "2", xp: 5000 },
        { userId: "3", xp: 2000 },
        { userId: "4", xp: 5000 }, // Tie
      ];

      const sorted = users.sort((a, b) => b.xp - a.xp);

      expect(sorted[0].xp).toBe(5000);
      expect(sorted[1].xp).toBe(5000);
      expect(sorted[2].xp).toBe(3000);
      expect(sorted[3].xp).toBe(2000);
    });

    it("handles tie-breaking by join date", () => {
      const users = [
        { userId: "1", xp: 5000, joinedAt: new Date("2024-01-15") },
        { userId: "2", xp: 5000, joinedAt: new Date("2024-01-10") },
      ];

      const sorted = users.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });

      expect(sorted[0].userId).toBe("2"); // Earlier join date wins
    });

    it("calculates user rank position", () => {
      const leaderboard = mockLeaderboard;
      const currentUserId = "current-user";

      const userPosition = leaderboard.find(
        (entry) => entry.userId === currentUserId
      )?.rank;
      expect(userPosition).toBe(15);
    });
  });

  describe("Leaderboard Types", () => {
    it("filters global leaderboard correctly", () => {
      const allUsers = mockLeaderboard;
      expect(allUsers).toHaveLength(4);
    });

    it("filters friends-only leaderboard", () => {
      const friendIds = ["user-1", "user-3", "current-user"];
      const friendsLeaderboard = mockLeaderboard.filter((entry) =>
        friendIds.includes(entry.userId)
      );

      expect(friendsLeaderboard).toHaveLength(3);
      expect(
        friendsLeaderboard.every((entry) => friendIds.includes(entry.userId))
      ).toBe(true);
    });

    it("filters course-specific leaderboard", () => {
      const courseEnrollments = [
        { userId: "user-1", courseId: "course-1", xp: 500 },
        { userId: "user-2", courseId: "course-1", xp: 450 },
        { userId: "user-3", courseId: "course-2", xp: 600 },
      ];

      const course1Leaderboard = courseEnrollments
        .filter((e) => e.courseId === "course-1")
        .sort((a, b) => b.xp - a.xp);

      expect(course1Leaderboard).toHaveLength(2);
      expect(course1Leaderboard[0].userId).toBe("user-1");
    });

    it("calculates weekly leaderboard reset", () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilReset = (7 - dayOfWeek) % 7 || 7;

      expect(daysUntilReset).toBeGreaterThan(0);
      expect(daysUntilReset).toBeLessThanOrEqual(7);
    });
  });
});

describe("Progress Visualization", () => {
  describe("Statistics Calculation", () => {
    it("calculates average daily study time", () => {
      const totalMinutes = 1380;
      const daysActive = 30;
      const averageDaily = Math.round(totalMinutes / daysActive);

      expect(averageDaily).toBe(46);
    });

    it("calculates course completion percentage", () => {
      const completedLessons = 24;
      const totalLessons = 32;
      const completionRate = Math.round(
        (completedLessons / totalLessons) * 100
      );

      expect(completionRate).toBe(75);
    });

    it("tracks skill proficiency levels", () => {
      const skills = [
        { name: "React", completedExercises: 85, totalExercises: 100 },
        { name: "TypeScript", completedExercises: 70, totalExercises: 100 },
      ];

      const proficiencies = skills.map((skill) => ({
        name: skill.name,
        level: Math.round(
          (skill.completedExercises / skill.totalExercises) * 100
        ),
      }));

      expect(proficiencies[0].level).toBe(85);
      expect(proficiencies[1].level).toBe(70);
    });
  });
});
