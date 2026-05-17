'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { packages } from '@/data/packages';
import PackageCard from '@/components/PackageCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const categories = ['All', 'Cultural', 'Beach', 'Adventure', 'Wildlife', 'Luxury'];

function PackagesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'All';
  const [active, setActive] = useState(initialCat);
  const [sort, setSort] = useState('recommended');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActive(cat);
  }, [searchParams]);

  let filtered = packages.filter(p => active === 'All' || p.category === active);
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <>
      {/* Filters Bar */}
      <section className="sticky top-16 lg:top-[36px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active === cat ? 'bg-gradient-to-r from-ocean-700 to-tropical-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-tropical-400">
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-400 text-sm mb-8">{filtered.length} packages found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No packages in this category yet. Check back soon!</p>
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
        <Image src="https://images.unsplash.com/photo-1578469550956-0e16b9c1a5f8?w=1600&q=80" alt="Galle Fort Sri Lanka" fill className="object-cover" priority />
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
