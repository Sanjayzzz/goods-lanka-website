'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(`Login failed: ${authError.message}`);
        setLoading(false);
        return;
      }
      if (data.session) {
        // Force hard navigation to ensure session cookie is set
        window.location.href = '/admin/dashboard';
      } else {
        setError('No session returned. Please check your Supabase settings.');
        setLoading(false);
      }
    } catch (err) {
      setError(`Unexpected error: ${String(err)}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-tropical-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image src="/logo.png" alt="Good's Lanka" fill className="object-contain" />
          </div>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white">Good&apos;s Lanka</h1>
          <p className="text-white/60 text-sm mt-1 tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-ocean-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@goodslanka.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-gray-800"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Good&apos;s Lanka Tours &amp; Travels — Admin Portal
        </p>
      </div>
    </div>
  );
}
