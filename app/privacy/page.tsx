import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy - Learn Farsi",
  description: "Privacy Policy for Learn Farsi - Learn Persian vocabulary app",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-persian-beige-200 flex flex-col">
      <div className="flex-1 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-3 border-persian-red-500">
          <h1 className="text-3xl font-bold text-persian-red-500 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-persian-red-700">
            <p className="text-sm text-persian-red-600 mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">1. Introduction</h2>
              <p>
                Welcome to Learn Farsi. We respect your privacy and are committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information when you use our
                language learning application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">2. Information We Collect</h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> When you sign up, we collect your email address and
                  optionally your name. We use passwordless authentication (magic links sent to your email),
                  so we never store any passwords.
                </li>
                <li>
                  <strong>Learning Progress (stored in our database):</strong> We store your vocabulary review
                  history (including spaced repetition data such as review counts, accuracy, and next review dates),
                  lesson and grammar completion status, quiz scores, daily practice streaks, XP totals, and your
                  current learning level.
                </li>
                <li>
                  <strong>Temporary Session Data (stored in your browser):</strong> While you are actively completing
                  a lesson or practice session, we temporarily store your session score and progress in your
                  browser&apos;s local storage. This data is cleared when the session ends. We also store your
                  theme preference (light/dark mode) and alphabet practice progress locally in your browser.
                </li>
              </ul>
              <p className="mt-4">
                We do not use any analytics or tracking services. We do not collect browsing behavior,
                IP addresses for tracking purposes, or any data beyond what is listed above.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authenticate you via magic link emails sent to your email address</li>
                <li>Track your learning progress, streaks, and XP across sessions</li>
                <li>Power the spaced repetition system (determining which words to review and when)</li>
                <li>Display your progress on your personal dashboard</li>
                <li>Send you transactional emails (magic links for sign-in only, no marketing emails)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">4. Data Storage and Security</h2>
              <p className="mb-4">
                All persistent user data (your account information and learning progress) is stored in a
                PostgreSQL database hosted by <strong>Supabase</strong> on Amazon Web Services (AWS) in the
                US-East-1 region. Data is encrypted in transit using TLS/SSL.
              </p>
              <p className="mb-4">
                Temporary session data (such as your current lesson score while practicing) is stored only in
                your browser&apos;s local storage and is not transmitted to our servers until you complete
                a session.
              </p>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties for
                marketing or advertising purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">5. Third-Party Services</h2>
              <p className="mb-4">We use the following third-party services to operate Learn Farsi:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Supabase</strong> (supabase.com): Hosts our PostgreSQL database on AWS. Stores all
                  user account data and learning progress. Supabase acts as a data processor on our behalf.
                </li>
                <li>
                  <strong>Resend</strong> (resend.com): Handles email delivery for magic link authentication
                  and contact form submissions. Resend processes your email address solely to deliver these
                  transactional emails.
                </li>
                <li>
                  <strong>Auth.js (NextAuth)</strong>: Open-source authentication framework that manages your
                  login sessions. Session data is stored in our own database, not on a third-party server.
                </li>
              </ul>
              <p className="mt-4">
                We do not use any analytics, advertising, or tracking services. These third-party services
                have their own privacy policies governing the use of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of any inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">7. Cookies and Local Storage</h2>
              <p className="mb-4">
                <strong>Cookies:</strong> We use a single session cookie managed by Auth.js to keep you
                signed in. This cookie is essential for the service to function and cannot be disabled
                while using the app. We do not use any advertising or tracking cookies.
              </p>
              <p className="mb-4">
                <strong>Browser Local Storage:</strong> We store the following data locally in your browser:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Temporary lesson and practice session scores (cleared when a session completes)</li>
                <li>Alphabet practice progress</li>
                <li>Your theme preference (light or dark mode)</li>
              </ul>
              <p>
                Your persistent learning data (word reviews, lesson completion, streaks, XP) is stored in
                our database, not in local storage. You can clear local storage through your browser settings
                at any time without losing your account or long-term progress.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">8. Data Retention</h2>
              <p className="mb-4">
                Your account data and learning progress are retained for as long as your account remains active.
                We do not currently have an automated process for deleting inactive accounts.
              </p>
              <p>
                If you wish to have your account and all associated data deleted, you can contact us at the
                email address listed below. Upon request, we will permanently remove your account, learning
                progress, and any other personal data from our database.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">9. Children&apos;s Privacy</h2>
              <p>
                Our service is not directed at children under 13. We do not knowingly collect personal
                information from children under 13. If you believe we have collected such information,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <a
                  href="mailto:thomasvanwelsenes@gmail.com"
                  className="text-persian-red-500 hover:text-persian-red-600 underline"
                >
                  thomasvanwelsenes@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-persian-red-200">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
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
