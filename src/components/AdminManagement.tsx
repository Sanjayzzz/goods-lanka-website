// src/components/AdminManagement.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

/**
 * Simple UI for listing admins, changing passwords, deleting admins,
 * and toggling the admin role stored in `user_metadata`.
 *
 * It assumes you have a JWT stored in localStorage (or a cookie) that
 * Supabase will use for `supabase.auth.getUser()`.
 */
export default function AdminManagement() {
  const supabase = createClient();
  const [admins, setAdmins] = useState<any[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  // Load admin list on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return setMsg('You must be logged in as an admin');
      const res = await fetch('/api/admin/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAdmins(data);
      else setMsg(data.error ?? 'Failed to load admins');
    };
    fetchAdmins();
  }, []);

  const handleChangePassword = async (userId: string) => {
    if (!newPassword) return setMsg('Enter a new password');
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'changePassword', userId, newPassword }),
    });
    const data = await res.json();
    setMsg(res.ok ? 'Password updated' : data.error);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this admin permanently?')) return;
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'deleteUser', userId }),
    });
    const data = await res.json();
    setMsg(res.ok ? 'Admin deleted' : data.error);
    if (res.ok) setAdmins(admins.filter(a => a.id !== userId));
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'setRole', userId, newRole }),
    });
    const data = await res.json();
    setMsg(res.ok ? `Role set to ${newRole}` : data.error);
    if (res.ok) {
      setAdmins(
        admins.map(a => (a.id === userId ? { ...a, user_metadata: { ...a.user_metadata, role: newRole } } : a))
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Management</h2>
      {msg && <p className="mb-2 text-sm text-gray-600">{msg}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id} className="odd:bg-gray-50">
              <td className="border p-2">{admin.email}</td>
              <td className="border p-2">{(admin.user_metadata?.role) || 'user'}</td>
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => handleToggleRole(admin.id, admin.user_metadata?.role)}
                  className="bg-indigo-600 text-white px-2 py-1 rounded"
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <input
                  type="password"
                  placeholder="New pwd"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="border rounded px-1 py-0.5"
                />
                <button
                  onClick={() => handleChangePassword(admin.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Set Pwd
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
