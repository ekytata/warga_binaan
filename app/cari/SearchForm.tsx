"use client";

import { useActionState, useState } from "react";
import { searchWargaBinaan, type SearchState } from "./actions";
import { formatDateID, formatRupiah, yaTidak } from "@/lib/format";

const initialState: SearchState = {};

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none transition focus:border-black/40 dark:border-white/20 dark:bg-white/5 dark:text-white dark:focus:border-white/40";
const labelClass = "mb-1 block text-xs font-medium text-black/70 dark:text-white/70";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-black/5 py-2 dark:border-white/10 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-xs text-black/50 dark:text-white/50">{label}</dt>
      <dd className="text-sm font-medium text-right sm:text-left">{value ?? "–"}</dd>
    </div>
  );
}

export function SearchForm() {
  const [state, formAction, pending] = useActionState(
    searchWargaBinaan,
    initialState
  );
  // Controlled inputs: React 19 clears uncontrolled form fields after every
  // action submission (found, not found, or error alike). Holding the
  // values in state ourselves keeps what the user typed on screen.
  const [nomorInduk, setNomorInduk] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const r = state.result;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <form
        action={formAction}
        className="flex flex-col gap-4 rounded-xl border border-black/10 p-5 dark:border-white/10 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className={labelClass} htmlFor="nomor_induk">
            Nomor Induk
          </label>
          <input
            id="nomor_induk"
            name="nomor_induk"
            required
            placeholder="mis. 380202310070001"
            value={nomorInduk}
            onChange={(e) => setNomorInduk(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass} htmlFor="tanggal_lahir">
            Tanggal Lahir
          </label>
          <input
            id="tanggal_lahir"
            name="tanggal_lahir"
            type="date"
            required
            value={tanggalLahir}
            onChange={(e) => setTanggalLahir(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {pending ? "Mencari…" : "Cari"}
        </button>
      </form>

      {state.error && (
        <p role="alert" className="text-center text-sm text-red-500">
          {state.error}
        </p>
      )}

      {state.notFound && (
        <p role="status" className="text-center text-sm text-black/60 dark:text-white/60">
          Data tidak ditemukan. Periksa kembali nomor induk dan tanggal lahir.
        </p>
      )}

      {r && (
        <div className="flex flex-col gap-6 rounded-xl border border-black/10 p-5 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold">{r.nama}</h2>
            {r.nama_alias && (
              <p className="text-sm text-black/60 dark:text-white/60">Alias {r.nama_alias}</p>
            )}
          </div>

          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              Identitas
            </h3>
            <dl>
              <Row label="Nomor Induk" value={r.nomor_induk} />
              <Row label="Nomor Induk KTP" value={r.nomor_induk_ktp_masked} />
              <Row label="Tanggal Lahir" value={formatDateID(r.tanggal_lahir)} />
              <Row label="Tempat Lahir" value={r.tempat_lahir} />
              <Row label="Usia" value={r.usia} />
              <Row label="Jenis Kelamin" value={r.jenis_kelamin} />
              <Row label="Agama" value={r.agama} />
              <Row label="Status Perkawinan" value={r.status_perkawinan} />
              <Row label="Pekerjaan" value={r.pekerjaan} />
              <Row label="Alamat" value={r.alamat} />
              <Row label="Provinsi / Kota" value={[r.provinsi, r.kota].filter(Boolean).join(" / ")} />
              <Row label="Nama Ayah" value={r.nama_ayah} />
              <Row label="Nama Ibu" value={r.nama_ibu} />
            </dl>
          </div>

          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              Perkara
            </h3>
            <dl>
              <Row label="Undang-undang" value={r.undang_undang} />
              <Row label="Pasal Utama" value={r.pasal_utama} />
              <Row label="Jenis Kejahatan" value={r.jenis_kejahatan} />
              <Row label="Jenis Kejahatan Narkotika" value={r.jenis_kejahatan_narkotika} />
              <Row label="Nomor Putusan Akhir" value={r.nomor_putusan_akhir} />
              <Row label="Tgl Putusan Akhir" value={formatDateID(r.tgl_putusan_akhir)} />
              <Row
                label="Lama Pidana"
                value={`${r.lama_pidana_tahun ?? 0} thn ${r.lama_pidana_bulan ?? 0} bln ${r.lama_pidana_hari ?? 0} hr`}
              />
              <Row label="Besaran Denda" value={formatRupiah(r.besaran_denda)} />
              <Row label="Subsider (bulan)" value={r.subsider_bulan} />
              <Row label="Residivis" value={yaTidak(r.residivis)} />
            </dl>
          </div>

          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              Masa Tahanan &amp; Remisi
            </h3>
            <dl>
              <Row label="Tanggal Mulai Ditahan" value={formatDateID(r.tanggal_mulai_ditahan)} />
              <Row label="Tgl Ekspirasi" value={formatDateID(r.tgl_ekspirasi)} />
              <Row label="1/3 Masa Pidana" value={formatDateID(r.sepertiga_masa_pidana)} />
              <Row label="1/2 Masa Pidana" value={formatDateID(r.setengah_masa_pidana)} />
              <Row label="2/3 Masa Pidana" value={formatDateID(r.duapertiga_masa_pidana)} />
              <Row label="Kategori Remisi" value={r.kategori_remisi} />
              <Row label="Total Remisi" value={`${r.total_bulan_remisi ?? 0} bln ${r.total_hari_remisi ?? 0} hr`} />
              <Row label="Tanggal Bebas" value={formatDateID(r.tgl_bebas)} />
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
