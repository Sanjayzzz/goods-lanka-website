'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const publicPaths = ['/account/login', '/account/register'];
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (isPublic) { setChecking(false); return; }
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/account/login'); }
      else { setChecking(false); }
    };
    check();
  }, [isPublic, router]);

  if (checking && !isPublic) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return <>{children}</>;
}
