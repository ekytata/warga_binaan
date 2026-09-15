"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-medium text-black/70 dark:text-white/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-white/5 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-xs font-medium text-black/70 dark:text-white/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-white/5 dark:text-white"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-red-500">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {pending ? "Masuk…" : "Masuk"}
      </button>
    </form>
  );
}
