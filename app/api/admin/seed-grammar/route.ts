import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { grammarLessons, grammarExercises } from "@/db/schema";

/**
 * POST /api/admin/seed-grammar
 * Seed initial grammar lessons and exercises
 * All exercises use PHONETIC Farsi (Latin script) for questions and answers
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if lessons already exist
    const existingLessons = await db.select().from(grammarLessons).limit(1);
    if (existingLessons.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Grammar lessons already exist. Delete them first to re-seed.",
      });
    }

    // Insert Grammar Lesson 1: Personal Pronouns
    const [lesson1] = await db
      .insert(grammarLessons)
      .values({
        title: "Lesson G1: Personal Pronouns",
        description: "Learn the personal pronouns in Farsi - the foundation of every sentence",
        icon: "👤",
        explanation: `# Personal Pronouns in Farsi

Personal pronouns are essential for building sentences in Farsi. Unlike English, Farsi pronouns don't change based on whether they're subjects or objects.

## The Six Personal Pronouns

man → I
to → You (informal/singular)
u → He/She/It
ma → We
shoma → You (formal/plural)
anha → They

## Key Points

- Farsi has no gender distinction in pronouns - "u" means both "he" and "she"
- "shoma" is used for politeness OR when addressing multiple people
- In casual speech, pronouns are often dropped because verb endings indicate the subject

## Examples

man irani hastam → I am Iranian
to khubi? → Are you well?
u daneshjoo ast → He/She is a student
ma irani hastim → We are Iranian`,
        difficultyLevel: 1,
        sortOrder: 1,
      })
      .returning();

    // Insert exercises for Lesson 1 - ALL IN PHONETIC
    await db.insert(grammarExercises).values([
      {
        grammarLessonId: lesson1.id,
        exerciseType: "multiple_choice",
        question: "What is the Farsi word for 'I'?",
        correctAnswer: "man",
        alternatives: JSON.stringify(["man", "to", "u", "ma"]),
        explanation: "'man' means 'I' in Farsi",
        sortOrder: 1,
      },
      {
        grammarLessonId: lesson1.id,
        exerciseType: "multiple_choice",
        question: "Which pronoun means 'they' in Farsi?",
        correctAnswer: "anha",
        alternatives: JSON.stringify(["shoma", "ma", "anha", "u"]),
        explanation: "'anha' is the plural third-person pronoun meaning 'they'",
        sortOrder: 2,
      },
      {
        grammarLessonId: lesson1.id,
        exerciseType: "translate",
        question: "Type the Farsi word for 'we'",
        correctAnswer: "ma",
        hint: "It's a short two-letter word",
        explanation: "'ma' means 'we' in Farsi",
        sortOrder: 3,
      },
      {
        grammarLessonId: lesson1.id,
        exerciseType: "multiple_choice",
        question: "Which pronoun would you use to politely address your teacher?",
        correctAnswer: "shoma",
        alternatives: JSON.stringify(["to", "u", "shoma", "man"]),
        explanation: "'shoma' is used for formal/polite address",
        sortOrder: 4,
      },
      {
        grammarLessonId: lesson1.id,
        exerciseType: "fill_blank",
        question: "Complete: ___ daneshjoo hastam (I am a student)",
        correctAnswer: "man",
        hint: "The pronoun for 'I'",
        explanation: "'man' is 'I' - 'man daneshjoo hastam' means 'I am a student'",
        sortOrder: 5,
      },
    ]);

    // Insert Grammar Lesson 2: The Verb "To Be"
    const [lesson2] = await db
      .insert(grammarLessons)
      .values({
        title: "Lesson G2: The Verb 'To Be'",
        description: "Master the most important verb in Farsi - budan (to be)",
        icon: "✨",
        explanation: `# The Verb "To Be" in Farsi

The verb "to be" (budan) is the most essential verb in Farsi. In the present tense, it's expressed through endings attached to the subject.

## Present Tense Conjugation

man hastam → I am
to hasti → You are (informal)
u ast/hast → He/She/It is
ma hastim → We are
shoma hastid → You are (formal/plural)
anha hastand → They are

## Short Forms (More Common in Speech)

In spoken Farsi, these are often shortened:
hastam → -am
hasti → -i
ast → -e or ast

## Examples

man khoshhaal hastam → I am happy
to daneshjoo hasti → You are a student
in ketaab ast → This is a book
ma irani hastim → We are Iranian`,
        difficultyLevel: 1,
        sortOrder: 2,
      })
      .returning();

    // Insert exercises for Lesson 2 - ALL IN PHONETIC
    await db.insert(grammarExercises).values([
      {
        grammarLessonId: lesson2.id,
        exerciseType: "conjugation",
        question: "Conjugate 'to be' for 'man' (I am)",
        correctAnswer: "hastam",
        hint: "Starts with 'h'",
        explanation: "'man hastam' = I am",
        sortOrder: 1,
      },
      {
        grammarLessonId: lesson2.id,
        exerciseType: "multiple_choice",
        question: "What is 'You are' (informal) in Farsi?",
        correctAnswer: "hasti",
        alternatives: JSON.stringify(["hastam", "hasti", "ast", "hastim"]),
        explanation: "'to hasti' = You are (informal)",
        sortOrder: 2,
      },
      {
        grammarLessonId: lesson2.id,
        exerciseType: "fill_blank",
        question: "Complete: u daneshjoo ___ (He/She is a student)",
        correctAnswer: "ast",
        hint: "The 'to be' form for he/she",
        explanation: "'ast' is the third-person singular form",
        sortOrder: 3,
      },
      {
        grammarLessonId: lesson2.id,
        exerciseType: "translate",
        question: "Complete: ma khoshhaal ___ (We are happy)",
        correctAnswer: "hastim",
        hint: "The 'to be' form for 'we'",
        explanation: "'ma khoshhaal hastim' = We are happy",
        sortOrder: 4,
      },
      {
        grammarLessonId: lesson2.id,
        exerciseType: "multiple_choice",
        question: "Which form is used for 'They are'?",
        correctAnswer: "hastand",
        alternatives: JSON.stringify(["hastid", "hastand", "hastim", "hasti"]),
        explanation: "'anha hastand' = They are",
        sortOrder: 5,
      },
    ]);

    // Insert Grammar Lesson 3: Simple Present Tense
    const [lesson3] = await db
      .insert(grammarLessons)
      .values({
        title: "Lesson G3: Simple Present Tense",
        description: "Learn how to form present tense verbs with the 'mi' prefix",
        icon: "🔄",
        explanation: `# Simple Present Tense in Farsi

The present tense in Farsi is formed by adding "mi" before the verb stem, plus personal endings.

## Formation

mi + verb stem + personal ending

## Personal Endings

man: -am
to: -i
u: -ad
ma: -im
shoma: -id
anha: -and

## Example: raftan (to go)

Verb stem: rav/ro

miravam → I go
miravi → You go
miravad → He/She goes
miravim → We go
miravid → You go (formal)
miravand → They go

## More Examples

khordan (to eat) → mikhoram (I eat)
didan (to see) → mibinam (I see)
goftan (to say) → miguyam (I say)`,
        difficultyLevel: 1,
        sortOrder: 3,
      })
      .returning();

    // Insert exercises for Lesson 3 - ALL IN PHONETIC
    await db.insert(grammarExercises).values([
      {
        grammarLessonId: lesson3.id,
        exerciseType: "multiple_choice",
        question: "What prefix is used for present tense in Farsi?",
        correctAnswer: "mi",
        alternatives: JSON.stringify(["mi", "na", "be", "kho"]),
        explanation: "'mi' is the present tense prefix in Farsi",
        sortOrder: 1,
      },
      {
        grammarLessonId: lesson3.id,
        exerciseType: "conjugation",
        question: "Conjugate 'raftan' (to go) for 'I go'",
        correctAnswer: "miravam",
        hint: "mi + rav + am",
        explanation: "'miravam' = I go",
        sortOrder: 2,
      },
      {
        grammarLessonId: lesson3.id,
        exerciseType: "fill_blank",
        question: "Complete: u be madrese ___ (He goes to school)",
        correctAnswer: "miravad",
        hint: "Present tense of 'raftan' for 'u'",
        explanation: "'miravad' is the third-person form",
        sortOrder: 3,
      },
      {
        grammarLessonId: lesson3.id,
        exerciseType: "multiple_choice",
        question: "What is 'They eat' in Farsi?",
        correctAnswer: "mikhorand",
        alternatives: JSON.stringify(["mikhoram", "mikhori", "mikhorad", "mikhorand"]),
        explanation: "'mikhorand' = They eat",
        sortOrder: 4,
      },
      {
        grammarLessonId: lesson3.id,
        exerciseType: "translate",
        question: "Type 'We see' in Farsi (using didan)",
        correctAnswer: "mibinim",
        hint: "mi + bin + im",
        explanation: "'mibinim' = We see",
        sortOrder: 5,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Successfully seeded 3 grammar lessons with PHONETIC exercises",
      lessons: [
        { id: lesson1.id, title: lesson1.title },
        { id: lesson2.id, title: lesson2.title },
        { id: lesson3.id, title: lesson3.title },
      ],
    });
  } catch (error) {
    console.error("Error seeding grammar lessons:", error);
    return NextResponse.json(
      { error: "Failed to seed grammar lessons", details: String(error) },
      { status: 500 }
    );
  }
}
