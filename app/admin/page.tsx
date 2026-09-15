import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { WargaBinaanForm } from "./WargaBinaanForm";

export const metadata = {
  title: "Admin – Input Data WBP",
};

export default async function AdminPage() {
  const supabase = await createClient();

  // Defense in depth: middleware already gates /admin, but a Server
  // Component that touches the DB should never assume that alone.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: recent } = await supabase
    .from("warga_binaan")
    .select("id, nama, nomor_induk, tanggal_lahir, jenis_kejahatan, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Input Data Warga Binaan</h1>
          <p className="text-sm text-black/60 dark:text-white/60">{user.email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-black/15 px-4 py-2 text-sm transition-colors hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
          >
            Keluar
          </button>
        </form>
      </header>

      <WargaBinaanForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Data Terbaru</h2>
        <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-black/[.03] dark:bg-white/[.06]">
              <tr>
                <th className="px-3 py-2 font-medium">Nama</th>
                <th className="px-3 py-2 font-medium">Nomor Induk</th>
                <th className="px-3 py-2 font-medium">Tanggal Lahir</th>
                <th className="px-3 py-2 font-medium">Jenis Kejahatan</th>
                <th className="px-3 py-2 font-medium">Ditambahkan</th>
              </tr>
            </thead>
            <tbody>
              {(recent ?? []).map((row) => (
                <tr key={row.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="px-3 py-2">{row.nama}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.nomor_induk}</td>
                  <td className="px-3 py-2">{row.tanggal_lahir}</td>
                  <td className="px-3 py-2">{row.jenis_kejahatan ?? "–"}</td>
                  <td className="px-3 py-2 text-black/60 dark:text-white/60">
                    {new Date(row.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-black/50 dark:text-white/50">
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
