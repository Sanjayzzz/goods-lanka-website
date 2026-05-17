'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { destinations } from '@/data/destinations';
import SectionHeading from '@/components/SectionHeading';
import { Star, MapPin, ArrowRight, Search } from 'lucide-react';

const categories = ['All', 'Cultural', 'Nature', 'Beach', 'Wildlife', 'Urban'];

export default function DestinationsClient() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = destinations.filter(d =>
    (active === 'All' || d.category === active) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1586613835341-ac4007e3a83c?w=1600&q=80" alt="Destinations" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/70 via-ocean-900/50 to-ocean-950/80" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Explore Sri Lanka</span>
            <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Our Destinations</h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">From ancient rock fortresses to pristine beaches — discover Sri Lanka&apos;s most breathtaking destinations.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 lg:top-[36px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    active === cat
                      ? 'bg-gradient-to-r from-ocean-700 to-tropical-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No destinations found. Try a different filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  id={dest.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link href={`/destinations#${dest.slug}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 group-hover:-translate-y-2">
                      <div className="relative h-80 overflow-hidden">
                        <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">{dest.category}</span>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md">
                          <Star size={13} className="text-sunset-400 fill-sunset-400" />
                          <span className="text-white text-xs font-bold">{dest.rating}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1.5">
                          <MapPin size={11} /><span>{dest.tagline}</span>
                        </div>
                        <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-white mb-2">{dest.name}</h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">{dest.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {dest.highlights.slice(0, 3).map(h => (
                            <span key={h} className="px-2 py-0.5 rounded-full bg-white/20 text-white/80 text-xs">{h}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/20 pt-3">
                          <span className="text-white/50 text-xs">{dest.reviewCount.toLocaleString()} reviews</span>
                          <span className="flex items-center gap-1 text-tropical-400 text-sm font-semibold group-hover:gap-2 transition-all">
                            Explore <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-ocean-900 to-tropical-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold mb-4">Can&apos;t Decide? We&apos;ll Help!</h2>
          <p className="text-white/70 mb-8">Talk to our travel experts and we&apos;ll craft the perfect Sri Lankan itinerary just for you.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all">
            Talk to an Expert <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
