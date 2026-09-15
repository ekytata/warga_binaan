/**
 * Mirrors the `public.warga_binaan` table (see supabase/migrations/0001_init.sql).
 * Field names follow the source spreadsheet (public/data/Pencarian Kompleks_*.csv).
 */
export type JenisKelamin = "Laki-laki" | "Perempuan";
export type KategoriUsia = "Anak" | "Dewasa" | "Lansia";

export interface WargaBinaan {
  id: string;
  no_urut: number | null;
  no_reg_instansi: string | null;
  nama: string;
  nama_alias: string | null;
  alamat: string | null;
  provinsi: string | null;
  kota: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string; // date (YYYY-MM-DD)
  usia: number | null;
  jenis_kelamin: JenisKelamin;
  agama: string | null;
  status_perkawinan: string | null;
  tingkat_pendidikan: string | null;
  pekerjaan: string | null;
  kategori_usia: KategoriUsia | null;

  nomor_induk: string;
  nomor_induk_ktp: string | null;

  undang_undang: string | null;
  pasal_utama: string | null;
  jenis_kejahatan: string | null;
  jenis_kejahatan_narkotika: string | null;
  nomor_putusan_akhir: string | null;
  tgl_putusan_akhir: string | null;
  lama_pidana_tahun: number | null;
  lama_pidana_bulan: number | null;
  lama_pidana_hari: number | null;
  besaran_denda: number | null;
  subsider_bulan: number | null;
  residivis: boolean;

  tanggal_mulai_ditahan: string | null;
  tgl_ekspirasi: string | null;
  sepertiga_masa_pidana: string | null;
  setengah_masa_pidana: string | null;
  duapertiga_masa_pidana: string | null;
  kategori_remisi: string | null;
  total_bulan_remisi: number | null;
  total_hari_remisi: number | null;
  tgl_bebas: string | null;

  nama_ayah: string | null;
  nama_ibu: string | null;

  foto_wbp: string | null;

  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Shape returned by the public `search_warga_binaan` RPC (KTP masked, no audit columns). */
export type WargaBinaanSearchResult = Omit<
  WargaBinaan,
  "nomor_induk_ktp" | "created_by" | "created_at" | "updated_at"
> & {
  nomor_induk_ktp_masked: string | null;
};

export const JENIS_KELAMIN_OPTIONS: JenisKelamin[] = ["Laki-laki", "Perempuan"];
export const KATEGORI_USIA_OPTIONS: KategoriUsia[] = ["Anak", "Dewasa", "Lansia"];
