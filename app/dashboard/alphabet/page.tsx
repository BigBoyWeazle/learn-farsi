"use client";

import { useState } from "react";
import Link from "next/link";
import { persianAlphabet, letterGroups, type PersianLetter } from "@/lib/alphabet-data";

export default function AlphabetPage() {
  const [selectedLetter, setSelectedLetter] = useState<PersianLetter | null>(null);
  const [showUniqueToPersian, setShowUniqueToPersian] = useState(false);

  const filteredLetters = showUniqueToPersian
    ? persianAlphabet.filter((l) => letterGroups.uniqueToPersian.includes(l.letter))
    : persianAlphabet;

  return (
    <div className="min-h-screen bg-persian-beige-200 dark:bg-[#654321] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-persian-red-700 dark:text-persian-gold-400 mb-2">
            Persian Alphabet
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Learn all 32 letters of the Persian alphabet
          </p>
          <Link
            href="/dashboard/alphabet/practice"
            className="inline-flex items-center gap-2 bg-persian-red-600 hover:bg-persian-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <span>Practice Alphabet</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowUniqueToPersian(!showUniqueToPersian)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showUniqueToPersian
                ? "bg-persian-gold-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
            }`}
          >
            {showUniqueToPersian ? "Show All Letters" : "Show Unique to Persian (4)"}
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-persian-beige-100 dark:bg-gray-800 rounded-xl p-4 mb-8 border border-persian-gold-300 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 text-center">
            <span className="font-semibold">Tip:</span> Persian is written right-to-left.
            Click on any letter to see all its forms and an example word.
          </p>
        </div>

        {/* Letter Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-8">
          {filteredLetters.map((letter) => (
            <button
              key={letter.letter}
              onClick={() => setSelectedLetter(selectedLetter?.letter === letter.letter ? null : letter)}
              className={`relative p-4 rounded-xl transition-all duration-200 ${
                selectedLetter?.letter === letter.letter
                  ? "bg-persian-red-600 text-white scale-105 shadow-lg"
                  : "bg-white dark:bg-gray-800 hover:bg-persian-beige-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-lg"
              } ${
                letterGroups.uniqueToPersian.includes(letter.letter)
                  ? "ring-2 ring-persian-gold-400"
                  : ""
              }`}
            >
              <span className="text-3xl md:text-4xl font-bold block">{letter.letter}</span>
              <span className={`text-xs mt-1 block ${
                selectedLetter?.letter === letter.letter
                  ? "text-white/80"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {letter.name}
              </span>
              {letterGroups.uniqueToPersian.includes(letter.letter) && (
                <span className="absolute top-1 right-1 text-xs">
                  {selectedLetter?.letter === letter.letter ? "🇮🇷" : "🇮🇷"}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Selected Letter Detail */}
        {selectedLetter && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Letter Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl md:text-8xl font-bold text-persian-red-600 dark:text-persian-gold-400">
                    {selectedLetter.letter}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedLetter.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedLetter.nameFarsi}
                    </p>
                    <p className="text-persian-red-600 dark:text-persian-gold-400 font-mono text-lg">
                      /{selectedLetter.transliteration}/
                    </p>
                  </div>
                </div>

                {selectedLetter.notes && (
                  <div className="bg-persian-beige-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <span className="font-semibold">Note:</span> {selectedLetter.notes}
                    </p>
                  </div>
                )}

                {/* Example Word */}
                <div className="bg-persian-beige-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Example Word
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1" dir="rtl">
                    {selectedLetter.example.word}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-mono text-persian-red-600 dark:text-persian-gold-400">
                      {selectedLetter.example.phonetic}
                    </span>
                    {" - "}
                    {selectedLetter.example.meaning}
                  </p>
                </div>
              </div>

              {/* Letter Forms */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Letter Forms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedLetter.forms).map(([position, form]) => (
                    <div
                      key={position}
                      className="bg-persian-beige-50 dark:bg-gray-700 rounded-xl p-4 text-center"
                    >
                      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2" dir="rtl">
                        {form}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {position}
                      </p>
                    </div>
                  ))}
                </div>
                {letterGroups.nonConnecting.includes(selectedLetter.letter) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                    This letter does not connect to the following letter
                  </p>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedLetter(null)}
              className="mt-6 w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded ring-2 ring-persian-gold-400 bg-white dark:bg-gray-800"></span>
            <span>Unique to Persian</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-persian-red-600"></span>
            <span>Selected</span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-persian-red-600 dark:text-persian-gold-400 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
