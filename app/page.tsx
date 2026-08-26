import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* ── Top Navigation ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            <span className="text-slate-950 font-black text-lg">⚡</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Invoice<span className="text-cyan-400">Tracker</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors duration-200"
            href="#features"
          >
            Features
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors duration-200 px-3 py-2"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-200"
            href="/signup"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <header className="relative w-full pt-20 pb-28 overflow-hidden bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16] px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            <span>✨</span> Next-Gen Invoice Tracking
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 max-w-5xl mx-auto leading-tight tracking-tight">
            Get Paid Faster with{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Simple Invoice Tracking.
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            The clean, high-speed tool for freelancers and small businesses to track client
            invoices, monitor payments in ₹ INR, and eliminate overdue accounts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-bold text-base px-8 py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(0,243,255,0.45)] flex items-center gap-2 w-full sm:w-auto justify-center"
              href="/signup"
            >
              Start Free Trial
              <span className="text-lg">→</span>
            </Link>
            <a
              className="bg-slate-900/90 border border-slate-700 text-slate-200 font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-slate-800 hover:border-slate-500 hover:text-white transition-all duration-200 w-full sm:w-auto justify-center text-center backdrop-blur-md"
              href="#features"
            >
              See How It Works
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="relative w-full rounded-2xl border border-cyan-500/30 bg-slate-900/90 shadow-[0_0_60px_rgba(0,243,255,0.15)] backdrop-blur-xl overflow-hidden transform hover:scale-[1.005] transition-transform duration-300">
            <div className="h-11 bg-slate-950/90 border-b border-slate-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_6px_#f43f5e]" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_6px_#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_6px_#10b981]" />
              <span className="ml-2 text-xs font-mono text-slate-500">dashboard.invoicetracker.app</span>
            </div>
            <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#090d16]/70">
              {/* Widget 1 */}
              <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,243,255,0.1)] text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                  Total Outstanding
                </p>
                <p className="text-3xl font-extrabold text-white">₹ 45,000</p>
                <p className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
                  <span>📈</span> +12% this month
                </p>
              </div>
              {/* Widget 2 */}
              <div className="bg-slate-900 p-6 rounded-xl border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)] text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
                  Overdue
                </p>
                <p className="text-3xl font-extrabold text-rose-400">₹ 12,000</p>
                <p className="text-xs font-medium text-rose-400 mt-2 flex items-center gap-1">
                  <span>⚠️</span> 1 invoice needs attention
                </p>
              </div>
              {/* Widget 3 */}
              <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                  Paid Last 30 Days
                </p>
                <p className="text-3xl font-extrabold text-emerald-400">
                  ₹ 82,000
                </p>
                <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
                  <span>✅</span> 8 invoices cleared
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features Section ────────────────────────────────── */}
      <section className="py-24 bg-[#090d16] relative border-t border-slate-800/80 px-4 sm:px-8 md:px-12 lg:px-16" id="features">
        <div className="w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Everything You Need. Nothing You Don&apos;t.
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto">
              Designed for clarity and speed. Manage your receivables without
              the bloat of complex accounting software.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/40 shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] group">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)] text-2xl group-hover:scale-110 transition-transform">
                ➕
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Effortless Management
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add invoices quickly with client names, precise amounts in INR
                ₹, and clear due dates. Keep your records pristine and easily
                searchable.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/40 shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group">
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center mb-6 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-2xl group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Smart Dashboard
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Monitor Unpaid, Partial, and Paid statuses at a glance. Visual
                indicators help you prioritize follow-ups and cash flow
                forecasting.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-2xl group-hover:scale-110 transition-transform">
                🔔
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Auto-Reminders
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Set it and forget it. Automatic, polite email follow-ups are
                sent before due dates and immediately for overdue
                invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="w-full py-12 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-800 bg-[#090d16]">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(0,243,255,0.4)]">
            <span className="text-slate-950 font-black text-xs">⚡</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Invoice<span className="text-cyan-400">Tracker</span>
          </span>
        </div>
        <p className="text-xs text-slate-400">
          &copy; 2026 Invoice Tracker. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-slate-400">
          <Link
            className="hover:text-cyan-400 transition-colors duration-200"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:text-cyan-400 transition-colors duration-200"
            href="/terms"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
