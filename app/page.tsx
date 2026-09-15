import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-32 text-center dark:bg-black">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Data Warga Binaan Pemasyarakatan
        </h1>
        <p className="mt-2 max-w-md text-black/60 dark:text-white/60">
          Cari data dengan nomor induk &amp; tanggal lahir, atau masuk sebagai admin untuk menambah data.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/cari"
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Cari Data
        </Link>
        <Link
          href="/admin"
          className="flex h-12 items-center justify-center rounded-full border border-black/[.08] px-6 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Login Admin
        </Link>
      </div>
    </div>
  );
}
