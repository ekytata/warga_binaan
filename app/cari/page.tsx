import { SearchForm } from "./SearchForm";

export const metadata = {
  title: "Cari Data Warga Binaan",
};

export default function CariPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-6 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Cari Data Warga Binaan</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Masukkan nomor induk dan tanggal lahir untuk melihat data.
        </p>
      </div>
      <SearchForm />
    </div>
  );
}
