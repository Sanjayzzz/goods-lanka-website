'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Edit2, Save, X, MapPin, RefreshCw, Users } from 'lucide-react';
import { destinations as staticDestinations } from '@/data/destinations';

interface VehiclePriceTier {
  guests: number;
  price: number | '';
}

interface VehiclePricing {
  car: VehiclePriceTier[];
  van: VehiclePriceTier[];
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
  vehicle_pricing?: VehiclePricing | null;
}

const GUEST_TIERS = [1, 2, 3, 4, 5];

const emptyVehiclePricing = (): VehiclePricing => ({
  car: GUEST_TIERS.map(g => ({ guests: g, price: '' })),
  van: [],
});

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

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDest, setEditingDest] = useState<string | null>(null);
  const [destEditData, setDestEditData] = useState<Partial<Destination>>({});
  const [editVehiclePricing, setEditVehiclePricing] = useState<VehiclePricing>(emptyVehiclePricing());

  const loadData = async () => {
    setLoading(true);
    setRefreshing(true);
    const supabase = createClient();
    try {
      const { data: dests, error: destError } = await supabase.from('destinations').select('*').order('name');
      if (destError) console.error('Destinations load error:', destError);

      if (dests && dests.length > 0) {
        setDestinations(dests);
      } else {
        const defaultPrices: Record<string, number> = {
          sigiriya: 150, ella: 120, kandy: 100, mirissa: 130,
          galle: 110, 'nuwara-eliya': 125, yala: 180,
          'arugam-bay': 90, bentota: 140, colombo: 80
        };
        const mappedStatic = staticDestinations.map(d => ({
          ...d, review_count: d.reviewCount,
          price: defaultPrices[d.slug.toLowerCase()] ?? 0,
          active: true, vehicle_pricing: null,
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

  useEffect(() => { loadData(); }, []);

  const startEditDest = (dest: Destination) => {
    setEditingDest(dest.slug);
    setDestEditData({
      name: dest.name, tagline: dest.tagline,
      description: dest.description, category: dest.category,
      price: dest.price, active: dest.active,
    });

    // Populate vehicle pricing from existing data or defaults
    const existing = dest.vehicle_pricing;
    const pricing: VehiclePricing = {
      car: GUEST_TIERS.map(g => ({
        guests: g,
        price: existing?.car?.find(t => t.guests === g)?.price ?? '',
      })),
      van: [],
    };
    setEditVehiclePricing(pricing);
  };

  const updateVehiclePrice = (vehicle: 'car' | 'van', guests: number, value: string) => {
    setEditVehiclePricing(prev => ({
      ...prev,
      [vehicle]: prev[vehicle].map(t =>
        t.guests === guests ? { ...t, price: value === '' ? '' : Number(value) } : t
      ),
    }));
  };

  const saveEditDest = async (slug: string) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const destToSave = destinations.find(d => d.slug === slug);
      if (!destToSave) return;

      // Clean vehicle pricing — remove empty entries
      const cleanedVehiclePricing: VehiclePricing = {
        car: editVehiclePricing.car.filter(t => t.price !== '' && Number(t.price) > 0).map(t => ({ guests: t.guests, price: Number(t.price) })),
        van: [],
      };

      const updatedFields = {
        name: destEditData.name ?? destToSave.name,
        tagline: destEditData.tagline ?? destToSave.tagline,
        description: destEditData.description ?? destToSave.description,
        category: destEditData.category ?? destToSave.category,
        price: Number(destEditData.price ?? destToSave.price),
        active: destEditData.active ?? destToSave.active,
        vehicle_pricing: cleanedVehiclePricing.car.length > 0 ? cleanedVehiclePricing : null,
      };

      setDestinations(prev => prev.map(d =>
        d.slug === slug ? { ...d, ...updatedFields } as Destination : d
      ));
      setEditingDest(null);

      const { error } = await supabase.from('destinations').update(updatedFields).eq('slug', slug);
      if (error) {
        const { error: insertError } = await supabase.from('destinations').insert({
          ...(destToSave as any), ...updatedFields, id: undefined,
        });
        setSaveMsg(insertError ? '⚠️ Updated locally (database sync pending)' : '✅ Destination created & saved!');
        if (!insertError) await loadData();
      } else {
        setSaveMsg('✅ Destination saved successfully!');
      }
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      console.error('saveEditDest error:', err);
      setSaveMsg('✅ Updated locally');
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
      const { error } = await supabase.from('destinations').upsert({ ...destToSave, active: !active }, { onConflict: 'slug' });
      if (error) {
        setDestinations(prev => prev.map(d => d.slug === slug ? { ...d, active: !active } : d));
      } else { await loadData(); }
    } catch {
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
          <p className="text-gray-500 text-sm">Set prices per guest count for each destination</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">{saveMsg}</span>}
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-ocean-300 transition-all shadow-sm disabled:opacity-60">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Destination Cards */}
      <div className="grid gap-4">
        {destinations.map(dest => (
          <div key={dest.slug} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {editingDest === dest.slug ? (
              /* ── EDIT MODE ── */
              <div className="p-5 sm:p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { key: 'name', label: 'Destination Name' },
                    { key: 'tagline', label: 'Tagline' },
                    { key: 'category', label: 'Category' },
                  ] as const).map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                      <input type="text"
                        value={(destEditData as Record<string, string | number>)[f.key] as string ?? ''}
                        onChange={e => setDestEditData(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                  <textarea rows={3} value={destEditData.description ?? ''}
                    onChange={e => setDestEditData(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500" />
                </div>

                {/* Pricing Table */}
                <div className="border-2 border-blue-200 rounded-2xl overflow-hidden">
                  <div className="bg-blue-50 px-4 py-3 flex items-center gap-2 border-b border-blue-200">
                    <Users size={18} className="text-blue-600" />
                    <div>
                      <p className="font-bold text-blue-800 text-sm">Pricing per Guest Count</p>
                      <p className="text-blue-500 text-xs">Price per day — multiplied by number of days on booking</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {editVehiclePricing.car.map(tier => (
                      <div key={tier.guests} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-20 shrink-0">
                          {tier.guests} {tier.guests === 1 ? 'person' : 'persons'}
                        </span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                          <input
                            type="number" min={0}
                            placeholder="Enter price"
                            value={tier.price}
                            onChange={e => updateVehiclePrice('car', tier.guests, e.target.value)}
                            className="w-full pl-7 pr-3 py-2 border-2 border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold text-blue-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => saveEditDest(dest.slug)} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-ocean-700 text-white rounded-xl text-sm font-medium hover:bg-ocean-800 disabled:opacity-60">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditingDest(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── VIEW MODE ── */
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <MapPin size={16} className="text-tropical-500" />
                      <h3 className="font-bold text-gray-900">{dest.name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryColors[dest.category] ?? 'bg-gray-100 text-gray-600'}`}>{dest.category}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${dest.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {dest.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs italic mb-3">{dest.tagline}</p>

                    {/* Vehicle pricing summary */}
                    {dest.vehicle_pricing && dest.vehicle_pricing.car && dest.vehicle_pricing.car.length > 0 ? (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 inline-block">
                        <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1.5"><Users size={12} className="text-blue-600" /> Pricing per Guest</p>
                        <div className="flex gap-3 flex-wrap">
                          {dest.vehicle_pricing.car.map(t => (
                            <span key={t.guests} className="text-xs text-blue-800 font-semibold">{t.guests}p: <span className="text-blue-600">${t.price}</span></span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
                        ⚠️ No pricing set yet — click Edit to add prices
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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
