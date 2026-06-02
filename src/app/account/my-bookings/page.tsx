'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { CalendarCheck, Users, Clock, CheckCircle, XCircle, ChevronRight, LogOut, Home } from 'lucide-react';

interface Booking {
  id: string;
  package_name: string;
  travel_date: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  pending:   { label: 'Pending Review',  color: 'text-amber-700',  icon: Clock,         bg: 'bg-amber-50 border-amber-200' },
  confirmed: { label: 'Confirmed! ✓',    color: 'text-green-700',  icon: CheckCircle,   bg: 'bg-green-50 border-green-200' },
  cancelled: { label: 'Cancelled',       color: 'text-red-600',    icon: XCircle,       bg: 'bg-red-50 border-red-200' },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Traveler');
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setBookings(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ocean-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <Image src="/logo.png" alt="GODS LANKA" fill className="object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">GODS LANKA</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Tours & Travels</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
              <Home size={15} /> Website
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-ocean-900">
            My Bookings
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-ocean-700">{userName}</span>! Here are all your travel bookings.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <CalendarCheck size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="font-semibold text-gray-700 text-lg mb-2">No bookings yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start planning your dream Sri Lanka adventure!</p>
            <Link href="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              Explore Packages <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const cfg = statusConfig[booking.status] ?? statusConfig.pending;
              const isConfirmed = booking.status === 'confirmed';
              return (
                <div key={booking.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${isConfirmed ? 'border-green-300' : 'border-gray-100'}`}>
                  {isConfirmed && (
                    <div className="bg-green-500 text-white text-sm font-semibold px-6 py-2.5 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Your booking is confirmed! Our team will contact you shortly.
                    </div>
                  )}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate">{booking.package_name}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <CalendarCheck size={14} className="text-ocean-500" />
                          {booking.travel_date || 'Date TBD'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={14} className="text-ocean-500" />
                          {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                        </span>
                        <span className="text-xs text-gray-400">
                          Booked {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xl font-bold text-ocean-800">${booking.total_price?.toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mt-1 ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon size={12} />
                          {cfg.label}
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <Link href={`/account/my-bookings/${booking.id}`}
                          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-ocean-700 bg-ocean-50 rounded-xl hover:bg-ocean-100 transition-colors">
                          Edit <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/booking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sunset-500 to-coral-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">
            + Book Another Tour
          </Link>
        </div>
      </div>
    </main>
  );
}
