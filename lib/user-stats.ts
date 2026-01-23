/**
 * User statistics utilities for localStorage-based stat tracking
 * Used while authentication is disabled
 */

export interface UserStats {
  currentLevel: number;
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null; // ISO date string (YYYY-MM-DD)
  totalXP: number;
}

const USER_STATS_KEY = "userStats";

/**
 * Get user stats from localStorage
 * Returns default stats if none exist
 */
export function getUserStats(): UserStats {
  if (typeof window === "undefined") {
    return getDefaultStats();
  }

  const saved = localStorage.getItem(USER_STATS_KEY);
  if (!saved) {
    return getDefaultStats();
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to parse user stats:", error);
    return getDefaultStats();
  }
}

/**
 * Save user stats to localStorage
 */
export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}

/**
 * Get default stats for new users
 */
function getDefaultStats(): UserStats {
  return {
    currentLevel: 1,
    totalWordsLearned: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    totalXP: 0,
  };
}
