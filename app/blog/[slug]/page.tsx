import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { Footer } from "@/components/footer";

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
            <time className="text-sm text-persian-red-400 dark:text-persian-beige-400 font-medium">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="text-3xl sm:text-4xl font-bold text-persian-red-500 mt-2 mb-4">
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
