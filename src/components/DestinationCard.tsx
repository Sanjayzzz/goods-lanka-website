'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Destination } from '@/data/destinations';

interface DestinationCardProps {
  destination: Destination;
  index: number;
  onClick?: () => void;
}

export default function DestinationCard({ destination, index, onClick }: DestinationCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/destinations#${destination.slug}`}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className="group block"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 group-hover:-translate-y-2">
          {/* Image */}
          <div className="relative h-72 sm:h-80 overflow-hidden">
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                {destination.category}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md">
              <Star size={13} className="text-sunset-400 fill-sunset-400" />
              <span className="text-white text-xs font-bold">{destination.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex items-center gap-1.5 text-white/70 text-xs mb-2">
              <MapPin size={12} />
              <span>{destination.tagline}</span>
            </div>
            <h3 className="font-[var(--font-playfair)] text-xl sm:text-2xl font-bold text-white mb-2">
              {destination.name}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-3">
              {destination.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">{destination.reviewCount.toLocaleString()} reviews</span>
              <span className="flex items-center gap-1 text-tropical-400 text-sm font-medium group-hover:gap-2 transition-all">
                Explore <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
