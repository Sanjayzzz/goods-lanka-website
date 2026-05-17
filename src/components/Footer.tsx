'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useState } from 'react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Tour Packages', href: '/packages' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'About Us', href: '/about' },
];

const destinations = [
  { name: 'Sigiriya', href: '/destinations#sigiriya' },
  { name: 'Ella', href: '/destinations#ella' },
  { name: 'Kandy', href: '/destinations#kandy' },
  { name: 'Mirissa', href: '/destinations#mirissa' },
  { name: 'Galle', href: '/destinations#galle' },
  { name: 'Yala', href: '/destinations#yala' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-coconut-800 to-coconut-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold mb-2">
                Get Travel Inspiration
              </h3>
              <p className="text-white/60 text-sm sm:text-base">
                Subscribe for exclusive offers, travel tips, and Sri Lanka insights
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-tropical-400 focus:bg-white/15 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-sunset-500 to-coral-500 rounded-full font-semibold hover:shadow-lg hover:shadow-sunset-500/30 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
            {subscribed && (
              <p className="text-tropical-400 text-sm animate-pulse">✓ Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-600 to-tropical-500 flex items-center justify-center font-bold text-white text-sm">
                GL
              </div>
              <div>
                <span className="font-[var(--font-playfair)] text-lg font-bold text-white">Good&apos;s Lanka</span>
                <span className="block text-xs tracking-widest uppercase text-tropical-400">Tours & Travels</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Discover the pearl of the Indian Ocean with Sri Lanka&apos;s premier luxury tour operator. Unforgettable experiences, curated with passion.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                { label: 'Instagram', svg: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></> },
                { label: 'X', svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                { label: 'YouTube', svg: <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" /> },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-tropical-500 transition-all duration-300 hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">{s.svg}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-tropical-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Destinations</h4>
            <ul className="space-y-3">
              {destinations.map((dest) => (
                <li key={dest.name}>
                  <Link href={dest.href} className="text-white/50 hover:text-tropical-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-tropical-400 mt-0.5 shrink-0" />
                <span className="text-white/50">42 Temple Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-tropical-400 shrink-0" />
                <span className="text-white/50">+94 77 726 6044</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-tropical-400 shrink-0" />
                <span className="text-white/50">info@goodslanka.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Good&apos;s Lanka Tours & Travels. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
