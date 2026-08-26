"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate, type LoginState } from "./actions";

const initialLoginState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialLoginState
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 py-3 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 transition-all duration-200"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>

      <p className="pt-2 text-center text-xs text-slate-400">
        New here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
