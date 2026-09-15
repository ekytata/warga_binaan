import { z } from "zod";

/** FormData gives back `""` for untouched optional inputs — normalize to
 * `undefined` before handing values to zod so `.optional()` behaves. */
const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalText = z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional());
const optionalDate = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
    .optional()
);
const optionalInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().optional()
);
const optionalMoney = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0).optional()
);

export const wargaBinaanFormSchema = z.object({
  // Identitas
  nama: z.string().trim().min(1, "Nama wajib diisi").max(300),
  nama_alias: optionalText,
  alamat: optionalText,
  provinsi: optionalText,
  kota: optionalText,
  tempat_lahir: optionalText,
  tanggal_lahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir wajib diisi (YYYY-MM-DD)"),
  usia: optionalInt,
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Pilih jenis kelamin",
  }),
  agama: optionalText,
  status_perkawinan: optionalText,
  tingkat_pendidikan: optionalText,
  pekerjaan: optionalText,
  kategori_usia: z.preprocess(
    emptyToUndefined,
    z.enum(["Anak", "Dewasa", "Lansia"]).optional()
  ),

  // Kunci pencarian
  nomor_induk: z.string().trim().min(1, "Nomor induk wajib diisi").max(100),
  nomor_induk_ktp: optionalText,

  // Data perkara
  no_reg_instansi: optionalText,
  undang_undang: optionalText,
  pasal_utama: optionalText,
  jenis_kejahatan: optionalText,
  jenis_kejahatan_narkotika: optionalText,
  nomor_putusan_akhir: optionalText,
  tgl_putusan_akhir: optionalDate,
  lama_pidana_tahun: optionalInt,
  lama_pidana_bulan: optionalInt,
  lama_pidana_hari: optionalInt,
  besaran_denda: optionalMoney,
  subsider_bulan: optionalInt,
  residivis: z.preprocess(
    (v) => v === "true" || v === "on" || v === true,
    z.boolean()
  ),

  // Masa tahanan & remisi
  tanggal_mulai_ditahan: optionalDate,
  tgl_ekspirasi: optionalDate,
  sepertiga_masa_pidana: optionalDate,
  setengah_masa_pidana: optionalDate,
  duapertiga_masa_pidana: optionalDate,
  kategori_remisi: optionalText,
  total_bulan_remisi: optionalInt,
  total_hari_remisi: optionalInt,
  tgl_bebas: optionalDate,

  // Keluarga
  nama_ayah: optionalText,
  nama_ibu: optionalText,
});

export type WargaBinaanFormValues = z.infer<typeof wargaBinaanFormSchema>;

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const searchFormSchema = z.object({
  nomor_induk: z.string().trim().min(1, "Nomor induk wajib diisi").max(100),
  tanggal_lahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir wajib diisi"),
});
