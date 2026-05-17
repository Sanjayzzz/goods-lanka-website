'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-gradient-to-b from-white to-ocean-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-tropical-600 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Testimonials</span>
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-ocean-900 mb-4">What Our Travelers Say</h2>
          <div className="section-divider mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white rounded-3xl shadow-premium p-8 sm:p-12 lg:p-16">
            {/* Quote icon */}
            <div className="absolute -top-5 left-8 sm:left-12 w-10 h-10 rounded-full bg-gradient-to-r from-sunset-400 to-coral-500 flex items-center justify-center">
              <Quote size={18} className="text-white" />
            </div>

            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className={i < t.rating ? 'text-sunset-400 fill-sunset-400' : 'text-gray-200'} />
                ))}
              </div>

              {/* Title */}
              <h3 className="font-[var(--font-playfair)] text-xl sm:text-2xl font-bold text-ocean-900 mb-4">
                &ldquo;{t.title}&rdquo;
              </h3>

              {/* Review */}
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                {t.review}
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center text-white font-bold text-lg mb-3">
                  {t.avatar}
                </div>
                <h4 className="font-semibold text-ocean-900">{t.name}</h4>
                <p className="text-gray-400 text-sm">{t.country} • {t.tourPackage}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button onClick={prev} className="flex items-center gap-2 text-sm text-gray-400 hover:text-ocean-700 transition-colors group">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Previous
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-tropical-500 w-8' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button onClick={next} className="flex items-center gap-2 text-sm text-gray-400 hover:text-ocean-700 transition-colors group">
                Next <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
