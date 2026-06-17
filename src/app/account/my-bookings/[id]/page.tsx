'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, Save, CalendarCheck, Users, FileText } from 'lucide-react';

interface Booking {
  id: string;
  package_name: string;
  travel_date: string;
  guests: number;
  total_price: number;
  special_requests: string;
  status: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  created_at: string;
}

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ travel_date: '', guests: 1, special_requests: '' });
  const [pricePerDay, setPricePerDay] = useState(0);
  const [durationDays, setDurationDays] = useState(1);
  const [vehiclePricing, setVehiclePricing] = useState<{car:{guests:number;price:number}[];van:{guests:number;price:number}[]} | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/account/login'); return; }
      const { data } = await supabase.from('bookings').select('*').eq('id', params.id).eq('user_id', user.id).single();
      if (!data) { router.push('/account/my-bookings'); return; }
      setBooking(data);
      setForm({ travel_date: data.travel_date ?? '', guests: data.guests ?? 1, special_requests: data.special_requests ?? '' });

      // Extract duration from special_requests
      const match = (data.special_requests ?? '').match(/Duration:\s*(\d+)\s*day/i);
      const days = match ? Number(match[1]) : 1;
      setDurationDays(days);

      // Fetch destination price
      const destName = (data.package_name ?? '').replace(' Tour', '').trim();
      const destSlug = destName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (destSlug) {
        const { data: destData } = await supabase.from('destinations').select('price, vehicle_pricing').eq('slug', destSlug).single();
        if (destData?.price) setPricePerDay(Number(destData.price));
        if (destData?.vehicle_pricing) setVehiclePricing(destData.vehicle_pricing);
      }

      setLoading(false);
    };
    load();
  }, [params.id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const supabase = createClient();

      // Extract duration days from special_requests
      let durationDays = 1;
      const durationMatch = (form.special_requests || booking?.special_requests || '').match(/Duration:\s*(\d+)\s*day/i);
      if (durationMatch) {
        durationDays = Number(durationMatch[1]);
      }

      // Extract vehicle type from special_requests
      const vehicleMatch = (form.special_requests || booking?.special_requests || '').match(/Vehicle:\s*(Car|Van)/i);
      const vehicleType = vehicleMatch ? vehicleMatch[1].toLowerCase() as 'car' | 'van' : 'car';

      // Fetch destination's current vehicle_pricing from DB
      const destName = booking?.package_name?.replace(' Tour', '').trim() ?? '';
      const destSlug = destName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      let newTotal = booking?.total_price ?? 0;

      if (destSlug) {
        const { data: destData } = await supabase
          .from('destinations')
          .select('price, vehicle_pricing')
          .eq('slug', destSlug)
          .single();

        if (destData) {
          const vehiclePricing = destData.vehicle_pricing;
          // Try tiered pricing first
          if (vehiclePricing && vehiclePricing[vehicleType]) {
            const tier = (vehiclePricing[vehicleType] as {guests:number;price:number}[]).find(t => t.guests === form.guests);
            if (tier) {
              newTotal = tier.price * durationDays;
            } else if (destData.price) {
              // Fallback: base price * days * guests
              newTotal = Number(destData.price) * durationDays * form.guests;
            }
          } else if (destData.price) {
            newTotal = Number(destData.price) * durationDays * form.guests;
          }
        }
      }

      // Final fallback: scale by guest ratio
      if (newTotal === booking?.total_price && booking && booking.guests > 0 && form.guests !== booking.guests) {
        const perGuestTotal = booking.total_price / booking.guests;
        newTotal = Math.round(perGuestTotal * form.guests);
      }

      const { error: updateError } = await supabase.from('bookings')
        .update({
          travel_date: form.travel_date,
          guests: form.guests,
          special_requests: form.special_requests,
          total_price: newTotal,
        })
        .eq('id', params.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
      } else {
        // Navigate back to My Bookings after successful save
        router.push('/account/my-bookings');
      }
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!booking) return null;

  const isEditable = booking.status === 'pending';

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/account/my-bookings" className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-800 text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to My Bookings
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-ocean-800 to-tropical-700 px-6 py-5">
            <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-white">{booking.package_name}</h1>
            <p className="text-white/70 text-sm mt-1">Booking ID: {booking.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="p-6 sm:p-8">
            {!isEditable && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                This booking is <strong>{booking.status}</strong> and can no longer be edited. Please contact us if you need changes.
              </div>
            )}


            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
            )}

            {/* Non-editable info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Name</p><p className="font-medium text-gray-800">{booking.full_name}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Email</p><p className="font-medium text-gray-800">{booking.email}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Phone</p><p className="font-medium text-gray-800">{booking.phone}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Country</p><p className="font-medium text-gray-800">{booking.country}</p></div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Total Price</p>
                {(() => {
                  let previewTotal = booking.total_price ?? 0;
                  const liveDurationMatch = (form.special_requests || booking?.special_requests || '').match(/Duration:\s*(\d+)\s*day/i);
                  const liveDuration = liveDurationMatch ? Number(liveDurationMatch[1]) : durationDays;
                  
                  const vMatch = (form.special_requests || booking?.special_requests || '').match(/Vehicle:\s*(Car|Van)/i);
                  const vType = vMatch ? vMatch[1].toLowerCase() as 'car' | 'van' : 'car';
                  
                  if (vehiclePricing && vehiclePricing[vType]) {
                    const tier = vehiclePricing[vType].find(t => t.guests === form.guests);
                    if (tier) {
                      previewTotal = tier.price * liveDuration;
                    } else if (pricePerDay > 0) {
                      previewTotal = pricePerDay * liveDuration * form.guests;
                    }
                  } else if (pricePerDay > 0) {
                    previewTotal = pricePerDay * liveDuration * form.guests;
                  }
                  
                  if (previewTotal === booking.total_price && form.guests !== booking.guests && booking.guests > 0) {
                    previewTotal = Math.round((booking.total_price / booking.guests) * form.guests);
                  }

                  return (
                    <p className="font-bold text-ocean-700 text-lg">${previewTotal.toLocaleString()} <span className="text-xs font-normal text-gray-400">(updated)</span></p>
                  );
                })()}
              </div>
              <div><p className="text-gray-400 text-xs mb-0.5">Status</p>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                }`}>{booking.status}</span>
              </div>
            </div>

            {/* Editable fields */}
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <CalendarCheck size={15} className="text-ocean-500" /> Travel Date
                </label>
                <input type="date" value={form.travel_date} onChange={e => setForm({ ...form, travel_date: e.target.value })}
                  disabled={!isEditable} min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm disabled:bg-gray-50 disabled:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Users size={15} className="text-ocean-500" /> Number of Guests
                </label>
                <input type="number" min={1} max={20} value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })}
                  disabled={!isEditable}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm disabled:bg-gray-50 disabled:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FileText size={15} className="text-ocean-500" /> Special Requests
                </label>
                <textarea rows={3} value={form.special_requests} onChange={e => setForm({ ...form, special_requests: e.target.value })}
                  disabled={!isEditable}
                  placeholder="Any dietary requirements, accessibility needs..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm resize-none disabled:bg-gray-50 disabled:text-gray-400" />
              </div>
              {isEditable && (
                <button type="submit" disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Need to make bigger changes? <a href="mailto:info@godslanka.com" className="text-ocean-600 hover:underline">Contact us</a>
        </p>
      </div>
    </main>
  );
}
