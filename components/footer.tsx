import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-persian-red-900 text-white py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="mb-5 sm:mb-6">
          {/* Brand — above links on mobile, left of links on desktop */}
          <div className="mb-4 md:hidden">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 overflow-hidden flex-shrink-0">
                <Image
                  src="/carpetlogo.png"
                  alt="Learn Farsi"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover scale-150"
                />
              </div>
              <h3 className="text-base font-bold">Learn Farsi</h3>
              <span className="bg-persian-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BETA</span>
            </div>
            <p className="text-persian-beige-200 text-[10px] leading-relaxed">
              Learn new Farsi words every day and actually remember them, with structured lessons and smart daily practice. Free forever!
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Brand — hidden on mobile, shown on desktop as first column */}
            <div className="hidden md:block">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 overflow-hidden flex-shrink-0">
                  <Image
                    src="/carpetlogo.png"
                    alt="Learn Farsi"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover scale-150"
                  />
                </div>
                <h3 className="text-base font-bold">Learn Farsi</h3>
                <span className="bg-persian-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BETA</span>
              </div>
              <p className="text-persian-beige-200 text-[10px] leading-relaxed">
                Learn new Farsi words every day and actually remember them, with structured lessons and smart daily practice. Free forever!
              </p>
            </div>
          {/* Learn Section */}
          <div>
            <h4 className="font-bold text-xs mb-2 text-persian-gold-400">Learn</h4>
            <ul className="space-y-1 text-persian-beige-200 text-[10px]">
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
            <h4 className="font-bold text-xs mb-2 text-persian-gold-400">Resources</h4>
            <ul className="space-y-1 text-persian-beige-200 text-[10px]">
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
            <h4 className="font-bold text-xs mb-2 text-persian-gold-400">Connect</h4>
            <ul className="space-y-1 text-persian-beige-200 text-[10px]">
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
        </div>

        {/* Divider */}
        <div className="border-t border-persian-red-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-persian-beige-200 text-[10px]">
              © {currentYear} Learn Farsi. Built to help you learn and remember Farsi words!
            </p>
            <div className="flex items-center gap-4 text-[10px] text-persian-beige-200">
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
