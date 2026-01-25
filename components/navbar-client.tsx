"use client";

import Link from "next/link";

interface NavbarClientProps {
  isLoggedIn?: boolean;
}

export function NavbarClient({ isLoggedIn = false }: NavbarClientProps) {
  return (
    <nav className="bg-persian-beige-200/95 backdrop-blur-sm shadow-sm border-b-2 border-persian-red-500 transition-colors sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🇮🇷</span>
            <span className="text-xl font-bold text-persian-red-500">
              Learn Farsi
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-persian-red-700 hover:text-persian-red-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="text-sm font-semibold text-persian-red-700 hover:text-persian-red-500 transition-colors"
            >
              Learn
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/words" : "/login"}
              className="text-sm font-semibold text-persian-red-700 hover:text-persian-red-500 transition-colors"
            >
              Word Library
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/alphabet" : "/login"}
              className="text-sm font-semibold text-persian-red-700 hover:text-persian-red-500 transition-colors"
            >
              Persian Alphabet
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="px-4 py-2 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors text-sm font-semibold shadow-md"
            >
              {isLoggedIn ? "Continue Learning" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
