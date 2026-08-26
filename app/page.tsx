import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden bg-grid-animated relative">
      {/* ── Top Navigation ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 h-20 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)] transform hover:rotate-6 transition-transform">
            <span className="text-slate-950 font-black text-xl">⚡</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Invoice<span className="text-cyan-400">Tracker</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
            href="#faq"
          >
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors duration-200 px-3 py-2"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 shadow-[0_0_25px_rgba(0,243,255,0.45)] transition-all duration-200 animate-pulse-glow"
            href="/signup"
          >
            Get Started Free →
          </Link>
        </div>
      </nav>

      {/* ── Hero Section (Kinetic Seesaw & Supahero Motion) ── */}
      <header className="relative w-full pt-16 sm:pt-24 pb-28 overflow-hidden bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16] px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Ambient Neon Motion Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[130px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none animate-float-reverse" />

        <div className="w-full text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(0,243,255,0.25)] animate-float-slow">
            <span>⚡</span> Automated Payment Reminders in ₹ INR
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 max-w-6xl mx-auto leading-tight tracking-tight">
            Get Paid Faster with{" "}
            <span className="gradient-text-animated">
              Kinetic Invoice Tracking.
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            The ultra-fast tool for freelancers and small businesses to monitor client receivables in ₹ INR, send hands-free email reminders, and eliminate overdue accounts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,243,255,0.5)] flex items-center gap-3 w-full sm:w-auto justify-center hover:scale-105"
              href="/signup"
            >
              Start Free Today
              <span className="text-xl font-black">→</span>
            </Link>
            <a
              className="bg-slate-900/90 border border-slate-700 text-slate-200 font-semibold text-base px-8 py-4 rounded-2xl hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all duration-300 w-full sm:w-auto justify-center text-center backdrop-blur-md hover:scale-105"
              href="#how-it-works"
            >
              See How It Works
            </a>
          </div>

          {/* ── Seesaw/Supahero Interactive Dashboard Showcase ── */}
          <div className="relative w-full rounded-3xl border border-cyan-500/40 bg-slate-900/90 shadow-[0_0_80px_rgba(0,243,255,0.2)] backdrop-blur-2xl overflow-hidden transform hover:scale-[1.008] transition-all duration-300">
            {/* macOS Browser Chrome */}
            <div className="h-12 bg-slate-950/90 border-b border-slate-800 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500/90 shadow-[0_0_8px_#f43f5e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/90 shadow-[0_0_8px_#f59e0b]" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 shadow-[0_0_8px_#10b981]" />
                <span className="ml-3 text-xs font-mono text-slate-400">invoice.techpick.tech/dashboard</span>
              </div>
              <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                LIVE PREVIEW
              </div>
            </div>

            {/* Showcase Widgets */}
            <div className="p-6 sm:p-10 bg-[#090d16]/80 text-left">
              {/* Metrics Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Widget 1 */}
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/40 shadow-[0_0_25px_rgba(0,243,255,0.15)] animate-float-slow">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Total Outstanding
                  </p>
                  <p className="text-4xl font-extrabold text-white">₹ 45,000.00</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
                    <span>📈</span> 3 active clients
                  </p>
                </div>
                {/* Widget 2 */}
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.15)] animate-float-reverse">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                    Overdue Balance
                  </p>
                  <p className="text-4xl font-extrabold text-rose-400">₹ 12,000.00</p>
                  <p className="text-xs font-semibold text-rose-400 mt-2 flex items-center gap-1">
                    <span>⚠️</span> XYZ Studio (Feb 10)
                  </p>
                </div>
                {/* Widget 3 */}
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Cleared This Month
                  </p>
                  <p className="text-4xl font-extrabold text-emerald-400">₹ 82,000.00</p>
                  <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
                    <span>✅</span> 8 invoices paid
                  </p>
                </div>
              </div>

              {/* Mock Table */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-cyan-400 font-semibold uppercase">
                      <th className="p-3">ID</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    <tr className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-mono text-cyan-300 font-bold">#101</td>
                      <td className="p-3 font-medium text-white">Acme Corp</td>
                      <td className="p-3 font-bold text-white">₹ 15,000.00</td>
                      <td className="p-3 text-slate-400">Feb 15, 2026</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">UNPAID</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">✓ Mark Paid</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-mono text-cyan-300 font-bold">#102</td>
                      <td className="p-3 font-medium text-white">XYZ Studio</td>
                      <td className="p-3 font-bold text-white">₹ 12,000.00</td>
                      <td className="p-3 text-slate-400">Feb 10, 2026</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">OVERDUE</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">Log Follow-up</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-mono text-cyan-300 font-bold">#103</td>
                      <td className="p-3 font-medium text-white">TechStart</td>
                      <td className="p-3 font-bold text-white">₹ 18,000.00</td>
                      <td className="p-3 text-slate-400">Feb 20, 2026</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">PARTIAL</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">Edit</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Supahero Style Feature Grid Section ──────────────── */}
      <section className="py-28 bg-[#090d16] relative border-t border-slate-800/80 px-4 sm:px-8 md:px-12 lg:px-16" id="features">
        <div className="w-full">
          <div className="text-center mb-20">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-full">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight">
              Designed for Speed. Built for Cash Flow.
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto">
              Everything freelancers need to stay organized and get paid on time, without the bloat of traditional accounting tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 rounded-3xl border border-slate-800 glass-card-hover group">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/40 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.25)] text-3xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                1-Click Invoice Tracking
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add invoices in under 30 seconds with client names, exact amounts in ₹ INR, and due dates. Real-time Total Owed metrics update automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 rounded-3xl border border-slate-800 glass-card-hover group">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/40 rounded-2xl flex items-center justify-center mb-6 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)] text-3xl group-hover:scale-110 transition-transform">
                🔔
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Automated Email Reminders
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Hands-free email reminders sent before due dates, on due dates, and for overdue invoices from your verified domain <code>reminders@techpick.tech</code>.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 rounded-3xl border border-slate-800 glass-card-hover group">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-3xl group-hover:scale-110 transition-transform">
                🔕
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Smart Follow-up Pause
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Click <strong>Log Follow-up</strong> whenever you contact a client personally. The app automatically pauses auto-emails for 3 days so clients aren&apos;t spammed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Kinetic Workflow ────────────────────── */}
      <section className="py-24 bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-8 md:px-12 lg:px-16" id="how-it-works">
        <div className="w-full text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-full">
            SIMPLE WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-16 tracking-tight">
            How It Works in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-left relative">
              <span className="text-5xl font-black text-cyan-500/20 absolute top-6 right-6">01</span>
              <h4 className="text-xl font-bold text-white mb-2">Create Account & Invoice</h4>
              <p className="text-sm text-slate-400">Takes 30 seconds. Enter who owes you money, the amount in ₹, and the due date.</p>
            </div>

            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-left relative">
              <span className="text-5xl font-black text-cyan-500/20 absolute top-6 right-6">02</span>
              <h4 className="text-xl font-bold text-white mb-2">Auto-Reminders Sent</h4>
              <p className="text-sm text-slate-400">Polite reminder emails are dispatched automatically before due dates and on due dates.</p>
            </div>

            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-left relative">
              <span className="text-5xl font-black text-cyan-500/20 absolute top-6 right-6">03</span>
              <h4 className="text-xl font-bold text-white mb-2">1-Click Mark as Paid</h4>
              <p className="text-sm text-slate-400">When payment arrives, click <strong>Mark as Paid</strong> to clear the invoice from your total immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────── */}
      <section className="py-24 bg-[#090d16] border-t border-slate-800/80 px-4 sm:px-8 md:px-12 lg:px-16" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">Everything you need to know about Invoice Tracker.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2">Do my clients need to create an account?</h3>
              <p className="text-sm text-slate-400">No! Your clients receive clean, professional email reminder notifications directly in their email inbox with your invoice details and payment instructions.</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2">Is the currency strictly formatted in ₹ INR?</h3>
              <p className="text-sm text-slate-400">Yes! Invoice Tracker is tailored for Indian freelancers, agencies, and small businesses with full ₹ INR formatting across all dashboard metrics.</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2">Can I send a test email to verify delivery?</h3>
              <p className="text-sm text-slate-400">Yes! Open <strong>Settings</strong> on your dashboard anytime to type any test email address and click <strong>Send Test Email</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Kinetic CTA Banner ────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-purple-950/60 p-10 sm:p-16 text-center backdrop-blur-xl shadow-[0_0_60px_rgba(0,243,255,0.2)]">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Ready to Stop Chasing Client Payments?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join freelancers and businesses getting paid faster with automated invoice tracking.
          </p>
          <Link
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 px-8 py-4 text-base sm:text-lg font-extrabold text-slate-950 hover:brightness-110 shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all hover:scale-105"
            href="/signup"
          >
            Get Started Free
            <span className="text-xl font-black">→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="w-full py-12 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-800 bg-[#090d16]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,243,255,0.4)]">
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
          <Link className="hover:text-cyan-400 transition-colors" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-cyan-400 transition-colors" href="/terms">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
