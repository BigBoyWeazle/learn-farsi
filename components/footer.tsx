import Link from "next/link";
import Image from "next/image";

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
              <div className="w-10 h-10 overflow-hidden flex-shrink-0">
                <Image
                  src="/carpetlogo.png"
                  alt="Learn Farsi"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover scale-150"
                />
              </div>
              <h3 className="text-2xl font-bold">Learn Farsi</h3>
              <span className="bg-persian-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded">BETA</span>
            </div>
            <p className="text-persian-beige-200 text-sm">
              Learn new Farsi words every day and actually remember them, with structured lessons and smart daily practice. Free forever!
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
              <li>
                <a href="https://thomasvanwelsenes.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Work with Me
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-persian-red-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-persian-beige-200 text-sm">
              © {currentYear} Learn Farsi. Built to help you learn and remember Farsi words!
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
