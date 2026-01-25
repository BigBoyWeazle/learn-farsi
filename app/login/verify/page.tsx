import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

export default function VerifyRequestPage() {
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
            <div className="text-6xl mb-6">📧</div>

            <h1 className="text-3xl font-bold text-persian-red-500 mb-4">
              Check Your Email!
            </h1>

            <p className="text-persian-red-700 font-medium mb-2">
              A sign in link has been sent to your email address.
            </p>

            <p className="text-persian-red-600 mb-6">
              Click the link in the email to complete sign in.
            </p>

            <div className="bg-persian-beige-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-persian-red-600">
                💡 <strong>Tip:</strong> Check your spam folder if you don&apos;t see the email in your inbox.
              </p>
            </div>

            <Link
              href="/login"
              className="text-persian-red-600 hover:text-persian-red-700 font-medium transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
