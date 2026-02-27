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
    <div className="bg-white/40 backdrop-blur-lg border border-persian-red-500/40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-xl p-3 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-persian-red-500/60 hover:bg-white/55 hover:scale-[1.02] transition-all ring-1 ring-white/20">
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
        </div>

        {/* Translation reveal button */}
        <div className="border-t border-persian-red-200 pt-2">
          {!showTranslation ? (
            <button
              onClick={() => setShowTranslation(true)}
              className="w-full py-1.5 px-3 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 transition-all text-xs font-semibold shadow-sm border border-persian-red-600/50 ring-1 ring-white/10"
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
                className="w-full py-1.5 px-3 bg-persian-beige-200/50 backdrop-blur-lg text-persian-red-500 rounded-xl hover:bg-persian-beige-300/60 transition-all text-xs font-semibold border border-persian-red-500/40 ring-1 ring-white/20"
              >
                Hide Translation
              </button>
            </div>
          )}
        </div>

        {/* Consolidated badge row */}
        {(word.entryType !== "word" || word.isFormal || word.difficultyLevel) && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold">
            {word.entryType === "phrase" && <span className="text-persian-gold-600">Phrase</span>}
            {word.entryType === "sentence" && <span className="text-teal-600">Sentence</span>}
            {(word.entryType !== "word" && (word.isFormal || word.difficultyLevel)) && <span className="text-persian-red-300">·</span>}
            {word.isFormal && <span className="text-persian-red-600">Formal</span>}
            {word.isFormal && word.difficultyLevel && <span className="text-persian-red-300">·</span>}
            {word.difficultyLevel && (
              <span className={`font-bold ${
                word.difficultyLevel === 1 ? "text-emerald-600" :
                word.difficultyLevel === 2 ? "text-sky-600" :
                word.difficultyLevel === 3 ? "text-amber-600" :
                word.difficultyLevel === 4 ? "text-orange-600" :
                "text-rose-600"
              }`}>
                {word.difficultyLevel === 1 ? "🌱 Beginner" :
                 word.difficultyLevel === 2 ? "📘 Elementary" :
                 word.difficultyLevel === 3 ? "⭐ Intermediate" :
                 word.difficultyLevel === 4 ? "🔥 Advanced" :
                 "👑 Expert"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
