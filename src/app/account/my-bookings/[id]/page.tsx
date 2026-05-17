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
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ travel_date: '', guests: 1, special_requests: '' });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/account/login'); return; }
      const { data } = await supabase.from('bookings').select('*').eq('id', params.id).eq('user_id', user.id).single();
      if (!data) { router.push('/account/my-bookings'); return; }
      setBooking(data);
      setForm({ travel_date: data.travel_date ?? '', guests: data.guests ?? 1, special_requests: data.special_requests ?? '' });
      setLoading(false);
    };
    load();
  }, [params.id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error: updateError } = await supabase.from('bookings')
      .update({ travel_date: form.travel_date, guests: form.guests, special_requests: form.special_requests })
      .eq('id', params.id);
    if (updateError) { setError(updateError.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
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

            {saved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                ✓ Changes saved successfully!
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
              <div><p className="text-gray-400 text-xs mb-0.5">Total Price</p><p className="font-bold text-ocean-700 text-lg">${booking.total_price?.toLocaleString()}</p></div>
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
          Need to make bigger changes? <a href="mailto:info@goodslanka.com" className="text-ocean-600 hover:underline">Contact us</a>
        </p>
      </div>
    </main>
  );
}
