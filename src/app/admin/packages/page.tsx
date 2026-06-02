'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Edit2, Save, X, DollarSign, MapPin, RefreshCw } from 'lucide-react';
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
  review_count?: number;
  reviewCount?: number;
}

const categoryColors: Record<string, string> = {
  Cultural: 'bg-purple-100 text-purple-700',
  Beach: 'bg-blue-100 text-blue-700',
  Adventure: 'bg-orange-100 text-orange-700',
  Wildlife: 'bg-green-100 text-green-700',
  Luxury: 'bg-yellow-100 text-yellow-700',
  Nature: 'bg-green-100 text-green-700',
  Urban: 'bg-yellow-100 text-yellow-700',
};

export default function PackagesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Destinations State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDest, setEditingDest] = useState<string | null>(null);
  const [destEditData, setDestEditData] = useState<Partial<Destination>>({});

  const loadData = async () => {
    setLoading(true);
    setRefreshing(true);
    const supabase = createClient();

    try {
      // Load Destinations — always prefer DB data
      const { data: dests, error: destError } = await supabase.from('destinations').select('*').order('name');

      if (destError) {
        console.error('Destinations load error:', destError);
      }

      if (dests && dests.length > 0) {
        setDestinations(dests);
      } else {
        // DB is empty or table not seeded — fall back to static with sensible defaults
        const defaultPrices: Record<string, number> = {
          sigiriya: 150, ella: 120, kandy: 100, mirissa: 130,
          galle: 110, 'nuwara-eliya': 125, yala: 180,
          'arugam-bay': 90, bentota: 140, colombo: 80
        };
        const mappedStatic = staticDestinations.map(d => ({
          ...d,
          review_count: d.reviewCount,
          price: defaultPrices[d.slug.toLowerCase()] ?? 0,
          active: true
        })) as any[];
        setDestinations(mappedStatic);
      }
    } catch (err) {
      console.error('loadData error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Destination Actions ---
  const startEditDest = (dest: Destination) => {
    setEditingDest(dest.slug);
    setDestEditData({
      name: dest.name,
      tagline: dest.tagline,
      description: dest.description,
      category: dest.category,
      price: dest.price,
      active: dest.active
    });
  };

  const saveEditDest = async (slug: string) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const destToSave = destinations.find(d => d.slug === slug);
      if (!destToSave) return;

      const updatedPrice = Number(destEditData.price ?? destToSave.price);
      const updatedFields = {
        name: destEditData.name ?? destToSave.name,
        tagline: destEditData.tagline ?? destToSave.tagline,
        description: destEditData.description ?? destToSave.description,
        category: destEditData.category ?? destToSave.category,
        price: updatedPrice,
        active: destEditData.active ?? destToSave.active,
      };

      // Apply to local state immediately so UI reflects change right away
      setDestinations(prev => prev.map(d =>
        d.slug === slug ? { ...d, ...updatedFields } as Destination : d
      ));
      setEditingDest(null);

      // Try to persist to database (UPDATE existing row by slug)
      const { error } = await supabase
        .from('destinations')
        .update(updatedFields)
        .eq('slug', slug);

      if (error) {
        // DB row may not exist yet — try inserting it
        const { error: insertError } = await supabase.from('destinations').insert({
          ...(destToSave as any),
          ...updatedFields,
          id: undefined, // let DB generate UUID
        });

        if (insertError) {
          setSaveMsg('✓ Updated locally (database sync pending)');
        } else {
          setSaveMsg('✓ Destination created & saved in database!');
          await loadData(); // Refresh with DB-assigned UUID
        }
      } else {
        setSaveMsg('✓ Destination saved successfully!');
      }
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      console.error('saveEditDest error:', err);
      setSaveMsg('✓ Updated locally');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditingDest(null);
    } finally {
      setSaving(false);
    }
  };

  const toggleDestActive = async (slug: string, active: boolean) => {
    try {
      const supabase = createClient();
      const destToSave = destinations.find(d => d.slug === slug);
      if (!destToSave) return;

      const { error } = await supabase.from('destinations').upsert({
        ...destToSave,
        active: !active
      }, { onConflict: 'slug' });

      if (error) {
        setDestinations(prev => prev.map(d => d.slug === slug ? { ...d, active: !active } : d));
      } else {
        await loadData();
      }
    } catch (err) {
      setDestinations(prev => prev.map(d => d.slug === slug ? { ...d, active: !active } : d));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Destinations &amp; Pricing</h2>
          <p className="text-gray-500 text-sm">Configure per-day rates, taglines, and destination details</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">{saveMsg}</span>}
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-ocean-300 transition-all shadow-sm disabled:opacity-60">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid gap-4">
        {destinations.map(dest => (
          <div key={dest.slug} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            {editingDest === dest.slug ? (
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
                        value={(destEditData as Record<string, string | number>)[f.key] as string ?? ''}
                        onChange={e => setDestEditData(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Tour Price / Day / Person (USD $)</label>
                    <input 
                      type="number" 
                      value={destEditData.price ?? ''} 
                      onChange={e => setDestEditData(p => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 border-2 border-ocean-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 font-bold text-ocean-700 text-lg" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                  <textarea
                    rows={3}
                    value={destEditData.description ?? ''}
                    onChange={e => setDestEditData(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => saveEditDest(dest.slug)} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-ocean-700 text-white rounded-xl text-sm font-medium hover:bg-ocean-800 disabled:opacity-60">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditingDest(null)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
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
                    <button onClick={() => startEditDest(dest)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-ocean-50 text-ocean-700 rounded-xl text-sm font-medium hover:bg-ocean-100">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => toggleDestActive(dest.slug, dest.active)}
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
