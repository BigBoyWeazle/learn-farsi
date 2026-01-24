"use client";

import { useEffect, useState } from "react";

interface Proverb {
  farsi: string;
  phonetic: string;
  english: string;
  meaning?: string;
}

const proverbs: Proverb[] = [
  {
    farsi: "صبر تلخ است ولی ثمرۀ شیرین دارد",
    phonetic: "Sabr talkh ast vali samare-ye shirin darad",
    english: "Patience is bitter, but its fruit is sweet.",
  },
  {
    farsi: "قطره قطره جمع گردد وانگهی دریا شود",
    phonetic: "Ghatre ghatre jam' gardad va angahi darya shavad",
    english: "Drop by drop gathers, and then becomes a sea.",
    meaning: "Small efforts add up to great achievements",
  },
  {
    farsi: "هر که را طاووس خواهد، جور هندوستان کشد",
    phonetic: "Har ke ra tavoos khahad, joor-e Hendoostan keshad",
    english: "Those who want a peacock must endure India.",
    meaning: "Great things require effort and patience",
  },
  {
    farsi: "یک دست صدا ندارد",
    phonetic: "Yek dast seda nadarad",
    english: "One hand has no sound.",
    meaning: "Cooperation is essential",
  },
  {
    farsi: "چراغی که به خانه رواست، به مسجد حرام است",
    phonetic: "Cheraghi ke be khane ravast, be masjed haram ast",
    english: "A lamp needed at home is forbidden at the mosque.",
    meaning: "Charity begins at home",
  },
  {
    farsi: "آب که سر بالا رود، قورباغه ابوعطا خواند",
    phonetic: "Ab ke sar bala ravad, ghorbaghe abu-ata khanad",
    english: "When water flows uphill, the frog sings abu-ata.",
    meaning: "When impossible things happen",
  },
  {
    farsi: "دوست آن باشد که گیرد دست دوست در پریشان حالی و درماندگی",
    phonetic: "Doost an bashad ke girad dast-e doost dar parishan hali va darmandegi",
    english: "A true friend is one who holds your hand in times of distress.",
  },
  {
    farsi: "زبان سرخ سر سبز می دهد بر باد",
    phonetic: "Zaban-e sorkh sar-e sabz midahad bar bad",
    english: "A red tongue gives a green head to the wind.",
    meaning: "Careless words can lead to trouble",
  },
];

interface PersianProverbProps {
  className?: string;
  showPhonetic?: boolean;
  variant?: "card" | "inline" | "banner";
}

export function PersianProverb({
  className = "",
  showPhonetic = true,
  variant = "card",
}: PersianProverbProps) {
  const [proverb, setProverb] = useState<Proverb | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Pick a random proverb, but keep it consistent for the day
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("proverbDate");
    const savedIndex = localStorage.getItem("proverbIndex");

    if (savedDate === today && savedIndex) {
      setProverb(proverbs[parseInt(savedIndex)]);
    } else {
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      localStorage.setItem("proverbDate", today);
      localStorage.setItem("proverbIndex", randomIndex.toString());
      setProverb(proverbs[randomIndex]);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !proverb) return null;

  if (variant === "inline") {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-persian-red-600 dark:text-persian-gold-400 italic text-sm">
          &ldquo;{proverb.english}&rdquo;
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-r from-persian-beige-100 via-persian-beige-50 to-persian-beige-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-3 px-4 ${className}`}
      >
        <p className="text-center text-persian-red-700 dark:text-persian-beige-200 text-sm">
          <span className="text-persian-gold-600 dark:text-persian-gold-400 mr-2">✨</span>
          {proverb.english}
          <span className="text-persian-gold-600 dark:text-persian-gold-400 ml-2">✨</span>
        </p>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-persian-gold-200 dark:border-persian-gold-700 ${className}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">📜</span>
        <h3 className="text-lg font-bold text-persian-red-600 dark:text-persian-gold-400">
          Proverb of the Day
        </h3>
      </div>

      {/* Farsi text */}
      <p
        className="text-2xl text-gray-900 dark:text-white mb-3 text-right leading-relaxed"
        dir="rtl"
        lang="fa"
      >
        {proverb.farsi}
      </p>

      {/* Phonetic */}
      {showPhonetic && (
        <p className="text-persian-red-500 dark:text-persian-gold-500 italic text-sm mb-3">
          {proverb.phonetic}
        </p>
      )}

      {/* English translation */}
      <p className="text-persian-red-800 dark:text-persian-beige-200 font-medium">
        &ldquo;{proverb.english}&rdquo;
      </p>

      {/* Meaning if available */}
      {proverb.meaning && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 italic">
          — {proverb.meaning}
        </p>
      )}
    </div>
  );
}

// Export proverbs for use elsewhere
export { proverbs };
