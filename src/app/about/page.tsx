import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Heart, Users, Globe, Star, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Us | Good's Lanka Tours & Travels",
  description: "Learn about Good's Lanka Tours & Travels — Sri Lanka's premier luxury tour operator with 12+ years of creating unforgettable travel experiences.",
};

const team = [
  { name: 'Roshan Perera', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Amali Fernando', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Kasun Jayawardena', role: 'Lead Tour Guide', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Dilini Silva', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
];

const values = [
  { icon: Heart, title: 'Passion for Travel', desc: 'Every journey we craft is infused with genuine love for Sri Lanka and travel.' },
  { icon: Users, title: 'People First', desc: 'Our guests\' safety, comfort, and satisfaction are our absolute top priority.' },
  { icon: Globe, title: 'Sustainable Tourism', desc: 'We are committed to protecting Sri Lanka\'s nature and supporting local communities.' },
  { icon: Award, title: 'Excellence Always', desc: 'We maintain the highest standards of service, never compromising on quality.' },
];

export default function AboutPage() {
  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80" alt="About Us" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Our Story</span>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-4">About Good&apos;s Lanka</h1>
          <p className="text-white/70 max-w-xl mx-auto">Crafting extraordinary Sri Lankan journeys since 2012.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-tropical-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Our Story</span>
              <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-ocean-900 mb-6 leading-tight">Born From a Love of Sri Lanka</h2>
              <div className="section-divider mb-6" />
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>Good&apos;s Lanka Tours & Travels was founded in 2012 by Roshan Perera, a passionate Sri Lankan traveler who wanted to share the incredible beauty of his homeland with the world.</p>
                <p>What began as a small operation with just two tour guides and a handful of clients has grown into one of Sri Lanka&apos;s most respected and awarded tourism companies, serving over 15,000 international travelers annually.</p>
                <p>We believe that travel is transformative — it changes perspectives, builds bridges between cultures, and creates memories that last a lifetime. Every tour we create is designed to give you an authentic, deeply enriching experience of Sri Lanka.</p>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-premium">
              <Image src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80" alt="Our story" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-ocean-50/30 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-tropical-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">What We Stand For</span>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-ocean-900 mb-4">Our Core Values</h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className="text-center p-8 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-2 group">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <v.icon size={28} className="text-white" />
                </div>
                <h3 className="font-semibold text-ocean-900 text-lg mb-3">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-tropical-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Meet The Team</span>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-ocean-900 mb-4">The People Behind Your Journey</h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-4 rounded-3xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-400 group-hover:-translate-y-2">
                  <Image src={member.image} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 112px, 144px" />
                </div>
                <h3 className="font-semibold text-ocean-900 text-sm sm:text-base">{member.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{member.role}</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {Array.from({length: 5}).map((_,i) => <Star key={i} size={10} className="text-sunset-400 fill-sunset-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900 to-tropical-800" />
        <div className="relative max-w-3xl mx-auto text-center px-6">
          <h2 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-6">Start Your Sri Lanka Story</h2>
          <p className="text-white/70 text-lg mb-8">Join thousands of happy travelers who have trusted us with their dream Sri Lankan holiday.</p>
          <Link href="/packages" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all text-lg">
            Browse Packages <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
