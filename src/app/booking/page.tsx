'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { destinations, Destination } from '@/data/destinations';
import { createClient } from '@/lib/supabase';
import { Check, ChevronRight, Calendar, Users, Clock, CreditCard, CheckCircle, Car, Bus } from 'lucide-react';

const steps = ['Select Tour', 'Travel Details', 'Personal Info', 'Confirmation'];

interface VehiclePriceTier { guests: number; price: number; }
interface VehiclePricing { car: VehiclePriceTier[]; van: VehiclePriceTier[]; }
interface LiveDestination extends Destination {
  vehicle_pricing?: VehiclePricing | null;
}

type VehicleType = 'car' | 'van';

const VEHICLE_MAX: Record<VehicleType, number> = { car: 3, van: 5 };

function getTieredPrice(
  vehiclePricing: VehiclePricing | null | undefined,
  vehicle: VehicleType,
  guests: number
): number | null {
  if (!vehiclePricing) return null;
  const tiers = vehiclePricing[vehicle];
  if (!tiers || tiers.length === 0) return null;
  const match = tiers.find(t => t.guests === guests);
  return match ? match.price : null;
}

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [liveDestinations, setLiveDestinations] = useState<LiveDestination[]>(
    destinations.map(d => ({ ...d, price: d.price ?? 99 }))
  );
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0].id);
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [guests, setGuests] = useState(1);
  const [durationDays, setDurationDays] = useState(5);
  const [date, setDate] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', notes: '' });
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/account/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }
      setUserId(user.id);
      setForm(f => ({
        ...f,
        name: user.user_metadata?.full_name ?? '',
        email: user.email ?? '',
      }));
      setAuthChecking(false);

      // Load live destinations with vehicle_pricing
      const { data: dbDests } = await supabase
        .from('destinations')
        .select('id, name, slug, price, active, vehicle_pricing');

      if (dbDests) {
        const liveMap = new Map(dbDests.map(d => [d.slug, d]));
        const updatedDests = destinations.filter(d => {
          const live = liveMap.get(d.slug);
          return !live || live.active;
        }).map(d => {
          const live = liveMap.get(d.slug);
          if (live) {
            return {
              ...d,
              id: live.id,
              price: Number(live.price) || 99,
              vehicle_pricing: live.vehicle_pricing ?? null,
            } as LiveDestination;
          }
          return { ...d, price: d.price ?? 99, vehicle_pricing: null } as LiveDestination;
        });
        setLiveDestinations(updatedDests);

        const params = new URLSearchParams(window.location.search);
        const destParam = params.get('destination');
        if (destParam) {
          const found = updatedDests.find(
            d => d.name.toLowerCase() === destParam.toLowerCase() || d.slug.toLowerCase() === destParam.toLowerCase()
          );
          if (found) setSelectedDestId(found.id);
        }
      }
    };
    checkAuth();
  }, []);

  const dest = (liveDestinations.find(d => d.id === selectedDestId) || liveDestinations[0]) as LiveDestination;

  // Vehicle max guests
  const maxGuests = VEHICLE_MAX[vehicle];

  // Clamp guests when vehicle changes
  const handleVehicleChange = (v: VehicleType) => {
    setVehicle(v);
    setGuests(g => Math.min(g, VEHICLE_MAX[v]));
  };

  // Get price from tiers or fall back to base price
  const tieredPrice = getTieredPrice(dest?.vehicle_pricing, vehicle, guests);
  const basePrice = dest?.price ?? 99;
  const total = tieredPrice !== null ? tieredPrice * durationDays : basePrice * durationDays * guests;

  if (authChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const next = async () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      setSubmitting(true);
      setSubmitError('');
      try {
        const supabase = createClient();
        const formattedNotes =
          `Vehicle: ${vehicle === 'car' ? 'Car (max 3)' : 'Van (max 5)'}\n` +
          `Duration: ${durationDays} days\n` +
          `Pricing: ${tieredPrice !== null ? `$${tieredPrice} (fixed ${guests}-person ${vehicle} rate)` : `$${basePrice}/person/day`}\n\n` +
          `Notes:\n${form.notes}`;

        const { error } = await supabase.from('bookings').insert({
          package_name: `${dest.name} Tour`,
          travel_date: date || null,
          guests,
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          special_requests: formattedNotes,
          total_price: total,
          status: 'pending',
          user_id: userId,
        });
        if (error) {
          setSubmitError(`Failed to save booking: ${error.message}`);
        } else {
          setBooked(true);
        }
      } catch (err) {
        setSubmitError(`Unexpected error: ${String(err)}`);
      } finally {
        setSubmitting(false);
      }
    }
  };
  const prev = () => setStep(s => Math.max(0, s - 1));

  if (booked) return (
    <main className="pt-24 lg:pt-32 min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center py-16 bg-white p-8 rounded-3xl shadow-premium">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-ocean-900 mb-3">Tour Booked!</h1>
        <p className="text-gray-400 mb-2">Thank you, {form.name || 'Traveler'}!</p>
        <p className="text-gray-400 text-sm mb-8">We&apos;ve received your request for the <strong>{dest.name} Tour</strong>. Our team will contact you within 24 hours to coordinate your custom itinerary.</p>
        <div className="p-6 bg-ocean-50 rounded-2xl text-left mb-8 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-400">Destination</span><span className="font-medium text-ocean-900">{dest.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Vehicle</span><span className="font-medium text-ocean-900">{vehicle === 'car' ? '🚗 Car' : '🚐 Van'}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Duration</span><span className="font-medium text-ocean-900">{durationDays} Days</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Guests</span><span className="font-medium text-ocean-900">{guests}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Travel Date</span><span className="font-medium text-ocean-900">{date || 'TBD'}</span></div>
          <div className="flex justify-between font-bold border-t border-gray-200 pt-2"><span className="text-gray-700">Total Est. Price</span><span className="text-ocean-900">${total.toLocaleString()}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/my-bookings" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-full hover:scale-105 transition-all">
            View My Bookings →
          </Link>
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );

  return (
    <main className="pt-24 lg:pt-32 bg-gray-50/50 min-h-screen">
      {/* Hero */}
      <section className="relative h-48 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1612862862126-865765df2ded?w=1600&q=80" alt="Book your Sri Lanka tour" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-ocean-950/75" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white">Book Your Tour</h1>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-ocean-500 to-tropical-500 z-0 transition-all duration-500" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? 'bg-tropical-500 text-white' : i === step ? 'bg-ocean-700 text-white ring-4 ring-ocean-200' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-ocean-800' : 'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-premium p-8">

                {/* ── STEP 0: SELECT TOUR ── */}
                {step === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Choose a Tour Destination</h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                      {liveDestinations.map(d => {
                        const hasVehiclePricing = d.vehicle_pricing && (d.vehicle_pricing.car?.length > 0 || d.vehicle_pricing.van?.length > 0);
                        return (
                          <label key={d.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedDestId === d.id ? 'border-tropical-500 bg-tropical-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <input type="radio" name="destination" value={d.id} checked={selectedDestId === d.id} onChange={() => setSelectedDestId(d.id)} className="hidden" />
                            <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0">
                              <Image src={d.image} alt={d.name} fill className="object-cover" sizes="64px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-ocean-900 text-sm truncate">{d.name}</p>
                              <p className="text-gray-400 text-xs">{d.category}</p>
                            </div>
                            <div className="text-right shrink-0 text-xs text-gray-400">
                              {hasVehiclePricing ? (
                                <span className="text-tropical-600 font-semibold">Tiered pricing ✓</span>
                              ) : (
                                <span>${d.price || 99}/day</span>
                              )}
                            </div>
                            {selectedDestId === d.id && <Check size={18} className="text-tropical-500 shrink-0" />}
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 1: TRAVEL DETAILS ── */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Travel Details</h2>
                    <div className="space-y-6">

                      {/* Vehicle Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Select Vehicle *</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => handleVehicleChange('car')}
                            className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${vehicle === 'car' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-200 bg-white'}`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${vehicle === 'car' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              🚗
                            </div>
                            <div className="text-center">
                              <p className={`font-bold text-sm ${vehicle === 'car' ? 'text-blue-800' : 'text-gray-700'}`}>Car</p>
                              <p className={`text-xs mt-0.5 ${vehicle === 'car' ? 'text-blue-500' : 'text-gray-400'}`}>Up to 3 guests</p>
                            </div>
                            {vehicle === 'car' && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleVehicleChange('van')}
                            className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${vehicle === 'van' ? 'border-tropical-500 bg-tropical-50 shadow-md' : 'border-gray-200 hover:border-tropical-200 bg-white'}`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${vehicle === 'van' ? 'bg-tropical-100' : 'bg-gray-100'}`}>
                              🚐
                            </div>
                            <div className="text-center">
                              <p className={`font-bold text-sm ${vehicle === 'van' ? 'text-tropical-800' : 'text-gray-700'}`}>Van</p>
                              <p className={`text-xs mt-0.5 ${vehicle === 'van' ? 'text-tropical-500' : 'text-gray-400'}`}>Up to 5 guests</p>
                            </div>
                            {vehicle === 'van' && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tropical-500 flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Travel Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date *</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                      </div>

                      {/* Number of Days */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days *</label>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                          <Clock size={18} className="text-tropical-500" />
                          <button onClick={() => setDurationDays(d => Math.max(1, d - 1))} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition-colors">−</button>
                          <span className="font-bold text-ocean-900 text-xl w-10 text-center">{durationDays}</span>
                          <button onClick={() => setDurationDays(d => d + 1)} className="w-9 h-9 rounded-full bg-tropical-100 hover:bg-tropical-200 flex items-center justify-center font-bold text-tropical-700 transition-colors">+</button>
                          <span className="text-gray-400 text-sm">{durationDays > 1 ? 'days' : 'day'}</span>
                        </div>
                      </div>

                      {/* Number of Guests */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Guests * <span className="text-gray-400 font-normal">(max {maxGuests} for {vehicle})</span>
                        </label>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                          <Users size={18} className="text-tropical-500" />
                          <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition-colors">−</button>
                          <span className="font-bold text-ocean-900 text-xl w-10 text-center">{guests}</span>
                          <button onClick={() => setGuests(g => Math.min(maxGuests, g + 1))} className="w-9 h-9 rounded-full bg-tropical-100 hover:bg-tropical-200 flex items-center justify-center font-bold text-tropical-700 transition-colors">+</button>
                          <span className="text-gray-400 text-sm">{guests > 1 ? 'guests' : 'guest'}</span>
                        </div>

                        {/* Live Pricing Preview */}
                        {dest?.vehicle_pricing && (
                          <div className="mt-3 p-3 bg-ocean-50 border border-ocean-100 rounded-xl">
                            <p className="text-xs font-semibold text-ocean-700 mb-1.5">Price for {vehicle === 'car' ? '🚗 Car' : '🚐 Van'}</p>
                            <div className="flex flex-wrap gap-2">
                              {(dest.vehicle_pricing[vehicle] ?? []).map(t => (
                                <span key={t.guests} className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${guests === t.guests ? 'bg-ocean-700 text-white border-ocean-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                                  {t.guests}p: ${t.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: PERSONAL INFO ── */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Personal Information</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="John Smith" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="john@example.com" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                          <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="+1 234 567 8900" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                          <input required type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                            placeholder="United Kingdom" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                          rows={3} placeholder="Any dietary requirements, accessibility needs, or special requests..."
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm resize-none" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: CONFIRMATION ── */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Review &amp; Confirm</h2>
                    <div className="space-y-1 mb-8">
                      {[
                        { label: 'Destination', value: dest.name },
                        { label: 'Vehicle', value: vehicle === 'car' ? '🚗 Car (max 3 guests)' : '🚐 Van (max 5 guests)' },
                        { label: 'Duration', value: `${durationDays} Days` },
                        { label: 'Travel Date', value: date || 'Not set' },
                        { label: 'Guests', value: guests.toString() },
                        { label: 'Name', value: form.name || 'Not set' },
                        { label: 'Email', value: form.email || 'Not set' },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between py-3 border-b border-gray-100 text-sm">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="font-medium text-ocean-900">{item.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-4 font-bold text-base">
                        <span className="text-gray-700">
                          Total Est. Price
                          {tieredPrice !== null && <span className="text-xs font-normal text-gray-400 ml-1">(fixed {guests}-person rate)</span>}
                        </span>
                        <span className="text-ocean-900 text-xl">${total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-ocean-50 rounded-2xl">
                      <CreditCard size={20} className="text-ocean-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-ocean-700">Payment will be arranged by our team after booking confirmation. We accept bank transfer, credit card, and PayPal.</p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{submitError}</div>
                )}
                <div className="flex justify-between mt-4 pt-6 border-t border-gray-100">
                  {step > 0 ? (
                    <button onClick={prev} disabled={submitting} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                      ← Back
                    </button>
                  ) : <div />}
                  <button onClick={next} disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Saving...' : step === 3 ? 'Confirm Booking' : 'Continue'} {!submitting && <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-premium p-6 sticky top-28">
                <h3 className="font-semibold text-ocean-900 mb-4">Tour Summary</h3>
                <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="300px" />
                </div>
                <h4 className="font-[var(--font-playfair)] font-bold text-ocean-900 mb-1">{dest.name} Tour</h4>
                <p className="text-gray-400 text-xs mb-4">{dest.category}</p>

                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vehicle</span>
                    <span className="font-medium">{vehicle === 'car' ? '🚗 Car' : '🚐 Van'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Guests</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="font-medium">{durationDays} days</span>
                  </div>
                  {tieredPrice !== null ? (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Fixed {guests}-person {vehicle} rate</span>
                      <span>${tieredPrice}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>${basePrice} × {guests} × {durationDays}d</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-ocean-900">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
