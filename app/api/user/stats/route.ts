import { auth } from "@/auth";
import { db } from "@/db";
import { userStats, userProgress } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET - Fetch user stats (with XP reconciliation from review history)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch stored stats and compute XP from review history in parallel
    const [stats, reviewData] = await Promise.all([
      db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1),
      // Compute XP from actual review data: 3 XP per correct, 1 XP per wrong
      // This is the reliable source of truth since reviews are tracked server-side per word
      db
        .select({
          reviewXP: sql<number>`COALESCE(SUM(${userProgress.totalCorrect} * 3 + ${userProgress.totalWrong} * 1), 0)`,
          wordsLearned: sql<number>`COALESCE(SUM(CASE WHEN ${userProgress.isLearned} = true THEN 1 ELSE 0 END), 0)`,
        })
        .from(userProgress)
        .where(eq(userProgress.userId, userId)),
    ]);

    const reviewXP = Number(reviewData[0]?.reviewXP || 0);
    const wordsLearned = Number(reviewData[0]?.wordsLearned || 0);

    if (stats.length === 0) {
      return NextResponse.json({
        currentLevel: 1,
        totalWordsLearned: wordsLearned,
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
        totalXP: reviewXP,
      });
    }

    // Use the higher of stored XP vs computed review XP
    // Stored may include grammar XP; computed catches missed client-side POST calls
    const storedXP = stats[0].totalXP;
    const actualXP = Math.max(storedXP, reviewXP);

    // Sync stored values if review data shows higher numbers
    if (reviewXP > storedXP || wordsLearned > stats[0].totalWordsLearned) {
      await db
        .update(userStats)
        .set({
          ...(reviewXP > storedXP ? { totalXP: reviewXP } : {}),
          ...(wordsLearned > stats[0].totalWordsLearned ? { totalWordsLearned: wordsLearned } : {}),
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, userId));
    }

    return NextResponse.json({
      currentLevel: stats[0].currentLevel,
      totalWordsLearned: wordsLearned,
      currentStreak: stats[0].currentStreak,
      longestStreak: stats[0].longestStreak,
      lastPracticeDate: stats[0].lastPracticeDate?.toISOString().split("T")[0] || null,
      totalXP: actualXP,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}

// PUT - Update user stats
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      currentLevel,
      totalWordsLearned,
      currentStreak,
      longestStreak,
      lastPracticeDate,
      totalXP,
    } = body;

    // Check if user stats exist
    const existingStats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    if (existingStats.length === 0) {
      // Create new stats
      await db.insert(userStats).values({
        userId,
        currentLevel: currentLevel || 1,
        totalWordsLearned: totalWordsLearned || 0,
        currentStreak: currentStreak || 0,
        longestStreak: longestStreak || 0,
        lastPracticeDate: lastPracticeDate ? new Date(lastPracticeDate) : null,
        totalXP: totalXP || 0,
      });
    } else {
      // Update existing stats
      await db
        .update(userStats)
        .set({
          currentLevel: currentLevel ?? existingStats[0].currentLevel,
          totalWordsLearned: totalWordsLearned ?? existingStats[0].totalWordsLearned,
          currentStreak: currentStreak ?? existingStats[0].currentStreak,
          longestStreak: longestStreak ?? existingStats[0].longestStreak,
          lastPracticeDate: lastPracticeDate
            ? new Date(lastPracticeDate)
            : existingStats[0].lastPracticeDate,
          totalXP: totalXP ?? existingStats[0].totalXP,
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: "Failed to update user stats" },
      { status: 500 }
    );
  }
}

// POST - Add XP and update streak
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { xpEarned = 0 } = body;

    // Get current stats
    const existingStats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    const today = new Date().toISOString().split("T")[0];

    if (existingStats.length === 0) {
      // Create new stats with initial values
      await db.insert(userStats).values({
        userId,
        currentLevel: 1,
        totalWordsLearned: 0,
        currentStreak: 1,
        longestStreak: 1,
        lastPracticeDate: new Date(),
        totalXP: xpEarned,
      });

      return NextResponse.json({
        currentStreak: 1,
        longestStreak: 1,
        totalXP: xpEarned,
        isNewStreak: true,
      });
    }

    const stats = existingStats[0];
    const lastPractice = stats.lastPracticeDate?.toISOString().split("T")[0];

    let newStreak = stats.currentStreak;
    let isNewStreak = false;

    if (lastPractice !== today) {
      // Check if this is a consecutive day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastPractice === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak = stats.currentStreak + 1;
      } else {
        // Streak broken - start new streak
        newStreak = 1;
        isNewStreak = true;
      }
    }

    const newLongestStreak = Math.max(stats.longestStreak, newStreak);
    const newTotalXP = stats.totalXP + xpEarned;

    // Update stats
    await db
      .update(userStats)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastPracticeDate: new Date(),
        totalXP: newTotalXP,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId));

    return NextResponse.json({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      totalXP: newTotalXP,
      isNewStreak,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}
