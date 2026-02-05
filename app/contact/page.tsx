"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create mailto link with form data
    const mailtoSubject = encodeURIComponent(subject || "Contact from Learn Farsi");
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:thomasvanwelsenes@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <div className="min-h-screen bg-persian-beige-200 flex flex-col">
      <div className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-3 border-persian-red-500">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-3xl font-bold text-persian-red-500 mb-2">
              Get in Touch
            </h1>
            <p className="text-persian-red-700">
              Have questions, feedback, or want to contribute? We&apos;d love to hear from you!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-persian-red-700 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-persian-red-300 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-persian-red-700 mb-2"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-persian-red-300 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-persian-red-700 mb-2"
              >
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-persian-red-300 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700 bg-white"
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Content Suggestion">Content Suggestion</option>
                <option value="Want to Contribute">Want to Contribute</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-persian-red-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 border-2 border-persian-red-300 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700 resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-persian-red-200">
            <div className="text-center">
              <p className="text-persian-red-700 mb-4">
                Or email us directly at:
              </p>
              <a
                href="mailto:thomasvanwelsenes@gmail.com"
                className="inline-flex items-center gap-2 text-persian-red-500 hover:text-persian-red-600 font-semibold text-lg"
              >
                <span>thomasvanwelsenes@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="text-persian-red-500 hover:text-persian-red-600 font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
