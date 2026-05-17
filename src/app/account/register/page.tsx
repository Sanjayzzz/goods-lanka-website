'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    if (authError) { setError(authError.message); setLoading(false); }
    else { setSuccess(true); }
  };

  if (success) return (
    <main className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-tropical-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
        <p className="text-gray-500 text-sm mb-6">We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then come back to sign in.</p>
        <Link href="/account/login" className="inline-block px-8 py-3 bg-ocean-700 text-white font-semibold rounded-xl hover:bg-ocean-800 transition-colors">
          Go to Sign In
        </Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-tropical-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image src="/logo.png" alt="Good's Lanka" fill className="object-contain" />
            </div>
          </Link>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/60 text-sm mt-1">Track your bookings and travel plans</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/account/login" className="text-ocean-600 font-semibold hover:underline">Sign in</Link>
          </div>
          <div className="mt-3 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to website</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
