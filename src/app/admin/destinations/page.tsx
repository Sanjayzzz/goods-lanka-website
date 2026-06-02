'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Edit2, Save, X, MapPin } from 'lucide-react';
import { destinations as staticDestinations } from '@/data/destinations';

interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  active: boolean;
  rating: number;
  review_count?: number; // DB uses review_count
  reviewCount?: number;  // static data uses reviewCount
}

const categoryColors: Record<string, string> = {
  Cultural: 'bg-purple-100 text-purple-700',
  Nature: 'bg-green-100 text-green-700',
  Beach: 'bg-blue-100 text-blue-700',
  Wildlife: 'bg-emerald-100 text-emerald-700',
  Urban: 'bg-yellow-100 text-yellow-700',
};

export default function DestinationsAdminPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Destination>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const load = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('destinations').select('*').order('name');
      
      if (error || !data || data.length === 0) {
        // Fallback to static destinations if table doesn't exist or is empty
        const mappedStatic = staticDestinations.map(d => ({
          ...d,
          review_count: d.reviewCount,
          price: (d as any).price || 0,
          active: true
        })) as any[];
        setDestinations(mappedStatic);
      } else {
        setDestinations(data);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const mappedStatic = staticDestinations.map(d => ({
        ...d,
        review_count: d.reviewCount,
        price: (d as any).price || 0,
        active: true
      })) as any[];
      setDestinations(mappedStatic);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (dest: Destination) => {
    setEditing(dest.id);
    setEditData({
      name: dest.name,
      tagline: dest.tagline,
      description: dest.description,
      category: dest.category,
      price: dest.price,
      active: dest.active
    });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('destinations').update(editData).eq('id', id);
      
      if (error) {
        // If updating in DB fails (e.g. table not updated yet), update local state as fallback
        setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...editData } as Destination : d));
        setSaveMsg('Updated locally! (Run updated SQL setup for persistent storage)');
      } else {
        setSaveMsg('Saved successfully!');
      }
      
      setTimeout(() => setSaveMsg(''), 3000);
      await load();
      setEditing(null);
    } catch (err) {
      console.error(err);
      setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...editData } as Destination : d));
      setSaveMsg('Updated locally!');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('destinations').update({ active: !active }).eq('id', id);
      if (error) {
        setDestinations(prev => prev.map(d => d.id === id ? { ...d, active: !active } : d));
      } else {
        await load();
      }
    } catch (err) {
      setDestinations(prev => prev.map(d => d.id === id ? { ...d, active: !active } : d));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Destinations &amp; Tour Prices</h2>
          <p className="text-gray-500 text-sm">{destinations.length} destinations — manage details and per-day base rates</p>
        </div>
        {saveMsg && <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">{saveMsg}</span>}
      </div>

      <div className="grid gap-4">
        {destinations.map(dest => (
          <div key={dest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            {editing === dest.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Destination Name', type: 'text' },
                    { key: 'tagline', label: 'Tagline', type: 'text' },
                    { key: 'category', label: 'Category', type: 'text' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                      <input
                        type={f.type}
                        value={(editData as Record<string, string | number>)[f.key] as string ?? ''}
                        onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Tour Price / Day (USD $)</label>
                    <input 
                      type="number" 
                      value={editData.price ?? ''} 
                      onChange={e => setEditData(p => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 border-2 border-ocean-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 font-bold text-ocean-700 text-lg" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                  <textarea
                    rows={3}
                    value={editData.description ?? ''}
                    onChange={e => setEditData(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => saveEdit(dest.id)} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-ocean-700 text-white rounded-xl text-sm font-medium hover:bg-ocean-800 disabled:opacity-60">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MapPin size={16} className="text-tropical-500" />
                      <h3 className="font-bold text-gray-900">{dest.name}</h3>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryColors[dest.category] ?? 'bg-gray-100 text-gray-600'}`}>{dest.category}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${dest.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {dest.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs italic mb-2">{dest.tagline}</p>
                  <p className="text-gray-400 text-sm line-clamp-2">{dest.description}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-start">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ocean-700">${dest.price?.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ day</span></p>
                    <p className="text-xs text-gray-400">Base Tour Price</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(dest)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-ocean-50 text-ocean-700 rounded-xl text-sm font-medium hover:bg-ocean-100">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => toggleActive(dest.id, dest.active)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${dest.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                      {dest.active ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
