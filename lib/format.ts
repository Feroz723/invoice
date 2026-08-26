const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatINR(amount: string): string {
  return INR_FORMATTER.format(amount as `${number}`);
}

export function toPaise(amount: string): bigint {
  const [rupees, decimals = ""] = amount.split(".");
  const paise = (decimals + "00").slice(0, 2);
  return BigInt(rupees) * 100n + BigInt(paise);
}

export function fromPaise(total: bigint): string {
  const rupees = total / 100n;
  const paise = (total % 100n).toString().padStart(2, "0");
  return `${rupees}.${paise}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) {
    return "—";
  }
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
