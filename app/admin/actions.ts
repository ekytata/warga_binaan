"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_BYTES,
  wargaBinaanFormSchema,
} from "@/lib/validation/warga-binaan";

export interface WargaBinaanFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
  message?: string;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createWargaBinaan(
  _prevState: WargaBinaanFormState,
  formData: FormData
): Promise<WargaBinaanFormState> {
  const supabase = await createClient();

  // Never trust page-level gating alone — re-verify inside the action.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi Anda berakhir, silakan login kembali." };
  }

  const raw = Object.fromEntries(formData);
  const parsed = wargaBinaanFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      error: "Beberapa isian belum valid, mohon periksa kembali.",
      fieldErrors,
    };
  }

  // Photo is optional; handle separately from the text-field schema.
  let fotoPath: string | null = null;
  const photo = formData.get("foto");
  if (photo instanceof File && photo.size > 0) {
    if (!ACCEPTED_PHOTO_TYPES.includes(photo.type)) {
      return {
        error: "Format foto harus JPG, PNG, atau WebP.",
        fieldErrors: { foto: "Format tidak didukung" },
      };
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return {
        error: "Ukuran foto maksimal 5MB.",
        fieldErrors: { foto: "Terlalu besar" },
      };
    }

    const ext = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    fotoPath = `${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("wbp-photos")
      .upload(fotoPath, photo, { contentType: photo.type });

    if (uploadError) {
      return { error: `Gagal mengunggah foto: ${uploadError.message}` };
    }
  }

  const { error: insertError } = await supabase.from("warga_binaan").insert({
    ...parsed.data,
    foto_wbp: fotoPath,
    created_by: user.id,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        error: "Nomor induk sudah terdaftar.",
        fieldErrors: { nomor_induk: "Sudah terdaftar" },
      };
    }
    return { error: `Gagal menyimpan data: ${insertError.message}` };
  }

  revalidatePath("/admin");
  return { success: true, message: "Data berhasil disimpan." };
}
