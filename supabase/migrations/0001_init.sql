-- =====================================================================
-- Pencarian Kompleks — Warga Binaan (inmate records)
-- Initial schema: table, RLS, guest search RPC (rate-limited), storage.
--
-- Data model based on public/data/Pencarian Kompleks_*.csv
--
-- Access model:
--   - anon (guests)      : NO direct table access at all. Can only call
--                          search_warga_binaan(nomor_induk, tanggal_lahir),
--                          a SECURITY DEFINER function that returns at most
--                          one exact match and masks the KTP number.
--   - authenticated (admin): full select/insert/update/delete on the table,
--                          via Supabase Auth. Create the admin login
--                          manually in Authentication > Users (this
--                          migration intentionally does not create any
--                          auth user or password).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Main table
-- ---------------------------------------------------------------------
create table if not exists public.warga_binaan (
  id                          uuid primary key default gen_random_uuid(),

  -- Identitas
  no_urut                     integer,
  no_reg_instansi             text,
  nama                        text not null,
  nama_alias                  text,
  alamat                      text,
  provinsi                    text,
  kota                        text,
  tempat_lahir                text,
  tanggal_lahir               date not null,
  usia                        integer,
  jenis_kelamin               text not null check (jenis_kelamin in ('Laki-laki', 'Perempuan')),
  agama                       text,
  status_perkawinan           text,
  tingkat_pendidikan          text,
  pekerjaan                   text,
  kategori_usia               text check (kategori_usia in ('Anak', 'Dewasa', 'Lansia')),

  -- Kunci pencarian (dipakai guest untuk mencari data)
  nomor_induk                 text not null,
  nomor_induk_ktp             text,

  -- Data perkara / pidana
  undang_undang               text,
  pasal_utama                 text,
  jenis_kejahatan              text,
  jenis_kejahatan_narkotika   text,
  nomor_putusan_akhir         text,
  tgl_putusan_akhir           date,
  lama_pidana_tahun           integer default 0,
  lama_pidana_bulan           integer default 0,
  lama_pidana_hari            integer default 0,
  besaran_denda                numeric default 0,
  subsider_bulan              integer default 0,
  residivis                   boolean not null default false,

  -- Masa tahanan & remisi
  tanggal_mulai_ditahan       date,
  tgl_ekspirasi               date,
  sepertiga_masa_pidana       date,
  setengah_masa_pidana        date,
  duapertiga_masa_pidana      date,
  kategori_remisi             text,
  total_bulan_remisi          integer,
  total_hari_remisi           integer,
  tgl_bebas                   date,

  -- Keluarga
  nama_ayah                   text,
  nama_ibu                    text,

  -- Foto (path relatif di storage bucket 'wbp-photos', bukan URL publik)
  foto_wbp                    text,

  -- Audit
  created_by                  uuid references auth.users (id),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  constraint warga_binaan_nomor_induk_key unique (nomor_induk)
);

create index if not exists idx_warga_binaan_nama on public.warga_binaan using gin (to_tsvector('simple', nama));
create index if not exists idx_warga_binaan_search_key on public.warga_binaan (nomor_induk, tanggal_lahir);

comment on table public.warga_binaan is 'Data warga binaan pemasyarakatan (WBP). Berisi data pribadi & catatan pidana sensitif — akses publik hanya lewat fungsi search_warga_binaan.';

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_warga_binaan_updated_at on public.warga_binaan;
create trigger trg_warga_binaan_updated_at
  before update on public.warga_binaan
  for each row execute function public.set_updated_at();

alter table public.warga_binaan enable row level security;

-- Admin (any authenticated user) has full access. No policy is defined for
-- `anon`, so RLS default-denies guests on the base table entirely.
create policy "authenticated can select warga_binaan"
  on public.warga_binaan for select
  to authenticated
  using (true);

create policy "authenticated can insert warga_binaan"
  on public.warga_binaan for insert
  to authenticated
  with check (true);

create policy "authenticated can update warga_binaan"
  on public.warga_binaan for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete warga_binaan"
  on public.warga_binaan for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 2. Rate limiting log for the public search function
