'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ subtitle, title, description, center = true, light = false }: SectionHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`mb-12 sm:mb-16 ${center ? 'text-center' : ''}`}
    >
      {subtitle && (
        <span className={`inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3 ${
          light ? 'text-tropical-300' : 'text-tropical-600'
        }`}>
          {subtitle}
        </span>
      )}
      <h2 className={`font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${
        light ? 'text-white' : 'text-ocean-900'
      }`}>
        {title}
      </h2>
      <div className={`section-divider ${center ? 'mx-auto' : ''} mb-4`} />
      {description && (
        <p className={`max-w-2xl text-base sm:text-lg leading-relaxed ${center ? 'mx-auto' : ''} ${
          light ? 'text-white/70' : 'text-gray-500'
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
