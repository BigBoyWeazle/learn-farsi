"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { getCurrentLevel } from "@/lib/levels";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [userLevel, setUserLevel] = useState<{ level: number; title: string; titlePersian: string } | null>(null);

  const isGuest = !user;
  const displayName = user?.name || user?.email?.split("@")[0] || "Learner";

  // Fetch user stats to get level (only for logged-in users)
  useEffect(() => {
    if (isGuest) return;
    fetch("/api/user/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const level = getCurrentLevel(data.totalXP || 0);
          setUserLevel({ level: level.level, title: level.title, titlePersian: level.titlePersian });
        }
      })
      .catch(console.error);
  }, [isGuest]);

  return (
    <header className="bg-white border-b-3 border-persian-red-500 shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 z-10">
            <Image
              src="/pomegranatedrawn.png"
              alt="Learn Farsi"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold text-persian-red-500 hidden sm:inline">
              Learn Farsi
            </span>
          </Link>

          {/* Navigation — centered absolutely */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/dashboard"
              className="text-persian-red-700 hover:text-persian-red-500 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/lessons"
              className="text-persian-red-700 hover:text-persian-red-500 font-medium transition-colors"
            >
              Lessons
            </Link>
            <Link
              href="/dashboard/grammar"
              className="text-persian-red-700 hover:text-persian-red-500 font-medium transition-colors"
            >
              Grammar
            </Link>
            <Link
              href="/dashboard/practice"
              className="text-persian-red-700 hover:text-persian-red-500 font-medium transition-colors"
            >
              Practice
            </Link>
            <Link
              href="/dashboard/alphabet"
              className="text-persian-red-700 hover:text-persian-red-500 font-medium transition-colors"
            >
              Alphabet
            </Link>
          </nav>

          {/* Guest: Sign In button */}
          {isGuest && (
            <div className="flex items-center gap-3">
              {/* Mobile menu button for guests */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden flex items-center px-3 py-2 rounded-lg hover:bg-persian-beige-100 transition-colors"
              >
                <svg className="w-6 h-6 text-persian-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
              <Link
                href="/login"
                className="px-5 py-2 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-bold text-sm shadow-md"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Logged-in: User Menu */}
          {!isGuest && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-persian-beige-100 transition-colors"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-persian-red-400"
                  />
                ) : (
                  <div className="w-8 h-8 bg-persian-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {displayName[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-persian-red-700 font-medium">
                    Hi, {displayName}!
                  </span>
                  {userLevel && (
                    <span className="text-xs text-persian-gold-600 font-semibold">
                      Lvl {userLevel.level} {userLevel.title}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-persian-red-500 transition-transform ${showMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-persian-red-300 rounded-lg shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-persian-red-200 flex items-center gap-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={displayName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border-2 border-persian-red-400"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-persian-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {displayName[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-persian-red-700">{displayName}</p>
                      {userLevel && (
                        <p className="text-xs font-semibold text-persian-gold-600">
                          Level {userLevel.level}: {userLevel.title}
                        </p>
                      )}
                      <p className="text-xs text-persian-red-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100 md:hidden"
                      onClick={() => setShowMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/lessons"
                      className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100 md:hidden"
                      onClick={() => setShowMenu(false)}
                    >
                      Lessons
                    </Link>
                    <Link
                      href="/dashboard/grammar"
                      className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100 md:hidden"
                      onClick={() => setShowMenu(false)}
                    >
                      Grammar
                    </Link>
                    <Link
                      href="/dashboard/practice"
                      className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100 md:hidden"
                      onClick={() => setShowMenu(false)}
                    >
                      Practice
                    </Link>
                    <Link
                      href="/dashboard/alphabet"
                      className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100 md:hidden"
                      onClick={() => setShowMenu(false)}
                    >
                      Alphabet
                    </Link>
                    <div className="border-t border-persian-red-200 mt-2 pt-2 md:border-t-0 md:mt-0 md:pt-0">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full text-left px-4 py-2 text-sm text-persian-red-600 hover:bg-persian-beige-100 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guest mobile dropdown */}
          {isGuest && showMenu && (
            <div className="absolute top-16 right-4 w-56 bg-white border-2 border-persian-red-300 rounded-lg shadow-xl z-50 md:hidden">
              <div className="py-2">
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100" onClick={() => setShowMenu(false)}>Dashboard</Link>
                <Link href="/dashboard/lessons" className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100" onClick={() => setShowMenu(false)}>Lessons</Link>
                <Link href="/dashboard/grammar" className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100" onClick={() => setShowMenu(false)}>Grammar</Link>
                <Link href="/dashboard/practice" className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100" onClick={() => setShowMenu(false)}>Practice</Link>
                <Link href="/dashboard/alphabet" className="block px-4 py-2 text-sm text-persian-red-700 hover:bg-persian-beige-100" onClick={() => setShowMenu(false)}>Alphabet</Link>
                <div className="border-t border-persian-red-200 mt-2 pt-2">
                  <Link href="/login" className="block px-4 py-2 text-sm text-persian-red-500 hover:bg-persian-beige-100 font-bold" onClick={() => setShowMenu(false)}>Sign In</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
