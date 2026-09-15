#!/usr/bin/env python3
"""Parse public/data/Pencarian Kompleks_*.csv and emit a single INSERT
statement (supabase/seed.sql) matching the warga_binaan schema.

Re-run this whenever the source CSV is replaced with a newer export, then
paste supabase/seed.sql into the Supabase SQL Editor (existing nomor_induk
values are skipped via ON CONFLICT DO NOTHING, so it's safe to re-run)."""
import csv
import glob
import re
import sys

ROOT = "/Users/eky/Projects/practice/my-app"
CANDIDATES = sorted(glob.glob(f"{ROOT}/public/data/Pencarian Kompleks*.csv"))
if not CANDIDATES:
    sys.exit(f"No 'Pencarian Kompleks*.csv' found under {ROOT}/public/data/")
SRC = CANDIDATES[-1]  # newest by filename (export timestamp suffix)
OUT = f"{ROOT}/supabase/seed.sql"

COLUMNS = [
    "no_urut", "no_reg_instansi", "nama", "alamat", "provinsi", "kota",
    "tempat_lahir", "tanggal_lahir", "usia", "jenis_kelamin", "agama",
    "status_perkawinan", "tingkat_pendidikan", "nomor_induk", "undang_undang",
    "nomor_putusan_akhir", "tgl_putusan_akhir", "lama_pidana_tahun",
    "lama_pidana_bulan", "lama_pidana_hari", "jenis_kejahatan",
    "tanggal_mulai_ditahan", "tgl_ekspirasi", "sepertiga_masa_pidana",
    "setengah_masa_pidana", "duapertiga_masa_pidana", "residivis", "pekerjaan",
    "total_bulan_remisi", "total_hari_remisi", "kategori_usia",
    "kategori_remisi", "pasal_utama", "jenis_kejahatan_narkotika",
    "besaran_denda", "subsider_bulan", "nama_alias", "nama_ayah", "nama_ibu",
    "nomor_induk_ktp", "tgl_bebas",
]

INT_COLS = {
    "no_urut", "usia", "lama_pidana_tahun", "lama_pidana_bulan",
    "lama_pidana_hari", "total_bulan_remisi", "total_hari_remisi",
    "subsider_bulan",
}
DATE_COLS = {
    "tanggal_lahir", "tgl_putusan_akhir", "tanggal_mulai_ditahan",
    "tgl_ekspirasi", "sepertiga_masa_pidana", "setengah_masa_pidana",
    "duapertiga_masa_pidana", "tgl_bebas",
}


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def to_int(value: str):
    value = value.strip()
    return int(value) if value else None


def to_money(value: str):
    digits = re.sub(r"[^\d]", "", value)
    return int(digits) if digits else 0


def to_bool_ya_tidak(value: str):
    return value.strip().lower() == "ya"


def cell(row, i):
    return row[i].strip() if i < len(row) else ""


