"use client";

import { useEffect, useState } from "react";
import { createInvoice, updateInvoice } from "@/lib/actions/invoices";
import type { SerializableInvoice } from "@/lib/invoices";

type Props = {
  invoice?: SerializableInvoice;
  onClose: () => void;
  onSaved: () => void;
};

const AMOUNT_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cyan-400";

export function InvoiceForm({ invoice, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const clientName = String(data.get("clientName") ?? "").trim();
    const clientEmail = String(data.get("clientEmail") ?? "").trim();
    const invoiceAmount = String(data.get("invoiceAmount") ?? "").trim();
    const dueDate = String(data.get("dueDate") ?? "");
    const status = String(data.get("status") ?? "");
    const notes = String(data.get("notes") ?? "");

    if (!clientName) {
      setError("Client name is required.");
      return;
    }
    if (!clientEmail) {
      setError("Client email is required.");
      return;
    }
    if (!AMOUNT_PATTERN.test(invoiceAmount)) {
      setError("Enter a valid positive amount with up to 2 decimal places.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    setPending(true);
    try {
      const result = invoice
        ? await updateInvoice({
            invoiceId: invoice.invoiceId,
            clientName,
            clientEmail,
            invoiceAmount,
            dueDate,
            status,
            notes,
          })
        : await createInvoice({
            clientName,
            clientEmail,
            invoiceAmount,
            dueDate,
            status,
            notes,
          });

      if (result.ok) {
        onSaved();
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
      aria-labelledby="invoice-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-[0_0_40px_rgba(0,243,255,0.15)] text-slate-100">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f3ff]" />
              <h2 id="invoice-form-title" className="text-lg font-bold text-white tracking-wide">
                {invoice ? `Edit Invoice #${invoice.invoiceId}` : "Add New Invoice"}
              </h2>
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

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="clientName" className={labelClass}>
                Client Name
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                defaultValue={invoice?.clientName}
                maxLength={120}
                autoComplete="off"
                placeholder="Acme Corp"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="clientEmail" className={labelClass}>
                Client Email
              </label>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                defaultValue={invoice?.clientEmail ?? ""}
                maxLength={254}
                autoComplete="email"
                placeholder="billing@client.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="invoiceAmount" className={labelClass}>
                Invoice Amount (₹)
              </label>
              <input
                id="invoiceAmount"
                name="invoiceAmount"
                type="text"
                inputMode="decimal"
                pattern="\d+(\.\d{1,2})?"
                title="Positive number with up to 2 decimal places"
                placeholder="15000 or 15000.50"
                defaultValue={invoice?.invoiceAmount}
                autoComplete="off"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dueDate" className={labelClass}>
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  defaultValue={invoice?.dueDate.slice(0, 10)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="status" className={labelClass}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={invoice?.status ?? "UNPAID"}
                  className={`${inputClass} bg-slate-950 text-slate-100`}
                >
                  <option value="UNPAID">UNPAID</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PAID">PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className={labelClass}>
                Notes <span className="font-normal opacity-60">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="Add any additional notes..."
                defaultValue={invoice?.notes ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 transition-all duration-200"
            >
              {pending
                ? "Saving…"
                : invoice
                  ? "Save Changes"
                  : "Save Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
