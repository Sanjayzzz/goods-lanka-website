// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

/**
 * Protected admin endpoint for managing user passwords, deletion and role metadata.
 * This route runs on the server, so it can safely use the service_role key.
 */
export async function POST(request: Request) {
  // Basic auth check – ensure the caller is already an admin.
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
  // Look at user_metadata.role – only admins can hit this endpoint.
  const role = (user.user_metadata as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Insufficient privileges' }, { status: 403 });
  }

  const { action, userId, newPassword, newRole } = await request.json();

  // -----------------------------------------------------------------
  // 1️⃣ Change password
  // -----------------------------------------------------------------
  if (action === 'changePassword') {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  // -----------------------------------------------------------------
  // 2️⃣ Delete user
  // -----------------------------------------------------------------
  if (action === 'deleteUser') {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  // -----------------------------------------------------------------
  // 3️⃣ Set/Update role (stored in user_metadata)
  // -----------------------------------------------------------------
  if (action === 'setRole') {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}
