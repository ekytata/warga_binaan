import { LinkButton } from "@/components/ui";

const FEATURES = [
  {
    title: "Akses Cepat",
    desc: "Cukup nomor induk & tanggal lahir untuk melihat data.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 15.75 12.5 12.5m1.75-4.25a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z"
      />
    ),
  },
  {
    title: "Privasi Terjaga",
    desc: "Nomor KTP disamarkan & pencarian dibatasi anti-spam.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 2.5 3.75 5v4.6c0 4 2.7 6.9 6.25 8.4 3.55-1.5 6.25-4.4 6.25-8.4V5L10 2.5Z"
      />
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20 text-center sm:py-28">
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
          Sistem Data Pemasyarakatan
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Data Warga Binaan
            <br className="hidden sm:block" /> Pemasyarakatan
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted sm:text-base">
            Cari data dengan nomor induk &amp; tanggal lahir, atau masuk
            sebagai admin untuk menambah data.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <LinkButton href="/cari" className="w-full sm:w-auto">
            Cari Data
          </LinkButton>
          <LinkButton href="/admin" variant="secondary" className="w-full sm:w-auto">
            Login Admin
          </LinkButton>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-none bg-border sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-background p-6 sm:p-8">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              >
                {f.icon}
              </svg>
              <div>
                <h2 className="text-sm font-semibold">{f.title}</h2>
                <p className="mt-0.5 text-sm text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