def transform(row) -> dict:
    out = {}
    out["no_urut"] = to_int(cell(row, 0))
    out["no_reg_instansi"] = cell(row, 1) or None
    out["nama"] = cell(row, 2)
    out["alamat"] = cell(row, 3) or None
    out["provinsi"] = cell(row, 4) or None
    out["kota"] = cell(row, 5) or None
    out["tempat_lahir"] = cell(row, 6) or None
    out["tanggal_lahir"] = cell(row, 7) or None
    out["usia"] = to_int(cell(row, 8))
    out["jenis_kelamin"] = cell(row, 9)
    out["agama"] = cell(row, 10) or None
    out["status_perkawinan"] = cell(row, 11) or None
    out["tingkat_pendidikan"] = cell(row, 12) or None
    out["nomor_induk"] = cell(row, 13).lstrip("'")
    out["undang_undang"] = cell(row, 14) or None
    out["nomor_putusan_akhir"] = cell(row, 15) or None
    out["tgl_putusan_akhir"] = cell(row, 16) or None
    out["lama_pidana_tahun"] = to_int(cell(row, 17)) or 0
    out["lama_pidana_bulan"] = to_int(cell(row, 18)) or 0
    out["lama_pidana_hari"] = to_int(cell(row, 19)) or 0
    out["jenis_kejahatan"] = cell(row, 20) or None
    out["tanggal_mulai_ditahan"] = cell(row, 21) or None
    out["tgl_ekspirasi"] = cell(row, 22) or None
    out["sepertiga_masa_pidana"] = cell(row, 23) or None
    out["setengah_masa_pidana"] = cell(row, 24) or None
    out["duapertiga_masa_pidana"] = cell(row, 25) or None
    out["residivis"] = to_bool_ya_tidak(cell(row, 26))
    out["pekerjaan"] = cell(row, 27) or None
    out["total_bulan_remisi"] = to_int(cell(row, 28))
    out["total_hari_remisi"] = to_int(cell(row, 29))
    out["kategori_usia"] = cell(row, 30) or None
    out["kategori_remisi"] = cell(row, 31) or None
    out["pasal_utama"] = cell(row, 32) or None
    out["jenis_kejahatan_narkotika"] = cell(row, 33) or None
    out["besaran_denda"] = to_money(cell(row, 34))
    out["subsider_bulan"] = to_int(cell(row, 35)) or 0
    out["nama_alias"] = cell(row, 36) or None
    out["nama_ayah"] = cell(row, 37) or None
    out["nama_ibu"] = cell(row, 38) or None
    out["nomor_induk_ktp"] = cell(row, 39) or None
    out["tgl_bebas"] = cell(row, 40) or None
    # column 41 (Foto WBP) intentionally skipped: those paths reference
    # files that were never uploaded to this project's storage bucket.
    return out


def render_value(col: str, value):
    if value is None:
        return "NULL"
    if col in INT_COLS:
        return str(value)
    if col == "besaran_denda":
        return str(value)
    if col == "residivis":
        return "true" if value else "false"
    if col in DATE_COLS:
        return sql_str(value)
    return sql_str(str(value))


def main():
    with open(SRC, newline="", encoding="utf-8-sig") as f:
        reader = list(csv.reader(f))

    header_idx = next(i for i, r in enumerate(reader) if r and r[0].strip() == "No")
    data_rows = [r for r in reader[header_idx + 1:] if any(c.strip() for c in r)]

    print(f"Parsed {len(data_rows)} data rows", file=sys.stderr)

    lines = []
    lines.append("-- Seed data imported from public/data/Pencarian Kompleks_*.csv")
    lines.append("-- Generated by scratchpad/build_seed_sql.py — safe to re-run (ON CONFLICT DO NOTHING).")
    lines.append("-- Note: the CSV's 'Foto WBP' paths are not migrated (no actual image files")
    lines.append("-- were provided); upload photos again via the admin form if needed.")
    lines.append("insert into public.warga_binaan (")
    lines.append("  " + ", ".join(COLUMNS))
    lines.append(") values")

    value_tuples = []
    seen_nomor_induk = set()
    for row in data_rows:
        rec = transform(row)
        if not rec["nama"] or not rec["nomor_induk"] or not rec["tanggal_lahir"]:
            print(f"SKIP (missing required field): {rec}", file=sys.stderr)
            continue
        if rec["nomor_induk"] in seen_nomor_induk:
            print(f"SKIP (duplicate nomor_induk in CSV): {rec['nomor_induk']}", file=sys.stderr)
            continue
        seen_nomor_induk.add(rec["nomor_induk"])
        values = ", ".join(render_value(c, rec[c]) for c in COLUMNS)
        value_tuples.append(f"  ({values})")

    lines.append(",\n".join(value_tuples))
    lines.append("on conflict (nomor_induk) do nothing;")

    sql = "\n".join(lines) + "\n"
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(sql)

    print(f"Wrote {len(value_tuples)} rows to {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
