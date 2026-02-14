"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });

type DisplayMode = "phonetic" | "persian";

interface DisplayPreferenceContextType {
  displayMode: DisplayMode;
  toggleDisplayMode: () => void;
  isPhoneticFirst: boolean;
}

const DisplayPreferenceContext = createContext<DisplayPreferenceContextType>({
  displayMode: "phonetic",
  toggleDisplayMode: () => {},
  isPhoneticFirst: true,
});

export function useDisplayPreference() {
  return useContext(DisplayPreferenceContext);
}

export function DisplayPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("phonetic");

  useEffect(() => {
    const saved = localStorage.getItem("farsi-display-mode");
    if (saved === "persian" || saved === "phonetic") {
      setDisplayMode(saved);
    }
  }, []);

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => {
      const next = prev === "phonetic" ? "persian" : "phonetic";
      localStorage.setItem("farsi-display-mode", next);
      return next;
    });
  };

  return (
    <DisplayPreferenceContext.Provider
      value={{
        displayMode,
        toggleDisplayMode,
        isPhoneticFirst: displayMode === "phonetic",
      }}
    >
      {children}
    </DisplayPreferenceContext.Provider>
  );
}

export function DisplayToggle() {
  const { displayMode, toggleDisplayMode } = useDisplayPreference();
  const isPhonetic = displayMode === "phonetic";
  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => {
          toggleDisplayMode();
        }}
        className="flex items-center rounded-full border-2 border-persian-red-300 overflow-hidden transition-colors hover:border-persian-red-400"
        title={isPhonetic ? "Showing phonetic first — click for Persian script" : "Showing Persian script first — click for phonetic"}
      >
        <span
          className={`px-2.5 py-1 text-xs font-bold transition-colors ${
            isPhonetic
              ? "bg-persian-red-500 text-white"
              : "bg-persian-beige-100 text-persian-red-400"
          }`}
        >
          Aa
        </span>
        <span
          className={`px-2.5 py-1 text-xs font-bold transition-colors ${
            !isPhonetic
              ? "bg-persian-red-500 text-white"
              : "bg-persian-beige-100 text-persian-red-400"
          }`}
        >
          فا
        </span>
      </button>

      {/* Hand-drawn arrow hint — always visible */}
      <div className="absolute top-1/2 right-full mr-1.5 -translate-y-1/2 flex items-center gap-0.5 whitespace-nowrap z-10">
        <span
          className={`${caveat.className} text-persian-gold-500 text-sm leading-tight`}
          style={{ transform: "rotate(-2deg)" }}
        >
          Switch script!
        </span>
        <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="text-persian-gold-500 flex-shrink-0">
          <path d="M2 12C8 10 14 6 22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 1L23 4L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
