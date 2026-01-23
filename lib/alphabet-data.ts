/**
 * Persian Alphabet Data
 * Contains all 32 letters of the Persian alphabet with their forms,
 * transliterations, and example words.
 */

export interface PersianLetter {
  letter: string;           // Persian character (isolated form)
  name: string;             // Name in English
  nameFarsi: string;        // Name in Farsi
  transliteration: string;  // How it sounds
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  example: {
    word: string;           // Example word in Farsi
    phonetic: string;       // Phonetic pronunciation
    meaning: string;        // English meaning
  };
  notes?: string;           // Optional pronunciation notes
}

export const persianAlphabet: PersianLetter[] = [
  {
    letter: "ا",
    name: "Alef",
    nameFarsi: "الف",
    transliteration: "â / a / o",
    forms: {
      isolated: "ا",
      initial: "ا",
      medial: "ـا",
      final: "ـا",
    },
    example: {
      word: "آب",
      phonetic: "âb",
      meaning: "water",
    },
    notes: "Silent at the beginning of words, carries vowels",
  },
  {
    letter: "ب",
    name: "Be",
    nameFarsi: "ب",
    transliteration: "b",
    forms: {
      isolated: "ب",
      initial: "بـ",
      medial: "ـبـ",
      final: "ـب",
    },
    example: {
      word: "باران",
      phonetic: "bârân",
      meaning: "rain",
    },
  },
  {
    letter: "پ",
    name: "Pe",
    nameFarsi: "پ",
    transliteration: "p",
    forms: {
      isolated: "پ",
      initial: "پـ",
      medial: "ـپـ",
      final: "ـپ",
    },
    example: {
      word: "پدر",
      phonetic: "pedar",
      meaning: "father",
    },
    notes: "Unique to Persian (not in Arabic)",
  },
  {
    letter: "ت",
    name: "Te",
    nameFarsi: "ت",
    transliteration: "t",
    forms: {
      isolated: "ت",
      initial: "تـ",
      medial: "ـتـ",
      final: "ـت",
    },
    example: {
      word: "تهران",
      phonetic: "tehrân",
      meaning: "Tehran",
    },
  },
  {
    letter: "ث",
    name: "Se",
    nameFarsi: "ث",
    transliteration: "s",
    forms: {
      isolated: "ث",
      initial: "ثـ",
      medial: "ـثـ",
      final: "ـث",
    },
    example: {
      word: "ثانیه",
      phonetic: "sâniye",
      meaning: "second",
    },
    notes: "Pronounced like 's' in Persian (like 'th' in Arabic)",
  },
  {
    letter: "ج",
    name: "Jim",
    nameFarsi: "ج",
    transliteration: "j",
    forms: {
      isolated: "ج",
      initial: "جـ",
      medial: "ـجـ",
      final: "ـج",
    },
    example: {
      word: "جان",
      phonetic: "jân",
      meaning: "soul / dear",
    },
  },
  {
    letter: "چ",
    name: "Che",
    nameFarsi: "چ",
    transliteration: "ch",
    forms: {
      isolated: "چ",
      initial: "چـ",
      medial: "ـچـ",
      final: "ـچ",
    },
    example: {
      word: "چای",
      phonetic: "châi",
      meaning: "tea",
    },
    notes: "Unique to Persian (not in Arabic)",
  },
  {
    letter: "ح",
    name: "He (guttural)",
    nameFarsi: "ح",
    transliteration: "h",
    forms: {
      isolated: "ح",
      initial: "حـ",
      medial: "ـحـ",
      final: "ـح",
    },
    example: {
      word: "حال",
      phonetic: "hâl",
      meaning: "condition / mood",
    },
    notes: "Guttural 'h' from throat",
  },
  {
    letter: "خ",
    name: "Khe",
    nameFarsi: "خ",
    transliteration: "kh",
    forms: {
      isolated: "خ",
      initial: "خـ",
      medial: "ـخـ",
      final: "ـخ",
    },
    example: {
      word: "خوب",
      phonetic: "khoob",
      meaning: "good",
    },
    notes: "Like Scottish 'loch' or German 'Bach'",
  },
  {
    letter: "د",
    name: "Dâl",
    nameFarsi: "د",
    transliteration: "d",
    forms: {
      isolated: "د",
      initial: "د",
      medial: "ـد",
      final: "ـد",
    },
    example: {
      word: "دوست",
      phonetic: "doost",
      meaning: "friend",
    },
    notes: "Non-connecting letter",
  },
  {
    letter: "ذ",
    name: "Zâl",
    nameFarsi: "ذ",
    transliteration: "z",
    forms: {
      isolated: "ذ",
      initial: "ذ",
      medial: "ـذ",
      final: "ـذ",
    },
    example: {
      word: "ذهن",
      phonetic: "zehn",
      meaning: "mind",
    },
    notes: "Pronounced like 'z' in Persian (like 'th' in Arabic)",
  },
  {
    letter: "ر",
    name: "Re",
    nameFarsi: "ر",
    transliteration: "r",
    forms: {
      isolated: "ر",
      initial: "ر",
      medial: "ـر",
      final: "ـر",
    },
    example: {
      word: "روز",
      phonetic: "rooz",
      meaning: "day",
    },
    notes: "Rolled 'r', non-connecting letter",
  },
  {
    letter: "ز",
    name: "Ze",
    nameFarsi: "ز",
    transliteration: "z",
    forms: {
      isolated: "ز",
      initial: "ز",
      medial: "ـز",
      final: "ـز",
    },
    example: {
      word: "زیبا",
      phonetic: "zibâ",
      meaning: "beautiful",
    },
    notes: "Non-connecting letter",
  },
  {
    letter: "ژ",
    name: "Zhe",
    nameFarsi: "ژ",
    transliteration: "zh",
    forms: {
      isolated: "ژ",
      initial: "ژ",
      medial: "ـژ",
      final: "ـژ",
    },
    example: {
      word: "ژاپن",
      phonetic: "zhâpon",
      meaning: "Japan",
    },
    notes: "Unique to Persian, like 's' in 'measure'",
  },
  {
    letter: "س",
    name: "Sin",
    nameFarsi: "س",
    transliteration: "s",
    forms: {
      isolated: "س",
      initial: "سـ",
      medial: "ـسـ",
      final: "ـس",
    },
    example: {
      word: "سلام",
      phonetic: "salâm",
      meaning: "hello",
    },
  },
  {
    letter: "ش",
    name: "Shin",
    nameFarsi: "ش",
    transliteration: "sh",
    forms: {
      isolated: "ش",
      initial: "شـ",
      medial: "ـشـ",
      final: "ـش",
    },
    example: {
      word: "شب",
      phonetic: "shab",
      meaning: "night",
    },
  },
  {
    letter: "ص",
    name: "Sâd",
    nameFarsi: "ص",
    transliteration: "s",
    forms: {
      isolated: "ص",
      initial: "صـ",
      medial: "ـصـ",
      final: "ـص",
    },
    example: {
      word: "صبح",
      phonetic: "sobh",
      meaning: "morning",
    },
    notes: "Emphatic 's' (sounds same as س in Persian)",
  },
  {
    letter: "ض",
    name: "Zâd",
    nameFarsi: "ض",
    transliteration: "z",
    forms: {
      isolated: "ض",
      initial: "ضـ",
      medial: "ـضـ",
      final: "ـض",
    },
    example: {
      word: "ضعیف",
      phonetic: "za'if",
      meaning: "weak",
    },
    notes: "Emphatic 'z' (sounds same as ز in Persian)",
  },
  {
    letter: "ط",
    name: "Tâ",
    nameFarsi: "ط",
    transliteration: "t",
    forms: {
      isolated: "ط",
      initial: "طـ",
      medial: "ـطـ",
      final: "ـط",
    },
    example: {
      word: "طلا",
      phonetic: "talâ",
      meaning: "gold",
    },
    notes: "Emphatic 't' (sounds same as ت in Persian)",
  },
  {
    letter: "ظ",
    name: "Zâ",
    nameFarsi: "ظ",
    transliteration: "z",
    forms: {
      isolated: "ظ",
      initial: "ظـ",
      medial: "ـظـ",
      final: "ـظ",
    },
    example: {
      word: "ظهر",
      phonetic: "zohr",
      meaning: "noon",
    },
    notes: "Emphatic 'z' (sounds same as ز in Persian)",
  },
  {
    letter: "ع",
    name: "Eyn",
    nameFarsi: "ع",
    transliteration: "'",
    forms: {
      isolated: "ع",
      initial: "عـ",
      medial: "ـعـ",
      final: "ـع",
    },
    example: {
      word: "عشق",
      phonetic: "'eshq",
      meaning: "love",
    },
    notes: "Guttural stop, often silent in casual speech",
  },
  {
    letter: "غ",
    name: "Gheyn",
    nameFarsi: "غ",
    transliteration: "gh",
    forms: {
      isolated: "غ",
      initial: "غـ",
      medial: "ـغـ",
      final: "ـغ",
    },
    example: {
      word: "غذا",
      phonetic: "ghazâ",
      meaning: "food",
    },
    notes: "Guttural 'gh', like French 'r'",
  },
  {
    letter: "ف",
    name: "Fe",
    nameFarsi: "ف",
    transliteration: "f",
    forms: {
      isolated: "ف",
      initial: "فـ",
      medial: "ـفـ",
      final: "ـف",
    },
    example: {
      word: "فارسی",
      phonetic: "fârsi",
      meaning: "Persian/Farsi",
    },
  },
  {
    letter: "ق",
    name: "Qâf",
    nameFarsi: "ق",
    transliteration: "gh",
    forms: {
      isolated: "ق",
      initial: "قـ",
      medial: "ـقـ",
      final: "ـق",
    },
    example: {
      word: "قلب",
      phonetic: "ghalb",
      meaning: "heart",
    },
    notes: "Pronounced like غ in Persian",
  },
  {
    letter: "ک",
    name: "Kâf",
    nameFarsi: "ک",
    transliteration: "k",
    forms: {
      isolated: "ک",
      initial: "کـ",
      medial: "ـکـ",
      final: "ـک",
    },
    example: {
      word: "کتاب",
      phonetic: "ketâb",
      meaning: "book",
    },
  },
  {
    letter: "گ",
    name: "Gâf",
    nameFarsi: "گ",
    transliteration: "g",
    forms: {
      isolated: "گ",
      initial: "گـ",
      medial: "ـگـ",
      final: "ـگ",
    },
    example: {
      word: "گل",
      phonetic: "gol",
      meaning: "flower",
    },
    notes: "Unique to Persian (not in Arabic)",
  },
  {
    letter: "ل",
    name: "Lâm",
    nameFarsi: "ل",
    transliteration: "l",
    forms: {
      isolated: "ل",
      initial: "لـ",
      medial: "ـلـ",
      final: "ـل",
    },
    example: {
      word: "لبخند",
      phonetic: "labkhand",
      meaning: "smile",
    },
  },
  {
    letter: "م",
    name: "Mim",
    nameFarsi: "م",
    transliteration: "m",
    forms: {
      isolated: "م",
      initial: "مـ",
      medial: "ـمـ",
      final: "ـم",
    },
    example: {
      word: "مادر",
      phonetic: "mâdar",
      meaning: "mother",
    },
  },
  {
    letter: "ن",
    name: "Nun",
    nameFarsi: "ن",
    transliteration: "n",
    forms: {
      isolated: "ن",
      initial: "نـ",
      medial: "ـنـ",
      final: "ـن",
    },
    example: {
      word: "نان",
      phonetic: "nân",
      meaning: "bread",
    },
  },
  {
    letter: "و",
    name: "Vâv",
    nameFarsi: "و",
    transliteration: "v / u / ow",
    forms: {
      isolated: "و",
      initial: "و",
      medial: "ـو",
      final: "ـو",
    },
    example: {
      word: "ورزش",
      phonetic: "varzesh",
      meaning: "exercise / sport",
    },
    notes: "Non-connecting, can be consonant 'v' or vowels 'u/ow'",
  },
  {
    letter: "ه",
    name: "He",
    nameFarsi: "ه",
    transliteration: "h / e",
    forms: {
      isolated: "ه",
      initial: "هـ",
      medial: "ـهـ",
      final: "ـه",
    },
    example: {
      word: "هفته",
      phonetic: "hafte",
      meaning: "week",
    },
    notes: "At word end often represents 'e' sound",
  },
  {
    letter: "ی",
    name: "Ye",
    nameFarsi: "ی",
    transliteration: "y / i",
    forms: {
      isolated: "ی",
      initial: "یـ",
      medial: "ـیـ",
      final: "ـی",
    },
    example: {
      word: "یک",
      phonetic: "yek",
      meaning: "one",
    },
    notes: "Can be consonant 'y' or vowel 'i'",
  },
];

