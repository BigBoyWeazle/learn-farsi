import "dotenv/config";
import { db } from "../db";
import { vocabulary, grammarLessons, grammarExercises } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Updates the database to use spoken/colloquial Farsi instead of formal Farsi.
 *
 * Key changes:
 * 1. Pronoun "u" → "oo" (He/She)
 * 2. Verb conjugations to spoken forms (miravam→miram, miravad→mire, etc.)
 * 3. "aa"→"oo" vowel shift for words like khaneh→khooneh, naan→noon
 *
 * Run with: npx tsx scripts/update-spoken-farsi.ts
 */

// ─── PART 1: Vocabulary Phonetic Updates ─────────────────────────────────────

const vocabUpdates: { oldPhonetic: string; newPhonetic: string }[] = [
  { oldPhonetic: "khaneh", newPhonetic: "khooneh" },
  { oldPhonetic: "naan", newPhonetic: "noon" },
  { oldPhonetic: "aan", newPhonetic: "oon" },
  { oldPhonetic: "aanha", newPhonetic: "oonaa" },
  { oldPhonetic: "aanjaa", newPhonetic: "oonjaa" },
  { oldPhonetic: "aamadan", newPhonetic: "oomadan" },
  { oldPhonetic: "khaandan", newPhonetic: "khoondan" },
  { oldPhonetic: "khosh aamadid", newPhonetic: "khosh oomadid" },
  { oldPhonetic: "dandaan", newPhonetic: "dandoon" },
  { oldPhonetic: "dahaan", newPhonetic: "dahoon" },
  { oldPhonetic: "dahan", newPhonetic: "dahoon" },
  { oldPhonetic: "khanevadeh", newPhonetic: "khoonevade" },
  { oldPhonetic: "injaa", newPhonetic: "inja" },
  { oldPhonetic: "kojaa", newPhonetic: "koja" },
];

// ─── PART 2: Updated Grammar Lesson Explanations ─────────────────────────────

