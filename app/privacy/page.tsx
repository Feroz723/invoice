import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Invoice Tracker",
  description: "Privacy Policy for Invoice Tracker platform.",
};

export default function PrivacyPage() {
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

      {/* ── Privacy Content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-xs font-mono text-cyan-400 mb-8">Last Updated: August 27, 2026</p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you use <strong>Invoice Tracker</strong>, we collect personal information required to deliver our invoice management service:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Account Credentials:</strong> Email address and encrypted password hashes.</li>
              <li><strong>Invoice Data:</strong> Client names, client emails, invoice amounts in ₹ INR, due dates, and notes.</li>
              <li><strong>System Logs:</strong> Automated reminder timestamps and logs for security auditing.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Data</h2>
            <p>Your data is strictly used for:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Calculating your real-time total outstanding balances in ₹ INR.</li>
              <li>Sending automated payment reminder emails to specified clients on your behalf.</li>
              <li>Maintaining secure session state and account authentication.</li>
            </ul>
            <p className="mt-3 text-slate-400">
              We <strong>never sell, rent, or monetize</strong> your client records or financial data.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">3. Data Security & Storage</h2>
            <p>
              All passwords are cryptographically hashed using <code>bcrypt</code> before database storage. Database connections are encrypted in transit via SSL/TLS. Automated emails are transmitted securely via Resend API.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-3">4. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, reach out to us at{" "}
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
