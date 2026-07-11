'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, MapPin, User, CalendarCheck, LogOut, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase';

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
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accountDropdown, setAccountDropdown] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Account');
        setUserAvatar(user.user_metadata?.avatar_url ?? null);
        setUserEmail(user.email ?? null);
      } else {
        setUserName(null);
        setUserAvatar(null);
        setUserEmail(null);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      if (u) {
        setUserName(u.user_metadata?.full_name ?? u.email?.split('@')[0] ?? 'Account');
        setUserAvatar(u.user_metadata?.avatar_url ?? null);
        setUserEmail(u.email ?? null);
      } else {
        setUserName(null);
        setUserAvatar(null);
        setUserEmail(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

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
            <span className="flex items-center gap-1.5"><Phone size={13} /> +94 77 726 6044</span>
            <span className="flex items-center gap-1.5"><Mail size={13} /> info@godslanka.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} /> Colombo, Sri Lanka
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'top-0 bg-white/95 backdrop-blur-xl shadow-lg'
            : 'top-0 lg:top-[36px] bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 transition-all duration-300 group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt="GODS LANKA Tours & Travels"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className={`font-[var(--font-playfair)] text-base sm:text-lg font-bold transition-colors duration-300 ${
                  scrolled ? 'text-ocean-900' : 'text-white'
                }`}>
                  GODS LANKA
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

            {/* CTA + Account + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* My Account Dropdown */}
              {userName ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdown(d => !d)}
                    onBlur={() => setTimeout(() => setAccountDropdown(false), 150)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      scrolled ? 'text-ocean-700 hover:bg-ocean-50' : 'text-white/90 hover:bg-white/10'
                    }`}>
                    {(userAvatar || userEmail) ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/20">
                        <img
                          src={userAvatar || `https://www.gravatar.com/avatar/${userEmail?.trim().toLowerCase()}?d=mp&s=80`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName ?? 'U')}&background=0D8ABC&color=fff&size=80`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-tropical-500 to-ocean-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                        {userName ? userName[0] : 'U'}
                      </div>
                    )}
                    <span className="hidden lg:inline">{userName}</span>
                    <ChevronDown size={13} className={`transition-transform ${accountDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {accountDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50"
                      >
                        <Link href="/account/my-bookings"
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-ocean-50 hover:text-ocean-700 transition-colors">
                          <CalendarCheck size={15} /> My Bookings
                        </Link>
                        <Link href="/account/profile"
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-ocean-50 hover:text-ocean-700 transition-colors border-t border-gray-50">
                          <Settings size={15} /> Profile Settings
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={async () => {
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            setUserName(null);
                            setAccountDropdown(false);
                            window.location.href = '/';
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/account/login"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    scrolled ? 'text-ocean-700 hover:bg-ocean-50' : 'text-white/90 hover:bg-white/10'
                  }`}>
                  <User size={15} /> Sign In
                </Link>
              )}
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

                {/* Mobile Account Section */}
                {userName ? (
                  <div className="border-t border-gray-150 mt-4 pt-4 space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-ocean-50/50 rounded-2xl">
                      {userAvatar ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-tropical-500 to-ocean-600 flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                          {userName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{userName}</p>
                        <p className="text-gray-400 text-xs">Logged In</p>
                      </div>
                    </div>
                    <Link
                      href="/account/my-bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-ocean-50 hover:text-ocean-700 transition-colors rounded-lg font-medium"
                    >
                      <CalendarCheck size={16} /> My Bookings
                    </Link>
                    <Link
                      href="/account/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-ocean-50 hover:text-ocean-700 transition-colors rounded-lg font-medium"
                    >
                      <Settings size={16} /> Profile Settings
                    </Link>
                    <button
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setUserName(null);
                        setMobileOpen(false);
                        window.location.href = '/';
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg font-medium text-left"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-150 mt-4 pt-4">
                    <Link
                      href="/account/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-ocean-50 hover:text-ocean-700 transition-colors rounded-lg font-medium"
                    >
                      <User size={16} /> Sign In
                    </Link>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href="/booking"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-5 py-3.5 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-semibold rounded-full shadow-lg"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
