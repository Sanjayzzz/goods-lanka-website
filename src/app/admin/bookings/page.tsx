'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Search, Eye, ChevronDown, RefreshCw } from 'lucide-react';

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  package_name: string;
  travel_date: string;
  guests: number;
  total_price: number;
  special_requests: string;
  status: string;
  created_at: string;
}

const statusOptions = ['all', 'pending', 'confirmed', 'cancelled'];
const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const supabase = createClient();
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data ?? []);
    setFiltered(data ?? []);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = bookings;
    if (filter !== 'all') result = result.filter(b => b.status === filter);
    if (search) result = result.filter(b =>
      b.full_name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.package_name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [filter, search, bookings]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from('bookings').update({ status }).eq('id', id);
    await load();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    setUpdating(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500 text-sm">{filtered.length} of {bookings.length} bookings
            {lastUpdated && <span className="ml-2 text-gray-400">· Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={load} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-ocean-300 transition-all shadow-sm disabled:opacity-60">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or package..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize border transition-all ${
                filter === s
                  ? 'bg-ocean-700 text-white border-ocean-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-ocean-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Customer', 'Package', 'Date', 'Guests', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">{b.full_name}</p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-600 max-w-[140px] truncate">{b.package_name}</td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{b.travel_date}</td>
                  <td className="px-4 py-4 text-gray-600">{b.guests}</td>
                  <td className="px-4 py-4 font-semibold text-gray-800">${b.total_price?.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <div className="relative group inline-block">
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        disabled={updating === b.id}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none appearance-none pr-6 ${statusColor[b.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelected(b)}
                      className="p-2 rounded-lg hover:bg-ocean-50 text-ocean-600 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Booking Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Customer', value: selected.full_name },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Country', value: selected.country },
                { label: 'Package', value: selected.package_name },
                { label: 'Travel Date', value: selected.travel_date },
                { label: 'Guests', value: String(selected.guests) },
                { label: 'Total Price', value: `$${selected.total_price?.toLocaleString()}` },
                { label: 'Special Requests', value: selected.special_requests || 'None' },
                { label: 'Booked At', value: new Date(selected.created_at).toLocaleString() },
              ].map(row => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{row.label}</span>
                  <span className="text-sm text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={async () => {
                  await updateStatus(selected.id, 'confirmed');
                  alert('Booking confirmed');
                  setSelected(null);
                }} 
                disabled={updating === selected.id}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {updating === selected.id ? 'Updating...' : 'Confirm'}
              </button>
              <button 
                onClick={async () => {
                  await updateStatus(selected.id, 'cancelled');
                  alert('Booking cancelled');
                  setSelected(null);
                }} 
                disabled={updating === selected.id}
                className="flex-1 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-60"
              >
                {updating === selected.id ? 'Updating...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
