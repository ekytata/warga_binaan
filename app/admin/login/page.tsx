import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Login Admin",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Login Admin</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Data Warga Binaan Pemasyarakatan
        </p>
      </div>
      <LoginForm next={next && next.startsWith("/admin") ? next : "/admin"} />
    </div>
  );
}
