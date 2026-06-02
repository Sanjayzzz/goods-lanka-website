'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Calendar, Users, ChevronDown, ChevronRight, Play } from 'lucide-react';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=1920&q=85',
    title: 'Discover the Pearl of the Indian Ocean',
    subtitle: 'Sigiriya Rock Fortress',
    location: 'Sigiriya, Sri Lanka',
  },
  {
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1920&q=85',
    title: 'Cross the Legendary Nine Arch Bridge',
    subtitle: 'Breathtaking Hill Country Railway',
    location: 'Ella, Sri Lanka',
  },
  {
    image: 'https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=1920&q=85',
    title: 'Pristine Tropical Beaches of Mirissa',
    subtitle: 'Paradise on the Southern Coast',
    location: 'Mirissa, Sri Lanka',
  },
  {
    image: 'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=1920&q=85',
    title: 'Sacred Temple of the Tooth Relic',
    subtitle: 'Ancient Royal Capital',
    location: 'Kandy, Sri Lanka',
  },
  {
    image: 'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=1920&q=85',
    title: 'Historic Galle Fort by the Sea',
    subtitle: 'UNESCO World Heritage',
    location: 'Galle, Sri Lanka',
  },
  {
    image: 'https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=1920&q=85',
    title: 'Emerald Tea Plantations of Nuwara Eliya',
    subtitle: 'Little England of Sri Lanka',
    location: 'Nuwara Eliya, Sri Lanka',
  },
  {
    image: 'https://images.unsplash.com/photo-1533484482814-3fe2d922be89?w=1920&q=85',
    title: 'Wild Elephants of Pinnawala',
    subtitle: 'Nature\'s Greatest Spectacle',
    location: 'Pinnawala Elephant Orphanage',
  },
  {
    image: 'https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?w=1920&q=85',
    title: 'Ancient City of Anuradhapura',
    subtitle: '3000 Years of Living History',
    location: 'Anuradhapura, Sri Lanka',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-20 pb-44 sm:pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-tropical-400 animate-pulse" />
              {slide.location}
            </motion.span>

            <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-[1.1]">
              {slide.title}
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 font-light max-w-2xl mx-auto">
              {slide.subtitle} — Experience luxury tours, exotic destinations, and unforgettable adventures with GODS LANKA Tours & Travels
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/destinations"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-sunset-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Explore Destinations <ChevronRight size={18} />
              </Link>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play size={18} /> Watch Video
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-12 sm:bottom-16 left-4 right-4 sm:left-auto sm:right-auto w-full max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl sm:rounded-full p-2 sm:p-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
              <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-0 rounded-xl sm:rounded-none sm:border-r border-white/20 bg-white/5 sm:bg-transparent">
                <Search size={18} className="text-white/60 shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="bg-transparent text-white placeholder-white/50 text-sm w-full focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-0 rounded-xl sm:rounded-none sm:border-r border-white/20 bg-white/5 sm:bg-transparent">
                <Calendar size={18} className="text-white/60 shrink-0" />
                <input
                  type="text"
                  placeholder="When?"
                  className="bg-transparent text-white placeholder-white/50 text-sm w-full focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-0 rounded-xl sm:rounded-none bg-white/5 sm:bg-transparent">
                <Users size={18} className="text-white/60 shrink-0" />
                <select className="bg-transparent text-white/50 text-sm w-full focus:outline-none appearance-none cursor-pointer">
                  <option value="">Guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
                <ChevronDown size={14} className="text-white/40" />
              </div>
              <button className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-semibold rounded-xl sm:rounded-full hover:shadow-lg hover:shadow-sunset-500/30 transition-all text-sm whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-3 h-8 bg-white' : 'w-3 h-3 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
