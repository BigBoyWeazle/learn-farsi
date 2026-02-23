import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { Footer } from "@/components/footer";
import { BlogViewCounter } from "@/components/blog-view-counter";

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

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://learnfarsi.app/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://learnfarsi.app/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Learn Farsi",
      url: "https://learnfarsi.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Learn Farsi",
      url: "https://learnfarsi.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://learnfarsi.app/blog/${post.slug}`,
    },
    inLanguage: "en",
  };

  return (
    <div className="min-h-screen bg-persian-beige-200 dark:bg-[#654321] flex flex-col transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-persian-red-500 dark:text-persian-gold-400 hover:underline font-medium text-sm"
            >
              ← Back to Blog
            </Link>
          </div>

          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {getTags(post).map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tagColors[tag] || "bg-persian-red-300 text-white"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <time className="text-sm text-persian-red-400 dark:text-persian-beige-400 font-medium">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-persian-red-300">·</span>
              <span className="inline-flex items-center gap-1 text-sm text-persian-red-400 dark:text-persian-beige-400 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getReadingTime(post)} min read
              </span>
              <span className="text-persian-red-300">·</span>
              <BlogViewCounter slug={slug} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-persian-red-500 mt-3 mb-4">
              {post.title}
            </h1>
            <p className="text-persian-red-700 dark:text-persian-beige-200 text-lg font-medium">
              {post.description}
            </p>
          </header>

          <div className="bg-white dark:bg-persian-beige-800 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-persian-red-300 dark:border-persian-red-700">
            {post.sections.map((section, index) => (
              <div key={index} className={index > 0 ? "mt-8" : ""}>
                <h2 className="text-xl sm:text-2xl font-bold text-persian-red-600 dark:text-persian-gold-400 mb-4">
                  {section.heading}
                </h2>
                <div className="text-persian-red-800 dark:text-persian-beige-200 leading-relaxed space-y-4 text-sm sm:text-base">
                  {section.content.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-persian-red-500 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to start learning Farsi?
            </h3>
            <p className="text-persian-red-100 mb-4">
              Try our free structured lessons and daily practice with spaced repetition.
            </p>
            <Link
              href="/dashboard/lessons"
              className="inline-block px-6 py-3 bg-white text-persian-red-500 rounded-lg font-bold hover:bg-persian-beige-100 transition-colors shadow-md"
            >
              Start Learning Free →
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="text-persian-red-500 dark:text-persian-gold-400 hover:underline font-semibold"
            >
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
