import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { FeedbackWidget } from "@/components/feedback-widget";

export const metadata: Metadata = {
  title: {
    default: "Learn Farsi - Learn Persian Daily | Free Farsi Lessons Online",
    template: "%s | Learn Farsi",
  },
  description:
    "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever. Start learning Persian today.",
  metadataBase: new URL("https://learnfarsi.app"),
  applicationName: "Learn Farsi",
  keywords: [
    "learn farsi",
    "learn persian",
    "farsi lessons",
    "persian language",
    "farsi vocabulary",
    "persian alphabet",
    "farsi grammar",
    "learn farsi online",
    "learn farsi free",
    "persian words",
    "farsi for beginners",
    "spaced repetition farsi",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://learnfarsi.app",
  },
  openGraph: {
    title: "Learn Farsi - Learn Persian Daily | Free Farsi Lessons Online",
    description:
      "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever. Start learning Persian today.",
    siteName: "Learn Farsi",
    locale: "en_US",
    type: "website",
    url: "https://learnfarsi.app",
    images: ["https://learnfarsi.app/ogimage.png?v=4"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Farsi - Learn Persian Daily | Free Farsi Lessons Online",
    description:
      "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever. Start learning Persian today.",
    images: ["https://learnfarsi.app/ogimage.png?v=4"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-persian-beige-200 dark:bg-[#654321] transition-colors">
        <Providers>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <FeedbackWidget />
        </Providers>
      </body>
    </html>
  );
}
