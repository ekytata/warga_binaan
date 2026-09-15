import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { WargaBinaanForm } from "./WargaBinaanForm";
import { Button, Card } from "@/components/ui";

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Input Data Warga Binaan</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            Keluar
          </Button>
        </form>
      </header>

      <WargaBinaanForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Data Terbaru</h2>

        {(!recent || recent.length === 0) && (
          <Card className="p-6 text-center text-sm text-muted">Belum ada data.</Card>
        )}

        {/* Mobile: stacked cards */}
        {recent && recent.length > 0 && (
          <div className="flex flex-col gap-2 sm:hidden">
            {recent.map((row) => (
              <Card key={row.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{row.nama}</p>
                  <p className="shrink-0 text-xs text-muted">
                    {new Date(row.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <p className="mt-1 font-mono text-xs text-muted">{row.nomor_induk}</p>
                <p className="mt-1 text-xs text-muted">
                  {row.tanggal_lahir} &middot; {row.jenis_kejahatan ?? "–"}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Desktop: table */}
        {recent && recent.length > 0 && (
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-black/[.03] dark:bg-white/[.06]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Nama</th>
                  <th className="px-4 py-2.5 font-medium">Nomor Induk</th>
                  <th className="px-4 py-2.5 font-medium">Tanggal Lahir</th>
                  <th className="px-4 py-2.5 font-medium">Jenis Kejahatan</th>
                  <th className="px-4 py-2.5 font-medium">Ditambahkan</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-4 py-2.5">{row.nama}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.nomor_induk}</td>
                    <td className="px-4 py-2.5">{row.tanggal_lahir}</td>
                    <td className="px-4 py-2.5">{row.jenis_kejahatan ?? "–"}</td>
                    <td className="px-4 py-2.5 text-muted">
                      {new Date(row.created_at).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  );
}
