import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client — RLS'i bypass eder.
 * Sadece server-side (route handler, server action) kullan, client'a asla expose etme.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
