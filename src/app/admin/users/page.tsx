'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { UserPlus, Shield, User, RefreshCw } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: me } = await supabase.from('admin_users').select('role').eq('id', user?.id ?? '').single();
    setCurrentRole(me?.role ?? '');
    const { data } = await supabase.from('admin_users').select('*').order('created_at');
    setUsers(data ?? []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (id: string, role: string) => {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from('admin_users').update({ role }).eq('id', id);
    await load();
    setUpdating(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (currentRole !== 'super_admin') return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Shield size={40} className="text-gray-300 mb-4" />
      <p className="text-gray-500 font-medium">Access Restricted</p>
      <p className="text-gray-400 text-sm mt-1">Only Super Admins can manage users.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm">{users.length} admin users</p>
        </div>
        <button onClick={load} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-ocean-300 transition-all shadow-sm disabled:opacity-60">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Role Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { role: 'super_admin', icon: Shield, color: 'ocean', label: 'Super Admin', desc: 'Full access: bookings, enquiries, packages, pricing, and user management.' },
          { role: 'client_admin', icon: User, color: 'tropical', label: 'Client Admin', desc: 'Access to bookings, enquiries, and package pricing only. Cannot manage users.' },
        ].map(r => (
          <div key={r.role} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl bg-${r.color}-100 flex items-center justify-center`}>
                <r.icon size={18} className={`text-${r.color}-700`} />
              </div>
              <span className="font-semibold text-gray-800">{r.label}</span>
            </div>
            <p className="text-gray-500 text-sm">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['User', 'Email', 'Role', 'Added', 'Change Role'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-500 to-tropical-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {u.full_name?.[0] ?? u.email[0]}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-800 font-medium">{u.full_name || '—'}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${u.role === 'super_admin' ? 'bg-ocean-100 text-ocean-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role === 'super_admin' ? 'Super Admin' : 'Client Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <select
                      value={u.role}
                      onChange={e => updateRole(u.id, e.target.value)}
                      disabled={updating === u.id}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-white disabled:opacity-50"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="client_admin">Client Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-ocean-50 border border-ocean-200 rounded-2xl p-5">
        <p className="text-ocean-800 font-semibold text-sm mb-1">To add a new admin user:</p>
        <ol className="text-ocean-700 text-sm space-y-1 list-decimal list-inside">
          <li>Go to your <strong>Supabase Dashboard → Authentication → Users</strong></li>
          <li>Click <strong>&quot;Add User&quot;</strong> and enter their email and password</li>
          <li>Copy their User ID from the list</li>
          <li>Run in Supabase SQL editor: <code className="bg-ocean-100 px-1.5 py-0.5 rounded text-xs">INSERT INTO admin_users (id, email, full_name, role) VALUES (&apos;USER_ID&apos;, &apos;email&apos;, &apos;Name&apos;, &apos;client_admin&apos;);</code></li>
          <li>They will then appear here and you can change their role anytime</li>
        </ol>
      </div>
    </div>
  );
}
