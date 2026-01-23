"use client";

import { useState, useMemo } from "react";
import type { Vocabulary } from "@/db/schema";
import WordCard from "../word-card";

interface WordsClientProps {
  words: Vocabulary[];
}

export default function WordsClient({ words }: WordsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter words based on search query
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) {
      return words;
    }

    const query = searchQuery.toLowerCase().trim();

    return words.filter((word) => {
      // Search in phonetic pronunciation
      if (word.phonetic?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in Farsi word
      if (word.farsiWord?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in English translation
      if (word.englishTranslation?.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [words, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
          Word Library
        </h2>
        <p className="text-persian-red-700 font-medium">
          Browse and learn all {words.length} words in the collection
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-2 border-persian-red-500 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <input
            type="text"
            placeholder="Search by phonetic, Farsi, or English translation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-persian-red-300 rounded-lg focus:outline-none focus:border-persian-red-500 text-persian-red-700 placeholder:text-persian-red-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-persian-red-600 font-medium">
            Found {filteredWords.length} word{filteredWords.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Difficulty Legend */}
      <div className="bg-white border-2 border-persian-red-500 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-persian-red-500">Difficulty Levels:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border-2 border-emerald-400 flex items-center gap-1">
            <span>🌱</span> Beginner
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border-2 border-sky-400 flex items-center gap-1">
            <span>📘</span> Elementary
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border-2 border-amber-400 flex items-center gap-1">
            <span>⭐</span> Intermediate
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border-2 border-orange-400 flex items-center gap-1">
            <span>🔥</span> Advanced
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border-2 border-rose-400 flex items-center gap-1">
            <span>👑</span> Expert
          </span>
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white border-3 border-persian-red-500 shadow-xl rounded-lg p-8 text-center">
          <p className="text-persian-red-700 font-medium">
            {searchQuery
              ? `No words found matching "${searchQuery}". Try a different search term.`
              : "No vocabulary words available yet. Check back soon!"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredWords.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </div>
  );
}
