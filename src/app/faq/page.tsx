'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { faqItems } from '@/data/faq';
import { ChevronDown, ArrowRight } from 'lucide-react';

const cats = ['All', 'Booking', 'Travel', 'Safety', 'Accommodation'];

export default function FAQPage() {
  const [active, setActive] = useState('All');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = faqItems.filter(f => active === 'All' || f.category === active);

  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-64 sm:h-72 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1571406384815-4caf0e32d267?w=1600&q=80" alt="FAQ" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/75" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Got Questions?</span>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-white/70 max-w-lg mx-auto">Find answers to common questions about Sri Lanka tours and travel.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-10">
            {cats.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active === cat ? 'bg-gradient-to-r from-ocean-700 to-tropical-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {filtered.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
                <button onClick={() => setOpen(open === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 text-left">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-tropical-100 text-tropical-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">Q</span>
                    <span className="font-semibold text-ocean-900">{item.question}</span>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 shrink-0 ml-4 transition-transform duration-300 ${open === item.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {open === item.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-6 pb-6 pt-0">
                        <div className="flex gap-3">
                          <span className="w-7 h-7 rounded-full bg-ocean-100 text-ocean-600 flex items-center justify-center text-xs font-bold shrink-0">A</span>
                          <p className="text-gray-500 leading-relaxed text-sm">{item.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-16 text-center p-10 bg-gradient-to-br from-ocean-50 to-tropical-50 rounded-3xl">
            <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-3">Still Have Questions?</h3>
            <p className="text-gray-400 mb-6">Our team is ready to help you plan the perfect Sri Lankan journey.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
