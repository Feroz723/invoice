import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getInvoices } from "@/lib/invoices";
import { formatINR, fromPaise, toPaise } from "@/lib/format";
import { signOutAction } from "./actions";
import { InvoiceSection } from "./invoice-section";

export const metadata: Metadata = {
  title: "Dashboard — Invoice Tracker",
};

const OWED_STATUSES = new Set(["UNPAID", "PARTIAL", "OVERDUE"]);

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const user = session.user;

  const invoices = await getInvoices();
  if (!invoices) {
    redirect("/login");
  }

  let owedPaise = 0n;
  let outstandingCount = 0;
  let paidCount = 0;
  for (const invoice of invoices) {
    if (OWED_STATUSES.has(invoice.status)) {
      outstandingCount++;
      owedPaise += toPaise(invoice.invoiceAmount);
    } else {
      paidCount++;
    }
  }

  const sorted = [...invoices].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate)
  );

  const metrics = [
    {
      label: "Total Owed",
      value: formatINR(fromPaise(owedPaise)),
      accent: "text-cyan-400 border-cyan-500/30 shadow-[0_0_25px_rgba(0,243,255,0.15)]",
    },
    {
      label: "Outstanding Invoices",
      value: String(outstandingCount),
      accent: "text-purple-400 border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)]",
    },
    {
      label: "Paid Invoices",
      value: String(paidCount),
      accent: "text-emerald-400 border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3.5 backdrop-blur-md sm:px-8 md:px-12">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,243,255,0.5)] group-hover:scale-105 transition-transform">
            <span className="text-slate-950 font-black text-sm">⚡</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            Invoice<span className="text-cyan-400">Tracker</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-slate-300 sm:inline">
            {user.name ?? user.email}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white transition-all"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="w-full px-4 py-8 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/60 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 sm:text-sm">
              Signed in as <span className="text-cyan-300 font-medium">{user.email}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-xl border bg-slate-900/90 p-6 backdrop-blur-md transition-all duration-200 hover:scale-[1.01] ${metric.accent}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <InvoiceSection invoices={sorted} userEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
