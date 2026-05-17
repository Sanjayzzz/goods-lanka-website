'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      window.location.href = '/account/my-bookings';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-tropical-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image src="/logo.png" alt="Good's Lanka" fill className="object-contain" />
            </div>
          </Link>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to view your bookings</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/account/register" className="text-ocean-600 font-semibold hover:underline">Create one</Link>
          </div>
          <div className="mt-3 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to website</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
