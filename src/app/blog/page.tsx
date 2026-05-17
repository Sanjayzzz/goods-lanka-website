import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { Clock, ArrowRight, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: "Travel Blog | Good's Lanka Tours & Travels",
  description: "Sri Lanka travel tips, destination guides, and inspiring stories from our expert team. Plan your perfect Sri Lankan holiday with our guides.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1600&q=80" alt="Ella Nine Arch Bridge Sri Lanka" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="text-tropical-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">Travel Inspiration</span>
          <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-3">Travel Blog</h1>
          <p className="text-white/70 max-w-lg mx-auto">Stories, tips and guides from Sri Lanka&apos;s most passionate travel experts.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured Post */}
          <div className="mb-16">
            <span className="text-tropical-600 text-xs font-bold uppercase tracking-widest mb-4 block">Featured Story</span>
            <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-tropical-500 text-white text-xs font-bold">{featured.category}</div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span>{featured.date}</span><span>•</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{featured.readTime}</span>
                </div>
                <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-ocean-900 mb-4 group-hover:text-tropical-600 transition-colors leading-tight">{featured.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-tropical-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>

          {/* All Posts */}
          <div>
            <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-ocean-900 mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-2">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-tropical-500 text-white text-xs font-semibold">{post.category}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span>{post.date}</span><span>•</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                    </div>
                    <h3 className="font-[var(--font-playfair)] text-lg font-bold text-ocean-900 mb-2 group-hover:text-tropical-600 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-tropical-600 text-sm font-semibold">
                      <Tag size={13} /> {post.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