-- ---------------------------------------------------------------------
create table if not exists public.search_attempts (
  id           bigint generated always as identity primary key,
  client_key   text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_search_attempts_key_time
  on public.search_attempts (client_key, attempted_at desc);

-- Locked down completely: only the SECURITY DEFINER function below (which
-- runs as the table owner) can read or write this table.
alter table public.search_attempts enable row level security;

-- ---------------------------------------------------------------------
-- 3. Public search RPC — the ONLY way `anon` can reach warga_binaan data.
--    Requires an exact (nomor_induk, tanggal_lahir) match, returns at most
--    one row, masks the KTP number, and rate-limits by caller-supplied key
--    (pass the request IP from the Next.js server).
-- ---------------------------------------------------------------------
create or replace function public.search_warga_binaan(
  p_nomor_induk   text,
  p_tanggal_lahir date,
  p_client_key    text default 'unknown'
)
returns table (
  id                        uuid,
  nama                      text,
  nama_alias                text,
  alamat                    text,
  provinsi                  text,
  kota                      text,
  tempat_lahir              text,
  tanggal_lahir             date,
  usia                      integer,
  jenis_kelamin             text,
  agama                     text,
  status_perkawinan         text,
  tingkat_pendidikan        text,
  pekerjaan                 text,
  kategori_usia             text,
  nomor_induk               text,
  nomor_induk_ktp_masked    text,
  undang_undang             text,
  pasal_utama               text,
  jenis_kejahatan           text,
  jenis_kejahatan_narkotika text,
  nomor_putusan_akhir       text,
  tgl_putusan_akhir         date,
  lama_pidana_tahun         integer,
  lama_pidana_bulan         integer,
  lama_pidana_hari          integer,
  besaran_denda             numeric,
  subsider_bulan            integer,
  residivis                 boolean,
  tanggal_mulai_ditahan     date,
  tgl_ekspirasi             date,
  sepertiga_masa_pidana     date,
  setengah_masa_pidana      date,
  duapertiga_masa_pidana    date,
  kategori_remisi           text,
  total_bulan_remisi        integer,
  total_hari_remisi         integer,
  tgl_bebas                 date,
  nama_ayah                 text,
  nama_ibu                  text,
  foto_wbp                  text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent_attempts integer;
  v_limit constant integer := 10;
  v_window constant interval := interval '5 minutes';
begin
  select count(*) into v_recent_attempts
  from public.search_attempts sa
  where sa.client_key = p_client_key
    and sa.attempted_at > now() - v_window;

  insert into public.search_attempts (client_key) values (p_client_key);

  if v_recent_attempts >= v_limit then
    raise exception 'RATE_LIMITED: too many search attempts, try again later'
      using errcode = 'P0001';
  end if;

  if p_nomor_induk is null or btrim(p_nomor_induk) = '' or p_tanggal_lahir is null then
    return;
  end if;

  return query
    select
      w.id, w.nama, w.nama_alias, w.alamat, w.provinsi, w.kota, w.tempat_lahir,
      w.tanggal_lahir, w.usia, w.jenis_kelamin, w.agama, w.status_perkawinan,
      w.tingkat_pendidikan, w.pekerjaan, w.kategori_usia, w.nomor_induk,
      case
        when w.nomor_induk_ktp is null or length(w.nomor_induk_ktp) < 4 then w.nomor_induk_ktp
        else repeat('*', length(w.nomor_induk_ktp) - 4) || right(w.nomor_induk_ktp, 4)
      end as nomor_induk_ktp_masked,
      w.undang_undang, w.pasal_utama, w.jenis_kejahatan, w.jenis_kejahatan_narkotika,
      w.nomor_putusan_akhir, w.tgl_putusan_akhir, w.lama_pidana_tahun, w.lama_pidana_bulan,
      w.lama_pidana_hari, w.besaran_denda, w.subsider_bulan, w.residivis,
      w.tanggal_mulai_ditahan, w.tgl_ekspirasi, w.sepertiga_masa_pidana,
      w.setengah_masa_pidana, w.duapertiga_masa_pidana, w.kategori_remisi,
      w.total_bulan_remisi, w.total_hari_remisi, w.tgl_bebas,
      w.nama_ayah, w.nama_ibu, w.foto_wbp
    from public.warga_binaan w
    where w.nomor_induk = btrim(p_nomor_induk)
      and w.tanggal_lahir = p_tanggal_lahir
    limit 1;
end;
$$;

revoke all on function public.search_warga_binaan(text, date, text) from public;
grant execute on function public.search_warga_binaan(text, date, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Storage bucket for admin-uploaded photos ("Foto WBP").
--    Private bucket: guests never get direct/public URLs. The app's
--    server (service role key, server-only) mints short-lived signed
--    URLs after a successful search match.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('wbp-photos', 'wbp-photos', false)
on conflict (id) do nothing;

drop policy if exists "authenticated can manage wbp-photos" on storage.objects;
create policy "authenticated can manage wbp-photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'wbp-photos')
  with check (bucket_id = 'wbp-photos');
