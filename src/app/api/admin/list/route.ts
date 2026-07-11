// src/app/api/admin/list/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

/**
 * Returns a list of all users that have `role: "admin"` in their
 * `user_metadata`. Only callable by an already‑authenticated admin.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const supabase = createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const role = (user.user_metadata as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Insufficient privileges' }, { status: 403 });
  }

  // Query the auth.users table via Supabase's RPC `get_auth_user` (or use the public view).
  const { data, error } = await supabase
    .from('auth.users')
    .select('id, email, user_metadata')
    .eq('user_metadata->>role', 'admin');

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}
