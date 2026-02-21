"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
}

const tagColors: Record<string, string> = {
  Alphabet: "bg-persian-turquoise-500 text-white",
  Phrases: "bg-persian-gold-500 text-white",
  Beginner: "bg-green-500 text-white",
  Grammar: "bg-purple-500 text-white",
  Tips: "bg-persian-red-400 text-white",
  Culture: "bg-amber-600 text-white",
};

function getTagColor(tag: string) {
  return tagColors[tag] || "bg-persian-red-300 text-white";
}

export function BlogCarousel({ posts }: { posts: BlogPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white border-2 border-persian-red-300 rounded-full shadow-lg flex items-center justify-center text-persian-red-500 hover:bg-persian-red-500 hover:text-white transition-colors hidden md:flex"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white border-2 border-persian-red-300 rounded-full shadow-lg flex items-center justify-center text-persian-red-500 hover:bg-persian-red-500 hover:text-white transition-colors hidden md:flex"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-1 py-2"
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start bg-white rounded-xl p-5 shadow-md border-2 border-persian-red-300 hover:border-persian-red-500 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all group cursor-pointer"
          >
            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center justify-between">
                <time className="text-xs text-persian-red-400 font-medium">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-xs text-persian-red-400 font-medium">
                  {post.readingTime} min read
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold text-persian-red-600 leading-snug">
                {post.title}
              </h2>
              <p className="text-persian-red-700 text-sm leading-relaxed flex-1 line-clamp-3">
                {post.description}
              </p>
              <span className="text-persian-red-500 font-semibold text-sm mt-1 group-hover:translate-x-1 transition-transform">
                Read more →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Scroll hint for mobile */}
      <p className="text-center text-xs text-persian-red-400 mt-3 md:hidden">
        Swipe to see more articles →
      </p>
    </div>
  );
}
