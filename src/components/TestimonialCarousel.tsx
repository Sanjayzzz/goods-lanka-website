'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, FormEvent, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquarePlus, X, CheckCircle } from 'lucide-react';

import { createClient } from '@/lib/supabase';

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('package_slug', 'general')
        .order('created_at', { ascending: false });
      
      if (data) {
        setDbReviews(data);
      }
    };
    fetchReviews();
  }, []);

  const allTestimonials = [
    ...dbReviews.map(r => ({
      id: r.id,
      name: r.author_name,
      country: 'Verified Guest',
      avatar: r.author_name.substring(0, 2).toUpperCase(),
      avatar_url: r.avatar_url,
      rating: r.rating,
      title: r.rating === 5 ? 'Excellent Experience' : 'Great Service',
      review: r.comment,
      tourPackage: 'GODS LANKA Tour',
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    })),
    
  ];

  const next = () => setCurrent((p) => (p + 1) % allTestimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + allTestimonials.length) % allTestimonials.length);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');


  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    setIsSubmitting(true);
    
    const supabase = createClient();
    
    // Check if user is logged in to grab their avatar
    const { data: { user } } = await supabase.auth.getUser();
    const avatarUrl = user?.user_metadata?.avatar_url || null;

    const { error } = await supabase.from('reviews').insert({
      package_slug: 'general',
      author_name: name,
      avatar_url: avatarUrl,
      rating,
      comment
    });

    setIsSubmitting(false);
    if (!error) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setName('');
        setRating(5);
        setComment('');
        // Refresh reviews after submitting
        const supabase = createClient();
        supabase.from('reviews').select('*').eq('package_slug', 'general').order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setDbReviews(data); });
      }, 3000);
    }
  };

    if (allTestimonials.length === 0) {
    return (
      <section ref={ref} className="py-20 sm:py-28 bg-gradient-to-b from-white to-ocean-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center py-12">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      </section>
    );
  }
  const t = allTestimonials[current];

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
          <div className="section-divider mx-auto mb-8" />
          
          <button
            onClick={async () => {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                window.location.href = `/account/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                return;
              }
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ocean-700 text-white rounded-full font-medium hover:bg-ocean-800 transition-colors shadow-md"
          >
            <MessageSquarePlus size={18} />
            Write a Review
          </button>
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
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center text-white font-bold text-lg mb-3 overflow-hidden border-2 border-ocean-100">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    t.avatar
                  )}
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
                {allTestimonials.map((_, i) => (
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ocean-950/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && !submitSuccess && setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {submitSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-500 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean-900 mb-2">Thank You!</h3>
                  <p className="text-gray-500">Your review has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input 
                        type="text" required
                        value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 transition-shadow"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star} type="button"
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star size={28} className={star <= rating ? 'text-sunset-400 fill-sunset-400' : 'text-gray-200'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                      <textarea 
                        required rows={4}
                        value={comment} onChange={e => setComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 transition-shadow resize-none"
                        placeholder="Tell us about your experience..."
                      />
                    </div>
                    <button 
                      type="submit" disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
