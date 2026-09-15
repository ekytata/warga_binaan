"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./env";

/** Supabase client for use in Client Components. Uses the publishable key
 * only (safe to expose in the browser) — access is governed entirely by
 * RLS policies on the `authenticated` role. */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
