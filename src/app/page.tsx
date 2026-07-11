'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import SectionHeading from '@/components/SectionHeading';
import DestinationCard from '@/components/DestinationCard';
import DestinationModal from '@/components/DestinationModal';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import StatsSection from '@/components/StatsSection';
import { destinations, Destination } from '@/data/destinations';
import { createClient } from '@/lib/supabase';
import {
  Shield, Award, Headphones, Heart, Camera, Mountain, Waves, TreePine, Binoculars, Compass,
  ArrowRight, Star, Clock, Send
} from 'lucide-react';

const categories = [
  { icon: Waves, label: 'Beach & Coastal', count: 8, color: 'from-blue-400 to-ocean-500', href: '/destinations?cat=Beach' },
  { icon: Mountain, label: 'Hill & Mountains', count: 6, color: 'from-tropical-400 to-tropical-700', href: '/destinations?cat=Nature' },
  { icon: Binoculars, label: 'Wildlife Safari', count: 5, color: 'from-sunset-400 to-coral-600', href: '/destinations?cat=Wildlife' },
  { icon: Camera, label: 'Cultural Tours', count: 7, color: 'from-purple-400 to-indigo-600', href: '/destinations?cat=Cultural' },
  { icon: TreePine, label: 'Eco & Nature', count: 4, color: 'from-green-400 to-tropical-600', href: '/destinations?cat=Nature' },
  { icon: Compass, label: 'Luxury Retreat', count: 3, color: 'from-amber-400 to-sunset-600', href: '/destinations?cat=Cultural' },
];

const whyUs = [
  { icon: Shield, title: 'Trusted & Safe', desc: '15+ years of trusted service with 100% customer safety record and fully insured tours.' },
  { icon: Award, title: 'Award Winning', desc: 'Multiple national and international tourism awards recognizing our excellence.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock support from our expert team — we\'re always here when you need us.' },
  { icon: Heart, title: 'Personalised', desc: 'Every tour crafted uniquely for you. We customize every detail to match your dream holiday.' },
];

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=600&q=80', alt: 'Sigiriya' },
  { src: 'https://images.unsplash.com/photo-1522310193626-604c5ef8be43?w=400&q=80', alt: 'Mirissa Beach' },
  { src: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=400&q=80', alt: 'Ella' },
  { src: 'https://images.unsplash.com/photo-1533484482814-3fe2d922be89?w=400&q=80', alt: 'Yala Wildlife' },
  { src: 'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?w=400&q=80', alt: 'Galle Fort' },
  { src: 'https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=400&q=80', alt: 'Nuwara Eliya Tea' },
];

function GalleryPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading subtitle="Gallery" title="Sri Lanka in Every Frame" description="A glimpse into the breathtaking beauty that awaits you." />
        <motion.div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 h-64 sm:h-80' : 'h-36 sm:h-40'}`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-ocean-700 text-ocean-700 font-semibold rounded-full hover:bg-ocean-700 hover:text-white transition-all duration-300 hover:scale-105">
            View Full Gallery <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}


function WhyUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <SectionHeading subtitle="Why Choose Us" title="Your Dream Journey, Our Passion" description="We don't just plan tours — we craft extraordinary memories that last a lifetime. Here's what sets us apart." center={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {whyUs.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex gap-4 p-5 rounded-2xl bg-ocean-50/50 hover:bg-ocean-50 hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ocean-900 mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }} className="mt-8">
              <Link href="/about" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300">
                Learn More About Us <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-premium">
            <Image src="https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=800&q=80" alt="Kandy Temple of the Tooth Sri Lanka" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['SM','MW','TY','EC'].map((a) => (
                      <div key={a} className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean-400 to-tropical-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">{a}</div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} className="text-sunset-400 fill-sunset-400"/>)}</div>
                    <p className="text-white text-sm font-medium">15,000+ happy travelers</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?w=1600&q=70')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/90 via-ocean-900/80 to-tropical-900/70" />
      <div className="relative max-w-4xl mx-auto text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="inline-block text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">Start Your Journey</span>
          <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready for Your Sri Lanka Adventure?
          </h2>
          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Let us craft your perfect Sri Lankan holiday. Expert guidance, luxury experiences, and memories that last forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-sunset-500/40 transition-all duration-300 hover:scale-105 text-lg">
              Book Your Tour Now
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 text-lg">
              Talk to an Expert
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section ref={ref} className="py-20 sm:py-24 bg-gradient-to-br from-tropical-50 via-white to-ocean-50">
      <div className="max-w-3xl mx-auto text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="text-tropical-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Newsletter</span>
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-ocean-900 mb-3">Get Exclusive Travel Deals</h2>
          <p className="text-gray-400 mb-8">Subscribe and be the first to receive special offers, hidden gems, and curated travel inspiration.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 focus:border-transparent text-sm" />
            <button type="submit" className="px-8 py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Send size={16} /> Subscribe
            </button>
          </form>
          <p className="text-gray-300 text-xs mt-4">No spam, ever. Unsubscribe at any time.</p>
        </motion.div>
      </div>
    </section>
  );
}

interface VehiclePriceTier { guests: number; price: number; }
interface VehiclePricing { car: VehiclePriceTier[]; van: VehiclePriceTier[]; }

export default function HomePage() {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [selectedVehiclePricing, setSelectedVehiclePricing] = useState<VehiclePricing | null>(null);
  const [liveDestinations, setLiveDestinations] = useState(destinations);
  const [vehiclePricingMap, setVehiclePricingMap] = useState<Map<string, VehiclePricing | null>>(new Map());

  useEffect(() => {
    const supabase = createClient();
    supabase.from('destinations').select('slug, price, active, vehicle_pricing').then(({ data }) => {
      if (data) {
        const liveMap = new Map(data.map(d => [d.slug, d]));
        const vpMap = new Map<string, VehiclePricing | null>(data.map(d => [d.slug, d.vehicle_pricing ?? null]));
        setVehiclePricingMap(vpMap);
        setLiveDestinations(destinations.filter(d => {
          const live = liveMap.get(d.slug);
          return !live || live.active;
        }).map(d => {
          const live = liveMap.get(d.slug);
          if (live) return { ...d, price: Number(live.price) };
          return d;
        }));
      }
    });
  }, []);

  const handleOpenModal = (dest: Destination) => {
    setSelectedDest(dest);
    setSelectedVehiclePricing(vehiclePricingMap.get(dest.slug) ?? null);
  };

  return (
    <>
      <HeroSection />

      {/* Categories */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Explore By Category" title="Find Your Perfect Experience" description="From tropical beaches to misty mountains — Sri Lanka has something magical for every traveler." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((cat, i) => (
              <motion.div key={cat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Link href={cat.href} className="group flex flex-col items-center p-5 sm:p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-card-hover transition-all duration-400 hover:-translate-y-2 text-center">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <cat.icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-ocean-900 text-sm sm:text-base mb-1">{cat.label}</h3>
                  <span className="text-gray-400 text-xs">{cat.count} tours</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-ocean-50/30 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Destinations" title="Iconic Sri Lankan Destinations" description="Explore the most breathtaking destinations this tropical paradise has to offer." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {liveDestinations.slice(0, 6).map((dest, i) => (
              <DestinationCard 
                key={dest.id} 
                destination={dest} 
                index={i} 
                onClick={() => handleOpenModal(dest)}
              />
            ))}
          </div>
          <div className="text-center">
            <Link href="/destinations" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-ocean-700 text-ocean-700 font-semibold rounded-full hover:bg-ocean-700 hover:text-white transition-all duration-300 hover:scale-105">
              View All Destinations <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <WhyUsSection />
      <StatsSection />
      <TestimonialCarousel />
      <GalleryPreview />
      <CTASection />
      <NewsletterSection />

      <DestinationModal 
        destination={selectedDest} 
        isOpen={selectedDest !== null} 
        onClose={() => { setSelectedDest(null); setSelectedVehiclePricing(null); }}
        vehiclePricing={selectedVehiclePricing}
      />
    </>
  );
}
