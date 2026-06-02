'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Edit2, Save, X, DollarSign } from 'lucide-react';

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

const categoryColors: Record<string, string> = {
  Cultural: 'bg-purple-100 text-purple-700',
  Beach: 'bg-blue-100 text-blue-700',
  Adventure: 'bg-orange-100 text-orange-700',
  Wildlife: 'bg-green-100 text-green-700',
  Luxury: 'bg-yellow-100 text-yellow-700',
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Package>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('packages').select('*').order('name');
    setPackages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (pkg: Package) => {
    setEditing(pkg.id);
    setEditData({ name: pkg.name, tagline: pkg.tagline, duration: pkg.duration, group_size: pkg.group_size, price: pkg.price, original_price: pkg.original_price, category: pkg.category, active: pkg.active });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('packages').update(editData).eq('id', id);
    setSaveMsg('Saved successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
    await load();
    setEditing(null);
    setSaving(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from('packages').update({ active: !active }).eq('id', id);
    await load();
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
          <h2 className="text-2xl font-bold text-gray-900">Packages &amp; Pricing</h2>
          <p className="text-gray-500 text-sm">{packages.length} packages — click Edit to update prices</p>
        </div>
        {saveMsg && <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">{saveMsg}</span>}
      </div>

      <div className="grid gap-4">
        {packages.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <DollarSign size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">No packages in database yet</p>
            <p className="text-gray-400 text-sm mt-1">Run the SQL setup script in your Supabase dashboard to seed packages</p>
          </div>
        )}

        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            {editing === pkg.id ? (
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
                        value={(editData as Record<string, string | number>)[f.key] as string ?? ''}
                        onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Price Per Day / Person (USD $)</label>
                    <input type="number" value={editData.price ?? ''} onChange={e => setEditData(p => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 border-2 border-ocean-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 font-bold text-ocean-700 text-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Original Per Day (USD $)</label>
                    <input type="number" value={editData.original_price ?? ''} onChange={e => setEditData(p => ({ ...p, original_price: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500" />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => saveEdit(pkg.id)} disabled={saving}
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
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ocean-700">${pkg.price?.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ day</span></p>
                    {pkg.original_price > pkg.price && (
                      <p className="text-sm text-gray-400 line-through">${pkg.original_price?.toLocaleString()} / day</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(pkg)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-ocean-50 text-ocean-700 rounded-xl text-sm font-medium hover:bg-ocean-100">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => toggleActive(pkg.id, pkg.active)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${pkg.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                      {pkg.active ? 'Hide' : 'Show'}
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
