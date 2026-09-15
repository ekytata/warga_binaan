"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { searchFormSchema } from "@/lib/validation/warga-binaan";
import type { WargaBinaanSearchResult } from "@/types/warga-binaan";

export interface SearchState {
  error?: string;
  notFound?: boolean;
  result?: WargaBinaanSearchResult;
  submitted?: boolean;
}

export async function searchWargaBinaan(
  _prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const raw = Object.fromEntries(formData);
  const parsed = searchFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Input tidak valid.",
      submitted: true,
    };
  }

  // Best-effort client identifier for the DB-side rate limiter. Forwarded
  // headers can be spoofed by a caller talking to this server directly,
  // but on a normal deployment behind a platform proxy (e.g. Vercel) they
  // reflect the real client IP.
  const hdrs = await headers();
  const clientKey =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_warga_binaan", {
    p_nomor_induk: parsed.data.nomor_induk,
    p_tanggal_lahir: parsed.data.tanggal_lahir,
    p_client_key: clientKey,
  });

  if (error) {
    if (error.message?.includes("RATE_LIMITED")) {
      return {
        error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit.",
        submitted: true,
      };
    }
    return { error: "Terjadi kesalahan, silakan coba lagi.", submitted: true };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { notFound: true, submitted: true };
  }

  return { result: row as WargaBinaanSearchResult, submitted: true };
}
