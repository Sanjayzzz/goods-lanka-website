'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages } from '@/data/packages';
import PackageCard from '@/components/PackageCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SlidersHorizontal, Users, Clock, MapPin, ChevronDown } from 'lucide-react';

const categories = ['All', 'Cultural', 'Beach', 'Adventure', 'Wildlife', 'Luxury'];

function PackagesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'All';

  const [active, setActive] = useState(initialCat);
  const [sort, setSort] = useState('recommended');
  const [passengers, setPassengers] = useState(0); // 0 = any
  const [showFilters, setShowFilters] = useState(false);
  const [livePackages, setLivePackages] = useState(packages);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActive(cat);
  }, [searchParams]);

  useEffect(() => {
    import('@/lib/supabase').then(({ createClient }) => {
      const supabase = createClient();
      supabase.from('packages').select('slug, price, active').then(({ data }) => {
        if (data) {
          const liveMap = new Map(data.map(p => [p.slug, p]));
          setLivePackages(packages.filter(p => {
             const live = liveMap.get(p.slug);
             return !live || live.active;
          }).map(p => {
             const live = liveMap.get(p.slug);
             if (live) return { ...p, price: live.price };
             return p;
          }));
        }
      });
    });
  }, []);

  let filtered = livePackages.filter(p => {
    if (active !== 'All' && p.category !== active) return false;
    if (passengers > 0 && p.maxGuests < passengers) return false;
    return true;
  });

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const hasActiveFilters = active !== 'All' || passengers > 0;

  return (
    <>
      {/* Sticky Filter Bar */}
      <section className="sticky top-16 lg:top-[36px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* Top row: Category pills + Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active === cat ? 'bg-gradient-to-r from-ocean-700 to-tropical-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowFilters(f => !f)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${showFilters || hasActiveFilters ? 'bg-ocean-700 text-white border-ocean-700' : 'border-gray-200 text-gray-600 hover:border-ocean-300'}`}>
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-tropical-400" />}
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tropical-400 bg-white">
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Expandable advanced filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Duration filter removed */}

              {/* Passengers Filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users size={13} /> Passengers
                </p>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map(n => (
                    <button key={n} onClick={() => setPassengers(n)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold border transition-all ${passengers === n ? 'bg-tropical-600 text-white border-tropical-600' : 'border-gray-200 text-gray-600 hover:border-tropical-400'}`}>
                      {n === 0 ? 'Any' : n === 6 ? '6+' : n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination / Category */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MapPin size={13} /> Destination Type
                </p>
                <div className="relative">
                  <select value={active} onChange={e => setActive(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-tropical-400 bg-white appearance-none">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Destinations' : cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick-pills when filters hidden */}
          {!showFilters && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {passengers === 0 ? null : (
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-ocean-100 text-ocean-700 border border-ocean-200">
                  {passengers === 6 ? '6+' : passengers} passenger{passengers !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm text-gray-500 mb-6 flex items-center">
            <span>{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</span>
            {hasActiveFilters && (
              <button onClick={() => { setActive('All'); setPassengers(0); }} className="ml-3 text-tropical-600 font-semibold hover:underline">
                Clear filters
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-3">No packages match your filters.</p>
              <button onClick={() => { setActive('All'); setPassengers(0); }}
                className="text-tropical-600 font-semibold hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function PackagesClient() {
  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=1600&q=80" alt="Galle Fort Sri Lanka" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/70 via-ocean-900/50 to-ocean-950/80" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Curated For You</span>
            <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Tour Packages</h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">Hand-crafted tours for every type of traveler — from adventurers to luxury seekers.</p>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading packages...</div>}>
        <PackagesContent />
      </Suspense>
    </main>
  );
}
