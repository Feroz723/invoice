const STATUS_STYLES: Record<string, string> = {
  UNPAID:
    "border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]",
  PARTIAL:
    "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.25)]",
  PAID: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]",
  OVERDUE:
    "border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.25)]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
        STATUS_STYLES[status] ?? "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "PAID"
            ? "bg-emerald-400 shadow-[0_0_5px_#10b981]"
            : status === "OVERDUE"
            ? "bg-rose-400 shadow-[0_0_5px_#f43f5e]"
            : status === "PARTIAL"
            ? "bg-cyan-400 shadow-[0_0_5px_#00f3ff]"
            : "bg-amber-400 shadow-[0_0_5px_#f59e0b]"
        }`}
      />
      {status}
    </span>
  );
}
