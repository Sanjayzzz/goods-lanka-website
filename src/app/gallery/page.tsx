'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80', alt: 'Sigiriya Rock Fortress', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80', alt: 'Mirissa Beach', category: 'Beach' },
  { src: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80', alt: 'Ella Nine Arch Bridge', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1533484482814-3fe2d922be89?w=800&q=80', alt: 'Yala National Park Elephant', category: 'Wildlife' },
  { src: 'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=800&q=80', alt: 'Galle Fort', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=800&q=80', alt: 'Nuwara Eliya Tea Plantations', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=800&q=80', alt: 'Kandy Temple of the Tooth', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80', alt: 'Arugam Bay Beach', category: 'Beach' },
  { src: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=800&q=80', alt: 'Colombo City Lotus Tower', category: 'Urban' },
  { src: 'https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?w=800&q=80', alt: 'Anuradhapura Ancient City', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', alt: 'Sri Lankan Cuisine', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=800&q=80', alt: 'Sigiriya Gardens', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80', alt: 'Ella Hills', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=800&q=80', alt: 'Galle Lighthouse', category: 'Cultural' },
  { src: 'https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=800&q=80', alt: 'Tea Pickers Nuwara Eliya', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=800&q=80', alt: 'Mirissa Sunset', category: 'Beach' },
];

const cats = ['All', 'Beach', 'Cultural', 'Nature', 'Wildlife', 'Urban'];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = galleryImages.filter(g => active === 'All' || g.category === active);

  const prev = () => setLightbox(l => l !== null ? (l - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(l => l !== null ? (l + 1) % filtered.length : null);

  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=1600&q=80" alt="Galle Fort Sri Lanka" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Visual Journey</span>
            <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-3">Sri Lanka Gallery</h1>
            <p className="text-white/70 max-w-lg mx-auto">A visual feast of Sri Lanka&apos;s breathtaking beauty, culture, and wildlife.</p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 lg:top-[36px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {cats.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active === cat ? 'bg-gradient-to-r from-ocean-700 to-tropical-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.div key={img.src} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-20px' }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer shadow-card hover:shadow-card-hover transition-shadow"
                onClick={() => setLightbox(i)}>
                <div className={`relative ${i % 4 === 0 ? 'h-72' : i % 3 === 0 ? 'h-52' : 'h-60'}`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium">{img.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors"><X size={28} /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white p-3 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={32} /></button>
            <motion.div key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-5xl w-full max-h-[85vh] aspect-video rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <Image src={filtered[lightbox].src} alt={filtered[lightbox].alt} fill className="object-contain" sizes="100vw" />
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white p-3 rounded-full hover:bg-white/10 transition-colors"><ChevronRight size={32} /></button>
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white/70 text-sm">{filtered[lightbox].alt}</p>
              <p className="text-white/40 text-xs mt-1">{lightbox + 1} / {filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
