'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Package } from '@/data/packages';
import { Star, Clock, Users, Check, ChevronRight, Calendar, Phone, ArrowRight, Sun } from 'lucide-react';
import ReviewsSection from './ReviewsSection';

interface Props { pkg: Package; }

export default function PackageDetailClient({ pkg }: Props) {
  const [activeTab, setActiveTab] = useState<'highlights' | 'itinerary' | 'included'>('highlights');
  const [activeImg, setActiveImg] = useState(0);
  const [guests, setGuests] = useState(2);
  const [days, setDays] = useState(pkg.nights + 1); // Default to the package's recommended duration
  const [livePrice, setLivePrice] = useState(pkg.price);
  const [liveOriginalPrice, setLiveOriginalPrice] = useState(pkg.originalPrice);

  useEffect(() => {
    import('@/lib/supabase').then(({ createClient }) => {
       const supabase = createClient();
       supabase.from('packages').select('price, original_price').eq('slug', pkg.slug).single().then(({ data }) => {
          if (data) {
             setLivePrice(data.price);
             if (data.original_price) setLiveOriginalPrice(data.original_price);
          }
       });
    });
  }, [pkg.slug]);

  const total = livePrice * guests * days;

  return (
    <main className="pt-24 lg:pt-32">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-ocean-700">Home</Link>
          <ChevronRight size={14} />
          <Link href="/packages" className="hover:text-ocean-700">Packages</Link>
          <ChevronRight size={14} />
          <span className="text-ocean-800 font-medium">{pkg.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-72 sm:h-96 lg:h-[480px] rounded-3xl overflow-hidden mb-3">
                <Image src={pkg.images[activeImg] || pkg.image} alt={pkg.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-coral-500 text-white text-sm font-bold">
                  {Math.round(((liveOriginalPrice - livePrice) / liveOriginalPrice) * 100)}% OFF
                </div>
              </div>
              <div className="flex gap-3">
                {pkg.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-tropical-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <Image src={img} alt={`${pkg.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Meta */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-tropical-100 text-tropical-700 text-xs font-semibold mb-3">{pkg.category}</span>
              <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-ocean-900 mb-2">{pkg.name}</h1>
              <p className="text-gray-400 text-lg mb-4">{pkg.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <span className="flex items-center gap-2"><Star size={16} className="text-sunset-400 fill-sunset-400" /><strong className="text-ocean-900">{pkg.rating}</strong><span className="text-gray-400">({pkg.reviewCount} reviews)</span></span>
                <span className="flex items-center gap-2 text-gray-500"><Clock size={16} className="text-tropical-500" />{pkg.duration}</span>
                <span className="flex items-center gap-2 text-gray-500"><Users size={16} className="text-tropical-500" />{pkg.groupSize}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 p-6 bg-ocean-50/50 rounded-2xl">
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Tour Description */}
            <div className="mb-8">
              <h3 className="font-[var(--font-playfair)] text-xl sm:text-2xl font-bold text-ocean-900 mb-3">About This Tour</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{pkg.tourDescription}</p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                {(['highlights', 'itinerary', 'included'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-all -mb-px ${activeTab === tab ? 'border-tropical-500 text-tropical-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    {tab === 'included' ? "What's Included" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'highlights' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map(h => (
                    <div key={h} className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-7 h-7 rounded-full bg-tropical-100 flex items-center justify-center shrink-0">
                        <Check size={14} className="text-tropical-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{h}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'itinerary' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {pkg.itinerary.map((day, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean-600 to-tropical-500 flex items-center justify-center text-white text-xs font-bold shrink-0">D{day.day}</div>
                        {i < pkg.itinerary.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2 mb-0" />}
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-ocean-900 mb-1">{day.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'included' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Included Column */}
                  <div>
                    <h4 className="font-semibold text-ocean-900 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      What's Included
                    </h4>
                    <div className="space-y-3">
                      {pkg.included.map(item => (
                        <div key={item} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Excluded Column */}
                  <div>
                    <h4 className="font-semibold text-ocean-900 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      What's Excluded
                    </h4>
                    <div className="space-y-3">
                      {pkg.excluded && pkg.excluded.map(item => (
                        <div key={item} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-red-600 font-bold text-sm">×</span>
                          </div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              {/* Price Card */}
              <div className="bg-white rounded-3xl shadow-premium p-7 border border-gray-100">
                <div className="mb-5">
                  <span className="text-gray-400 text-sm line-through">${liveOriginalPrice} / day</span>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="font-[var(--font-playfair)] text-4xl font-bold text-ocean-900">${livePrice}</span>
                    <span className="text-gray-400 text-sm mb-1">/ person / day</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {Array.from({length: 5}).map((_,i) => <Star key={i} size={14} className={i < Math.round(pkg.rating) ? 'text-sunset-400 fill-sunset-400' : 'text-gray-200'} />)}
                    <span className="text-sm text-gray-500 ml-1">{pkg.rating} ({pkg.reviewCount})</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                    <Sun size={18} className="text-tropical-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">Number of Days</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setDays(d => Math.max(1, d - 1))} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold transition-colors">−</button>
                        <span className="font-semibold text-ocean-900 w-6 text-center">{days}</span>
                        <button onClick={() => setDays(d => d + 1)} className="w-7 h-7 rounded-full bg-tropical-100 hover:bg-tropical-200 flex items-center justify-center text-tropical-700 font-bold transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                    <Users size={18} className="text-tropical-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">Number of Guests</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold transition-colors">−</button>
                        <span className="font-semibold text-ocean-900 w-6 text-center">{guests}</span>
                        <button onClick={() => setGuests(g => g + 1)} className="w-7 h-7 rounded-full bg-tropical-100 hover:bg-tropical-200 flex items-center justify-center text-tropical-700 font-bold transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>${livePrice} × {guests} guests × {days} days</span>
                    <span>${(livePrice * guests * days).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-ocean-900 text-lg mt-2">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/booking" className="block w-full text-center py-4 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-sunset-500/30 transition-all hover:scale-[1.02] mb-3">
                  Book This Package
                </Link>
                <Link href="/contact" className="block w-full text-center py-3.5 border-2 border-ocean-700 text-ocean-700 font-semibold rounded-2xl hover:bg-ocean-50 transition-all">
                  Send an Inquiry
                </Link>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-ocean-700 to-tropical-600 rounded-3xl p-6 text-white">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-white/70 text-sm mb-4">Our travel experts are available 24/7 to help plan your perfect trip.</p>
                <a href="tel:+94777266044" className="flex items-center gap-2 text-sm font-semibold hover:text-tropical-300 transition-colors">
                  <Phone size={16} /> +94 77 726 6044
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection packageSlug={pkg.slug} packageName={pkg.name} />

        {/* Related Packages */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-ocean-900 mb-8">You Might Also Like</h2>
          <div className="text-center">
            <Link href="/packages" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-ocean-700 text-ocean-700 font-semibold rounded-full hover:bg-ocean-700 hover:text-white transition-all">
              Browse All Packages <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
