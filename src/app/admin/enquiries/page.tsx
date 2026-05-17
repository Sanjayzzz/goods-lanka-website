'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Search, Eye, ChevronDown } from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const statusOptions = ['all', 'new', 'read', 'replied'];
const statusColor: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  read: 'bg-gray-100 text-gray-600 border-gray-200',
  replied: 'bg-green-100 text-green-700 border-green-200',
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filtered, setFiltered] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    setEnquiries(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = enquiries;
    if (filter !== 'all') result = result.filter(e => e.status === filter);
    if (search) result = result.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [filter, search, enquiries]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from('enquiries').update({ status }).eq('id', id);
    await load();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    setUpdating(null);
  };

  const openEnquiry = async (e: Enquiry) => {
    setSelected(e);
    if (e.status === 'new') await updateStatus(e.id, 'read');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enquiries</h2>
        <p className="text-gray-500 text-sm">{filtered.length} of {enquiries.length} enquiries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or subject..."
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Subject', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No enquiries found</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id} className={`hover:bg-gray-50/50 transition-colors ${e.status === 'new' ? 'font-semibold' : ''}`}>
                  <td className="px-4 py-4">
                    <p className="text-gray-800">{e.name}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{e.email}</td>
                  <td className="px-4 py-4 text-gray-600 max-w-[180px] truncate">{e.subject}</td>
                  <td className="px-4 py-4 text-gray-400 whitespace-nowrap text-xs">
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative inline-block">
                      <select
                        value={e.status}
                        onChange={ev => updateStatus(e.id, ev.target.value)}
                        disabled={updating === e.id}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none appearance-none pr-6 ${statusColor[e.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => openEnquiry(e)} className="p-2 rounded-lg hover:bg-ocean-50 text-ocean-600 transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Enquiry Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'From', value: selected.name },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone || 'Not provided' },
                { label: 'Subject', value: selected.subject },
                { label: 'Received', value: new Date(selected.created_at).toLocaleString() },
              ].map(row => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-sm font-medium text-gray-500 w-24 shrink-0">{row.label}</span>
                  <span className="text-sm text-gray-800">{row.value}</span>
                </div>
              ))}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">{selected.message}</div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                onClick={() => updateStatus(selected.id, 'replied')}
                className="flex-1 py-2.5 bg-ocean-700 text-white rounded-xl text-sm font-medium text-center hover:bg-ocean-800">
                Reply via Email
              </a>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
