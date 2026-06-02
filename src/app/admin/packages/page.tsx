'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Edit2, Save, X, DollarSign, Package as PackageIcon, MapPin, RefreshCw } from 'lucide-react';
import { destinations as staticDestinations } from '@/data/destinations';

interface Package {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  group_size: string;
  price: number;
  original_price: number;
  category: string;
  active: boolean;
}

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
  const [activeTab, setActiveTab] = useState<'packages' | 'destinations'>('packages');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Packages State
  const [packages, setPackages] = useState<Package[]>([]);
  const [editingPkg, setEditingPkg] = useState<string | null>(null);
  const [pkgEditData, setPkgEditData] = useState<Partial<Package>>({});

  // Destinations State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDest, setEditingDest] = useState<string | null>(null);
  const [destEditData, setDestEditData] = useState<Partial<Destination>>({});

  const loadData = async () => {
    setLoading(true);
    setRefreshing(true);
    const supabase = createClient();

    try {
      // Load Packages
      const { data: pkgs } = await supabase.from('packages').select('*').order('name');
      setPackages(pkgs ?? []);

      // Load Destinations
      const { data: dests } = await supabase.from('destinations').select('*').order('name');
      if (!dests || dests.length === 0) {
        const defaultPrices: Record<string, number> = {
          sigiriya: 150,
          ella: 120,
          kandy: 100,
          mirissa: 130,
          galle: 110,
          'nuwara-eliya': 125,
          yala: 180,
          'arugam-bay': 90,
          bentota: 140,
          colombo: 80
        };
        const mappedStatic = staticDestinations.map(d => ({
          ...d,
          review_count: d.reviewCount,
          price: defaultPrices[d.slug.toLowerCase()] || 0,
          active: true
        })) as any[];
        setDestinations(mappedStatic);
      } else {
        setDestinations(dests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'destinations') {
        setActiveTab('destinations');
      }
    }
  }, []);

  // --- Package Actions ---
  const startEditPkg = (pkg: Package) => {
    setEditingPkg(pkg.id);
    setPkgEditData({
      name: pkg.name,
      tagline: pkg.tagline,
      duration: pkg.duration,
      group_size: pkg.group_size,
      price: pkg.price,
      original_price: pkg.original_price,
      category: pkg.category,
      active: pkg.active
    });
  };

  const saveEditPkg = async (id: string) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('packages').update(pkgEditData).eq('id', id);
    setSaveMsg('Package saved successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
    await loadData();
    setEditingPkg(null);
    setSaving(false);
  };

  const togglePkgActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from('packages').update({ active: !active }).eq('id', id);
    await loadData();
  };

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

      const saveData = {
        name: destEditData.name ?? destToSave.name,
        slug: destToSave.slug,
        tagline: destEditData.tagline ?? destToSave.tagline,
        description: destEditData.description ?? destToSave.description,
        category: destEditData.category ?? destToSave.category,
        price: Number(destEditData.price ?? destToSave.price),
        active: destEditData.active ?? destToSave.active,
        rating: destToSave.rating ?? 4.8,
        review_count: destToSave.review_count ?? destToSave.reviewCount ?? 0,
      };

      const { error } = await supabase.from('destinations').upsert(saveData, { onConflict: 'slug' });
      
      if (error) {
        setDestinations(prev => prev.map(d => d.slug === slug ? { ...d, ...destEditData } as Destination : d));
        setSaveMsg('Updated locally! (Sync database with new SQL schema for persistence)');
      } else {
        setSaveMsg('Destination saved successfully!');
      }
      setTimeout(() => setSaveMsg(''), 3000);
      await loadData();
      setEditingDest(null);
    } catch (err) {
      console.error(err);
      setDestinations(prev => prev.map(d => d.slug === slug ? { ...d, ...destEditData } as Destination : d));
      setSaveMsg('Updated locally!');
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
          <h2 className="text-2xl font-bold text-gray-900">Packages &amp; Pricing</h2>
          <p className="text-gray-500 text-sm">Configure per-day rates, tour durations, and destination base details</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">{saveMsg}</span>}
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-ocean-300 transition-all shadow-sm disabled:opacity-60">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all -mb-px ${
            activeTab === 'packages' 
              ? 'border-ocean-600 text-ocean-700' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <PackageIcon size={16} /> Tour Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all -mb-px ${
            activeTab === 'destinations' 
              ? 'border-ocean-600 text-ocean-700' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <MapPin size={16} /> Destinations &amp; Base Prices ({destinations.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="grid gap-4">
        {activeTab === 'packages' ? (
          <>
            {packages.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                <DollarSign size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">No packages in database yet</p>
              </div>
            )}
            
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                {editingPkg === pkg.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Package Name', type: 'text' },
                        { key: 'tagline', label: 'Tagline', type: 'text' },
                        { key: 'duration', label: 'Duration', type: 'text' },
                        { key: 'group_size', label: 'Group Size', type: 'text' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                          <input
                            type={f.type}
                            value={(pkgEditData as Record<string, string | number>)[f.key] as string ?? ''}
                            onChange={e => setPkgEditData(p => ({ ...p, [f.key]: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Price Per Day / Person (USD $)</label>
                        <input type="number" value={pkgEditData.price ?? ''} onChange={e => setPkgEditData(p => ({ ...p, price: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 border-2 border-ocean-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 font-bold text-ocean-700 text-lg" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Original Per Day (USD $)</label>
                        <input type="number" value={pkgEditData.original_price ?? ''} onChange={e => setPkgEditData(p => ({ ...p, original_price: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => saveEditPkg(pkg.id)} disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-ocean-700 text-white rounded-xl text-sm font-medium hover:bg-ocean-800 disabled:opacity-60">
                        <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button onClick={() => setEditingPkg(null)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                        <X size={15} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryColors[pkg.category] ?? 'bg-gray-100 text-gray-600'}`}>{pkg.category}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${pkg.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {pkg.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{pkg.tagline} · {pkg.duration} · {pkg.group_size}</p>
                    </div>
                    <div className="flex items-center gap-6 justify-between sm:justify-start">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ocean-700">${pkg.price?.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ day</span></p>
                        {pkg.original_price > pkg.price && (
                          <p className="text-sm text-gray-400 line-through">${pkg.original_price?.toLocaleString()} / day</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditPkg(pkg)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-ocean-50 text-ocean-700 rounded-xl text-sm font-medium hover:bg-ocean-100">
                          <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => togglePkgActive(pkg.id, pkg.active)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium ${pkg.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                          {pkg.active ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
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
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Tour Price / Day (USD $)</label>
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
          </>
        )}
      </div>
    </div>
  );
}
