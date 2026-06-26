'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, Compass, Star, MapPin } from 'lucide-react';
import { Destination } from '@/data/destinations';

interface VehiclePriceTier { guests: number; price: number; }
interface VehiclePricing { car: VehiclePriceTier[]; van: VehiclePriceTier[]; }

interface DestinationModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  vehiclePricing?: VehiclePricing | null;
}

export default function DestinationModal({ destination, isOpen, onClose, vehiclePricing }: DestinationModalProps) {
  if (!destination) return null;

  const getPackageCategory = (destCat: string) => {
    switch (destCat) {
      case 'Cultural': return 'Cultural';
      case 'Nature': return 'Adventure';
      case 'Beach': return 'Beach';
      case 'Wildlife': return 'Wildlife';
      case 'Urban': return 'Cultural';
      default: return 'All';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-45"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all duration-300 shadow-lg border border-white/10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[250px] md:min-h-[400px]">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-tropical-500/90 text-white border border-white/20 mb-3 inline-block">
                  {destination.category}
                </span>
                <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold mb-2">
                  {destination.name}
                </h2>
                <p className="text-white/80 text-sm italic">
                  {destination.tagline}
                </p>
              </div>
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-sunset-500 fill-sunset-500" />
                    <span className="text-gray-900 font-bold text-sm">{destination.rating}</span>
                    <span className="text-gray-400 text-xs">({destination.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={14} className="text-tropical-500" />
                    <span>Sri Lanka</span>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About the Destination</h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  {destination.description}
                </p>

                {vehiclePricing && vehiclePricing.car?.length > 0 ? (
                  <div className="mb-6 rounded-2xl border border-ocean-100 overflow-hidden shadow-sm">
                    <div className="bg-ocean-50 px-4 py-2 border-b border-ocean-100 flex items-center gap-2">
                      <span className="text-base">🚗</span>
                      <p className="text-[10px] text-ocean-600 uppercase tracking-wider font-bold">Tour Pricing per Guest</p>
                    </div>
                    <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(vehiclePricing.car ?? []).map(t => (
                        <div key={t.guests} className="flex justify-between items-center bg-ocean-50/60 rounded-lg px-3 py-1.5 text-xs">
                          <span className="text-gray-500">{t.guests} {t.guests === 1 ? 'person' : 'persons'}</span>
                          <span className="font-bold text-ocean-800">${t.price}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 px-3 pb-2">× number of days = total price</p>
                  </div>
                ) : destination.price ? (
                  <div className="mb-6 p-4 bg-gradient-to-r from-ocean-50 to-tropical-50/30 rounded-2xl border border-ocean-100/60 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Base Tour Price</p>
                      <p className="text-xl sm:text-2xl font-black text-ocean-900">${destination.price} <span className="text-xs font-normal text-gray-500">/ day / person</span></p>
                    </div>
                    <span className="text-[10px] sm:text-xs text-tropical-700 font-semibold bg-tropical-50/80 px-3 py-1.5 rounded-full border border-tropical-100/50">Customizable Tour</span>
                  </div>
                ) : null}

                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Highlights</h4>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {destination.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-tropical-200 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-tropical-50 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-tropical-600" />
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/booking?destination=${encodeURIComponent(destination.name)}`}
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                >
                  <Compass size={16} /> Explore Tour
                </Link>
                <Link
                  href={`/contact?destination=${encodeURIComponent(destination.name)}`}
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-ocean-700 text-ocean-700 font-semibold rounded-full hover:bg-ocean-700 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-sm text-center"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
