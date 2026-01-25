import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-persian-beige-200">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/pomegranate.png"
                alt="Learn Farsi"
                width={80}
                height={80}
                className="mx-auto"
              />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white border-3 border-persian-red-500 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">😕</div>

            <h1 className="text-3xl font-bold text-persian-red-500 mb-4">
              Authentication Error
            </h1>

            <p className="text-persian-red-700 font-medium mb-6">
              There was a problem signing you in. The link may have expired or been used already.
            </p>

            <Link
              href="/login"
              className="inline-block w-full py-4 px-6 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Try Again <span className="btn-arrow">→</span>
            </Link>

            <div className="mt-6">
              <Link
                href="/"
                className="text-persian-red-600 hover:text-persian-red-700 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
