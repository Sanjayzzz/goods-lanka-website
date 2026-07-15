'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, Camera } from 'lucide-react';

interface TravelerStory {
  id: string;
  image_url: string;
  caption: string | null;
}

export default function TravelerStoriesPage() {
  const [stories, setStories] = useState<TravelerStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('traveler_stories')
          .select('id, image_url, caption')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setStories(data || []);
      } catch (e) {
        console.error('Error loading traveler stories:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-ocean-900 via-ocean-800 to-tropical-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-yellow-300 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Camera size={14} />
              Traveler Stories
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Memories Captured<br />by Our Guests
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Real adventures, real smiles — a gallery of unforgettable moments shared by travellers who explored Sri Lanka with us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-ocean-700 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Masonry Gallery */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-32 text-gray-400">
              <Camera size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No memories uploaded yet.</p>
              <p className="text-sm">Check back soon!</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-5">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.4) }}
                  className="break-inside-avoid inline-block w-full h-fit mb-3 sm:mb-5 overflow-hidden rounded-2xl sm:rounded-3xl group shadow-sm bg-white border border-gray-100 p-1.5 sm:p-2 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden">
                    <img
                      src={story.image_url}
                      alt={story.caption || 'Traveler Memory'}
                      className="w-full h-auto object-cover rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl" />
                  </div>
                  {story.caption && (
                    <div className="px-2 pt-2 pb-1.5 text-center">
                      <p className="text-xs sm:text-sm font-semibold text-ocean-900 leading-snug">{story.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
