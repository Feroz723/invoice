"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type RegisterState } from "./actions";

const initialRegisterState: RegisterState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    register,
    initialRegisterState
  );
  const errors = state.errors;

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
          aria-invalid={Boolean(errors?.email)}
          aria-describedby={errors?.email ? "email-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
        />
        {errors?.email ? (
          <p id="email-error" className="mt-1 text-xs text-rose-400">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          aria-invalid={Boolean(errors?.password)}
          aria-describedby={errors?.password ? "password-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
        />
        {errors?.password ? (
          <p id="password-error" className="mt-1 text-xs text-rose-400">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repeat password"
          aria-invalid={Boolean(errors?.confirmPassword)}
          aria-describedby={errors?.confirmPassword ? "confirm-password-error" : undefined}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
        />
        {errors?.confirmPassword ? (
          <p id="confirm-password-error" className="mt-1 text-xs text-rose-400">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 py-3 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 transition-all duration-200"
      >
        {isPending ? "Creating account…" : "Create Account"}
      </button>

      <p className="pt-2 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
