"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setLoading(false);
      setError("Invalid password. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
        Password
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-950 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
