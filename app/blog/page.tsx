import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { db } from "@/db";
import { blogViews } from "@/db/schema";

const caveat = Caveat({ subsets: ["latin"] });
import { BlogCarousel } from "@/components/blog-carousel";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Blog - Tips, Guides & Resources for Learning Persian",
  description:
    "Read our guides on how to learn Farsi, the Persian alphabet, common phrases, and the best resources for learning Persian online.",
  alternates: {
    canonical: "https://learnfarsi.app/blog",
  },
};

function getReadingTime(post: BlogPost): number {
  const totalWords = post.sections.reduce(
    (sum, s) => sum + s.content.split(/\s+/).length,
    0
  );
  return Math.max(1, Math.round(totalWords / 200));
}

function getTags(post: BlogPost): string[] {
  const kw = post.keywords.join(" ").toLowerCase();
  const tags: string[] = [];
  if (kw.includes("alphabet") || kw.includes("letters")) tags.push("Alphabet");
  if (kw.includes("phrases") || kw.includes("greetings")) tags.push("Phrases");
  if (kw.includes("beginner") || kw.includes("how to learn")) tags.push("Beginner");
  if (kw.includes("grammar")) tags.push("Grammar");
  if (kw.includes("best way") || kw.includes("tips") || kw.includes("online")) tags.push("Tips");
  if (kw.includes("farsi vs") || kw.includes("difference") || kw.includes("persian")) tags.push("Culture");
  return tags.slice(0, 2);
}

const tagColors: Record<string, string> = {
  Alphabet: "bg-persian-turquoise-500 text-white",
  Phrases: "bg-persian-gold-500 text-white",
  Beginner: "bg-green-500 text-white",
  Grammar: "bg-purple-500 text-white",
  Tips: "bg-persian-red-400 text-white",
  Culture: "bg-amber-600 text-white",
};

export default async function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Fetch all view counts from database
  const allViews = await db.select().from(blogViews);
  const viewMap: Record<string, number> = {};
  for (const row of allViews) {
    viewMap[row.slug] = row.views;
  }

  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);
  const featuredTags = getTags(featuredPost);
  const featuredReadingTime = getReadingTime(featuredPost);
  const featuredViews = viewMap[featuredPost.slug] ?? 0;

  return (
    <div className="min-h-screen bg-persian-beige-200 flex flex-col transition-colors">
      <div className="flex-1">
        {/* Hero section with LogoDesert2 */}
        <div className="text-center pt-10 pb-6">
          <div className="flex justify-center mb-5 relative">
            <Image
              src="/LogoDesert2.png"
              alt="Learn Farsi - Persian arch with desert landscape"
              width={220}
              height={220}
              className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-contain"
              priority
            />
            {/* Handwritten text with arrow */}
            <div className="absolute left-[calc(50%+35px)] sm:left-[calc(50%+55px)] top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-persian-gold-500 flex-shrink-0">
                <path d="M26 16C20 12 14 8 4 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M8 6L3 10L8 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className={`${caveat.className} text-persian-gold-500 font-bold text-xl leading-snug`} style={{ transform: "rotate(-2deg)" }}>
                Learn more about Farsi
                <br />
                and the Persian culture
              </p>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-persian-red-500 mb-2">
            Learn Farsi Blog
          </h1>
          <p className="text-persian-red-700 text-base sm:text-lg font-medium max-w-xl mx-auto px-4">
            Guides, tips, and resources to help you learn Persian
          </p>
        </div>

        {/* Featured post */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 pb-8">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block bg-white rounded-2xl shadow-lg border-2 border-persian-red-300 hover:border-persian-red-500 hover:shadow-xl transition-all overflow-hidden group"
          >
            <div className="bg-persian-red-500 px-5 py-2 flex items-center justify-between">
              <span className="text-white text-xs font-bold uppercase tracking-wide">
                Latest Article
              </span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-persian-red-100 text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {featuredViews}
                </span>
                <span className="inline-flex items-center gap-1 text-persian-red-100 text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {featuredReadingTime} min read
                </span>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {featuredTags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tagColors[tag] || "bg-persian-red-300 text-white"}`}
                  >
                    {tag}
                  </span>
                ))}
                <time className="text-xs text-persian-red-400 font-medium ml-auto self-center">
                  {new Date(featuredPost.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-persian-red-600 mb-2 leading-snug">
                {featuredPost.title}
              </h2>
              <p className="text-persian-red-700 text-sm sm:text-base leading-relaxed mb-3">
                {featuredPost.description}
              </p>
              <span className="text-persian-red-500 font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                Read article →
              </span>
            </div>
          </Link>
        </div>

        {/* More articles carousel */}
        {remainingPosts.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-10">
            <h2 className="text-lg font-bold text-persian-red-600 mb-4">
              More Articles
            </h2>
            <BlogCarousel
              posts={remainingPosts.map((p) => ({
                slug: p.slug,
                title: p.title,
                description: p.description,
                date: p.date,
                readingTime: getReadingTime(p),
                tags: getTags(p),
                views: viewMap[p.slug] ?? 0,
              }))}
            />
          </div>
        )}

        {/* CTA banner */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <div className="bg-persian-red-500 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to start learning Farsi?
            </h3>
            <p className="text-persian-red-100 mb-4">
              Try our free structured lessons and daily practice with spaced repetition.
            </p>
            <Link
              href="/dashboard/lessons"
              className="group/cta inline-flex items-center gap-2 px-6 py-3 bg-white text-persian-red-500 rounded-lg font-bold hover:bg-persian-beige-100 hover:scale-105 transition-all shadow-md hover:shadow-lg"
            >
              Start Learning Free
              <span className="inline-block group-hover/cta:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
