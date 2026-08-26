import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Invoice Tracker",
  description: "Terms of Service for Invoice Tracker platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* ── Top Navigation ── */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            <span className="text-slate-950 font-black text-lg">⚡</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Invoice<span className="text-cyan-400">Tracker</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* ── Terms Content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
        <p className="text-xs font-mono text-cyan-400 mb-8">Last Updated: August 27, 2026</p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing <strong>Invoice Tracker</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              Invoice Tracker provides invoice tracking, financial visualization in ₹ INR, and automated email payment reminders for freelancers and business users.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">3. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to enter accurate client details for reminder processing.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">4. Limitation of Liability</h2>
            <p>
              Invoice Tracker is provided on an &quot;as is&quot; basis without warranties of any kind. We are not liable for delayed payments, client disputes, or third-party email provider outages.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">5. Modifications & Support</h2>
            <p>
              We reserve the right to update these terms at any time. For support or inquiries, contact{" "}
              <a href="mailto:support@techpick.tech" className="text-cyan-400 hover:underline">
                support@techpick.tech
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
