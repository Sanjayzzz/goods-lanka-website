'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  {
    name: 'Destinations', href: '/destinations',
    dropdown: [
      { name: 'Sigiriya', href: '/destinations#sigiriya' },
      { name: 'Ella', href: '/destinations#ella' },
      { name: 'Kandy', href: '/destinations#kandy' },
      { name: 'Mirissa', href: '/destinations#mirissa' },
      { name: 'Galle', href: '/destinations#galle' },
    ]
  },
  {
    name: 'Packages', href: '/packages',
    dropdown: [
      { name: 'Cultural Tours', href: '/packages?cat=Cultural' },
      { name: 'Beach Escapes', href: '/packages?cat=Beach' },
      { name: 'Adventure Tours', href: '/packages?cat=Adventure' },
      { name: 'Wildlife Safari', href: '/packages?cat=Wildlife' },
      { name: 'Luxury Retreats', href: '/packages?cat=Luxury' },
    ]
  },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        setScrolled(window.scrollY > 50);
      } else {
        setScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Top info bar */}
      <div className="hidden lg:block bg-ocean-950 text-white/80 text-sm py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone size={13} /> +94 77 123 4567</span>
            <span className="flex items-center gap-1.5"><Mail size={13} /> info@goodslanka.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} /> Colombo, Sri Lanka
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        className={`fixed top-0 lg:top-[36px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg lg:top-0'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 transition-all duration-300 group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt="Good's Lanka Tours & Travels"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className={`font-[var(--font-playfair)] text-base sm:text-lg font-bold transition-colors duration-300 ${
                  scrolled ? 'text-ocean-900' : 'text-white'
                }`}>
                  Good&apos;s Lanka
                </span>
                <span className={`block text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300 ${
                  scrolled ? 'text-tropical-600' : 'text-white/70'
                }`}>
                  Tours & Travels
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1 transition-all duration-300 ${
                      scrolled
                        ? 'text-gray-700 hover:text-ocean-700 hover:bg-ocean-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-ocean-50 hover:text-ocean-700 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/booking"
                className="hidden sm:inline-flex px-5 py-2.5 bg-gradient-to-r from-sunset-500 to-coral-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-sunset-500/30 transition-all duration-300 hover:scale-105"
              >
                Book Now
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-ocean-900' : 'text-white'
                }`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-ocean-50 hover:text-ocean-700 transition-colors"
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="ml-4 border-l-2 border-ocean-100 pl-4 space-y-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-500 hover:text-ocean-700 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="block mx-4 mt-4 text-center px-5 py-3 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-semibold rounded-full"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
