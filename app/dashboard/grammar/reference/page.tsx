"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface TenseData {
  name: string;
  namefarsi: string;
  icon: string;
  level: number;
  description: string;
  formation: string;
  conjugation: { person: string; form: string; english: string }[];
  negative: { person: string; form: string }[];
  examples: { farsi: string; english: string }[];
  lessonRef: string;
}

const tenses: TenseData[] = [
  // Level 1
  {
    name: "Present (Habitual)",
    namefarsi: "حال ساده",
    icon: "🔄",
    level: 1,
    description: "Habitual or general actions: I go, I eat, I read",
    formation: "mi- + verb stem + personal ending",
    conjugation: [
      { person: "man", form: "miram", english: "I go" },
      { person: "to", form: "miri", english: "You go" },
      { person: "oo", form: "mire", english: "He/She goes" },
      { person: "ma", form: "mirim", english: "We go" },
      { person: "shoma", form: "mirid", english: "You go (formal)" },
      { person: "oonaa", form: "miran", english: "They go" },
    ],
    negative: [
      { person: "man", form: "nemiram" },
      { person: "to", form: "nemiri" },
      { person: "oo", form: "nemire" },
    ],
    examples: [
      { farsi: "man har rooz ketaab mikhoonam", english: "I read a book every day" },
      { farsi: "oo be madrese mire", english: "He/She goes to school" },
    ],
    lessonRef: "G3",
  },
  // Level 2
  {
    name: "Imperative",
    namefarsi: "امری",
    icon: "📢",
    level: 2,
    description: "Commands and requests: Go! Eat! Look!",
    formation: "be-/bo- + verb stem (+ -id for formal)",
    conjugation: [
      { person: "to", form: "boro", english: "Go!" },
      { person: "shoma", form: "borid", english: "Go! (formal)" },
      { person: "to", form: "bokhor", english: "Eat!" },
      { person: "shoma", form: "bokhorid", english: "Eat! (formal)" },
      { person: "to", form: "bebin", english: "Look!" },
      { person: "shoma", form: "bebinid", english: "Look! (formal)" },
    ],
    negative: [
      { person: "to", form: "naro" },
      { person: "to", form: "nakhor" },
      { person: "to", form: "nabin" },
    ],
    examples: [
      { farsi: "lotfan benshinid", english: "Please sit down (formal)" },
      { farsi: "nagoo!", english: "Don't say!" },
    ],
    lessonRef: "G9",
  },
  {
    name: "Simple Past",
    namefarsi: "گذشته ساده",
    icon: "⏮️",
    level: 2,
    description: "Completed past actions: I went, I ate, I saw",
    formation: "past stem + personal ending",
    conjugation: [
      { person: "man", form: "raftam", english: "I went" },
      { person: "to", form: "rafti", english: "You went" },
      { person: "oo", form: "raft", english: "He/She went" },
      { person: "ma", form: "raftim", english: "We went" },
      { person: "shoma", form: "raftid", english: "You went (formal)" },
      { person: "oonaa", form: "raftand", english: "They went" },
    ],
    negative: [
      { person: "man", form: "naraftam" },
      { person: "to", form: "narafti" },
      { person: "oo", form: "naraft" },
    ],
    examples: [
      { farsi: "man dirooz be madrese raftam", english: "I went to school yesterday" },
      { farsi: "ma ghazaa khordim", english: "We ate food" },
    ],
    lessonRef: "G10",
  },
  {
    name: "Present Continuous",
    namefarsi: "حال استمراری",
    icon: "▶️",
    level: 2,
    description: "Actions happening right now: I am going, I am eating",
    formation: "daashtan (present) + mi-verb",
    conjugation: [
      { person: "man", form: "daram miram", english: "I am going" },
      { person: "to", form: "dari miri", english: "You are going" },
      { person: "oo", form: "dare mire", english: "He/She is going" },
      { person: "ma", form: "darim mirim", english: "We are going" },
      { person: "shoma", form: "darid mirid", english: "You are going (formal)" },
      { person: "oonaa", form: "daran miran", english: "They are going" },
    ],
    negative: [
      { person: "man", form: "nadaram miram" },
      { person: "to", form: "nadari miri" },
      { person: "oo", form: "nadare mire" },
    ],
    examples: [
      { farsi: "daram ghazaa mikhoram", english: "I am eating food (right now)" },
      { farsi: "dare minevise", english: "He/She is writing (right now)" },
    ],
    lessonRef: "G11",
  },
  // Level 3
  {
    name: "Subjunctive",
    namefarsi: "التزامی",
    icon: "💭",
    level: 3,
    description: "Possibility, desire, necessity: I should go, I want to eat",
    formation: "be- + verb stem + personal ending",
    conjugation: [
      { person: "man", form: "beram", english: "that I go" },
      { person: "to", form: "beri", english: "that you go" },
      { person: "oo", form: "bere", english: "that he/she go" },
      { person: "ma", form: "berim", english: "that we go" },
      { person: "shoma", form: "berid", english: "that you go (formal)" },
      { person: "oonaa", form: "beran", english: "that they go" },
    ],
    negative: [
      { person: "man", form: "naram" },
      { person: "to", form: "nari" },
      { person: "oo", form: "nare" },
    ],
    examples: [
      { farsi: "baayad beram", english: "I should/must go" },
      { farsi: "mikhaam bekhoram", english: "I want to eat" },
    ],
    lessonRef: "G12",
  },
  {
    name: "Past Continuous",
    namefarsi: "گذشته استمراری",
    icon: "⏪",
    level: 3,
    description: "Ongoing past actions: I was going, I was eating",
    formation: "daashtan (past) + mi-verb",
    conjugation: [
      { person: "man", form: "dashtam miraftam", english: "I was going" },
      { person: "to", form: "dashti mirafti", english: "You were going" },
      { person: "oo", form: "dasht miraft", english: "He/She was going" },
      { person: "ma", form: "dashtim miraftim", english: "We were going" },
      { person: "shoma", form: "dashtid miraftid", english: "You were going (formal)" },
      { person: "oonaa", form: "dashtand miraftand", english: "They were going" },
    ],
    negative: [
      { person: "man", form: "nadashtam miraftam" },
      { person: "to", form: "nadashti mirafti" },
      { person: "oo", form: "nadasht miraft" },
    ],
    examples: [
      { farsi: "dashtam mikhordam ke oo oomad", english: "I was eating when he arrived" },
      { farsi: "dasht ketaab mikhond", english: "He/She was reading a book" },
    ],
    lessonRef: "G14",
  },
  {
    name: "Present Perfect",
    namefarsi: "ماضی نقلی",
    icon: "✅",
    level: 3,
    description: "Completed actions with present relevance: I have gone, I have eaten",
    formation: "past participle (-e) + boodan endings",
    conjugation: [
      { person: "man", form: "rafte-am", english: "I have gone" },
      { person: "to", form: "rafte-i", english: "You have gone" },
      { person: "oo", form: "rafte", english: "He/She has gone" },
      { person: "ma", form: "rafte-im", english: "We have gone" },
      { person: "shoma", form: "rafte-id", english: "You have gone (formal)" },
      { person: "oonaa", form: "rafte-and", english: "They have gone" },
    ],
    negative: [
      { person: "man", form: "narafte-am" },
      { person: "to", form: "narafte-i" },
      { person: "oo", form: "narafte" },
    ],
    examples: [
      { farsi: "man in film ro dide-am", english: "I have seen this movie" },
      { farsi: "oo rafte", english: "He/She has gone" },
    ],
    lessonRef: "G15",
  },
  {
    name: "Past Perfect",
    namefarsi: "ماضی بعید",
    icon: "⏮️",
    level: 3,
    description: "Actions completed before another past event: I had gone",
    formation: "past participle + past boodan",
    conjugation: [
      { person: "man", form: "rafte boodam", english: "I had gone" },
      { person: "to", form: "rafte boodi", english: "You had gone" },
      { person: "oo", form: "rafte bood", english: "He/She had gone" },
      { person: "ma", form: "rafte boodim", english: "We had gone" },
      { person: "shoma", form: "rafte boodid", english: "You had gone (formal)" },
      { person: "oonaa", form: "rafte boodand", english: "They had gone" },
    ],
    negative: [
      { person: "man", form: "narafte boodam" },
      { person: "to", form: "narafte boodi" },
      { person: "oo", form: "narafte bood" },
    ],
    examples: [
      { farsi: "ghazaa ro khorde boodam ke oo oomad", english: "I had eaten when he arrived" },
      { farsi: "ghabl az oo rafte boodim", english: "We had gone before him" },
    ],
    lessonRef: "G16",
  },
  {
    name: "Simple Future",
    namefarsi: "آینده",
    icon: "🔮",
    level: 3,
    description: "Future actions: I will go, I will eat",
    formation: "mikhaam + subjunctive (spoken) / khaah- + past stem (formal)",
    conjugation: [
      { person: "man", form: "mikhaam beram", english: "I will go" },
      { person: "to", form: "mikhaay beri", english: "You will go" },
      { person: "oo", form: "mikhaad bere", english: "He/She will go" },
      { person: "ma", form: "mikhaym berim", english: "We will go" },
      { person: "shoma", form: "mikhayd berid", english: "You will go (formal)" },
      { person: "oonaa", form: "mikhaan beran", english: "They will go" },
    ],
    negative: [
      { person: "man", form: "nemikhaaam beram" },
      { person: "to", form: "nemikhaay beri" },
      { person: "oo", form: "nemikhaad bere" },
    ],
    examples: [
      { farsi: "farda mikhaam biam", english: "I'll come tomorrow (spoken)" },
      { farsi: "mikhaam beram khooneh", english: "I want to go home / I'll go home" },
    ],
    lessonRef: "G17",
  },
];

