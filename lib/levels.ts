/**
 * Persian Title Progression System
 * Users level up through historical Persian titles as they earn XP
 */

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  titlePersian: string;
  titlePhonetic: string;
}

export const LEVELS: Level[] = [
  { level: 1, xpRequired: 0, title: "Student", titlePersian: "شاگرد", titlePhonetic: "Shāgerd" },
  { level: 2, xpRequired: 100, title: "Apprentice", titlePersian: "کارآموز", titlePhonetic: "Kārāmūz" },
  { level: 3, xpRequired: 300, title: "Scholar", titlePersian: "دانشجو", titlePhonetic: "Dāneshjū" },
  { level: 4, xpRequired: 600, title: "Poet", titlePersian: "شاعر", titlePhonetic: "Shā'er" },
  { level: 5, xpRequired: 1000, title: "Master", titlePersian: "استاد", titlePhonetic: "Ostād" },
  { level: 6, xpRequired: 1500, title: "Sage", titlePersian: "حکیم", titlePhonetic: "Hakīm" },
  { level: 7, xpRequired: 2500, title: "Royal Scribe", titlePersian: "دبیر دربار", titlePhonetic: "Dabīr-e Darbār" },
  { level: 8, xpRequired: 4000, title: "Persian Scholar", titlePersian: "دانشمند", titlePhonetic: "Dāneshmand" },
  { level: 9, xpRequired: 6000, title: "Keeper of Words", titlePersian: "نگهبان کلمات", titlePhonetic: "Negahbān-e Kalamāt" },
  { level: 10, xpRequired: 10000, title: "Grand Vizier", titlePersian: "وزیر اعظم", titlePhonetic: "Vazīr-e A'zam" },
];

/**
 * Get the user's current level based on their total XP
 */
export function getCurrentLevel(totalXP: number): Level {
  // Find the highest level the user has reached
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Get the next level the user is working towards
 * Returns null if user is at max level
 */
export function getNextLevel(totalXP: number): Level | null {
  const currentLevel = getCurrentLevel(totalXP);
  const nextIndex = LEVELS.findIndex(l => l.level === currentLevel.level + 1);
  return nextIndex !== -1 ? LEVELS[nextIndex] : null;
}

/**
 * Calculate progress percentage towards the next level
 */
export function getLevelProgress(totalXP: number): number {
  const currentLevel = getCurrentLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);

  if (!nextLevel) {
    return 100; // Max level reached
  }

  const xpIntoCurrentLevel = totalXP - currentLevel.xpRequired;
  const xpNeededForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;

  return Math.min(100, Math.round((xpIntoCurrentLevel / xpNeededForNextLevel) * 100));
}

/**
 * Get XP remaining until next level
 */
export function getXPToNextLevel(totalXP: number): number {
  const nextLevel = getNextLevel(totalXP);

  if (!nextLevel) {
    return 0; // Max level reached
  }

  return nextLevel.xpRequired - totalXP;
}
