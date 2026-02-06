"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        // Provide more specific error messages
        if (result.error === "Configuration") {
          setError("Email service configuration error. Please contact support.");
        } else if (result.error === "AccessDenied") {
          setError("Access denied. Please check your email address.");
        } else {
          setError("Failed to send login link. Please try again.");
        }
        console.error("Sign in error:", result.error);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign in exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-persian-beige-100 border-2 border-persian-gold-500 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">📧</div>
        <h3 className="text-xl font-bold text-persian-red-500 mb-2">
          Check your email!
        </h3>
        <p className="text-persian-red-700 font-medium">
          We&apos;ve sent a magic link to
        </p>
        <p className="text-persian-red-500 font-bold mt-1">{email}</p>
        <p className="text-sm text-persian-red-600 mt-4">
          Click the link in the email to sign in.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 text-sm text-persian-red-500 hover:text-persian-red-700 underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-persian-red-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border-2 border-persian-red-300 rounded-lg text-persian-red-800 placeholder-persian-red-400 focus:outline-none focus:ring-2 focus:ring-persian-red-500 focus:border-persian-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          placeholder="your@email.com"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-persian-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          <>Send Magic Link <span className="btn-arrow">→</span></>
        )}
      </button>
    </form>
  );
}
