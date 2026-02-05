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
                  <strong>Account Information:</strong> When you sign up, we collect your name and email address
                  through our authentication providers (Google).
                </li>
                <li>
                  <strong>Learning Progress:</strong> We store your lesson progress, quiz scores, streak data,
                  and XP to provide a personalized learning experience.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect information about how you interact with the app
                  to improve our services.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our language learning service</li>
                <li>Track your learning progress and maintain your streak</li>
                <li>Personalize your learning experience</li>
                <li>Communicate with you about your account or our services</li>
                <li>Improve and optimize our application</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">4. Data Storage and Security</h2>
              <p>
                Your data is stored securely using industry-standard practices. We use secure databases and
                authentication services to protect your information. We do not sell, trade, or otherwise
                transfer your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">5. Third-Party Services</h2>
              <p className="mb-4">We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Authentication:</strong> For secure sign-in functionality
                </li>
                <li>
                  <strong>Database Services:</strong> For storing your learning progress
                </li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies governing the use of your information.
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
              <p>
                We use local storage in your browser to save your learning progress and preferences.
                This helps provide a seamless learning experience across sessions. You can clear this
                data through your browser settings at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">8. Children&apos;s Privacy</h2>
              <p>
                Our service is not directed at children under 13. We do not knowingly collect personal
                information from children under 13. If you believe we have collected such information,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">10. Contact Us</h2>
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
