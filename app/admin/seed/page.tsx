"use client";

import { useState } from "react";

interface SeedResult {
  success: boolean;
  message: string;
  stats?: Record<string, number>;
  lessons?: Array<{ id: string; title: string }>;
  error?: string;
  details?: string;
}

export default function AdminSeedPage() {
  const [results, setResults] = useState<Record<string, SeedResult | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const seedEndpoints = [
    {
      key: "resetVocabulary",
      name: "🔄 RESET ALL Vocabulary Data",
      endpoint: "/api/admin/reset-vocabulary",
      description: "Complete reset: Delete ALL words, lessons, and categories. Use this before re-seeding to start fresh!",
      danger: true,
    },
    {
      key: "clearGrammar",
      name: "Clear Grammar Data",
      endpoint: "/api/admin/clear-grammar",
      description: "Delete all existing grammar lessons and exercises",
      danger: true,
    },
    {
      key: "clearVocabulary",
      name: "Clear Vocabulary Lessons Only",
      endpoint: "/api/admin/clear-vocabulary",
      description: "Delete vocabulary lessons only (keeps words in database)",
      danger: true,
    },
    {
      key: "grammarExpanded",
      name: "Seed Grammar Lessons (12 lessons)",
      endpoint: "/api/admin/seed-grammar-expanded",
      description: "Add comprehensive grammar lessons covering pronouns, verbs, tenses, and more",
    },
    {
      key: "vocabularyOrganized",
      name: "Seed Vocabulary (4-Level Structure) ⭐",
      endpoint: "/api/admin/seed-vocabulary-organized",
      description: "40 lessons across 4 levels (Beginner → Intermediate). Part 1/Part 2 lessons spaced for natural progression.",
      recommended: true,
    },
    {
      key: "vocabularyExpanded",
      name: "Seed Vocabulary (Legacy - flat)",
      endpoint: "/api/admin/seed-vocabulary-expanded",
      description: "Add vocabulary organized by category (no level structure)",
    },
    {
      key: "verbsExpanded",
      name: "Seed Verbs (Legacy - flat)",
      endpoint: "/api/admin/seed-verbs-expanded",
      description: "Add essential verbs (no level structure)",
    },
    {
      key: "fixNumbering",
      name: "Fix Lesson Numbering",
      endpoint: "/api/admin/fix-lesson-numbering",
      description: "Renumber all vocabulary lessons sequentially (Lesson 1, Lesson 2, etc.)",
    },
  ];

  const runSeed = async (key: string, endpoint: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setResults((prev) => ({ ...prev, [key]: null }));

    try {
      const response = await fetch(endpoint, { method: "POST" });
      const data = await response.json();
      setResults((prev) => ({ ...prev, [key]: data }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [key]: { success: false, message: "Network error", error: String(error) },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const runAllSeeds = async () => {
    // Run recommended seeds in sequence
    const recommendedKeys = ["vocabularyOrganized", "grammarExpanded"];
    for (const key of recommendedKeys) {
      const seed = seedEndpoints.find((s) => s.key === key);
      if (seed) {
        await runSeed(seed.key, seed.endpoint);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin: Seed Database</h1>
        <p className="text-gray-600 mb-8">
          Use these buttons to populate the database with vocabulary and grammar content from the Google Doc.
        </p>

        <div className="mb-8">
          <button
            onClick={runAllSeeds}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg"
          >
            Run All Seeds (Vocabulary + Verbs + Grammar)
          </button>
        </div>

        <div className="space-y-4">
          {seedEndpoints.map((seed) => (
            <div
              key={seed.key}
              className={`bg-white rounded-lg shadow p-6 ${seed.danger ? "border-2 border-red-300" : ""} ${"recommended" in seed && seed.recommended ? "border-2 border-green-400 bg-green-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800">{seed.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{seed.description}</p>
                  {seed.danger && (
                    <p className="text-red-600 text-sm mt-1 font-medium">
                      ⚠️ Warning: This will delete data!
                    </p>
                  )}
                </div>
                <button
                  onClick={() => runSeed(seed.key, seed.endpoint)}
                  disabled={loading[seed.key]}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    seed.danger
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } disabled:opacity-50`}
                >
                  {loading[seed.key] ? "Running..." : "Run"}
                </button>
              </div>

              {results[seed.key] && (
                <div
                  className={`mt-4 p-4 rounded ${
                    results[seed.key]?.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      results[seed.key]?.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {results[seed.key]?.success ? "✅ Success" : "❌ Failed"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{results[seed.key]?.message}</p>
                  {results[seed.key]?.stats && (
                    <div className="mt-2 text-sm text-gray-600">
                      {Object.entries(results[seed.key]!.stats!).map(([key, value]) => (
                        <p key={key}>
                          {key}: <strong>{value}</strong>
                        </p>
                      ))}
                    </div>
                  )}
                  {results[seed.key]?.lessons && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Lessons created:</p>
                      <ul className="list-disc list-inside">
                        {results[seed.key]!.lessons!.map((lesson) => (
                          <li key={lesson.id}>{lesson.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results[seed.key]?.error && (
                    <p className="text-sm text-red-600 mt-1">{results[seed.key]?.details}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
            <li>
              To add new content: Click &quot;Run All Seeds&quot; or run individual seeds
            </li>
            <li>
              To replace grammar content: First click &quot;Clear Grammar Data&quot;, then &quot;Seed Grammar Lessons&quot;
            </li>
            <li>
              Vocabulary and verbs will skip existing words (no duplicates)
            </li>
            <li>
              After seeding, visit /dashboard/grammar or /dashboard/lessons to see the content
            </li>
          </ol>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
