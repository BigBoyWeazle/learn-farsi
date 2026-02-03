import { NextResponse } from "next/server";
import { db } from "@/db";
import { grammarLessons, grammarExercises } from "@/db/schema";

/**
 * POST /api/admin/seed-grammar-expanded
 * Seed expanded grammar lessons from the Google Doc content
 * All exercises use PHONETIC Farsi (Latin script)
 */
export async function POST() {
  try {
    // Check if lessons already exist
    const existingLessons = await db.select().from(grammarLessons).limit(1);
    if (existingLessons.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Grammar lessons already exist. Clear them first to re-seed.",
      });
    }

    const lessonsData = [
      // Lesson G1: Personal Pronouns
      {
        lesson: {
          title: "Lesson G1: Personal Pronouns",
          description: "Learn the personal pronouns in Farsi - the foundation of every sentence",
          icon: "👤",
          explanation: `# Personal Pronouns in Farsi

Personal pronouns are essential for building sentences in Farsi. Unlike English, Farsi pronouns don't change based on whether they're subjects or objects.

## The Six Personal Pronouns

man → I
to → You (informal/singular)
u (oo) → He/She/It
ma → We
shoma → You (formal/plural)
anha (oonha) → They

## Key Points

- Farsi has no gender distinction - "u" means both "he" and "she"
- "shoma" is used for politeness OR when addressing multiple people
- "Ishoon" is the polite way of saying "they"
- In casual speech, pronouns are often dropped because verb endings indicate the subject

## Examples

man irani hastam → I am Iranian
to khubi? → Are you well?
u daaneshjo ast → He/She is a student
ma irani hastim → We are Iranian
shoma chetori hastid? → How are you? (formal)
anha doost hastand → They are friends`,
          difficultyLevel: 1,
          sortOrder: 1,
        },
        exercises: [
          {
            exerciseType: "multiple_choice",
            question: "What is the Farsi word for 'I'?",
            correctAnswer: "man",
            alternatives: JSON.stringify(["man", "to", "u", "ma"]),
            explanation: "'man' means 'I' in Farsi",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "Which pronoun means 'they' in Farsi?",
            correctAnswer: "anha",
            alternatives: JSON.stringify(["shoma", "ma", "anha", "u"]),
            explanation: "'anha' (or 'oonha') is the plural third-person pronoun meaning 'they'",
            sortOrder: 2,
          },
          {
            exerciseType: "translate",
            question: "Type the Farsi word for 'we'",
            correctAnswer: "ma",
            hint: "It's a short two-letter word",
            explanation: "'ma' means 'we' in Farsi",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "Which pronoun would you use to politely address your teacher?",
            correctAnswer: "shoma",
            alternatives: JSON.stringify(["to", "u", "shoma", "man"]),
            explanation: "'shoma' is used for formal/polite address",
            sortOrder: 4,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: ___ daaneshjo hastam (I am a student)",
            correctAnswer: "man",
            hint: "The pronoun for 'I'",
            explanation: "'man' is 'I' - 'man daaneshjo hastam' means 'I am a student'",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G2: The Verb "To Be"
      {
        lesson: {
          title: "Lesson G2: The Verb 'To Be' (Boodan)",
          description: "Master the most important verb in Farsi - boodan (to be)",
          icon: "✨",
          explanation: `# The Verb "To Be" in Farsi

The verb "to be" (boodan) is the most essential verb in Farsi. It conjugates differently in the present tense.

## Present Tense Conjugation

man hastam → I am
to hasti → You are (informal)
u ast/hast → He/She/It is
ma hastim → We are
shoma hastid → You are (formal/plural)
anha hastand → They are

## Negative Form (Nist)

man nistam → I am not
to nisti → You are not
u nist → He/She is not
ma nistim → We are not
shoma nistid → You are not (formal)
anha nistand → They are not

## Difference: ast vs hast

- "ast" = is (describing something)
- "hast" = there is / exists

Examples:
- in ketaab ast → This is a book
- ketaab hast → There is a book

## Short Forms (Common in Speech)

hastam → -am (e.g., irani-am = I am Iranian)
hasti → -i
ast → -e or ast

## Examples

man khoshhaal hastam → I am happy
to daaneshjo hasti → You are a student
in ketaab ast → This is a book
ma irani hastim → We are Iranian`,
          difficultyLevel: 1,
          sortOrder: 2,
        },
        exercises: [
          {
            exerciseType: "conjugation",
            question: "Conjugate 'boodan' (to be) for 'man' (I am)",
            correctAnswer: "hastam",
            hint: "Starts with 'h'",
            explanation: "'man hastam' = I am",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is 'You are' (informal) in Farsi?",
            correctAnswer: "hasti",
            alternatives: JSON.stringify(["hastam", "hasti", "ast", "hastim"]),
            explanation: "'to hasti' = You are (informal)",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: u daaneshjo ___ (He/She is a student)",
            correctAnswer: "ast",
            hint: "The 'to be' form for he/she",
            explanation: "'ast' is the third-person singular form",
            sortOrder: 3,
          },
          {
            exerciseType: "translate",
            question: "Complete: ma khoshhaal ___ (We are happy)",
            correctAnswer: "hastim",
            hint: "The 'to be' form for 'we'",
            explanation: "'ma khoshhaal hastim' = We are happy",
            sortOrder: 4,
          },
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'I am not' in Farsi?",
            correctAnswer: "nistam",
            alternatives: JSON.stringify(["hastam", "nistam", "nist", "nistand"]),
            explanation: "'man nistam' = I am not",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G3: Present Tense with Mi- Prefix
      {
        lesson: {
          title: "Lesson G3: Present Tense (Mi- Prefix)",
          description: "Learn how to form present tense verbs with the 'mi' prefix",
          icon: "🔄",
          explanation: `# Present Tense in Farsi

The present tense (also called present continuous) in Farsi is formed by adding "mi" before the verb stem, plus personal endings.

## Formation

mi + verb stem + personal ending

## Personal Endings

man: -am
to: -i
u: -ad (or -e in spoken)
ma: -im
shoma: -id
anha: -and

## Example: raftan (to go)

Verb stem: rav

miravam → I go / I am going
miravi → You go
miravad → He/She goes
miravim → We go
miravid → You go (formal)
miravand → They go

## More Examples

khordan (to eat) → stem: khor
mikhoram → I eat
mikhori → You eat
mikhorad → He/She eats

didan (to see) → stem: bin
mibinam → I see
mibini → You see
mibine → He/She sees

goftan (to say) → stem: gu/go
miguyam → I say
miguyi → You say
miguyad → He/She says

## Important Note

The "mi-" prefix indicates ongoing or habitual action in the present.`,
          difficultyLevel: 1,
          sortOrder: 3,
        },
        exercises: [
          {
            exerciseType: "multiple_choice",
            question: "What prefix is used for present tense in Farsi?",
            correctAnswer: "mi",
            alternatives: JSON.stringify(["mi", "na", "be", "kho"]),
            explanation: "'mi' is the present tense prefix in Farsi",
            sortOrder: 1,
          },
          {
            exerciseType: "conjugation",
            question: "Conjugate 'raftan' (to go) for 'I go'",
            correctAnswer: "miravam",
            hint: "mi + rav + am",
            explanation: "'miravam' = I go",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: u be madrese ___ (He goes to school)",
            correctAnswer: "miravad",
            hint: "Present tense of 'raftan' for 'u'",
            explanation: "'miravad' is the third-person form",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is 'They eat' in Farsi?",
            correctAnswer: "mikhorand",
            alternatives: JSON.stringify(["mikhoram", "mikhori", "mikhorad", "mikhorand"]),
            explanation: "'mikhorand' = They eat",
            sortOrder: 4,
          },
          {
            exerciseType: "translate",
            question: "Type 'We see' in Farsi (using didan → bin)",
            correctAnswer: "mibinim",
            hint: "mi + bin + im",
            explanation: "'mibinim' = We see",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G4: Negative Verbs
      {
        lesson: {
          title: "Lesson G4: Negative Verbs",
          description: "Learn how to make verbs negative in Farsi",
          icon: "🚫",
          explanation: `# Negative Verbs in Farsi

Negating verbs in Farsi is done by adding a negative prefix. The prefix changes slightly depending on the tense.

## Present Tense Negative: ne- or na-

Replace "mi-" with "ne-" (or "nemi-"):

miravam → nemiravam (I don't go)
mikhoram → nemikhoram (I don't eat)

## "To Be" Negative: nist-

hastam → nistam (I am not)
hasti → nisti (You are not)
ast → nist (is not)

## "To Have" Negative: Special Case

daaram → nadaaram (I don't have)
Note: "daashtan" uses "na-" not "ne-"

## Past Tense Negative: na-

raftam → naraftam (I didn't go)
khordam → nakhordam (I didn't eat)

## Examples

man nemiravam → I am not going / I don't go
to nadaari → You don't have
u nist → He/She is not
ma nemikhorim → We don't eat
anha naraftand → They didn't go

## Key Points

- Present: Replace "mi-" with "nemi-" or add "ne-" before "mi-"
- Past: Add "na-" before the verb
- Exception: "daashtan" (to have) always uses "na-"`,
          difficultyLevel: 1,
          sortOrder: 4,
        },
        exercises: [
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'I don't go' in Farsi?",
            correctAnswer: "nemiravam",
            alternatives: JSON.stringify(["nemiravam", "miravam", "naravam", "miram"]),
            explanation: "Add 'ne-' before 'mi-' to negate: nemiravam",
            sortOrder: 1,
          },
          {
            exerciseType: "translate",
            question: "Type 'I don't have' in Farsi",
            correctAnswer: "nadaaram",
            hint: "daashtan uses 'na-' prefix",
            explanation: "'nadaaram' = I don't have (exception: uses 'na-' not 'ne-')",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: u ___ (He/She is not)",
            correctAnswer: "nist",
            hint: "Negative of 'ast'",
            explanation: "'nist' is the negative of 'ast' (is not)",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is 'We don't eat' in Farsi?",
            correctAnswer: "nemikhorim",
            alternatives: JSON.stringify(["mikhorim", "nemikhorim", "nakhorim", "mikhorand"]),
            explanation: "'nemikhorim' = We don't eat",
            sortOrder: 4,
          },
          {
            exerciseType: "conjugation",
            question: "Make negative: 'man hastam' (I am)",
            correctAnswer: "nistam",
            hint: "Replace 'hast-' with 'nist-'",
            explanation: "'man nistam' = I am not",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G5: Possessive Suffixes
      {
        lesson: {
          title: "Lesson G5: Possessive Suffixes",
          description: "Learn how to show possession in Farsi using suffixes",
          icon: "👜",
          explanation: `# Possessive Suffixes in Farsi

In Farsi, you can show possession by adding suffixes directly to nouns. This is very common in spoken Farsi.

## Possessive Suffixes

-am → my
-et → your (informal)
-esh → his/her/its
-emoon → our
-etoon → your (formal/plural)
-eshoon → their

## Examples with "khodkaar" (pen)

khodkaar-am → my pen
khodkaar-et → your pen
khodkaar-esh → his/her pen
khodkaar-emoon → our pen
khodkaar-etoon → your pen (formal)
khodkaar-eshoon → their pen

## Alternative: Using "maal-e" (belongs to)

You can also use "maal-e" + pronoun:
maal-e man → mine
maal-e to → yours
maal-e u → his/hers

Example: in ketaab maal-e man ast → This book is mine

## Formal Form with "-e"

ketaab-e man → my book
khoone-ye to → your house (after vowel, add -ye)

## Important Notes

- After vowels, add "-y" before the suffix: baba-yam (my dad)
- The suffix form is more casual/spoken
- The "maal-e" form emphasizes ownership`,
          difficultyLevel: 2,
          sortOrder: 5,
        },
        exercises: [
          {
            exerciseType: "translate",
            question: "Type 'my book' using the suffix form",
            correctAnswer: "ketaab-am",
            hint: "Add -am to ketaab",
            explanation: "ketaab + am = ketaab-am (my book)",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'your pen' (informal) in Farsi?",
            correctAnswer: "khodkaar-et",
            alternatives: JSON.stringify(["khodkaar-am", "khodkaar-et", "khodkaar-esh", "khodkaar-emoon"]),
            explanation: "'-et' is the suffix for 'your' (informal)",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: khoone-___ bozorg ast (Our house is big)",
            correctAnswer: "emoon",
            hint: "The suffix for 'our'",
            explanation: "khoone-emoon = our house",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "What does 'maal-e man' mean?",
            correctAnswer: "mine",
            alternatives: JSON.stringify(["mine", "yours", "his", "ours"]),
            explanation: "'maal-e man' = mine (belongs to me)",
            sortOrder: 4,
          },
          {
            exerciseType: "translate",
            question: "Type 'their car' using suffix",
            correctAnswer: "maashin-eshoon",
            hint: "maashin + eshoon",
            explanation: "maashin-eshoon = their car",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G6: Plural Forms
      {
        lesson: {
          title: "Lesson G6: Plural Forms (-haa)",
          description: "Learn how to make nouns plural in Farsi",
          icon: "👥",
          explanation: `# Plural Forms in Farsi

Making nouns plural in Farsi is straightforward - just add the suffix "-haa".

## Basic Rule

Add "-haa" to any noun to make it plural:

ketaab → ketaab-haa (books)
toop → toop-haa (balls)
doost → doost-haa (friends)

## Examples

gorbe-haa → cats
sag-haa → dogs
bach'e-haa → children/guys
khoone-haa → houses

## Important Exception

If a number is already describing the subject, you don't need "-haa":

fasl-haa → seasons (no number)
chaar fasl → four seasons (number present, no -haa needed)

yek ketaab → one book
do ketaab → two books (not do ketaab-haa)

## Counting Units

When counting, use special units:
- "daane" for single item: yek daane naan (one bread)
- "taa" for multiple items: do taa naan (two breads)
- "nafar" for people: se nafar (three people)

## Examples with Numbers

yek nafar → one person
do taa sib → two apples
se taa ketaab → three books
chand taa? → how many?`,
          difficultyLevel: 2,
          sortOrder: 6,
        },
        exercises: [
          {
            exerciseType: "translate",
            question: "Type 'books' in Farsi",
            correctAnswer: "ketaab-haa",
            hint: "ketaab + haa",
            explanation: "ketaab-haa = books",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'two apples' in Farsi?",
            correctAnswer: "do taa sib",
            alternatives: JSON.stringify(["do taa sib", "do sib-haa", "do taa sib-haa", "dovvom sib"]),
            explanation: "With numbers, use 'taa' and no '-haa' suffix",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: se ___ (three people)",
            correctAnswer: "nafar",
            hint: "Unit for counting people",
            explanation: "'nafar' is used to count people",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "Which is correct for 'children'?",
            correctAnswer: "bach'e-haa",
            alternatives: JSON.stringify(["bach'e", "bach'e-haa", "bach'e-i", "bach'e-yam"]),
            explanation: "bach'e-haa = children (plural)",
            sortOrder: 4,
          },
          {
            exerciseType: "translate",
            question: "Type 'one bread' in Farsi",
            correctAnswer: "yek daane naan",
            hint: "Use 'daane' for single items",
            explanation: "yek daane naan = one bread",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G7: Comparative & Superlative
      {
        lesson: {
          title: "Lesson G7: Comparative & Superlative",
          description: "Learn how to compare things in Farsi using -tar and -tarin",
          icon: "📊",
          explanation: `# Comparative & Superlative in Farsi

Farsi uses simple suffixes to create comparative and superlative forms.

## Comparative: -tar

Add "-tar" to make "more" or "-er":

bozorg → bozorg-tar (bigger)
koochak → koochak-tar (smaller)
khoob → behtar (better - irregular)
bad → badtar (worse)
zibaa → zibaa-tar (more beautiful)

## Superlative: -tarin

Add "-tarin" to make "most" or "-est":

bozorg → bozorg-tarin (biggest)
koochak → koochak-tarin (smallest)
khoob → behtarin (best - irregular)
khoshmazze → khoshmazze-tarin (most delicious)

## Using Comparatives

Use "az" (than) for comparisons:

ketaab-e aabi bozorg-tar az ketaab-e ghermez ast
→ The blue book is bigger than the red book

man az to bozorg-tar hastam
→ I am older/bigger than you

## Using Superlatives

Superlatives often come before the noun:

behtarin doost-am → my best friend
bozorg-tarin shahr → the biggest city

Or after with emphasis:
Tah Dig khoshmazze-tarin ghazaa ast!
→ Tah Dig is the most delicious food!`,
          difficultyLevel: 2,
          sortOrder: 7,
        },
        exercises: [
          {
            exerciseType: "translate",
            question: "Type 'bigger' in Farsi",
            correctAnswer: "bozorg-tar",
            hint: "bozorg + tar",
            explanation: "bozorg-tar = bigger",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'best' in Farsi?",
            correctAnswer: "behtarin",
            alternatives: JSON.stringify(["khoob-tarin", "behtarin", "behtar", "khoob-tar"]),
            explanation: "'behtarin' = best (irregular from 'khoob')",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: in ghazaa khoshmazze-___ ast (This food is the most delicious)",
            correctAnswer: "tarin",
            hint: "Superlative suffix",
            explanation: "khoshmazze-tarin = most delicious",
            sortOrder: 3,
          },
          {
            exerciseType: "translate",
            question: "Type 'smaller' in Farsi",
            correctAnswer: "koochak-tar",
            hint: "koochak + tar",
            explanation: "koochak-tar = smaller",
            sortOrder: 4,
          },
          {
            exerciseType: "multiple_choice",
            question: "What word means 'than' in Farsi comparisons?",
            correctAnswer: "az",
            alternatives: JSON.stringify(["az", "ba", "be", "ta"]),
            explanation: "'az' = than (used in comparisons)",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G8: Word Building Suffixes
      {
        lesson: {
          title: "Lesson G8: Word Building Suffixes",
          description: "Learn common suffixes to build new words in Farsi",
          icon: "🔨",
          explanation: `# Word Building Suffixes in Farsi

Farsi uses many suffixes to create new words from existing ones.

## Diminutive: -che (small/little)

Add "-che" to make something smaller or cuter:

daftar → daftar-che (little notebook)
baagh → baagh-che (garden, lit. little orchard)
kooche → small alley (from kooch)

## Place Suffix: -gah or -estaan

"-gah" creates a place:
daan (knowledge) → daanesh-gah (university)
aamooz (learning) → aamoozesh-gah (institute)

"-estaan" creates a location/land:
bimaar (patient) → bimaar-estaan (hospital)
gorbe (cat) → gorbe-staan (cat shelter/land of cats)

## With/Without: baa- / bi-

"baa-" means with:
adab (etiquette) → baa-adab (polite/with manners)
namak (salt) → baa-namak (cute, lit. with salt)

"bi-" means without:
adab → bi-adab (impolite/without manners)
kaar → bi-kaar (unemployed/without work)

## Person Suffix: -gar, -chi, -kaar

Creates person who does something:
kaar (work) → kaar-gar (worker)
aashpaz (cooking) → aashpaz (cook, from aash + paz)

## Examples

bimaar-estaan → hospital (place of patients)
kaar-khaane → factory (work house)
ketaab-khaane → library (book house)`,
          difficultyLevel: 2,
          sortOrder: 8,
        },
        exercises: [
          {
            exerciseType: "translate",
            question: "What does 'daftar-che' mean?",
            correctAnswer: "little notebook",
            hint: "-che makes it smaller",
            explanation: "daftar-che = little notebook (diminutive)",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "What does 'bi-kaar' mean?",
            correctAnswer: "unemployed",
            alternatives: JSON.stringify(["working", "unemployed", "busy", "tired"]),
            explanation: "bi- = without, kaar = work, so bi-kaar = without work/unemployed",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: bimaar-___ (hospital)",
            correctAnswer: "estaan",
            hint: "Place suffix for locations",
            explanation: "bimaar-estaan = hospital (place of patients)",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "What does 'baa-adab' mean?",
            correctAnswer: "polite",
            alternatives: JSON.stringify(["impolite", "polite", "quiet", "loud"]),
            explanation: "baa- = with, adab = manners, so baa-adab = polite",
            sortOrder: 4,
          },
          {
            exerciseType: "translate",
            question: "What is a 'daanesh-gah'?",
            correctAnswer: "university",
            hint: "daanesh = knowledge, -gah = place",
            explanation: "daanesh-gah = university (place of knowledge)",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G9: Imperative (Commands)
      {
        lesson: {
          title: "Lesson G9: Imperative (Commands)",
          description: "Learn how to give commands and make requests in Farsi",
          icon: "📢",
          explanation: `# Imperative (Commands) in Farsi

Imperatives are used to give commands or make requests.

## Formation

Add prefix "be-" or "bo-" to the verb stem:

If first vowel is "o", use "bo-":
khordan (to eat) → stem: khor → bokhor (eat!)

Otherwise use "be-":
raftan (to go) → stem: rav → berav or boro (go!)
didan (to see) → stem: bin → bebin (look!)

## Informal (to) vs Formal (shomaa)

Informal (to):
bebin → look!
bokhor → eat!
begoo → say!

Formal (shomaa) - add "-id":
bebinid → look! (formal)
bokhorid → eat! (formal)
beguid → say! (formal)

## Exceptions

kardan (to do) → kon (not bekon)
shodan (to become) → sho (not besho)

These can be used alone without "be-":
to kon → you do!
to sho → you become!

## Negative Imperative

Replace "be-" with "na-":
bebin → nabin (don't look!)
bokhor → nakhor (don't eat!)
begoo → nagoo (don't say!)

## Polite Requests

Use "lotfan" (please) to soften commands:
lotfan befarmaayid → please, go ahead
lotfan benshinid → please sit down`,
          difficultyLevel: 2,
          sortOrder: 9,
        },
        exercises: [
          {
            exerciseType: "translate",
            question: "Type 'eat!' (informal command)",
            correctAnswer: "bokhor",
            hint: "bo- + khor",
            explanation: "bokhor = eat! (first vowel is 'o', so use 'bo-')",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'look!' in Farsi?",
            correctAnswer: "bebin",
            alternatives: JSON.stringify(["bebin", "nebin", "mibinam", "didam"]),
            explanation: "bebin = look! (be- + bin)",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: ___ (don't eat!)",
            correctAnswer: "nakhor",
            hint: "Negative imperative: replace 'bo-' with 'na-'",
            explanation: "nakhor = don't eat! (na- + khor)",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is the formal imperative of 'didan' (to see)?",
            correctAnswer: "bebinid",
            alternatives: JSON.stringify(["bebin", "bebinid", "mibinid", "didid"]),
            explanation: "bebinid = look! (formal, with -id suffix)",
            sortOrder: 4,
          },
          {
            exerciseType: "translate",
            question: "Type 'do!' (informal command from 'kardan')",
            correctAnswer: "kon",
            hint: "kardan is an exception - no 'be-' needed",
            explanation: "kon = do! (kardan/shodan drop the 'be-' prefix)",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G10: Past Tense
      {
        lesson: {
          title: "Lesson G10: Past Tense",
          description: "Learn how to talk about the past in Farsi",
          icon: "⏮️",
          explanation: `# Past Tense in Farsi

The past tense is formed using the past stem of the verb plus personal endings.

## Finding the Past Stem

Take the infinitive and remove "-an":
raftan → raft (went)
khordan → khord (ate)
didan → did (saw)
goftan → goft (said)

## Personal Endings (Past)

man: -am
to: -i
u: (nothing)
ma: -im
shoma: -id
anha: -and

## Conjugation Example: raftan (to go)

man raftam → I went
to rafti → You went
u raft → He/She went
ma raftim → We went
shoma raftid → You went (formal)
anha raftand → They went

## More Examples

khordam → I ate
khordim → We ate
goftam → I said
didam → I saw

## Negative Past: na-

Add "na-" before the verb:
raftam → naraftam (I didn't go)
khordam → nakhordam (I didn't eat)
goftam → nagoftam (I didn't say)

## Important Note

The verb "boodan" (to be) in past:
man boodam → I was
to boodi → You were
u bood → He/She was`,
          difficultyLevel: 2,
          sortOrder: 10,
        },
        exercises: [
          {
            exerciseType: "conjugation",
            question: "Conjugate 'raftan' (to go) for 'I went'",
            correctAnswer: "raftam",
            hint: "Past stem 'raft' + am",
            explanation: "raftam = I went",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is 'He/She ate' in Farsi?",
            correctAnswer: "khord",
            alternatives: JSON.stringify(["khordam", "khordi", "khord", "khordim"]),
            explanation: "Third person has no ending: u khord = He/She ate",
            sortOrder: 2,
          },
          {
            exerciseType: "translate",
            question: "Type 'I didn't go' in Farsi",
            correctAnswer: "naraftam",
            hint: "na- + raftam",
            explanation: "naraftam = I didn't go (negative past)",
            sortOrder: 3,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: ma ghazaa ___ (We ate food)",
            correctAnswer: "khordim",
            hint: "Past tense of khordan for 'ma'",
            explanation: "khordim = we ate",
            sortOrder: 4,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is 'I was' in Farsi?",
            correctAnswer: "boodam",
            alternatives: JSON.stringify(["hastam", "boodam", "boodim", "bood"]),
            explanation: "boodam = I was (past of boodan)",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G11: Subjunctive Mood
      {
        lesson: {
          title: "Lesson G11: Subjunctive Mood",
          description: "Learn when and how to use the subjunctive in Farsi",
          icon: "💭",
          explanation: `# Subjunctive Mood in Farsi

The subjunctive is used after certain words to express possibility, desire, or necessity.

## Formation

be- + verb stem + conjugation

Example with khordan (to eat):
bekhoram → that I eat
bekhori → that you eat
bekhore → that he/she eat

## When to Use Subjunctive

After "baayad" (should/must):
man baayad bekhoram → I should eat
to baayad beravi → You should go

After "mikhaad" (want to):
man mikhaam bekhaanam → I want to read
u mikhaad bekhore → He wants to eat

After "age" (if):
age biaay, khoshhaal misham → If you come, I'll be happy

After "shaayad" (maybe):
shaayad biaayad → Maybe he'll come

After "fekr mikonam" (I think):
fekr mikonam biaaad → I think he'll come

## Negative Subjunctive

Replace "be-" with "na-":
bekhoram → nakhoram (that I don't eat)
beravi → naravi (that you don't go)

## Examples

baayad bekhaanam → I should study
mikhaaam beram → I want to go
shaayad biaayad → Maybe he'll come
age bishini, behtar ast → If you sit, it's better

## Note on kardan/shodan

kardan → konam (not bekonam)
shodan → shavam (no 'be-' in formal)`,
          difficultyLevel: 3,
          sortOrder: 11,
        },
        exercises: [
          {
            exerciseType: "fill_blank",
            question: "Complete: man baayad ___ (I should eat)",
            correctAnswer: "bekhoram",
            hint: "be- + khor + am",
            explanation: "bekhoram = that I eat (subjunctive)",
            sortOrder: 1,
          },
          {
            exerciseType: "multiple_choice",
            question: "Which word triggers the subjunctive?",
            correctAnswer: "baayad",
            alternatives: JSON.stringify(["baayad", "dirooz", "hamishe", "kheyli"]),
            explanation: "'baayad' (should/must) requires subjunctive after it",
            sortOrder: 2,
          },
          {
            exerciseType: "translate",
            question: "Type 'I want to go' in Farsi",
            correctAnswer: "mikhaam beram",
            hint: "mikhaam + be + rav + am",
            explanation: "mikhaam beram = I want to go",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "What is 'maybe he'll come' in Farsi?",
            correctAnswer: "shaayad biaayad",
            alternatives: JSON.stringify(["shaayad biaayad", "shaayad aamad", "shaayad miaaad", "hatman miaaad"]),
            explanation: "shaayad biaayad = maybe he'll come (subjunctive after shaayad)",
            sortOrder: 4,
          },
          {
            exerciseType: "conjugation",
            question: "Make subjunctive: 'that you go' (to beravi)",
            correctAnswer: "beravi",
            hint: "be- + rav + i",
            explanation: "beravi = that you go",
            sortOrder: 5,
          },
        ],
      },

      // Lesson G12: Word Order
      {
        lesson: {
          title: "Lesson G12: Word Order",
          description: "Learn the basic sentence structure in Farsi",
          icon: "📝",
          explanation: `# Word Order in Farsi

Farsi follows Subject-Object-Verb (SOV) order, different from English (SVO).

## Basic Structure

Subject + Object + Verb

English: I eat food (SVO)
Farsi: man ghazaa mikhoram (SOV)
Literally: I food eat

## Examples

man ketaab mikhaanam → I book read (I read a book)
to chai mikhori → You tea drink (You drink tea)
u be madrese miravad → He to school goes (He goes to school)

## Verb Always at the End

The verb typically comes at the very end of the sentence:

man emrooz be khoone miram
→ I today to home go (I'm going home today)

## Object Marker: "raa" (or "ro")

When the object is specific/definite, add "raa":
man ketaab raa mikhaanam → I read THE book
man oon ghazaa raa doost daaram → I like THAT food

Without raa = general:
man ketaab mikhaanam → I read (a) book

## Connecting Words with "-e" (ezaafe)

Connect nouns to adjectives/possessives:
ketaab-e bozorg → big book (book of big)
khoone-ye man → my house (house of me)
maashin-e ghermez → red car

After consonants: -e
After vowels: -ye

## Adjective Order

Adjectives come AFTER the noun:
ketaab-e aabi-ye bozorg → The big blue book
(book-of blue-of big)

Last adjective doesn't need connector.`,
          difficultyLevel: 3,
          sortOrder: 12,
        },
        exercises: [
          {
            exerciseType: "multiple_choice",
            question: "What is the basic word order in Farsi?",
            correctAnswer: "Subject-Object-Verb",
            alternatives: JSON.stringify(["Subject-Verb-Object", "Subject-Object-Verb", "Verb-Subject-Object", "Object-Subject-Verb"]),
            explanation: "Farsi uses SOV order: Subject-Object-Verb",
            sortOrder: 1,
          },
          {
            exerciseType: "translate",
            question: "Rearrange for Farsi: 'I read a book'",
            correctAnswer: "man ketaab mikhaanam",
            hint: "Subject + Object + Verb",
            explanation: "man ketaab mikhaanam = I book read",
            sortOrder: 2,
          },
          {
            exerciseType: "fill_blank",
            question: "Complete: man ghazaa ___ doost daaram (I like THAT food)",
            correctAnswer: "raa",
            hint: "Object marker for specific things",
            explanation: "'raa' marks a specific/definite object",
            sortOrder: 3,
          },
          {
            exerciseType: "multiple_choice",
            question: "How do you say 'big book' in Farsi?",
            correctAnswer: "ketaab-e bozorg",
            alternatives: JSON.stringify(["bozorg ketaab", "ketaab-e bozorg", "bozorg-e ketaab", "ketaab bozorg-e"]),
            explanation: "Adjectives come after nouns with '-e': ketaab-e bozorg",
            sortOrder: 4,
          },
          {
            exerciseType: "translate",
            question: "Type 'my house' in Farsi",
            correctAnswer: "khoone-ye man",
            hint: "house-of me (use -ye after vowel)",
            explanation: "khoone-ye man = my house (house of me)",
            sortOrder: 5,
          },
        ],
      },
    ];

    // Insert all lessons and exercises
    const createdLessons = [];
    for (const data of lessonsData) {
      const [lesson] = await db
        .insert(grammarLessons)
        .values(data.lesson)
        .returning();

      createdLessons.push({ id: lesson.id, title: lesson.title });

      // Insert exercises for this lesson
      for (const exercise of data.exercises) {
        await db.insert(grammarExercises).values({
          grammarLessonId: lesson.id,
          ...exercise,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdLessons.length} grammar lessons with exercises`,
      lessons: createdLessons,
    });
  } catch (error) {
    console.error("Error seeding expanded grammar:", error);
    return NextResponse.json(
      { error: "Failed to seed expanded grammar", details: String(error) },
      { status: 500 }
    );
  }
}
