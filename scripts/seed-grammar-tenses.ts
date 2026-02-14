import "dotenv/config";
import { db } from "../db";
import { grammarLessons, grammarExercises } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Seeds 5 new grammar lessons covering verb tenses:
 * G13: Present Continuous
 * G14: Past Continuous (Imperfect)
 * G15: Present Perfect
 * G16: Past Perfect (Pluperfect)
 * G17: Simple Future
 *
 * Run with: tsx scripts/seed-grammar-tenses.ts
 */

const lessonsData = [
  // ─── G13: Present Continuous ─────────────────────────────────────
  {
    lesson: {
      title: "Lesson G13: Present Continuous",
      description: "Learn to express actions happening right now using daashtan + mi-verb",
      icon: "▶️",
      explanation: `# Present Continuous in Farsi

The present continuous describes actions happening **right now**. It uses the auxiliary verb "daashtan" (to have) in present tense + the mi-verb.

## Formation

present "daashtan" + mi- + verb stem + ending

## Conjugation of "daashtan" (auxiliary)

daram → I am (doing)
dari → You are (doing)
dare → He/She is (doing)
darim → We are (doing)
darid → You are (doing, formal)
daran → They are (doing)

## Full Example: raftan (to go)

daram miram → I am going (right now)
dari miri → You are going
dare mire → He/She is going
darim mirim → We are going
darid mirid → You are going (formal)
daran miran → They are going

## More Examples

daram mikhoram → I am eating (right now)
dari minevisi → You are writing
dare mikhoone → He/She is reading
darim kar mikonim → We are working

## Present vs Present Continuous

miram → I go (habitual/general)
daram miram → I am going (right now, at this moment)

mikhoram → I eat (generally)
daram mikhoram → I am eating (right now)

## Key Point

The "daashtan" auxiliary **must match** the subject. Both verbs conjugate for the same person.`,
      difficultyLevel: 2,
      sortOrder: 13,
    },
    exercises: [
      {
        exerciseType: "multiple_choice",
        question: "How do you say 'I am going (right now)' in Farsi?",
        correctAnswer: "daram miram",
        alternatives: JSON.stringify(["miram", "daram miram", "raftam", "khaaham raft"]),
        explanation: "'daram miram' = I am going right now (present continuous)",
        sortOrder: 1,
      },
      {
        exerciseType: "fill_blank",
        question: "Complete: ___ mikhoram (I am eating right now)",
        correctAnswer: "daram",
        hint: "The auxiliary 'daashtan' for 'I'",
        explanation: "'daram mikhoram' = I am eating right now",
        sortOrder: 2,
      },
      {
        exerciseType: "conjugation",
        question: "Say 'She is reading' using khandan (dare + ...)",
        correctAnswer: "dare mikhone",
        hint: "dare + mi + khon + e",
        explanation: "'dare mikhone' = She is reading right now",
        sortOrder: 3,
      },
      {
        exerciseType: "multiple_choice",
        question: "What is the difference between 'miram' and 'daram miram'?",
        correctAnswer: "miram is habitual, daram miram is right now",
        alternatives: JSON.stringify([
          "miram is habitual, daram miram is right now",
          "They mean the same thing",
          "miram is future, daram miram is past",
          "miram is formal, daram miram is informal",
        ]),
        explanation: "'miram' = I go (in general). 'daram miram' = I am going (at this moment)",
        sortOrder: 4,
      },
      {
        exerciseType: "translate",
        question: "Type 'We are working' (kar kardan) in present continuous",
        correctAnswer: "darim kar mikonim",
        hint: "darim + kar + mikonim",
        explanation: "'darim kar mikonim' = We are working right now",
        sortOrder: 5,
      },
    ],
  },

  // ─── G14: Past Continuous ────────────────────────────────────────
  {
    lesson: {
      title: "Lesson G14: Past Continuous",
      description: "Learn to describe ongoing actions in the past",
      icon: "⏪",
      explanation: `# Past Continuous (Imperfect) in Farsi

The past continuous describes actions that **were happening** at a point in the past. It uses the past tense of "daashtan" + the mi-verb.

## Formation

past "daashtan" + mi- + verb stem + ending

## Conjugation of "daashtan" (past auxiliary)

dashtam → I was (doing)
dashti → You were (doing)
dasht → He/She was (doing)
dashtim → We were (doing)
dashtid → You were (doing, formal)
dashtand → They were (doing)

## Full Example: raftan (to go)

dashtam miraftam → I was going
dashti mirafti → You were going
dasht miraft → He/She was going
dashtim miraftim → We were going
dashtid miraftid → You were going (formal)
dashtand miraftand → They were going

## More Examples

dashtam mikhordam → I was eating
dashti mineveshtí → You were writing
dasht mikhond → He/She was reading

## When to Use

Use past continuous for:
- Background actions: dashtam ghaza mikhordam ke telefon zang zad
  → I was eating when the phone rang
- Simultaneous past actions: dasht mirfat va harf mizad
  → He was walking and talking

## Past Continuous vs Simple Past

raftam → I went (completed action)
dashtam miraftam → I was going (ongoing in the past)

khordam → I ate (finished)
dashtam mikhordam → I was eating (in the middle of it)`,
      difficultyLevel: 3,
      sortOrder: 14,
    },
    exercises: [
      {
        exerciseType: "conjugation",
        question: "Say 'I was eating' using khordan",
        correctAnswer: "dashtam mikhordam",
        hint: "dashtam + mi + khord + am",
        explanation: "'dashtam mikhordam' = I was eating",
        sortOrder: 1,
      },
      {
        exerciseType: "multiple_choice",
        question: "How do you say 'She was reading' in Farsi?",
        correctAnswer: "dasht mikhond",
        alternatives: JSON.stringify(["dasht mikhond", "dare mikhone", "khond", "mikhonad"]),
        explanation: "'dasht mikhond' = She was reading (past continuous)",
        sortOrder: 2,
      },
      {
        exerciseType: "fill_blank",
        question: "Complete: ___ miraftam ke telefon zang zad (I was going when the phone rang)",
        correctAnswer: "dashtam",
        hint: "Past tense of 'daashtan' for 'I'",
        explanation: "'dashtam miraftam' = I was going",
        sortOrder: 3,
      },
      {
        exerciseType: "multiple_choice",
        question: "What is the difference between 'raftam' and 'dashtam miraftam'?",
        correctAnswer: "raftam = I went (done), dashtam miraftam = I was going (ongoing)",
        alternatives: JSON.stringify([
          "raftam = I went (done), dashtam miraftam = I was going (ongoing)",
          "They mean the same thing",
          "raftam is informal, dashtam miraftam is formal",
          "raftam is future, dashtam miraftam is present",
        ]),
        explanation: "Simple past = completed. Past continuous = was in progress.",
        sortOrder: 4,
      },
      {
        exerciseType: "translate",
        question: "Type 'We were working' in Farsi",
        correctAnswer: "dashtim kar mikordim",
        hint: "dashtim + kar + mikordim",
        explanation: "'dashtim kar mikordim' = We were working",
        sortOrder: 5,
      },
    ],
  },

  // ─── G15: Present Perfect ────────────────────────────────────────
  {
    lesson: {
      title: "Lesson G15: Present Perfect",
      description: "Learn to express completed actions with present relevance",
      icon: "✅",
      explanation: `# Present Perfect in Farsi

The present perfect describes actions that have been completed but are relevant to the present. Very common in spoken Farsi — often used instead of simple past.

## Formation

past participle (-e) + shortened boodan endings

## Past Participle

Take the past stem and add "-e":
raft → rafte (gone)
khord → khorde (eaten)
did → dide (seen)
goft → gofte (said)
nevesht → neveshte (written)

## Personal Endings

-am → I have
-i → You have
(nothing) → He/She has
-im → We have
-id → You have (formal)
-and → They have

## Full Example: raftan (to go)

rafte-am → I have gone
rafte-i → You have gone
rafte (ast) → He/She has gone
rafte-im → We have gone
rafte-id → You have gone (formal)
rafte-and → They have gone

## More Examples

khorde-am → I have eaten
dide-am → I have seen
gofte → He/She has said
neveshte-im → We have written

## Negative: na- + participle

narafte-am → I have not gone
nakhorde-am → I have not eaten
nadide-am → I have not seen

## Present Perfect vs Simple Past

In spoken Farsi, present perfect often replaces simple past:
raftam = I went (literary)
rafte-am = I have gone / I went (spoken)

Both are correct, but rafte-am is more common in conversation.`,
      difficultyLevel: 3,
      sortOrder: 15,
    },
    exercises: [
      {
        exerciseType: "conjugation",
        question: "Say 'I have gone' using raftan",
        correctAnswer: "rafte-am",
        hint: "past participle 'rafte' + am",
        explanation: "'rafte-am' = I have gone",
        sortOrder: 1,
      },
      {
        exerciseType: "multiple_choice",
        question: "What is the past participle of 'khordan' (to eat)?",
        correctAnswer: "khorde",
        alternatives: JSON.stringify(["khord", "khorde", "mikhoram", "bokhor"]),
        explanation: "Past stem 'khord' + '-e' = 'khorde'",
        sortOrder: 2,
      },
      {
        exerciseType: "fill_blank",
        question: "Complete: man in film raa ___ (I have seen this movie)",
        correctAnswer: "dide-am",
        hint: "Past participle of didan + am",
        explanation: "'dide-am' = I have seen",
        sortOrder: 3,
      },
      {
        exerciseType: "translate",
        question: "Type 'I have not eaten' in Farsi",
        correctAnswer: "nakhorde-am",
        hint: "na + khorde + am",
        explanation: "'nakhorde-am' = I have not eaten (negative present perfect)",
        sortOrder: 4,
      },
      {
        exerciseType: "multiple_choice",
        question: "How do you say 'They have gone' in Farsi?",
        correctAnswer: "rafte-and",
        alternatives: JSON.stringify(["rafte-am", "rafte-im", "rafte-and", "rafte-id"]),
        explanation: "'rafte-and' = They have gone",
        sortOrder: 5,
      },
    ],
  },

  // ─── G16: Past Perfect (Pluperfect) ──────────────────────────────
  {
    lesson: {
      title: "Lesson G16: Past Perfect (Pluperfect)",
      description: "Learn to describe actions completed before another past event",
      icon: "⏮️",
      explanation: `# Past Perfect (Pluperfect) in Farsi

The past perfect describes actions that **had been completed** before another past event. "I had already eaten when he arrived."

## Formation

past participle + past tense of boodan

## Past Tense of Boodan (to be)

boodam → I was
boodi → You were
bood → He/She was
boodim → We were
boodid → You were (formal)
boodand → They were

## Full Example: raftan (to go)

rafte boodam → I had gone
rafte boodi → You had gone
rafte bood → He/She had gone
rafte boodim → We had gone
rafte boodid → You had gone (formal)
rafte boodand → They had gone

## More Examples

khorde boodam → I had eaten
dide bood → He/She had seen
neveshte boodim → We had written

## When to Use

Use past perfect for events that happened before another past event:

ghazaa raa khorde boodam ke oo aamad
→ I had eaten when he/she arrived

ghabl az inke beri, man rafte boodam
→ Before you went, I had (already) gone

## Negative

narafte boodam → I had not gone
nakhorde bood → He/She had not eaten

## Past Perfect vs Present Perfect

rafte-am → I have gone (relevant now)
rafte boodam → I had gone (before another past event)`,
      difficultyLevel: 3,
      sortOrder: 16,
    },
    exercises: [
      {
        exerciseType: "conjugation",
        question: "Say 'I had gone' using raftan",
        correctAnswer: "rafte boodam",
        hint: "past participle 'rafte' + boodam",
        explanation: "'rafte boodam' = I had gone",
        sortOrder: 1,
      },
      {
        exerciseType: "multiple_choice",
        question: "How do you say 'She had seen' in Farsi?",
        correctAnswer: "dide bood",
        alternatives: JSON.stringify(["dide-am", "dide bood", "dide boodam", "dide-and"]),
        explanation: "'dide bood' = She had seen (3rd person past perfect)",
        sortOrder: 2,
      },
      {
        exerciseType: "fill_blank",
        question: "Complete: man ghazaa raa khorde ___ ke oo aamad (I had eaten when he arrived)",
        correctAnswer: "boodam",
        hint: "Past tense of boodan for 'I'",
        explanation: "'khorde boodam' = I had eaten",
        sortOrder: 3,
      },
      {
        exerciseType: "translate",
        question: "Type 'We had written' in Farsi",
        correctAnswer: "neveshte boodim",
        hint: "neveshte + boodim",
        explanation: "'neveshte boodim' = We had written",
        sortOrder: 4,
      },
      {
        exerciseType: "multiple_choice",
        question: "What tense is 'rafte boodam'?",
        correctAnswer: "Past perfect (I had gone)",
        alternatives: JSON.stringify([
          "Simple past (I went)",
          "Present perfect (I have gone)",
          "Past perfect (I had gone)",
          "Future (I will go)",
        ]),
        explanation: "Past participle + past boodan = past perfect",
        sortOrder: 5,
      },
    ],
  },

  // ─── G17: Simple Future ──────────────────────────────────────────
  {
    lesson: {
      title: "Lesson G17: Simple Future",
      description: "Learn to talk about future events in Farsi",
      icon: "🔮",
      explanation: `# Simple Future in Farsi

The future tense has two forms: a formal/literary form and a more common spoken form.

## Formal Future: khaahd + past stem

khaaham + past stem → I will
khaahi + past stem → You will
khaahad + past stem → He/She will
khaahim + past stem → We will
khaahid + past stem → You will (formal)
khaahnd + past stem → They will

## Example: raftan (to go)

khaaham raft → I will go
khaahi raft → You will go
khaahad raft → He/She will go
khaahim raft → We will go
khaahid raft → You will go (formal)
khaahnd raft → They will go

## More Formal Examples

khaaham khord → I will eat
khaahad did → He/She will see
khaahim nevesht → We will write

## Spoken Future (More Common)

In everyday speech, Iranians use "mikhaam" + subjunctive:

mikhaam beram → I'm going to go / I will go
mikhaay beri → You will go
mikhaad bere → He/She will go
mikhaym berim → We will go

## Negative Future

Formal: nakhaaham raft → I will not go
Spoken: nemikhaaam beram → I won't go

## When to Use Which

- Formal future (khaahd): news, writing, formal speeches, promises
- Spoken future (mikhaam): daily conversation, casual plans

## Examples in Context

farda khaaham aamad → I will come tomorrow (formal)
farda mikhaam biam → I'll come tomorrow (spoken)
ma khaahim dido → We will see (formal)
ma mikhaaym bebinim → We'll see (spoken)`,
      difficultyLevel: 3,
      sortOrder: 17,
    },
    exercises: [
      {
        exerciseType: "conjugation",
        question: "Say 'I will go' (formal) using raftan",
        correctAnswer: "khaaham raft",
        hint: "khaaham + past stem 'raft'",
        explanation: "'khaaham raft' = I will go (formal future)",
        sortOrder: 1,
      },
      {
        exerciseType: "multiple_choice",
        question: "What is the more common spoken way to say 'I will go'?",
        correctAnswer: "mikhaam beram",
        alternatives: JSON.stringify(["khaaham raft", "mikhaam beram", "miravam", "raftam"]),
        explanation: "'mikhaam beram' is the spoken/informal future (using subjunctive)",
        sortOrder: 2,
      },
      {
        exerciseType: "fill_blank",
        question: "Complete: man farda ___ raft (I will go tomorrow, formal)",
        correctAnswer: "khaaham",
        hint: "Future auxiliary for 'I'",
        explanation: "'khaaham raft' = I will go",
        sortOrder: 3,
      },
      {
        exerciseType: "translate",
        question: "Type 'I will not go' (formal) in Farsi",
        correctAnswer: "nakhaaham raft",
        hint: "na + khaaham + raft",
        explanation: "'nakhaaham raft' = I will not go (formal negative future)",
        sortOrder: 4,
      },
      {
        exerciseType: "multiple_choice",
        question: "When is 'khaaham raft' typically used instead of 'mikhaam beram'?",
        correctAnswer: "In formal writing and speeches",
        alternatives: JSON.stringify([
          "In daily conversation",
          "In formal writing and speeches",
          "Only with friends",
          "Only for questions",
        ]),
        explanation: "The formal future (khaaham + stem) is used in writing, news, and formal contexts",
        sortOrder: 5,
      },
    ],
  },
];

async function main() {
  console.log("Seeding grammar verb tense lessons (G13-G17)...\n");

  try {
    let createdCount = 0;

    for (const data of lessonsData) {
      // Check if lesson already exists by title
      const existing = await db
        .select()
        .from(grammarLessons)
        .where(eq(grammarLessons.title, data.lesson.title));

      if (existing.length > 0) {
        console.log(`  Exists: ${data.lesson.title}`);
        continue;
      }

      // Insert lesson
      const [lesson] = await db
        .insert(grammarLessons)
        .values(data.lesson)
        .returning();

      // Insert exercises
      for (const exercise of data.exercises) {
        await db.insert(grammarExercises).values({
          grammarLessonId: lesson.id,
          ...exercise,
        });
      }

      console.log(`  Created: ${data.lesson.title} (${data.exercises.length} exercises)`);
      createdCount++;
    }

    console.log("\n" + "=".repeat(50));
    console.log("GRAMMAR TENSES SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log(`\nLessons created: ${createdCount}`);
    console.log(`Exercises created: ${createdCount * 5}\n`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
