"use client";

import { useActionState, useState } from "react";
import { signIn, type LoginState } from "./actions";
import { Button, Card } from "@/components/ui";
import { TextField } from "@/components/fields";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [email, setEmail] = useState("");

  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {state?.error && (
          <p role="alert" className="text-sm text-red-500">
            {state.error}
          </p>
        )}
        <Button type="submit" disabled={pending} className="mt-1 w-full">
          {pending ? "Masuk…" : "Masuk"}
        </Button>
      </form>
    </Card>
  );
}
