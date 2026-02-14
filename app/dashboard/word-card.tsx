"use client";

import type { Vocabulary } from "@/db/schema";
import { useState } from "react";
import { useDisplayPreference } from "@/components/display-preference";

interface WordCardProps {
  word: Vocabulary;
}

export default function WordCard({ word }: WordCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const { isPhoneticFirst } = useDisplayPreference();

  return (
    <div className="bg-white border-2 border-persian-red-500 shadow-md rounded-lg p-3 hover:shadow-lg hover:border-persian-red-600 transition-all">
      <div className="space-y-2">
        {/* Word display - respects display preference */}
        <div className="text-center">
          {isPhoneticFirst ? (
            <>
              <div className="text-lg font-bold text-persian-red-500 capitalize leading-tight">
                {word.phonetic || word.farsiWord}
              </div>
              {word.farsiWord && word.phonetic && (
                <div className="text-base text-persian-red-700" style={{ direction: "rtl", fontFamily: "serif" }}>
                  {word.farsiWord}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-persian-red-500 leading-tight" style={{ direction: "rtl", fontFamily: "serif" }}>
                {word.farsiWord}
              </div>
              {word.phonetic && (
                <div className="text-sm text-persian-red-700 capitalize">
                  {word.phonetic}
                </div>
              )}
            </>
          )}
          {word.isFormal && (
            <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-semibold rounded-full border border-purple-300">
              Formal
            </span>
          )}
        </div>

        {/* Translation reveal button */}
        <div className="border-t border-persian-red-200 pt-2">
          {!showTranslation ? (
            <button
              onClick={() => setShowTranslation(true)}
              className="w-full py-1.5 px-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors text-xs font-semibold shadow-sm"
            >
              Show Translation
            </button>
          ) : (
            <div className="space-y-1.5">
              {/* English translation */}
              <div className="text-center">
                <div className="text-sm font-semibold text-persian-red-500">
                  {word.englishTranslation}
                </div>
              </div>

              {/* Example sentences if available */}
              {word.exampleFarsi && word.exampleEnglish && (
                <div className="pt-1.5 border-t border-persian-red-200">
                  <div className="text-[10px] leading-snug">
                    <div className="text-persian-red-700 font-medium" style={{ direction: "rtl" }}>
                      {word.exampleFarsi}
                    </div>
                    {word.examplePhonetic && (
                      <div className="text-persian-red-600 italic">
                        ({word.examplePhonetic})
                      </div>
                    )}
                    <div className="text-persian-red-700 italic">
                      {word.exampleEnglish}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowTranslation(false)}
                className="w-full py-1.5 px-3 bg-persian-beige-200 text-persian-red-500 rounded-lg hover:bg-persian-beige-300 transition-colors text-xs font-semibold border border-persian-red-500"
              >
                Hide Translation
              </button>
            </div>
          )}
        </div>

        {/* Difficulty indicator */}
        {word.difficultyLevel && (
          <div className="flex justify-center">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 ${
              word.difficultyLevel === 1 ? "bg-emerald-100 text-emerald-700 border border-emerald-400" :
              word.difficultyLevel === 2 ? "bg-sky-100 text-sky-700 border border-sky-400" :
              word.difficultyLevel === 3 ? "bg-amber-100 text-amber-700 border border-amber-400" :
              word.difficultyLevel === 4 ? "bg-orange-100 text-orange-700 border border-orange-400" :
              "bg-rose-100 text-rose-700 border border-rose-400"
            }`}>
              <span>
                {word.difficultyLevel === 1 ? "🌱" :
                 word.difficultyLevel === 2 ? "📘" :
                 word.difficultyLevel === 3 ? "⭐" :
                 word.difficultyLevel === 4 ? "🔥" :
                 "👑"}
              </span>
              {word.difficultyLevel === 1 ? "Beginner" :
               word.difficultyLevel === 2 ? "Elementary" :
               word.difficultyLevel === 3 ? "Intermediate" :
               word.difficultyLevel === 4 ? "Advanced" :
               "Expert"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
