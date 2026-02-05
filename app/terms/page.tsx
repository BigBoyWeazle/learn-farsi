import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of Use - Learn Farsi",
  description: "Terms of Use for Learn Farsi - Learn Persian vocabulary app",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-persian-beige-200 flex flex-col">
      <div className="flex-1 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-3 border-persian-red-500">
          <h1 className="text-3xl font-bold text-persian-red-500 mb-8">
            Terms of Use
          </h1>

          <div className="prose prose-lg max-w-none text-persian-red-700">
            <p className="text-sm text-persian-red-600 mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Learn Farsi, you accept and agree to be bound by these Terms of Use.
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">2. Description of Service</h2>
              <p>
                Learn Farsi is a free language learning application designed to help users learn Persian (Farsi)
                vocabulary through structured lessons, daily practice sessions, and interactive quizzes. The
                service includes vocabulary lessons, grammar lessons, alphabet practice, and progress tracking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">3. User Accounts</h2>
              <p className="mb-4">To use Learn Farsi, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create an account using a valid authentication method (Google Sign-In)</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="mt-4">
                You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">4. Acceptable Use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">5. Intellectual Property</h2>
              <p>
                All content on Learn Farsi, including but not limited to text, graphics, logos, vocabulary content,
                lesson materials, and software, is the property of Learn Farsi or its content suppliers and is
                protected by intellectual property laws. You may not reproduce, distribute, or create derivative
                works without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">6. Educational Content Disclaimer</h2>
              <p>
                While we strive to provide accurate and helpful language learning content, Learn Farsi is provided
                for educational purposes only. We do not guarantee that using our service will result in fluency
                or any specific level of language proficiency. Language learning outcomes depend on individual
                effort, dedication, and practice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">7. Service Availability</h2>
              <p>
                We strive to keep Learn Farsi available at all times, but we do not guarantee uninterrupted access.
                The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond
                our control. We reserve the right to modify, suspend, or discontinue any part of the service at
                any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">8. Limitation of Liability</h2>
              <p>
                Learn Farsi is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent permitted
                by law, we disclaim all warranties, express or implied. We shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">9. Account Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these
                terms or for any other reason at our discretion. You may also delete your account at any time
                by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">10. Changes to Terms</h2>
              <p>
                We may update these Terms of Use from time to time. We will notify users of significant changes
                by posting the updated terms on this page. Your continued use of the service after changes
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">11. Governing Law</h2>
              <p>
                These Terms of Use shall be governed by and construed in accordance with applicable laws,
                without regard to conflicts of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-persian-red-500 mb-4">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Use, please contact us at:{" "}
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
