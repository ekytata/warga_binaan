const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** Formats a `YYYY-MM-DD` string as "D Month YYYY" without going through
 * `Date` (avoids UTC/local timezone off-by-one-day surprises). */
export function formatDateID(value: string | null | undefined): string {
  if (!value) return "–";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  const monthName = BULAN[Number(m) - 1] ?? m;
  return `${Number(d)} ${monthName} ${y}`;
}

export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined) return "–";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function yaTidak(value: boolean | null | undefined): string {
  return value ? "Ya" : "Tidak";
}
