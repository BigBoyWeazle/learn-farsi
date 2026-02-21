import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoginForm from "./login-form";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Learn Farsi to continue learning Persian vocabulary, grammar, and alphabet with spaced repetition.",
};

export default async function LoginPage() {
  const session = await auth();

  // If user is already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-persian-beige-200">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo/Branding */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/pomegranatedrawn.png"
                alt="Learn Farsi"
                width={80}
                height={80}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-4xl font-bold text-persian-red-500 mb-2">
              Welcome Back!
            </h1>
            <p className="text-lg text-persian-red-700 font-medium">
              Sign in to continue your Farsi journey
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border-3 border-persian-red-500 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
                Sign In
              </h2>
              <p className="text-persian-red-700 font-medium">
                Enter your email to receive a magic link
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-persian-red-600">
                We&apos;ll send you a secure login link via email.
                <br />
                No password needed! ✨
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="text-persian-red-600 hover:text-persian-red-700 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
