import { pgTable, text, timestamp, uuid, integer, boolean, unique, primaryKey } from "drizzle-orm/pg-core";

/**
 * Users table - stores user authentication data
 * Uses email-only authentication (no passwords)
 */
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

/**
 * Accounts table - for OAuth providers (required by Auth.js)
 */
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

/**
 * Sessions table - for database sessions (required by Auth.js)
 */
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * Verification tokens - for magic link authentication
 * Stores one-time tokens sent via email
 */
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().primaryKey(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  }
);

/**
 * Vocabulary table - stores Farsi words with translations
 * Core content for the learning application
 */
export const vocabulary = pgTable("vocabulary", {
  id: uuid("id").primaryKey().defaultRandom(),
  // The Farsi word in Persian script
  farsiWord: text("farsi_word").notNull(),
  // English translation
  englishTranslation: text("english_translation").notNull(),
  // Optional phonetic transcription (e.g., "salaam" for "سلام")
  phonetic: text("phonetic"),
  // Optional example sentence in Farsi
  exampleFarsi: text("example_farsi"),
  // Optional phonetic version of the Farsi example
  examplePhonetic: text("example_phonetic"),
  // Optional example translation
  exampleEnglish: text("example_english"),
  // Difficulty level (1-5, can be used for future features)
  difficultyLevel: integer("difficulty_level").default(1),
  // Whether this word is formal register
  isFormal: boolean("is_formal").default(false),
  // Whether this word is active/published
  isActive: boolean("is_active").default(true).notNull(),
  // When this word was added
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  // Last updated
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * User progress table - tracks which words users have learned
 * Foundation for spaced repetition algorithm
 */
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  vocabularyId: uuid("vocabulary_id")
    .notNull()
    .references(() => vocabulary.id, { onDelete: "cascade" }),
  // Number of times the user has reviewed this word
  reviewCount: integer("review_count").default(0).notNull(),
  // Last time the user reviewed this word
  lastReviewedAt: timestamp("last_reviewed_at", { mode: "date" }),
  // User's self-reported confidence (1-5)
  confidenceLevel: integer("confidence_level").default(1),
  // When the user first saw this word
  firstSeenAt: timestamp("first_seen_at", { mode: "date" }).defaultNow().notNull(),
  // Last updated
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),

  // Spaced repetition fields
  nextReviewDate: timestamp("next_review_date", { mode: "date" }),
  easeFactor: text("ease_factor").default("2.50"), // Using text for decimal storage
  repetitions: integer("repetitions").default(0).notNull(),

  // Mastery tracking
  isLearned: boolean("is_learned").default(false).notNull(),
  lastAssessment: text("last_assessment"), // "easy" | "good" | "hard" | "again"

  // Answer tracking (for validation system)
  lastAnswerCorrect: boolean("last_answer_correct"),
  consecutiveCorrect: integer("consecutive_correct").default(0).notNull(),
  consecutiveWrong: integer("consecutive_wrong").default(0).notNull(),
  totalCorrect: integer("total_correct").default(0).notNull(),
  totalWrong: integer("total_wrong").default(0).notNull(),
  accuracy: integer("accuracy").default(0).notNull(), // Percentage (0-100)
});

/**
 * Daily lessons table - tracks which words were featured on which day
 * Allows for "word of the day" functionality
 */
export const dailyLessons = pgTable("daily_lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  vocabularyId: uuid("vocabulary_id")
    .notNull()
    .references(() => vocabulary.id, { onDelete: "cascade" }),
  // The date this word is/was featured
  lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
  // When this lesson was created
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * User stats table - tracks overall user progress and statistics
 * Used for dashboard metrics and level progression
 */
export const userStats = pgTable("user_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  // Current difficulty level (1-5)
  currentLevel: integer("current_level").default(1).notNull(),
  // Total words marked as learned
  totalWordsLearned: integer("total_words_learned").default(0).notNull(),
  // Current consecutive days streak
  currentStreak: integer("current_streak").default(0).notNull(),
  // Longest streak achieved
  longestStreak: integer("longest_streak").default(0).notNull(),
  // Last date user practiced
  lastPracticeDate: timestamp("last_practice_date", { mode: "date" }),
  // Total XP earned
  totalXP: integer("total_xp").default(0).notNull(),
  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Vocabulary = typeof vocabulary.$inferSelect;
export type NewVocabulary = typeof vocabulary.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

export type DailyLesson = typeof dailyLessons.$inferSelect;
export type NewDailyLesson = typeof dailyLessons.$inferInsert;

export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;

/**
 * Word categories table - organizes vocabulary into thematic groups
 * Enables category-based progression and contextual learning
 */
export const wordCategories = pgTable("word_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Category name (e.g., "Basic Greetings", "Food & Drink")
  name: text("name").notNull().unique(),
  // URL-friendly slug (e.g., "greetings", "food")
  slug: text("slug").notNull().unique(),
  // Optional description of the category
  description: text("description"),
  // Emoji icon for visual display
  icon: text("icon"),
  // Difficulty level this category belongs to (1-5)
  difficultyLevel: integer("difficulty_level").notNull(),
  // Display order within the difficulty level
  sortOrder: integer("sort_order").default(0).notNull(),
  // Whether this category is active/published
  isActive: boolean("is_active").default(true).notNull(),
  // When this category was created
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Vocabulary categories junction table - many-to-many relationship
 * Allows words to belong to multiple categories
 */
export const vocabularyCategories = pgTable(
  "vocabulary_categories",
  {
    vocabularyId: uuid("vocabulary_id")
      .notNull()
      .references(() => vocabulary.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => wordCategories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.vocabularyId, table.categoryId] }),
  })
);

