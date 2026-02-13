import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { FeedbackWidget } from "@/components/feedback-widget";

export const metadata: Metadata = {
  title: "Learn Farsi - Learn Persian Daily",
  description:
    "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever.",
  metadataBase: new URL("https://learnfarsi.app"),
  openGraph: {
    title: "Learn Farsi - Learn Persian Daily",
    description:
      "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever.",
    siteName: "Learn Farsi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Farsi - Learn Persian Daily",
    description:
      "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever.",
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
