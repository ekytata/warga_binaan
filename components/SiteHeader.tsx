import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Data WBP
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/cari"
            className="rounded-full px-3 py-1.5 text-foreground/80 transition-colors hover:bg-black/[.04] hover:text-foreground dark:hover:bg-white/[.06]"
          >
            Cari Data
          </Link>
          <Link
            href="/admin"
            className="rounded-full px-3 py-1.5 text-foreground/80 transition-colors hover:bg-black/[.04] hover:text-foreground dark:hover:bg-white/[.06]"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
