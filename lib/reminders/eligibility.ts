import { normalizeClientEmail } from "@/lib/email-validation";
import { calendarDate } from "@/lib/overdue";
import {
  FOLLOW_UP_SUPPRESS_DAYS,
  REMINDER_DAYS_BEFORE_DUE,
  REMINDER_RESEND_SUPPRESS_DAYS,
} from "./config";

export type ReminderKind = "UPCOMING" | "OVERDUE";

export type ReminderEvaluationReason =
  | "STATUS_NOT_ELIGIBLE"
  | "NOT_TIMELY"
  | "RECENT_FOLLOW_UP"
  | "RECENT_REMINDER"
  | "INVALID_RECIPIENT_EMAIL";

export type ReminderInvoiceInput = {
  invoiceId: number;
  clientName: string;
  clientEmail: string | null;
  invoiceAmount: string;
  dueDate: string;
  status: string;
  lastFollowUp: string | null;
  lastReminderSentAt: string | null;
};

export type ReminderEvaluation = {
  businessEligible: boolean;
  kind?: ReminderKind;
  hasRecipient: boolean;
  recipientEmail?: string;
  reason?: ReminderEvaluationReason;
};

const ELIGIBLE_STATUSES = new Set(["UNPAID", "PARTIAL", "OVERDUE"]);

function dayDifference(fromDate: string, toDate: string): number {
  return Math.round(
    (Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) /
      86_400_000
  );
}

function isWithinCalendarDays(
  pastDate: string,
  today: Date,
  windowDays: number
): boolean {
  const pastKey = calendarDate(new Date(pastDate));
  return (
    dayDifference(pastKey, calendarDate(today)) >= 0 &&
    dayDifference(pastKey, calendarDate(today)) <= windowDays
  );
}

export function evaluateReminder(
  invoice: ReminderInvoiceInput,
  today: Date = new Date()
): ReminderEvaluation {
  const todayKey = calendarDate(today);
  const dueKey = calendarDate(new Date(invoice.dueDate));

  let businessEligible = false;
  let kind: ReminderKind | undefined;
  let reason: ReminderEvaluationReason | undefined;

  if (!ELIGIBLE_STATUSES.has(invoice.status)) {
    reason = "STATUS_NOT_ELIGIBLE";
  } else if (invoice.status === "OVERDUE" && dueKey < todayKey) {
    businessEligible = true;
    kind = "OVERDUE";
  } else if (
    (invoice.status === "UNPAID" || invoice.status === "PARTIAL") &&
    dueKey >= todayKey &&
    dayDifference(todayKey, dueKey) <= REMINDER_DAYS_BEFORE_DUE
  ) {
    businessEligible = true;
    kind = "UPCOMING";
  } else {
    reason = "NOT_TIMELY";
  }

  if (
    businessEligible &&
    invoice.lastReminderSentAt &&
    isWithinCalendarDays(invoice.lastReminderSentAt, today, REMINDER_RESEND_SUPPRESS_DAYS)
  ) {
    businessEligible = false;
    kind = undefined;
    reason = "RECENT_REMINDER";
  }

  if (
    businessEligible &&
    invoice.lastFollowUp &&
    isWithinCalendarDays(invoice.lastFollowUp, today, FOLLOW_UP_SUPPRESS_DAYS)
  ) {
    businessEligible = false;
    kind = undefined;
    reason = "RECENT_FOLLOW_UP";
  }

  const recipientResult =
    invoice.clientEmail == null
      ? { ok: false as const }
      : normalizeClientEmail(invoice.clientEmail);
  const hasRecipient = recipientResult.ok;

  return {
    businessEligible,
    kind,
    hasRecipient,
    recipientEmail: recipientResult.ok ? recipientResult.email : undefined,
    reason:
      !recipientResult.ok && recipientEmailInvalid(invoice.clientEmail)
        ? "INVALID_RECIPIENT_EMAIL"
        : reason,
  };
}

function recipientEmailInvalid(clientEmail: string | null): boolean {
  if (clientEmail == null) {
    return false;
  }
  return !normalizeClientEmail(clientEmail).ok && clientEmail.trim().length > 0;
}
