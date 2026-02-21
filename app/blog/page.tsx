import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
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

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-persian-beige-200 flex flex-col transition-colors">
      <div className="flex-1">
        {/* Hero section with LogoDesert2 */}
        <div className="text-center pt-10 pb-6">
          <div className="flex justify-center mb-5">
            <Image
              src="/LogoDesert2.png"
              alt="Learn Farsi - Persian arch with desert landscape"
              width={220}
              height={220}
              className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-persian-red-500 mb-2">
            Learn Farsi Blog
          </h1>
          <p className="text-persian-red-700 text-base sm:text-lg font-medium max-w-xl mx-auto px-4">
            Guides, tips, and resources to help you learn Persian
          </p>
        </div>

        {/* Blog carousel */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-10">
          <BlogCarousel
            posts={sortedPosts.map((p) => ({
              slug: p.slug,
              title: p.title,
              description: p.description,
              date: p.date,
            }))}
          />
        </div>

        {/* Back link */}
        <div className="text-center pb-10">
          <Link
            href="/"
            className="text-persian-red-500 hover:underline font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