const lessonExplanations: Record<string, string> = {
  "Lesson G1: Personal Pronouns": `# Personal Pronouns in Farsi

Personal pronouns are essential for building sentences in Farsi. Unlike English, Farsi pronouns don't change based on whether they're subjects or objects.

## The Six Personal Pronouns

man → I
to → You (informal/singular)
oo → He/She/It
ma → We
shoma → You (formal/plural)
oonaa → They

## Key Points

- Farsi has no gender distinction - "oo" means both "he" and "she"
- "shoma" is used for politeness OR when addressing multiple people
- "ishoon" is the polite way of saying "they"
- In casual speech, pronouns are often dropped because verb endings indicate the subject

## Examples

man irani hastam → I am Iranian
to khubi? → Are you well?
oo daaneshjooe → He/She is a student
ma irani hastim → We are Iranian
shoma chetori hastid? → How are you? (formal)
oonaa doost-an → They are friends`,

  "Lesson G2: The Verb 'To Be' (Boodan)": `# The Verb "To Be" in Farsi

The verb "to be" (boodan) is the most essential verb in Farsi. It conjugates differently in the present tense.

## Present Tense Conjugation

man hastam → I am
to hasti → You are (informal)
oo -e/ast → He/She/It is
ma hastim → We are
shoma hastid → You are (formal/plural)
oonaa -an/hastand → They are

## Negative Form (Nist)

man nistam → I am not
to nisti → You are not
oo nist → He/She is not
ma nistim → We are not
shoma nistid → You are not (formal)
oonaa nistan → They are not

## Difference: -e/ast vs hast

- "-e" or "ast" = is (describing something)
- "hast" = there is / exists

Examples:
- in ketaab-e → This is a book
- ketaab hast → There is a book

## Short Forms (Common in Speech)

hastam → -am (e.g., irani-am = I am Iranian)
hasti → -i
ast → -e

## Examples

man khoshhaal-am → I am happy
to daaneshjooi → You are a student
in ketaab-e → This is a book
ma irani hastim → We are Iranian`,

  "Lesson G3: Present Tense (Mi- Prefix)": `# Present Tense in Farsi

The present tense in Farsi is formed by adding "mi" before the verb stem, plus personal endings.

## Formation

mi + verb stem + personal ending

## Personal Endings

man: -am
to: -i
oo: -e
ma: -im
shoma: -id
oonaa: -an

## Example: raftan (to go)

Verb stem: r (spoken) / rav (formal)

miram → I go / I am going
miri → You go
mire → He/She goes
mirim → We go
mirid → You go (formal)
miran → They go

## More Examples

khordan (to eat) → stem: khor
mikhoram → I eat
mikhori → You eat
mikhore → He/She eats

didan (to see) → stem: bin
mibinam → I see
mibini → You see
mibine → He/She sees

goftan (to say) → stem: g (spoken)
migam → I say
migi → You say
mige → He/She says

khoondan (to read) → stem: khoon
mikhoonam → I read
mikhooni → You read
mikhoone → He/She reads

## Important Note

The "mi-" prefix indicates ongoing or habitual action in the present.`,

  "Lesson G4: Negative Verbs": `# Negative Verbs in Farsi

Negating verbs in Farsi is done by adding a negative prefix. The prefix changes slightly depending on the tense.

## Present Tense Negative: ne- or na-

Replace "mi-" with "nemi-":

miram → nemiram (I don't go)
mikhoram → nemikhoram (I don't eat)

## "To Be" Negative: nist-

hastam → nistam (I am not)
hasti → nisti (You are not)
-e/ast → nist (is not)

## "To Have" Negative: Special Case

daaram → nadaaram (I don't have)
Note: "daashtan" uses "na-" not "ne-"

## Past Tense Negative: na-

raftam → naraftam (I didn't go)
khordam → nakhordam (I didn't eat)

## Examples

man nemiram → I am not going / I don't go
to nadaari → You don't have
oo nist → He/She is not
ma nemikhorim → We don't eat
oonaa naraftand → They didn't go

## Key Points

- Present: Add "nemi-" before the verb stem
- Past: Add "na-" before the verb
- Exception: "daashtan" (to have) always uses "na-"`,

  "Lesson G5: Possessive Suffixes": `# Possessive Suffixes in Farsi

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
maal-e oo → his/hers

Example: in ketaab maal-e man-e → This book is mine

## Connecting with "-e" (ezaafe)

ketaab-e man → my book
khooneh-ye to → your house (after vowel, add -ye)

## Important Notes

- After vowels, add "-y" before the suffix: baba-yam (my dad)
- The suffix form is more casual/spoken
- The "maal-e" form emphasizes ownership`,

  "Lesson G6: Plural Forms (-haa)": `# Plural Forms in Farsi

Making nouns plural in Farsi is straightforward - just add the suffix "-haa".

## Basic Rule

Add "-haa" to any noun to make it plural:

ketaab → ketaab-haa (books)
toop → toop-haa (balls)
doost → doost-haa (friends)

## Examples

gorbe-haa → cats
sag-haa → dogs
bache-haa → children/guys
khooneh-haa → houses

## Important Exception

If a number is already describing the subject, you don't need "-haa":

fasl-haa → seasons (no number)
chaar fasl → four seasons (number present, no -haa needed)

yek ketaab → one book
do ketaab → two books (not do ketaab-haa)

## Counting Units

When counting, use special units:
- "doone" for single item: yek doone noon (one bread)
- "taa" for multiple items: do taa noon (two breads)
- "nafar" for people: se nafar (three people)

## Examples with Numbers

yek nafar → one person
do taa sib → two apples
se taa ketaab → three books
chand taa? → how many?`,

  "Lesson G7: Comparative & Superlative": `# Comparative & Superlative in Farsi

Farsi uses simple suffixes to create comparative and superlative forms.

## Comparative: -tar

Add "-tar" to make "more" or "-er":

bozorg → bozorg-tar (bigger)
koochik → koochik-tar (smaller)
khoob → behtar (better - irregular)
bad → badtar (worse)
zibaa → zibaa-tar (more beautiful)

## Superlative: -tarin

Add "-tarin" to make "most" or "-est":

bozorg → bozorg-tarin (biggest)
koochik → koochik-tarin (smallest)
khoob → behtarin (best - irregular)
khoshmazze → khoshmazze-tarin (most delicious)

## Using Comparatives

Use "az" (than) for comparisons:

ketaab-e aabi bozorg-tar az ketaab-e ghermez-e
→ The blue book is bigger than the red book

man az to bozorg-tar-am
→ I am older/bigger than you

## Using Superlatives

Superlatives often come before the noun:

behtarin doost-am → my best friend
bozorg-tarin shahr → the biggest city

Or after with emphasis:
Tah Dig khoshmazze-tarin ghazaa-e!
→ Tah Dig is the most delicious food!`,

  "Lesson G8: Word Building Suffixes": `# Word Building Suffixes in Farsi

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
kaar-khoone → factory (work house)
ketaab-khoone → library (book house)`,

  "Lesson G9: Imperative (Commands)": `# Imperative (Commands) in Farsi

Imperatives are used to give commands or make requests.

## Formation

Add prefix "be-" or "bo-" to the verb stem:

If first vowel is "o", use "bo-":
khordan (to eat) → stem: khor → bokhor (eat!)

Otherwise use "be-":
raftan (to go) → boro (go!)
didan (to see) → stem: bin → bebin (look!)

## Informal (to) vs Formal (shomaa)

Informal (to):
bebin → look!
bokhor → eat!
begoo → say!

Formal (shomaa) - add "-id":
bebinid → look! (formal)
bokhorid → eat! (formal)
begid → say! (formal)

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

  "Lesson G10: Past Tense": `# Past Tense in Farsi

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
oo: (nothing)
ma: -im
shoma: -id
oonaa: -and

## Conjugation Example: raftan (to go)

man raftam → I went
to rafti → You went
oo raft → He/She went
ma raftim → We went
shoma raftid → You went (formal)
oonaa raftand → They went

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
oo bood → He/She was`,

  "Lesson G11: Subjunctive Mood": `# Subjunctive Mood in Farsi

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
to baayad beri → You should go

After "mikhaam" (want to):
man mikhaam bekhoonam → I want to read
oo mikhaad bekhore → He wants to eat

After "age" (if):
age biaay, khoshhaal misham → If you come, I'll be happy

After "shaayad" (maybe):
shaayad biaad → Maybe he'll come

After "fekr mikonam" (I think):
fekr mikonam biaad → I think he'll come

## Negative Subjunctive

Replace "be-" with "na-":
bekhoram → nakhoram (that I don't eat)
beri → nari (that you don't go)

## Examples

baayad bekhoonam → I should study
mikhaam beram → I want to go
shaayad biaad → Maybe he'll come
age beshini, behtar-e → If you sit, it's better

## Note on kardan/shodan

kardan → konam (not bekonam)
shodan → besham (spoken)`,

  "Lesson G12: Word Order": `# Word Order in Farsi

Farsi follows Subject-Object-Verb (SOV) order, different from English (SVO).

## Basic Structure

Subject + Object + Verb

English: I eat food (SVO)
Farsi: man ghazaa mikhoram (SOV)
Literally: I food eat

## Examples

man ketaab mikhoonam → I book read (I read a book)
to chaay mikhori → You tea drink (You drink tea)
oo be madrese mire → He to school goes (He goes to school)

## Verb Always at the End

The verb typically comes at the very end of the sentence:

man emrooz be khooneh miram
→ I today to home go (I'm going home today)

## Object Marker: "ro" (or formal "raa")

When the object is specific/definite, add "ro":
man ketaab ro mikhoonam → I read THE book
man oon ghazaa ro doost daaram → I like THAT food

Without ro = general:
man ketaab mikhoonam → I read (a) book

## Connecting Words with "-e" (ezaafe)

Connect nouns to adjectives/possessives:
ketaab-e bozorg → big book (book of big)
khooneh-ye man → my house (house of me)
maashin-e ghermez → red car

After consonants: -e
After vowels: -ye

## Adjective Order

Adjectives come AFTER the noun:
ketaab-e aabi-ye bozorg → The big blue book
(book-of blue-of big)

Last adjective doesn't need connector.`,

  "Lesson G13: Present Continuous": `# Present Continuous in Farsi

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

  "Lesson G14: Past Continuous": `# Past Continuous (Imperfect) in Farsi

The past continuous describes actions that **were happening** at a point in the past. It uses the past tense of "daashtan" + the mi-verb.

## Formation

past "daashtan" + mi- + past verb

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
dashti mineveshti → You were writing
dasht mikhond → He/She was reading

## When to Use

Use past continuous for:
- Background actions: dashtam ghazaa mikhordam ke telefon zang zad
  → I was eating when the phone rang
- Simultaneous past actions: dasht miraft va harf mizad
  → He was walking and talking

## Past Continuous vs Simple Past

raftam → I went (completed action)
dashtam miraftam → I was going (ongoing in the past)

khordam → I ate (finished)
dashtam mikhordam → I was eating (in the middle of it)`,

  "Lesson G15: Present Perfect": `# Present Perfect in Farsi

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
rafte → He/She has gone
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

  "Lesson G16: Past Perfect (Pluperfect)": `# Past Perfect (Pluperfect) in Farsi

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

ghazaa ro khorde boodam ke oo oomad
→ I had eaten when he/she arrived

ghabl az inke beri, man rafte boodam
→ Before you went, I had (already) gone

## Negative

narafte boodam → I had not gone
nakhorde bood → He/She had not eaten

## Past Perfect vs Present Perfect

rafte-am → I have gone (relevant now)
rafte boodam → I had gone (before another past event)`,

  "Lesson G17: Simple Future": `# Simple Future in Farsi

The future tense has two forms: a formal/literary form and a more common spoken form.

## Formal Future: khaah- + past stem

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

## Spoken Future (More Common!)

In everyday speech, Iranians use "mikhaam" + subjunctive:

mikhaam beram → I'm going to go / I will go
mikhaay beri → You will go
mikhaad bere → He/She will go
mikhaym berim → We will go

## Negative Future

Formal: nakhaaham raft → I will not go
Spoken: nemikhaaam beram → I won't go

## When to Use Which

- Formal future (khaah-): news, writing, formal speeches, promises
- Spoken future (mikhaam): daily conversation, casual plans

## Examples in Context

farda khaaham oomad → I will come tomorrow (formal)
farda mikhaam biam → I'll come tomorrow (spoken)
ma mikhaaym bebinim → We'll see (spoken)`,
};

// ─── PART 3: Grammar Exercise Updates ────────────────────────────────────────

// Update exercises by matching on their current correctAnswer and modifying question/answer/alternatives
interface ExerciseUpdate {
  matchAnswer: string;
  newQuestion?: string;
  newAnswer?: string;
  newAlternatives?: string;
  newExplanation?: string;
  newHint?: string;
}

const exerciseUpdates: ExerciseUpdate[] = [
  // G1: Pronouns
  {
    matchAnswer: "anha",
    newAnswer: "oonaa",
    newAlternatives: JSON.stringify(["shoma", "ma", "oonaa", "oo"]),
    newExplanation: "'oonaa' is the pronoun meaning 'they'",
  },
  // G1: alternatives with u → oo
  {
    matchAnswer: "shoma",
    newAlternatives: JSON.stringify(["to", "oo", "shoma", "man"]),
  },
  // G3: Present tense - miravam → miram
  {
    matchAnswer: "miravam",
    newAnswer: "miram",
    newHint: "mi + r + am",
    newExplanation: "'miram' = I go (spoken form)",
  },
  // G3: miravad → mire
  {
    matchAnswer: "miravad",
    newQuestion: "Complete: oo be madrese ___ (He goes to school)",
    newAnswer: "mire",
    newHint: "Present tense of 'raftan' for 'oo'",
    newExplanation: "'mire' is the spoken third-person form",
  },
  // G3: mikhorand → mikhoran
  {
    matchAnswer: "mikhorand",
    newAnswer: "mikhoran",
    newAlternatives: JSON.stringify(["mikhoram", "mikhori", "mikhore", "mikhoran"]),
    newExplanation: "'mikhoran' = They eat (spoken form)",
  },
  // G4: nemiravam → nemiram
  {
    matchAnswer: "nemiravam",
    newAnswer: "nemiram",
    newAlternatives: JSON.stringify(["nemiram", "miram", "naram", "miram"]),
    newExplanation: "Add 'ne-' before 'mi-' to negate: nemiram",
  },
  // G5: maal-e u → maal-e oo
  {
    matchAnswer: "mine",
    newExplanation: "'maal-e man' = mine (belongs to me)",
  },
  // G6: yek daane naan → yek doone noon
  {
    matchAnswer: "yek daane naan",
    newAnswer: "yek doone noon",
    newHint: "Use 'doone' for single items",
    newExplanation: "yek doone noon = one bread",
  },
  // G10: u → oo in question
  {
    matchAnswer: "khord",
    newExplanation: "Third person has no ending: oo khord = He/She ate",
  },
  // G11: beravi → beri
  {
    matchAnswer: "beravi",
    newAnswer: "beri",
    newQuestion: "Make subjunctive: 'that you go' (to beri)",
    newHint: "be + r + i",
    newExplanation: "beri = that you go (spoken subjunctive)",
  },
  // G11: shaayad biaayad → shaayad biaad
  {
    matchAnswer: "shaayad biaayad",
    newAnswer: "shaayad biaad",
    newAlternatives: JSON.stringify(["shaayad biaad", "shaayad oomad", "shaayad miaad", "hatman miaad"]),
    newExplanation: "shaayad biaad = maybe he'll come (subjunctive after shaayad)",
  },
  // G12: man ketaab mikhaanam → man ketaab mikhoonam
  {
    matchAnswer: "man ketaab mikhaanam",
    newAnswer: "man ketaab mikhoonam",
    newHint: "Subject + Object + Verb",
    newExplanation: "man ketaab mikhoonam = I book read",
  },
  // G12: ketaab-e bozorg stays but let's fix the question about u
  {
    matchAnswer: "khoone-ye man",
    newAnswer: "khooneh-ye man",
    newHint: "house-of me (use -ye after vowel)",
    newExplanation: "khooneh-ye man = my house (house of me)",
  },
  // G13: daram miravam → daram miram
  {
    matchAnswer: "daram miravam",
    newAnswer: "daram miram",
    newAlternatives: JSON.stringify(["miram", "daram miram", "raftam", "khaaham raft"]),
    newExplanation: "'daram miram' = I am going right now (present continuous)",
  },
  // G13: dare mikhone stays (already spoken)
  // G13: miravam is habitual, daram miravam is right now → update
  {
    matchAnswer: "miravam is habitual, daram miravam is right now",
    newAnswer: "miram is habitual, daram miram is right now",
    newAlternatives: JSON.stringify([
      "miram is habitual, daram miram is right now",
      "They mean the same thing",
      "miram is future, daram miram is past",
      "miram is formal, daram miram is informal",
    ]),
    newExplanation: "'miram' = I go (in general). 'daram miram' = I am going (at this moment)",
  },
  // G16: oo aamad → oo oomad in exercise context
  // G17: stays mostly (formal future is formal on purpose)
];

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("UPDATING DATABASE TO SPOKEN FARSI");
  console.log("=".repeat(60));

  // ── STEP 1: Update Vocabulary Phonetics ──
  console.log("\n--- Step 1: Updating vocabulary phonetics ---\n");
  let vocabCount = 0;

  for (const update of vocabUpdates) {
    const result = await db
      .update(vocabulary)
      .set({ phonetic: update.newPhonetic })
      .where(eq(vocabulary.phonetic, update.oldPhonetic));

    // Check if any rows were affected by querying
    const check = await db
      .select({ id: vocabulary.id })
      .from(vocabulary)
      .where(eq(vocabulary.phonetic, update.newPhonetic))
      .limit(1);

    if (check.length > 0) {
      console.log(`  ✓ ${update.oldPhonetic} → ${update.newPhonetic}`);
      vocabCount++;
    } else {
      console.log(`  - ${update.oldPhonetic} (not found, skipping)`);
    }
  }
  console.log(`\n  Updated ${vocabCount} vocabulary phonetics`);

  // ── STEP 2: Update Grammar Lesson Explanations ──
  console.log("\n--- Step 2: Updating grammar lesson explanations ---\n");
  let lessonCount = 0;

  for (const [title, explanation] of Object.entries(lessonExplanations)) {
    await db
      .update(grammarLessons)
      .set({ explanation })
      .where(eq(grammarLessons.title, title));
    console.log(`  ✓ ${title}`);
    lessonCount++;
  }
  console.log(`\n  Updated ${lessonCount} lesson explanations`);

  // ── STEP 3: Update Grammar Exercises ──
  console.log("\n--- Step 3: Updating grammar exercises ---\n");
  let exerciseCount = 0;

  for (const update of exerciseUpdates) {
    // Find exercises with this correctAnswer
    const exercises = await db
      .select()
      .from(grammarExercises)
      .where(eq(grammarExercises.correctAnswer, update.matchAnswer));

    if (exercises.length === 0) {
      console.log(`  - No exercise with answer "${update.matchAnswer}" (skipping)`);
      continue;
    }

    for (const exercise of exercises) {
      const updateData: Record<string, string> = {};
      if (update.newQuestion) updateData.question = update.newQuestion;
      if (update.newAnswer) updateData.correctAnswer = update.newAnswer;
      if (update.newAlternatives) updateData.alternatives = update.newAlternatives;
      if (update.newExplanation) updateData.explanation = update.newExplanation;
      if (update.newHint) updateData.hint = update.newHint;

      if (Object.keys(updateData).length > 0) {
        await db
          .update(grammarExercises)
          .set(updateData)
          .where(eq(grammarExercises.id, exercise.id));
        console.log(`  ✓ Exercise "${update.matchAnswer}" → ${update.newAnswer || "(updated fields)"}`);
        exerciseCount++;
      }
    }
  }

  // Also do a broad sweep: update any exercise question/explanation that contains "u " as pronoun
  console.log("\n  Sweeping exercises for pronoun 'u' → 'oo'...");
  const allExercises = await db.select().from(grammarExercises);
  let pronounCount = 0;

  for (const ex of allExercises) {
    const updates: Record<string, string> = {};

    // Update question text: "u " as Farsi pronoun at word boundaries
    if (ex.question) {
      const newQ = ex.question
        .replace(/\bu daaneshjo\b/g, "oo daaneshjo")
        .replace(/\bu mikhaad\b/g, "oo mikhaad")
        .replace(/\bu nist\b/g, "oo nist")
        .replace(/Complete: u /g, "Complete: oo ");
      if (newQ !== ex.question) updates.question = newQ;
    }

    if (ex.explanation) {
      const newExp = ex.explanation
        .replace(/Third person has no ending: u /g, "Third person has no ending: oo ")
        .replace(/'u '/g, "'oo '");
      if (newExp !== ex.explanation) updates.explanation = newExp;
    }

    // Update alternatives JSON that contain "u" as option
    if (ex.alternatives) {
      const newAlt = ex.alternatives
        .replace(/"u"/g, '"oo"');
      if (newAlt !== ex.alternatives) updates.alternatives = newAlt;
    }

    if (Object.keys(updates).length > 0) {
      await db.update(grammarExercises).set(updates).where(eq(grammarExercises.id, ex.id));
      pronounCount++;
    }
  }

  console.log(`  Updated ${pronounCount} exercises with pronoun fixes`);
  console.log(`\n  Total exercises updated: ${exerciseCount + pronounCount}`);

  // ── Summary ──
  console.log("\n" + "=".repeat(60));
  console.log("SPOKEN FARSI UPDATE COMPLETE!");
  console.log("=".repeat(60));
  console.log(`\nVocabulary phonetics updated: ${vocabCount}`);
  console.log(`Grammar explanations updated: ${lessonCount}`);
  console.log(`Grammar exercises updated: ${exerciseCount + pronounCount}`);
  console.log("\nNote: Also update reference page and seed scripts manually.\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
