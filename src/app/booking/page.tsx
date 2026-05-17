'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { packages } from '@/data/packages';
import { Check, ChevronRight, Calendar, Users, CreditCard, CheckCircle } from 'lucide-react';

const steps = ['Select Package', 'Travel Details', 'Personal Info', 'Confirmation'];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(packages[0].id);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', notes: '' });
  const [booked, setBooked] = useState(false);

  const pkg = packages.find(p => p.id === selectedPkg) || packages[0];
  const total = pkg.price * guests;

  const next = () => {
    if (step < 3) setStep(s => s + 1);
    else setBooked(true);
  };
  const prev = () => setStep(s => Math.max(0, s - 1));

  if (booked) return (
    <main className="pt-24 lg:pt-32 min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-ocean-900 mb-3">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-2">Thank you, {form.name || 'Traveler'}!</p>
        <p className="text-gray-400 text-sm mb-8">We&apos;ve received your booking for <strong>{pkg.name}</strong>. Our team will contact you within 24 hours to confirm your reservation.</p>
        <div className="p-6 bg-ocean-50 rounded-2xl text-left mb-8 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-400">Package</span><span className="font-medium text-ocean-900">{pkg.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Guests</span><span className="font-medium text-ocean-900">{guests}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-400">Travel Date</span><span className="font-medium text-ocean-900">{date || 'TBD'}</span></div>
          <div className="flex justify-between font-bold border-t border-gray-200 pt-2"><span className="text-gray-700">Total</span><span className="text-ocean-900">${total.toLocaleString()}</span></div>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-full hover:scale-105 transition-all">
          Back to Home
        </Link>
      </motion.div>
    </main>
  );

  return (
    <main className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="relative h-48 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1600&q=80" alt="Booking" fill className="object-cover" priority />
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
                {step === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Choose a Package</h2>
                    <div className="space-y-3">
                      {packages.map(p => (
                        <label key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPkg === p.id ? 'border-tropical-500 bg-tropical-50' : 'border-gray-100 hover:border-gray-200'}`}>
                          <input type="radio" name="package" value={p.id} checked={selectedPkg === p.id} onChange={() => setSelectedPkg(p.id)} className="hidden" />
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0">
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ocean-900 text-sm truncate">{p.name}</p>
                            <p className="text-gray-400 text-xs">{p.duration} • {p.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-ocean-900">${p.price}</p>
                            <p className="text-gray-400 text-xs">/ person</p>
                          </div>
                          {selectedPkg === p.id && <Check size={18} className="text-tropical-500 shrink-0" />}
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Travel Details</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date *</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                          <Users size={18} className="text-tropical-500" />
                          <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition-colors">−</button>
                          <span className="font-bold text-ocean-900 text-xl w-10 text-center">{guests}</span>
                          <button onClick={() => setGuests(g => g + 1)} className="w-9 h-9 rounded-full bg-tropical-100 hover:bg-tropical-200 flex items-center justify-center font-bold text-tropical-700 transition-colors">+</button>
                          <span className="text-gray-400 text-sm">{guests > 1 ? 'guests' : 'guest'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Personal Information</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                          <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="John Smith" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="john@example.com" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                          <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                            placeholder="+1 234 567 8900" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                          <input required type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                            placeholder="United Kingdom" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                        <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                          rows={3} placeholder="Any dietary requirements, accessibility needs, or special requests..."
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm resize-none" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-ocean-900 mb-6">Review & Confirm</h2>
                    <div className="space-y-4 mb-8">
                      {[
                        { label: 'Package', value: pkg.name },
                        { label: 'Duration', value: pkg.duration },
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
                      <div className="flex justify-between py-3 font-bold text-base">
                        <span className="text-gray-700">Total Amount</span>
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
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  {step > 0 ? (
                    <button onClick={prev} className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                      ← Back
                    </button>
                  ) : <div />}
                  <button onClick={next}
                    className="px-8 py-3 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2">
                    {step === 3 ? 'Confirm Booking' : 'Continue'} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-premium p-6 sticky top-28">
                <h3 className="font-semibold text-ocean-900 mb-4">Booking Summary</h3>
                <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover" sizes="300px" />
                </div>
                <h4 className="font-[var(--font-playfair)] font-bold text-ocean-900 mb-1">{pkg.name}</h4>
                <p className="text-gray-400 text-xs mb-4">{pkg.duration} • {pkg.category}</p>
                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  <div className="flex justify-between"><span className="text-gray-400">${pkg.price} × {guests} guests</span><span>${(pkg.price * guests).toLocaleString()}</span></div>
                  {date && <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-medium">{date}</span></div>}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                    <span>Total</span><span className="text-ocean-900">${total.toLocaleString()}</span>
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
