import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-persian-red-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🇮🇷</div>
              <h3 className="text-2xl font-bold">Learn Farsi</h3>
              <span className="bg-persian-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded">BETA</span>
            </div>
            <p className="text-persian-beige-200 text-sm">
              Learn Persian vocabulary through structured lessons and daily practice — completely free! Currently in beta, with new content added regularly.
            </p>
          </div>

          {/* Learn Section */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-persian-gold-400">Learn</h4>
            <ul className="space-y-2 text-persian-beige-200">
              <li>
                <Link href="/dashboard/lessons" className="hover:text-white transition-colors">
                  Structured Lessons
                </Link>
              </li>
              <li>
                <Link href="/dashboard/practice" className="hover:text-white transition-colors">
                  Daily Practice
                </Link>
              </li>
              <li>
                <Link href="/dashboard/alphabet" className="hover:text-white transition-colors">
                  Persian Alphabet
                </Link>
              </li>
              <li>
                <Link href="/dashboard/words" className="hover:text-white transition-colors">
                  Word Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-persian-gold-400">Resources</h4>
            <ul className="space-y-2 text-persian-beige-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-persian-gold-400">Connect</h4>
            <ul className="space-y-2 text-persian-beige-200">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Want to Contribute?
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-persian-red-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-persian-beige-200 text-sm">
              © {currentYear} Learn Farsi. Built for language learners!
            </p>
            <div className="flex items-center gap-6 text-sm text-persian-beige-200">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
