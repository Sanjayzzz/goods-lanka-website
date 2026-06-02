'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { CalendarCheck, MessageSquare, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react';

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalEnquiries: number;
  newEnquiries: number;
  monthRevenue: number;
}

interface Booking {
  id: string;
  full_name: string;
  package_name: string;
  travel_date: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, totalEnquiries: 0, newEnquiries: 0, monthRevenue: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setRefreshing(true);
    const supabase = createClient();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [bookingsRes, enquiriesRes, recentBRes, recentERes, monthRevRes] = await Promise.all([
      supabase.from('bookings').select('status', { count: 'exact' }),
      supabase.from('enquiries').select('status', { count: 'exact' }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('bookings').select('total_price').gte('created_at', monthStart).eq('status', 'confirmed'),
    ]);

    const bookings = bookingsRes.data ?? [];
    const enquiries = enquiriesRes.data ?? [];
    const monthRevenue = (monthRevRes.data ?? []).reduce((sum, b) => sum + (b.total_price ?? 0), 0);

    setStats({
      totalBookings: bookingsRes.count ?? 0,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      totalEnquiries: enquiriesRes.count ?? 0,
      newEnquiries: enquiries.filter(e => e.status === 'new').length,
      monthRevenue,
    });
    setRecentBookings(recentBRes.data ?? []);
    setRecentEnquiries(recentERes.data ?? []);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'from-ocean-500 to-ocean-700', sub: `${stats.pendingBookings} pending` },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: CheckCircle, color: 'from-green-500 to-green-700', sub: 'This month' },
    { label: 'Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'from-tropical-500 to-tropical-700', sub: `${stats.newEnquiries} new` },
    { label: 'Monthly Revenue', value: `$${stats.monthRevenue.toLocaleString()}`, icon: TrendingUp, color: 'from-sunset-500 to-coral-600', sub: 'Confirmed only' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
            {lastUpdated && <span className="ml-2 text-gray-400">· Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={load} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-ocean-300 transition-all shadow-sm disabled:opacity-60">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                <card.icon size={20} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
            <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Bookings</h3>
            <a href="/admin/bookings" className="text-xs text-ocean-600 hover:underline font-medium">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
            ) : recentBookings.map(b => (
              <div key={b.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{b.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{b.package_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-800">${b.total_price}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Enquiries</h3>
            <a href="/admin/enquiries" className="text-xs text-ocean-600 hover:underline font-medium">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEnquiries.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No enquiries yet</p>
            ) : recentEnquiries.map(e => (
              <div key={e.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{e.name}</p>
                  <p className="text-xs text-gray-400 truncate">{e.subject}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColor[e.status]}`}>{e.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
