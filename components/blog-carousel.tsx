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
  views: number;
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
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);

    // Calculate which card is most visible
    const cardWidth = 320;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, posts.length - 1));
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

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320;
    el.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left fade gradient */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-persian-beige-200 to-transparent z-[5] pointer-events-none" />
      )}

      {/* Right fade gradient */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-persian-beige-200 to-transparent z-[5] pointer-events-none" />
      )}

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white/60 backdrop-blur-lg border border-persian-red-300/40 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex items-center justify-center text-persian-red-500 hover:bg-persian-red-500/90 hover:text-white hover:scale-110 transition-all ring-1 ring-white/30 hidden md:flex"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white/60 backdrop-blur-lg border border-persian-red-300/40 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex items-center justify-center text-persian-red-500 hover:bg-persian-red-500/90 hover:text-white hover:scale-110 transition-all ring-1 ring-white/30 hidden md:flex"
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
            className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start bg-white/40 backdrop-blur-lg rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-persian-red-300/40 hover:border-persian-red-400/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/55 transition-all group cursor-pointer ring-1 ring-white/20"
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
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-persian-red-400 font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.views}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-persian-red-400 font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readingTime} min
                  </span>
                </div>
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

      {/* Scroll position dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to article ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 h-2.5 bg-persian-red-500"
                : "w-2.5 h-2.5 bg-persian-red-300 hover:bg-persian-red-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
