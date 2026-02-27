"use client";

import { useState, useMemo } from "react";
import type { Vocabulary } from "@/db/schema";
import WordCard from "../word-card";
import { DisplayToggle } from "@/components/display-preference";

interface WordsClientProps {
  words: Vocabulary[];
}

const difficultyLevels = [
  { level: 1, name: "Beginner", emoji: "🌱", colors: "bg-emerald-100 text-emerald-700 border-emerald-400", activeColors: "bg-emerald-500 text-white border-emerald-600" },
  { level: 2, name: "Elementary", emoji: "📘", colors: "bg-sky-100 text-sky-700 border-sky-400", activeColors: "bg-sky-500 text-white border-sky-600" },
  { level: 3, name: "Intermediate", emoji: "⭐", colors: "bg-amber-100 text-amber-700 border-amber-400", activeColors: "bg-amber-500 text-white border-amber-600" },
  { level: 4, name: "Advanced", emoji: "🔥", colors: "bg-orange-100 text-orange-700 border-orange-400", activeColors: "bg-orange-500 text-white border-orange-600" },
  { level: 5, name: "Expert", emoji: "👑", colors: "bg-rose-100 text-rose-700 border-rose-400", activeColors: "bg-rose-500 text-white border-rose-600" },
];

const entryTypes = [
  { type: "word", name: "Words", colors: "bg-persian-red-100 text-persian-red-700 border-persian-red-300", activeColors: "bg-persian-red-500 text-white border-persian-red-600" },
  { type: "phrase", name: "Phrases", colors: "bg-amber-100 text-amber-700 border-persian-gold-400", activeColors: "bg-persian-gold-500 text-white border-persian-gold-600" },
  { type: "sentence", name: "Sentences", colors: "bg-teal-100 text-teal-700 border-teal-400", activeColors: "bg-teal-500 text-white border-teal-600" },
] as const;

export default function WordsClient({ words }: WordsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Filter and sort words alphabetically
  const filteredWords = useMemo(() => {
    let result = [...words];

    // Filter by difficulty level
    if (selectedLevel !== null) {
      result = result.filter((word) => word.difficultyLevel === selectedLevel);
    }

    // Filter by entry type
    if (selectedType !== null) {
      result = result.filter((word) => word.entryType === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((word) => {
        if (word.phonetic?.toLowerCase().includes(query)) return true;
        if (word.farsiWord?.toLowerCase().includes(query)) return true;
        if (word.englishTranslation?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    // Sort alphabetically A-Z by phonetic/farsiWord
    result.sort((a, b) => {
      const aWord = (a.phonetic || a.farsiWord || "").toLowerCase();
      const bWord = (b.phonetic || b.farsiWord || "").toLowerCase();
      return aWord.localeCompare(bWord);
    });

    return result;
  }, [words, searchQuery, selectedLevel, selectedType]);

  // Count words per level
  const levelCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    words.forEach((word) => {
      if (word.difficultyLevel) {
        counts[word.difficultyLevel] = (counts[word.difficultyLevel] || 0) + 1;
      }
    });
    return counts;
  }, [words]);

  // Count words per entry type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    words.forEach((word) => {
      const type = word.entryType || "word";
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [words]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLevel(null);
    setSelectedType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            Word Library
          </h2>
          <p className="text-persian-red-700 font-medium">
            Browse and learn all {words.length} words in the collection
          </p>
        </div>
        <DisplayToggle />
      </div>

      {/* Search Bar */}
      <div className="bg-white/40 backdrop-blur-lg border border-persian-red-500/40 rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-white/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <input
            type="text"
            placeholder="Search by phonetic, Farsi, or English translation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/50 backdrop-blur-lg border border-persian-red-300/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-persian-red-300/30 focus:border-persian-red-500 text-persian-red-700 placeholder:text-persian-red-400"
          />
          {(searchQuery || selectedLevel !== null || selectedType !== null) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 hover:scale-105 transition-all font-semibold shadow-md border border-persian-red-600/50 ring-1 ring-white/10"
            >
              Clear
            </button>
          )}
        </div>
        {(searchQuery || selectedLevel !== null || selectedType !== null) && (
          <p className="mt-2 text-sm text-persian-red-600 font-medium">
            Showing {filteredWords.length} word{filteredWords.length !== 1 ? "s" : ""} (sorted A-Z)
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/40 backdrop-blur-lg border border-persian-red-500/40 rounded-xl p-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-white/20 space-y-2">
        {/* Level Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-persian-red-500">Level:</span>
          <button
            onClick={() => setSelectedLevel(null)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
              selectedLevel === null
                ? "bg-persian-red-500 text-white border-persian-red-600"
                : "bg-persian-red-50 text-persian-red-600 border-persian-red-300 hover:bg-persian-red-100"
            }`}
          >
            All ({words.length})
          </button>
          {difficultyLevels.map((level) => (
            <button
              key={level.level}
              onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-0.5 ${
                selectedLevel === level.level ? level.activeColors : level.colors
              } hover:opacity-80`}
            >
              <span>{level.emoji}</span> {level.name} ({levelCounts[level.level] || 0})
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-persian-red-500">Type:</span>
          <button
            onClick={() => setSelectedType(null)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
              selectedType === null
                ? "bg-persian-red-500 text-white border-persian-red-600"
                : "bg-persian-red-50 text-persian-red-600 border-persian-red-300 hover:bg-persian-red-100"
            }`}
          >
            All
          </button>
          {entryTypes.map((et) => (
            <button
              key={et.type}
              onClick={() => setSelectedType(selectedType === et.type ? null : et.type)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                selectedType === et.type ? et.activeColors : et.colors
              } hover:opacity-80`}
            >
              {et.name} ({typeCounts[et.type] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-lg border border-persian-red-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl p-8 text-center ring-1 ring-white/20">
          <p className="text-persian-red-700 font-medium">
            {searchQuery || selectedLevel !== null || selectedType !== null
              ? "No words found with current filters. Try adjusting your search or filters."
              : "No vocabulary words available yet. Check back soon!"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredWords.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </div>
  );
}
