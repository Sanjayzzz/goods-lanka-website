import type { Metadata } from 'next';
import Image from 'next/image';
import { testimonials } from '@/data/testimonials';
import { Star, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: "Testimonials | Good's Lanka Tours & Travels",
  description: "Read what our travelers say about their Sri Lanka experience with Good's Lanka Tours & Travels.",
};

export default function TestimonialsPage() {
  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-64 sm:h-72 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1590068723081-49d13fcb1e07?w=1600&q=80" alt="Testimonials" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/75" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Traveler Reviews</span>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-3">What Our Guests Say</h1>
          <p className="text-white/70 max-w-lg mx-auto">Real stories from real travelers who explored Sri Lanka with us.</p>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-12 bg-gradient-to-b from-ocean-50/50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <p className="font-[var(--font-playfair)] text-5xl sm:text-6xl font-bold text-ocean-900">4.9</p>
              <div className="flex justify-center gap-1 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="text-sunset-400 fill-sunset-400" />
                ))}
              </div>
              <p className="text-gray-400 text-sm">Based on {testimonials.length * 40}+ reviews</p>
            </div>
            <div className="space-y-2 w-full max-w-xs">
              {[
                { stars: 5, pct: 92 },
                { stars: 4, pct: 6 },
                { stars: 3, pct: 1.5 },
                { stars: 2, pct: 0.4 },
                { stars: 1, pct: 0.1 },
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-3">{r.stars}</span>
                  <Star size={13} className="text-sunset-400 fill-sunset-400" />
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sunset-400 to-coral-500 rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-gray-400 w-10 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-2 p-7 relative group">
                {/* Quote icon */}
                <div className="absolute -top-3 right-6 w-8 h-8 rounded-full bg-gradient-to-r from-sunset-400 to-coral-500 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <Quote size={14} className="text-white" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className={i < t.rating ? 'text-sunset-400 fill-sunset-400' : 'text-gray-200'} />
                  ))}
                </div>

                {/* Title & Review */}
                <h3 className="font-[var(--font-playfair)] text-lg font-bold text-ocean-900 mb-3">&ldquo;{t.title}&rdquo;</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.review}</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-ocean-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.country} • {t.date}</p>
                  </div>
                </div>

                {/* Tour badge */}
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-medium">
                    {t.tourPackage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
