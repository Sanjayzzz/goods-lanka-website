'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

const contactDetails = [
  { icon: MapPin, label: 'Office Address', value: '42 Temple Road, Colombo 03, Sri Lanka' },
  { icon: Phone, label: 'Phone', value: '+94 77 123 4567' },
  { icon: Mail, label: 'Email', value: 'info@goodslanka.com' },
  { icon: Clock, label: 'Working Hours', value: 'Mon-Sat: 8AM - 8PM, Sun: 10AM - 5PM' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-64 sm:h-72 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80" alt="Contact" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/75" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Get In Touch</span>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-white/70 max-w-lg mx-auto">Our travel experts are ready to help you plan your perfect Sri Lanka journey.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Contact Info */}
            <div className="space-y-6">
              {/* Info Cards */}
              {contactDetails.map((c) => (
                <div key={c.label} className="flex gap-4 p-5 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center shrink-0">
                    <c.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">{c.label}</p>
                    <p className="font-medium text-ocean-900 text-sm">{c.value}</p>
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 bg-green-500 rounded-2xl text-white hover:bg-green-600 transition-colors">
                <MessageCircle size={24} />
                <div>
                  <p className="font-semibold">WhatsApp Us</p>
                  <p className="text-green-100 text-xs">Quick reply guaranteed</p>
                </div>
              </a>

              {/* Social Media */}
              <div className="p-5 bg-white rounded-2xl shadow-card">
                <p className="font-semibold text-ocean-900 mb-4 text-sm">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                    { label: 'Instagram', complex: true },
                    { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  ].map((s) => (
                    <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center hover:bg-ocean-100 text-ocean-700 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        {s.complex ? (
                          <>
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="white" strokeWidth="2" />
                          </>
                        ) : (
                          <path d={s.path} />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="p-5 bg-ocean-50 rounded-2xl">
                <p className="text-sm text-ocean-800 font-medium mb-2">Looking for quick answers?</p>
                <Link href="/faq" className="text-tropical-600 text-sm font-semibold hover:underline">Browse our FAQ →</Link>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-premium p-8 sm:p-10">
                <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-ocean-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-400 text-sm mb-8">We&apos;ll get back to you within 24 hours.</p>

                {sent && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-medium">
                    ✓ Message sent! We&apos;ll be in touch within 24 hours.
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="John Smith"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 focus:border-transparent text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 focus:border-transparent text-sm transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 focus:border-transparent text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <select required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 focus:border-transparent text-sm bg-white transition-all">
                        <option value="">Select a subject</option>
                        <option>Tour Inquiry</option>
                        <option>Custom Package Request</option>
                        <option>Booking Support</option>
                        <option>General Question</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                      rows={5} placeholder="Tell us about your dream Sri Lanka holiday — destinations, dates, budget, group size..."
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 focus:border-transparent text-sm transition-all resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <Send size={18} /> Send Message
                  </button>
                </form>
              </div>

              {/* Map Embed Placeholder */}
              <div className="mt-6 h-64 bg-ocean-50 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <MapPin size={40} className="text-tropical-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">42 Temple Road, Colombo 03</p>
                  <p className="text-gray-300 text-xs mt-1">Google Maps integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Float */}
      <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 hover:scale-110 transition-all animate-pulse-glow">
        <MessageCircle size={26} className="text-white" />
      </a>
    </main>
  );
}
