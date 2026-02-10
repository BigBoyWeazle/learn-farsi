"use client";

import { useState, useEffect } from "react";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show hint after 3 seconds on first load
    const initialTimer = setTimeout(() => setShowHint(true), 3000);
    // Hide it after 5 seconds
    const hideTimer = setTimeout(() => setShowHint(false), 8000);

    // Then repeat every 30 seconds
    const interval = setInterval(() => {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 5000);
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackType, message }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setFeedbackType("");
        setMessage("");
      }, 2000);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popup Form */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border-3 border-persian-red-500 overflow-hidden">
          {/* Header */}
          <div className="bg-persian-red-500 px-4 py-3 flex justify-between items-center">
            <h3 className="text-white font-bold text-sm">Give Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close feedback"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitted ? (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">✉️</div>
              <p className="text-persian-red-600 font-semibold">Thanks for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-persian-red-200 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700 text-sm bg-white"
                >
                  <option value="">Select type...</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Content Suggestion">Content Suggestion</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-persian-red-200 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700 text-sm resize-none"
                  placeholder="Tell us what you think..."
                />
              </div>

              {error && (
                <p className="text-rose-500 text-xs font-medium">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full px-4 py-2 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Hint Tooltip */}
      {showHint && !isOpen && (
        <div className="absolute bottom-2 right-16 whitespace-nowrap bg-persian-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg animate-bounce">
          Give feedback here!
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-persian-red-600 rotate-45" />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowHint(false); }}
        className="w-12 h-12 bg-persian-red-500 hover:bg-persian-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Give feedback"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
