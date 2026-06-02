'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, User, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Review {
  id: string;
  package_slug: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Props {
  packageSlug: string;
  packageName: string;
}

export default function ReviewsSection({ packageSlug, packageName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [packageSlug]);

  async function fetchReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('package_slug', packageSlug)
      .order('created_at', { ascending: false });

    if (!error && data) setReviews(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      setError('Please fill in all fields and select a star rating.');
      return;
    }
    setError('');
    setSubmitting(true);

    const { error: insertError } = await supabase.from('reviews').insert({
      package_slug: packageSlug,
      author_name: name.trim(),
      rating,
      comment: comment.trim(),
    });

    if (insertError) {
      setError('Failed to submit review. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setName('');
    setComment('');
    setRating(0);
    fetchReviews();

    setTimeout(() => setSubmitted(false), 5000);
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-ocean-900 mb-2">
        Traveller Reviews
      </h2>
      {avgRating && (
        <div className="flex items-center gap-2 mb-8">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className={i < Math.round(Number(avgRating)) ? 'text-sunset-400 fill-sunset-400' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="font-bold text-ocean-900">{avgRating}</span>
          <span className="text-gray-400 text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Submit Review Form */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-900 mb-5">Share Your Experience</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-5 text-green-700">
                  <CheckCircle size={20} />
                  <p className="text-sm font-medium">Thank you! Your review has been posted.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Your Rating *</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    const active = val <= (hoverRating || rating);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(val)}
                        onMouseEnter={() => setHoverRating(val)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110">
                        <Star size={28} className={active ? 'text-sunset-400 fill-sunset-400' : 'text-gray-300 fill-gray-300'} />
                      </button>
                    );
                  })}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-500 self-center">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah from Australia"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm transition-all"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review *</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={`Share your experience on the ${packageName} tour...`}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm resize-none transition-all"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-900 mb-5">
            {reviews.length === 0 ? 'No reviews yet — be the first!' : `${reviews.length} Review${reviews.length !== 1 ? 's' : ''}`}
          </h3>
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Star size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No reviews yet for this tour.</p>
                <p className="text-sm">Share your experience to help other travellers!</p>
              </div>
            ) : (
              reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean-600 to-tropical-500 flex items-center justify-center text-white shrink-0">
                      <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-ocean-900 text-sm truncate">{review.author_name}</p>
                        <time className="text-xs text-gray-400 shrink-0">
                          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                      </div>
                      <div className="flex mt-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={12} className={j < review.rating ? 'text-sunset-400 fill-sunset-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
