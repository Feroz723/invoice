"use client";

import { useEffect, useState } from "react";
import { signOutAction } from "./actions";
import { sendTestEmailAction } from "@/lib/actions/reminders";

type Props = {
  userEmail: string;
  onClose: () => void;
};

export function SettingsModal({ userEmail, onClose }: Props) {
  const [reminderFreq, setReminderFreq] = useState("every_2_days");
  const [customTargetEmail, setCustomTargetEmail] = useState(
    userEmail || "ferozferoz1363@gmail.com"
  );
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSendTestEmail() {
    setTestSending(true);
    setTestResult(null);
    try {
      const result = await sendTestEmailAction(customTargetEmail);
      setTestResult(result);
    } catch (err) {
      setTestResult({ ok: false, message: `Failed: ${String(err)}` });
    } finally {
      setTestSending(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-[0_0_40px_rgba(0,243,255,0.15)] text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 id="settings-title" className="text-lg font-bold text-white">
              Settings & Preferences
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

        <div className="mt-5 space-y-5">
          {/* User Account Info */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Account Email
            </label>
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-slate-200">
              {userEmail}
            </div>
          </div>

          {/* Currency Preference */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Currency
            </label>
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-cyan-300 flex items-center justify-between">
              <span>Indian Rupee (₹ INR)</span>
              <span className="text-xs font-bold text-slate-500">DEFAULT</span>
            </div>
          </div>

          {/* Reminder Frequency */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Reminder Frequency
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-3 hover:border-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="reminderFreq"
                  value="every_2_days"
                  checked={reminderFreq === "every_2_days"}
                  onChange={(e) => setReminderFreq(e.target.value)}
                  className="accent-cyan-400"
                />
                <div className="text-xs">
                  <p className="font-semibold text-white">Every 2 Days (Recommended)</p>
                  <p className="text-slate-400">Polite automated email follow-ups</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-3 hover:border-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="reminderFreq"
                  value="every_1_day"
                  checked={reminderFreq === "every_1_day"}
                  onChange={(e) => setReminderFreq(e.target.value)}
                  className="accent-cyan-400"
                />
                <div className="text-xs">
                  <p className="font-semibold text-white">Daily (High Urgency)</p>
                  <p className="text-slate-400">Escalated daily reminder notifications</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-3 hover:border-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="reminderFreq"
                  value="disabled"
                  checked={reminderFreq === "disabled"}
                  onChange={(e) => setReminderFreq(e.target.value)}
                  className="accent-cyan-400"
                />
                <div className="text-xs">
                  <p className="font-semibold text-white">No Reminders</p>
                  <p className="text-slate-400">Turn off automated reminder emails</p>
                </div>
              </label>
            </div>
          </div>

          {/* Test Email Section */}
          <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Email Testing</p>
              <p className="text-xs text-slate-400 mt-0.5">Send a test payment reminder to any email address</p>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                value={customTargetEmail}
                onChange={(e) => setCustomTargetEmail(e.target.value)}
                placeholder="ferozferoz1363@gmail.com"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testSending}
                className="rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(0,243,255,0.3)]"
              >
                {testSending ? "Sending…" : "✉️ Send Email"}
              </button>
            </div>

            {testResult ? (
              <p
                className={`text-xs p-2 rounded-lg border ${
                  testResult.ok
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                }`}
              >
                {testResult.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              Log Out
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 px-5 py-2 text-sm font-bold text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
