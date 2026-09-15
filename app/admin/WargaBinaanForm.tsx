"use client";

import { useActionState, useEffect, useRef } from "react";
import { createWargaBinaan, type WargaBinaanFormState } from "./actions";
import { FieldSet, RadioField, SelectField, TextField } from "@/components/fields";
import {
  JENIS_KELAMIN_OPTIONS,
  KATEGORI_USIA_OPTIONS,
} from "@/types/warga-binaan";

const initialState: WargaBinaanFormState = {};

export function WargaBinaanForm() {
  const [state, formAction, pending] = useActionState(
    createWargaBinaan,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const err = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <FieldSet title="Identitas">
        <TextField label="Nama" name="nama" required error={err.nama} />
        <TextField label="Nama Alias" name="nama_alias" error={err.nama_alias} />
        <TextField
          label="Nomor Induk"
          name="nomor_induk"
          required
          placeholder="mis. 380202310070001"
          error={err.nomor_induk}
        />
        <TextField
          label="Nomor Induk KTP"
          name="nomor_induk_ktp"
          error={err.nomor_induk_ktp}
        />
        <TextField
          label="Tanggal Lahir"
          name="tanggal_lahir"
          type="date"
          required
          error={err.tanggal_lahir}
        />
        <TextField label="Tempat Lahir" name="tempat_lahir" error={err.tempat_lahir} />
        <TextField label="Usia" name="usia" type="number" error={err.usia} />
        <SelectField
          label="Jenis Kelamin"
          name="jenis_kelamin"
          required
          options={JENIS_KELAMIN_OPTIONS as unknown as string[]}
          error={err.jenis_kelamin}
        />
        <SelectField
          label="Kategori Usia"
          name="kategori_usia"
          options={KATEGORI_USIA_OPTIONS as unknown as string[]}
          error={err.kategori_usia}
        />
        <TextField label="Agama" name="agama" error={err.agama} />
        <TextField
          label="Status Perkawinan"
          name="status_perkawinan"
          error={err.status_perkawinan}
        />
        <TextField
          label="Tingkat Pendidikan"
          name="tingkat_pendidikan"
          error={err.tingkat_pendidikan}
        />
        <TextField label="Pekerjaan" name="pekerjaan" error={err.pekerjaan} />
        <TextField label="Provinsi" name="provinsi" error={err.provinsi} />
        <TextField label="Kota" name="kota" error={err.kota} />
        <div className="sm:col-span-2 lg:col-span-3">
          <TextField label="Alamat" name="alamat" error={err.alamat} />
        </div>
      </FieldSet>

      <FieldSet title="Data Keluarga">
        <TextField label="Nama Ayah" name="nama_ayah" error={err.nama_ayah} />
        <TextField label="Nama Ibu" name="nama_ibu" error={err.nama_ibu} />
      </FieldSet>

      <FieldSet title="Data Perkara">
        <TextField
          label="No. Reg Instansi"
          name="no_reg_instansi"
          error={err.no_reg_instansi}
        />
        <TextField label="Undang-undang" name="undang_undang" error={err.undang_undang} />
        <TextField label="Pasal Utama" name="pasal_utama" error={err.pasal_utama} />
        <TextField
          label="Jenis Kejahatan"
          name="jenis_kejahatan"
          error={err.jenis_kejahatan}
        />
        <TextField
          label="Jenis Kejahatan Narkotika"
          name="jenis_kejahatan_narkotika"
          placeholder="mis. Pengedar, Pengguna"
          error={err.jenis_kejahatan_narkotika}
        />
        <TextField
          label="Nomor Putusan Akhir"
          name="nomor_putusan_akhir"
          error={err.nomor_putusan_akhir}
        />
        <TextField
          label="Tgl Putusan Akhir"
          name="tgl_putusan_akhir"
          type="date"
          error={err.tgl_putusan_akhir}
        />
        <TextField
          label="Lama Pidana (tahun)"
          name="lama_pidana_tahun"
          type="number"
          error={err.lama_pidana_tahun}
        />
        <TextField
          label="Lama Pidana (bulan)"
          name="lama_pidana_bulan"
          type="number"
          error={err.lama_pidana_bulan}
        />
        <TextField
          label="Lama Pidana (hari)"
          name="lama_pidana_hari"
          type="number"
          error={err.lama_pidana_hari}
        />
        <TextField
          label="Besaran Denda (Rp)"
          name="besaran_denda"
          type="number"
          error={err.besaran_denda}
        />
        <TextField
          label="Subsider (bulan)"
          name="subsider_bulan"
          type="number"
          error={err.subsider_bulan}
        />
        <RadioField
          label="Residivis"
          name="residivis"
          defaultValue="false"
          options={[
            { label: "Ya", value: "true" },
            { label: "Tidak", value: "false" },
          ]}
        />
      </FieldSet>

      <FieldSet title="Masa Tahanan &amp; Remisi">
        <TextField
          label="Tanggal Mulai Ditahan"
          name="tanggal_mulai_ditahan"
          type="date"
          error={err.tanggal_mulai_ditahan}
        />
        <TextField
          label="Tgl Ekspirasi"
          name="tgl_ekspirasi"
          type="date"
          error={err.tgl_ekspirasi}
        />
        <TextField
          label="1/3 Masa Pidana"
          name="sepertiga_masa_pidana"
          type="date"
          error={err.sepertiga_masa_pidana}
        />
        <TextField
          label="1/2 Masa Pidana"
          name="setengah_masa_pidana"
          type="date"
          error={err.setengah_masa_pidana}
        />
        <TextField
          label="2/3 Masa Pidana"
          name="duapertiga_masa_pidana"
          type="date"
          error={err.duapertiga_masa_pidana}
        />
        <TextField
          label="Kategori Remisi"
          name="kategori_remisi"
          error={err.kategori_remisi}
        />
        <TextField
          label="Total Bulan Remisi"
          name="total_bulan_remisi"
          type="number"
          error={err.total_bulan_remisi}
        />
        <TextField
          label="Total Hari Remisi"
          name="total_hari_remisi"
          type="number"
          error={err.total_hari_remisi}
        />
        <TextField label="Tgl Bebas" name="tgl_bebas" type="date" error={err.tgl_bebas} />
      </FieldSet>

      <FieldSet title="Foto WBP">
        <div>
          <label
            htmlFor="foto"
            className="mb-1 block text-xs font-medium text-black/70 dark:text-white/70"
          >
            Unggah foto (JPG/PNG/WebP, maks 5MB)
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-black/70 file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-medium file:text-background dark:text-white/70"
          />
          {err.foto && <p className="mt-1 text-xs text-red-500">{err.foto}</p>}
        </div>
      </FieldSet>

      {state.error && (
        <p role="alert" className="text-sm text-red-500">
          {state.error}
        </p>
      )}
      {state.success && state.message && (
        <p role="status" className="text-sm text-green-600 dark:text-green-400">
          {state.message}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {pending ? "Menyimpan…" : "Simpan Data"}
        </button>
      </div>
    </form>
  );
}
