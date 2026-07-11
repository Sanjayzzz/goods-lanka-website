import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client that uses the **service_role** secret.
 * This client should ONLY be used on the server (e.g., in API routes)
 * because it bypasses Row‑Level Security and can manage users.
 */
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