const levelColors: Record<number, { bg: string; border: string; text: string; badge: string; headerBg: string }> = {
  1: { bg: "bg-[#4aa6a6]/10", border: "border-[#4aa6a6]", text: "text-[#3d8a8a]", badge: "bg-[#4aa6a6]", headerBg: "bg-[#4aa6a6]/5" },
  2: { bg: "bg-persian-gold-50", border: "border-persian-gold-500", text: "text-persian-gold-800", badge: "bg-persian-gold-500", headerBg: "bg-persian-gold-50" },
  3: { bg: "bg-persian-red-50", border: "border-persian-red-500", text: "text-persian-red-800", badge: "bg-persian-red-500", headerBg: "bg-persian-red-50" },
};

export default function GrammarReferencePage() {
  const [expandedTense, setExpandedTense] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <Link
          href="/dashboard/grammar"
          className="text-persian-red-500 hover:text-persian-red-600 font-medium text-sm sm:text-base"
        >
          &larr; Back to Grammar Lessons
        </Link>
      </div>

      {/* Header */}
      <div className="bg-persian-red-500 rounded-xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white border-2 border-persian-red-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Verb Tense Reference</h1>
            <p className="text-persian-beige-200 text-xs sm:text-sm font-medium">
              Quick reference for all Farsi verb tenses using <span className="font-bold text-white">raftan</span> (to go)
            </p>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 overflow-hidden flex-shrink-0">
            <Image src="/bookicon.png" alt="Book" width={100} height={100} className="w-full h-full object-cover scale-125" />
          </div>
        </div>
      </div>

      {/* Tense Cards */}
      <div className="space-y-3 sm:space-y-4">
        {tenses.map((tense) => {
          const isExpanded = expandedTense === tense.name;
          const colors = levelColors[tense.level] || levelColors[3];

          return (
            <div
              key={tense.name}
              className={`border-2 rounded-xl shadow-lg overflow-hidden transition-all ${colors.border} ${isExpanded ? colors.bg : "bg-white"}`}
            >
              {/* Header - Always visible */}
              <button
                onClick={() => setExpandedTense(isExpanded ? null : tense.name)}
                className={`w-full px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between text-left transition-colors ${isExpanded ? "" : "hover:bg-persian-beige-50"}`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{tense.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm sm:text-base font-bold ${colors.text}`}>{tense.name}</h3>
                      <span className={`text-[10px] sm:text-xs font-bold text-white px-1.5 py-0.5 rounded ${colors.badge}`}>
                        Lv{tense.level}
                      </span>
                    </div>
                    <p className="text-xs text-persian-red-600 font-medium mt-0.5 line-clamp-1">{tense.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                  <span className={`text-xs sm:text-sm font-mono font-bold ${colors.text} hidden sm:block`}>
                    {tense.conjugation[0].form}
                  </span>
                  <span className={`text-sm sm:text-base transition-transform ${colors.text} ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4">
                  {/* Farsi name */}
                  <div className="text-center">
                    <span className="text-lg sm:text-xl font-bold text-persian-red-500" dir="rtl" style={{ fontFamily: "serif" }}>
                      {tense.namefarsi}
                    </span>
                  </div>

                  {/* Formation Rule */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-persian-beige-300">
                    <h4 className="text-xs font-bold text-persian-red-600 uppercase mb-1">Formation</h4>
                    <p className={`font-mono font-bold text-sm sm:text-base ${colors.text}`}>{tense.formation}</p>
                  </div>

                  {/* Conjugation Table */}
                  <div>
                    <h4 className="text-xs font-bold text-persian-red-600 uppercase mb-2">Conjugation</h4>
                    <div className="bg-white rounded-lg border-2 border-persian-beige-300 overflow-hidden">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-persian-beige-100 border-b-2 border-persian-beige-300">
                            <th className="px-3 py-2 sm:px-4 text-left font-bold text-persian-red-700">Person</th>
                            <th className="px-3 py-2 sm:px-4 text-left font-bold text-persian-red-700">Farsi (Phonetic)</th>
                            <th className="px-3 py-2 sm:px-4 text-left font-bold text-persian-red-700">English</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tense.conjugation.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "" : "bg-persian-beige-50"}>
                              <td className="px-3 py-1.5 sm:px-4 sm:py-2 font-semibold text-persian-red-700">{row.person}</td>
                              <td className={`px-3 py-1.5 sm:px-4 sm:py-2 font-mono font-bold ${colors.text}`}>{row.form}</td>
                              <td className="px-3 py-1.5 sm:px-4 sm:py-2 text-persian-red-600">{row.english}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Negative Forms */}
                  <div>
                    <h4 className="text-xs font-bold text-persian-red-600 uppercase mb-2">Negative</h4>
                    <div className="flex flex-wrap gap-2">
                      {tense.negative.map((neg, i) => (
                        <span
                          key={i}
                          className="bg-white border-2 border-persian-beige-300 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm"
                        >
                          <span className="text-persian-red-400 font-medium">{neg.person}:</span>{" "}
                          <span className={`font-mono font-bold ${colors.text}`}>{neg.form}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="text-xs font-bold text-persian-red-600 uppercase mb-2">Examples</h4>
                    <div className="space-y-2">
                      {tense.examples.map((ex, i) => (
                        <div key={i} className="bg-white border-2 border-persian-beige-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3">
                          <p className={`font-mono font-bold text-sm ${colors.text}`}>{ex.farsi}</p>
                          <p className="text-xs sm:text-sm text-persian-red-600 italic">{ex.english}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Link to Lesson */}
                  <div className="pt-1">
                    <Link
                      href="/dashboard/grammar"
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm hover:shadow-md bg-persian-red-500 text-white hover:bg-persian-red-600`}
                    >
                      Go to {tense.lessonRef} Lesson <span className="btn-arrow ml-1">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
