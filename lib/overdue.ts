import type { InvoiceStatus } from "@prisma/client";

export const BUSINESS_TIME_ZONE = "Asia/Kolkata";
const BUSINESS_UTC_OFFSET = "+05:30";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function calendarDate(date: Date): string {
  return dateFormatter.format(date);
}

export function startOfToday(): Date {
  return new Date(`${calendarDate(new Date())}T00:00:00${BUSINESS_UTC_OFFSET}`);
}

export function isOverdue(
  dueDate: Date,
  status: InvoiceStatus | string,
  reference: Date = new Date()
): boolean {
  if (status === "PAID") {
    return false;
  }
  return calendarDate(dueDate) < calendarDate(reference);
}
