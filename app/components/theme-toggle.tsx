"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-persian-beige-300 dark:bg-persian-beige-700 transition-colors focus:outline-none focus:ring-2 focus:ring-persian-red-500 focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      <span
        className={`${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg`}
      >
        <span className="flex items-center justify-center h-full text-xs">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </span>
    </button>
  );
}
