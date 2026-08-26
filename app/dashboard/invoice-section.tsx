"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteInvoice,
  logFollowUp,
  markAsPaid,
  markPartial,
} from "@/lib/actions/invoices";
import type { SerializableInvoice } from "@/lib/invoices";
import { formatDate, formatINR } from "@/lib/format";
import { InvoiceForm } from "./invoice-form";
import { StatusBadge } from "./status-badge";
import { SettingsModal } from "./settings-modal";

const thClass =
  "whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-cyan-400";
const tdClass = "px-4 py-4 align-middle text-sm text-slate-200";

type FilterStatus = "ALL" | "UNPAID" | "PARTIAL" | "OVERDUE" | "PAID";
type SortOption = "DUE_DATE" | "HIGHEST_AMOUNT" | "CLIENT_NAME";

export function InvoiceSection({
  invoices,
  userEmail,
}: {
  invoices: SerializableInvoice[];
  userEmail?: string;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState<SerializableInvoice | null>(null);
  const [deleting, setDeleting] = useState<SerializableInvoice | null>(null);
  const [actionModalInvoice, setActionModalInvoice] =
    useState<SerializableInvoice | null>(null);

  const [filter, setFilter] = useState<FilterStatus>("UNPAID");
  const [sortBy, setSortBy] = useState<SortOption>("DUE_DATE");

  const [followUpPendingId, setFollowUpPendingId] = useState<number | null>(
    null
  );
  const [followUpError, setFollowUpError] = useState<{
    invoiceId: number;
    message: string;
  } | null>(null);

  // Status counts for filter tabs
  const counts = {
    ALL: invoices.length,
    UNPAID: invoices.filter((i) => i.status === "UNPAID").length,
    PARTIAL: invoices.filter((i) => i.status === "PARTIAL").length,
    OVERDUE: invoices.filter((i) => i.status === "OVERDUE").length,
    PAID: invoices.filter((i) => i.status === "PAID").length,
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (filter === "ALL") return true;
    return inv.status === filter;
  });

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === "HIGHEST_AMOUNT") {
      return Number(b.invoiceAmount) - Number(a.invoiceAmount);
    }
    if (sortBy === "CLIENT_NAME") {
      return a.clientName.localeCompare(b.clientName);
    }
    // Default: Due Date
    return a.dueDate.localeCompare(b.dueDate);
  });

  async function handleLogFollowUp(invoice: SerializableInvoice) {
    setFollowUpPendingId(invoice.invoiceId);
    setFollowUpError(null);
    try {
      const result = await logFollowUp(invoice.invoiceId);
      if (result.ok) {
        router.refresh();
      } else {
        setFollowUpError({
          invoiceId: invoice.invoiceId,
          message: result.error,
        });
      }
    } catch {
      setFollowUpError({
        invoiceId: invoice.invoiceId,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setFollowUpPendingId(null);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(invoice: SerializableInvoice) {
    setEditing(invoice);
    setFormOpen(true);
    setActionModalInvoice(null);
  }

  return (
    <section className="mt-8 w-full">
      {/* ── Top Section Header & Actions ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2 sm:text-2xl">
            Invoices
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {filteredInvoices.length} visible
            </span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white transition-all shadow-md"
          >
            <span>⚙️</span> Settings
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-200"
          >
            <span className="text-base font-black">+</span> Add Invoice
          </button>
        </div>
      </div>

      {/* ── Step 8: Filters & Sorting Bar ── */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(["ALL", "UNPAID", "PARTIAL", "OVERDUE", "PAID"] as FilterStatus[]).map(
            (statusKey) => {
              const active = filter === statusKey;
              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => setFilter(statusKey)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]"
                      : "border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {statusKey === "ALL" ? "Show All" : statusKey}{" "}
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                      active ? "bg-slate-950/30 text-slate-950" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {counts[statusKey]}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-cyan-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="DUE_DATE">Due Date (Earliest First)</option>
            <option value="HIGHEST_AMOUNT">Highest Amount</option>
            <option value="CLIENT_NAME">Client Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ── Invoice Table / Empty State ── */}
      {sortedInvoices.length === 0 ? (
        <div className="mt-6 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)] text-3xl">
            📑
          </div>
          <p className="text-lg font-semibold text-white">No invoices found</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
            {filter === "ALL"
              ? "Add your first invoice to start tracking who owes you what in real time."
              : `No invoices matching status "${filter}".`}
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-200"
          >
            <span className="text-base font-black">+</span> Add New Invoice
          </button>
        </div>
      ) : (
        <div className="mt-6 w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/90">
                <th scope="col" className={thClass}>ID</th>
                <th scope="col" className={thClass}>Client Name</th>
                <th scope="col" className={thClass}>Amount</th>
                <th scope="col" className={thClass}>Due Date</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={thClass}>Last Follow-up</th>
                <th scope="col" className={thClass}>Notes</th>
                <th scope="col" className={thClass}>Created</th>
                <th scope="col" className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedInvoices.map((invoice) => (
                <tr
                  key={invoice.invoiceId}
                  onClick={() => setActionModalInvoice(invoice)}
                  className="transition-colors hover:bg-slate-800/40 cursor-pointer group"
                >
                  <td className={`${tdClass} font-mono font-semibold text-cyan-300`}>
                    #{invoice.invoiceId}
                  </td>
                  <td className={tdClass}>
                    <div className="whitespace-nowrap font-medium text-white group-hover:text-cyan-300 transition-colors">
                      {invoice.clientName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {invoice.clientEmail ?? "—"}
                    </div>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap font-bold tabular-nums text-white`}>
                    {formatINR(invoice.invoiceAmount)}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-slate-300`}>
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className={tdClass}>
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-slate-400`}>
                    {formatDate(invoice.lastFollowUp)}
                  </td>
                  <td
                    className={`${tdClass} max-w-[240px] truncate text-slate-400`}
                    title={invoice.notes ?? undefined}
                  >
                    {invoice.notes ?? "—"}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-slate-400`}>
                    {formatDate(invoice.createdAt)}
                  </td>
                  <td
                    className={`${tdClass} text-right`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(invoice)}
                        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLogFollowUp(invoice)}
                        disabled={followUpPendingId === invoice.invoiceId}
                        aria-busy={followUpPendingId === invoice.invoiceId}
                        className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 disabled:opacity-50 transition-all"
                      >
                        {followUpPendingId === invoice.invoiceId
                          ? "Logging…"
                          : "Log Follow-up"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(invoice)}
                        className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                    {followUpError?.invoiceId === invoice.invoiceId ? (
                      <p
                        role="alert"
                        className="mt-1 text-xs text-rose-400 text-right"
                      >
                        {followUpError.message}
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modals & Popups ── */}
      {formOpen ? (
        <InvoiceForm
          key={editing?.invoiceId ?? "new"}
          invoice={editing ?? undefined}
          onClose={() => setFormOpen(false)}
          onSaved={() => router.refresh()}
        />
      ) : null}

      {deleting ? (
        <ConfirmDeleteDialog
          invoice={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => router.refresh()}
        />
      ) : null}

      {/* Step 6: Invoice Detail & Quick Action Popup */}
      {actionModalInvoice ? (
        <InvoiceActionPopup
          invoice={actionModalInvoice}
          onClose={() => setActionModalInvoice(null)}
          onEdit={() => openEdit(actionModalInvoice)}
          onDelete={() => {
            setDeleting(actionModalInvoice);
            setActionModalInvoice(null);
          }}
          onRefresh={() => router.refresh()}
        />
      ) : null}

      {/* Step 9: Settings Modal */}
      {settingsOpen ? (
        <SettingsModal
          userEmail={userEmail ?? ""}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
    </section>
  );
}

{/* ── Step 6: Mark as Paid & Invoice Action Popup ── */}
function InvoiceActionPopup({
  invoice,
  onClose,
  onEdit,
  onDelete,
  onRefresh,
}: {
  invoice: SerializableInvoice;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPartialInput, setShowPartialInput] = useState(false);
  const [partialNote, setPartialNote] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleMarkPaid() {
    setPending(true);
    setError(null);
    try {
      const result = await markAsPaid(invoice.invoiceId);
      if (result.ok) {
        onRefresh();
        onClose();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleMarkPartialSubmit() {
    setPending(true);
    setError(null);
    try {
      const result = await markPartial(invoice.invoiceId, partialNote);
      if (result.ok) {
        onRefresh();
        onClose();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-[0_0_40px_rgba(0,243,255,0.15)] text-slate-100">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400">
                #{invoice.invoiceId}
              </span>
              <StatusBadge status={invoice.status} />
            </div>
            <h2 id="action-popup-title" className="mt-1 text-xl font-bold text-white">
              {invoice.clientName}
            </h2>
            <p className="text-xs text-slate-400">{invoice.clientEmail ?? "No email specified"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Invoice Summary Details */}
        <div className="my-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Amount Due:</span>
            <span className="font-extrabold text-white text-lg">
              {formatINR(invoice.invoiceAmount)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Due Date:</span>
            <span className="font-semibold text-slate-200">
              {formatDate(invoice.dueDate)}
            </span>
          </div>
          {invoice.notes ? (
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Notes:</span> {invoice.notes}
            </div>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400"
          >
            {error}
          </p>
        ) : null}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {invoice.status !== "PAID" ? (
            <button
              type="button"
              onClick={handleMarkPaid}
              disabled={pending}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 py-3 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all"
            >
              {pending ? "Updating…" : "✓ Mark as Paid"}
            </button>
          ) : null}

          {showPartialInput ? (
            <div className="space-y-2 border border-cyan-500/30 rounded-xl p-3 bg-slate-950">
              <input
                type="text"
                value={partialNote}
                onChange={(e) => setPartialNote(e.target.value)}
                placeholder="e.g. Received ₹5,000 partial payment"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPartialInput(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMarkPartialSubmit}
                  disabled={pending}
                  className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950"
                >
                  Save Partial
                </button>
              </div>
            </div>
          ) : invoice.status !== "PAID" && invoice.status !== "PARTIAL" ? (
            <button
              type="button"
              onClick={() => setShowPartialInput(true)}
              className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              Mark Partial Payment
            </button>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              ✏️ Edit Details
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteDialog({
  invoice,
  onClose,
  onDeleted,
}: {
  invoice: SerializableInvoice;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleDelete() {
    setError(null);
    setPending(true);
    try {
      const result = await deleteInvoice(invoice.invoiceId);
      if (result.ok) {
        onDeleted();
        onClose();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-invoice-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)] text-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-lg shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            ⚠️
          </span>
          <h2 id="delete-invoice-title" className="text-lg font-bold text-white">
            Delete invoice?
          </h2>
        </div>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          Invoice <span className="font-mono text-cyan-300">#{invoice.invoiceId}</span> for{" "}
          <span className="font-semibold text-white">{invoice.clientName}</span> (
          <span className="font-semibold text-white">{formatINR(invoice.invoiceAmount)}</span>) will be permanently deleted. This action cannot be undone.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] disabled:opacity-50 transition-all"
          >
            {pending ? "Deleting…" : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
