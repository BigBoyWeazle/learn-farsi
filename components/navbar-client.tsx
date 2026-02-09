"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarClientProps {
  isLoggedIn?: boolean;
}

export function NavbarClient({ isLoggedIn = false }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-persian-beige-200/95 backdrop-blur-sm shadow-sm border-b-2 border-persian-red-500 transition-colors sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 overflow-hidden flex-shrink-0">
              <Image
                src="/carpetlogo.png"
                alt="Learn Farsi"
                width={80}
                height={80}
                className="w-full h-full object-cover scale-150"
              />
            </div>
            <span className="text-xl font-bold text-persian-red-500">
              Learn Farsi
            </span>
            <span className="bg-persian-gold-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">BETA</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="px-3 py-1.5 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors text-sm font-semibold shadow-md"
            >
              {isLoggedIn ? "Continue" : "Get Started"}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-persian-red-700 hover:bg-persian-beige-300 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-persian-red-300 bg-persian-beige-200/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-persian-red-700 hover:bg-persian-beige-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-persian-red-700 hover:bg-persian-beige-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Learn
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/words" : "/login"}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-persian-red-700 hover:bg-persian-beige-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Word Library
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/alphabet" : "/login"}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-persian-red-700 hover:bg-persian-beige-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Persian Alphabet
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
