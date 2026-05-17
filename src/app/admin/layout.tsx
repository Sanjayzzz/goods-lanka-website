'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Package,
  Users, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const allNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'client_admin'] },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, roles: ['super_admin', 'client_admin'] },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare, roles: ['super_admin', 'client_admin'] },
  { href: '/admin/packages', label: 'Packages & Pricing', icon: Package, roles: ['super_admin', 'client_admin'] },
  { href: '/admin/users', label: 'User Management', icon: Users, roles: ['super_admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        if (pathname !== '/admin') router.push('/admin');
        setLoading(false);
        return;
      }

      // Get role from admin_users table
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role, full_name')
        .eq('id', authUser.id)
        .single();

      setUser({
        email: authUser.email ?? '',
        role: adminData?.role ?? 'client_admin',
      });
      setLoading(false);
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin');
  };

  // Show login page without sidebar
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-ocean-950">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image src="/logo.png" alt="Good's Lanka" fill className="object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Good&apos;s Lanka</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tropical-500 to-ocean-600 flex items-center justify-center text-white text-xs font-bold uppercase">
            {user.email[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.email}</p>
            <p className="text-white/40 text-[10px] capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-800 font-semibold text-base capitalize">
              {navItems.find(n => pathname.startsWith(n.href))?.label ?? 'Admin'}
            </h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-ocean-600 hover:text-ocean-800 transition-colors font-medium"
          >
            View Website ↗
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
