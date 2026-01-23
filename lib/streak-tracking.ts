/**
 * Streak tracking utilities for daily practice monitoring
 * Calculates and updates user streaks based on practice sessions
 */

import { getUserStats, saveUserStats, type UserStats } from "./user-stats";

export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
  isNewStreak: boolean; // First day practicing
  streakContinued: boolean; // Consecutive day
  streakBroken: boolean; // Skipped days
}

/**
 * Update user's practice streak based on session completion
 * @param xpEarned - XP earned in the completed session
 * @returns StreakUpdate with current streak information
 */
export function updateStreak(xpEarned: number): StreakUpdate {
  const stats = getUserStats();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const lastPractice = stats.lastPracticeDate;

  let currentStreak = stats.currentStreak;
  let isNewStreak = false;
  let streakContinued = false;
  let streakBroken = false;

  if (!lastPractice) {
    // First time practicing ever
    currentStreak = 1;
    isNewStreak = true;
  } else if (lastPractice === today) {
    // Already practiced today - streak stays the same
    // Still update XP though
    const updatedStats: UserStats = {
      ...stats,
      totalXP: stats.totalXP + xpEarned,
    };
    saveUserStats(updatedStats);

    return {
      currentStreak,
      longestStreak: stats.longestStreak,
      lastPracticeDate: today,
      isNewStreak: false,
      streakContinued: false,
      streakBroken: false,
    };
  } else {
    // Calculate days since last practice
    const lastDate = new Date(lastPractice);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day - increment streak
      currentStreak += 1;
      streakContinued = true;
    } else {
      // Streak broken - start over
      currentStreak = 1;
      streakBroken = true;
    }
  }

  // Update longest streak if current exceeds it
  const longestStreak = Math.max(stats.longestStreak, currentStreak);

  // Save updated stats
  const updatedStats: UserStats = {
    ...stats,
    currentStreak,
    longestStreak,
    lastPracticeDate: today,
    totalXP: stats.totalXP + xpEarned,
  };

  saveUserStats(updatedStats);

  return {
    currentStreak,
    longestStreak,
    lastPracticeDate: today,
    isNewStreak,
    streakContinued,
    streakBroken,
  };
}

/**
 * Get a user-friendly message about the current streak status
 */
export function getStreakMessage(streakUpdate: StreakUpdate): string {
  if (streakUpdate.isNewStreak) {
    return "🔥 1 day streak started!";
  } else if (streakUpdate.streakContinued) {
    return `🔥 ${streakUpdate.currentStreak} day streak!`;
  } else if (streakUpdate.streakBroken) {
    return "🔥 1 day streak! Keep it going tomorrow!";
  } else {
    // Same day practice
    return `🔥 ${streakUpdate.currentStreak} day streak maintained!`;
  }
}

/**
 * Get current streak without updating it
 */
export function getCurrentStreak(): number {
  const stats = getUserStats();
  return stats.currentStreak;
}

/**
 * Get longest streak achieved
 */
export function getLongestStreak(): number {
  const stats = getUserStats();
  return stats.longestStreak;
}