// Group letters by their characteristics
export const letterGroups = {
  uniqueToPersian: ["پ", "چ", "ژ", "گ"],
  nonConnecting: ["ا", "د", "ذ", "ر", "ز", "ژ", "و"],
  sameSound: {
    s: ["س", "ث", "ص"],
    z: ["ز", "ذ", "ض", "ظ"],
    t: ["ت", "ط"],
    h: ["ه", "ح"],
    gh: ["غ", "ق"],
  },
};

// Vowels in Persian (short vowels are diacritics, not letters)
export const persianVowels = {
  long: [
    { letter: "ا", sound: "â", example: "آب (âb) - water" },
    { letter: "و", sound: "u / ow", example: "تو (to) - you" },
    { letter: "ی", sound: "i", example: "شیر (shir) - milk/lion" },
  ],
  short: [
    { name: "Fatha", symbol: "َ", sound: "a", example: "بَد (bad) - bad" },
    { name: "Kasra", symbol: "ِ", sound: "e", example: "دِل (del) - heart" },
    { name: "Zamma", symbol: "ُ", sound: "o", example: "گُل (gol) - flower" },
  ],
};

// Helper function to get a letter by its isolated form
export function getLetterByChar(char: string): PersianLetter | undefined {
  return persianAlphabet.find((l) => l.letter === char);
}

// Helper function to get letters by difficulty (for practice sessions)
export function getLettersForPractice(count: number = 5): PersianLetter[] {
  const shuffled = [...persianAlphabet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