export type WordCategory = typeof wordCategories.$inferSelect;
export type NewWordCategory = typeof wordCategories.$inferInsert;

export type VocabularyCategory = typeof vocabularyCategories.$inferSelect;
export type NewVocabularyCategory = typeof vocabularyCategories.$inferInsert;

/**
 * Lessons table - structured learning paths organized by category
 * Each lesson focuses on a specific category of words
 */
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Reference to the category this lesson teaches
  categoryId: uuid("category_id")
    .notNull()
    .references(() => wordCategories.id, { onDelete: "cascade" }),
  // Lesson title (e.g., "Lesson 1: Basic Greetings")
  title: text("title").notNull(),
  // Description of what the lesson covers
  description: text("description"),
  // Difficulty level (1-5) - inherited from category
  difficultyLevel: integer("difficulty_level").notNull(),
  // Display order within the level
  sortOrder: integer("sort_order").notNull(),
  // Whether this lesson is published/active
  isActive: boolean("is_active").default(true).notNull(),
  // When this lesson was created
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * User lesson progress - tracks completion status for each lesson
 * Stored in localStorage until auth is enabled
 */
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  // User ID (will be used when auth is enabled)
  userId: text("user_id").notNull(),
  // Reference to the lesson
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  // Whether user completed this lesson
  isCompleted: boolean("is_completed").default(false).notNull(),
  // When the lesson was completed
  completedAt: timestamp("completed_at"),
  // Number of times user attempted this lesson
  attempts: integer("attempts").default(0).notNull(),
  // Best score achieved (percentage 0-100)
  bestScore: integer("best_score").default(0).notNull(),
  // When this progress was created
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Last time this progress was updated
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type NewUserLessonProgress = typeof userLessonProgress.$inferInsert;

/**
 * Grammar lessons table - structured grammar learning
 * Contains explanations and links to exercises
 */
export const grammarLessons = pgTable("grammar_lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Lesson title (e.g., "Lesson G1: Personal Pronouns")
  title: text("title").notNull(),
  // Brief description of what's covered
  description: text("description"),
  // Full grammar explanation in markdown format
  explanation: text("explanation").notNull(),
  // Difficulty level (1-5)
  difficultyLevel: integer("difficulty_level").notNull(),
  // Display order (sequential across all levels)
  sortOrder: integer("sort_order").notNull(),
  // Emoji icon for visual display
  icon: text("icon").default("📖"),
  // Whether this lesson is published/active
  isActive: boolean("is_active").default(true).notNull(),
  // When this lesson was created
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Grammar exercises table - practice questions for grammar lessons
 * Supports multiple exercise types: fill_blank, multiple_choice, conjugation, translate
 */
export const grammarExercises = pgTable("grammar_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Reference to the grammar lesson
  grammarLessonId: uuid("grammar_lesson_id")
    .notNull()
    .references(() => grammarLessons.id, { onDelete: "cascade" }),
  // Type of exercise: "fill_blank" | "multiple_choice" | "conjugation" | "translate"
  exerciseType: text("exercise_type").notNull(),
  // The exercise prompt/question in English
  question: text("question").notNull(),
  // Optional Farsi version of the question
  questionFarsi: text("question_farsi"),
  // The correct answer
  correctAnswer: text("correct_answer").notNull(),
  // JSON array of alternative answers for multiple choice
  alternatives: text("alternatives"),
  // Optional hint to help the user
  hint: text("hint"),
  // Explanation of why this answer is correct
  explanation: text("explanation"),
  // Display order within the lesson
  sortOrder: integer("sort_order").default(0).notNull(),
});

/**
 * User grammar progress - tracks completion status for grammar lessons
 */
export const userGrammarProgress = pgTable("user_grammar_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  // User ID
  userId: text("user_id").notNull(),
  // Reference to the grammar lesson
  grammarLessonId: uuid("grammar_lesson_id")
    .notNull()
    .references(() => grammarLessons.id, { onDelete: "cascade" }),
  // Whether user completed this lesson
  isCompleted: boolean("is_completed").default(false).notNull(),
  // When the lesson was completed
  completedAt: timestamp("completed_at"),
  // Number of times user attempted this lesson
  attempts: integer("attempts").default(0).notNull(),
  // Best score achieved (percentage 0-100)
  bestScore: integer("best_score").default(0).notNull(),
  // When this progress was created
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Last time this progress was updated
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type GrammarLesson = typeof grammarLessons.$inferSelect;
export type NewGrammarLesson = typeof grammarLessons.$inferInsert;

export type GrammarExercise = typeof grammarExercises.$inferSelect;
export type NewGrammarExercise = typeof grammarExercises.$inferInsert;

export type UserGrammarProgress = typeof userGrammarProgress.$inferSelect;
export type NewUserGrammarProgress = typeof userGrammarProgress.$inferInsert;
