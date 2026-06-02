'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Package } from '@/data/packages';

interface PackageCardProps {
  pkg: Package;
  index: number;
}

export default function PackageCard({ pkg, index }: PackageCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Link href={`/packages/${pkg.slug}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 group-hover:-translate-y-2">
          {/* Image */}
          <div className="relative h-56 sm:h-60 overflow-hidden">
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Discount badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-coral-500 text-white text-xs font-bold">
                {discount}% OFF
              </div>
            )}

            {/* Category */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
              {pkg.category}
            </div>

            {/* Price */}
            <div className="absolute bottom-4 right-4 text-right">
              <span className="text-white/60 text-xs line-through block">${pkg.originalPrice} / day</span>
              <span className="text-white text-2xl font-bold">${pkg.price}</span>
              <span className="text-white/70 text-xs"> / day</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-sunset-400 fill-sunset-400" />
                <span className="text-sm font-bold text-ocean-900">{pkg.rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-sm">{pkg.reviewCount} reviews</span>
            </div>

            <h3 className="font-[var(--font-playfair)] text-lg sm:text-xl font-bold text-ocean-900 mb-1 group-hover:text-tropical-700 transition-colors">
              {pkg.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{pkg.tagline}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-tropical-500" /> {pkg.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-tropical-500" /> {pkg.groupSize}
              </span>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {pkg.highlights.slice(0, 3).map((h) => (
                <span key={h} className="px-2.5 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-medium">
                  {h}
                </span>
              ))}
              {pkg.highlights.length > 3 && (
                <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 text-xs">
                  +{pkg.highlights.length - 3} more
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">Starting from <strong className="text-ocean-900">${pkg.price} / day</strong></span>
              <span className="flex items-center gap-1 text-tropical-600 text-sm font-semibold group-hover:gap-2 transition-all">
                View Details <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
