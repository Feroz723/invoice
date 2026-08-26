import { prisma } from "@/lib/prisma";
import { getInvoicesForUser } from "@/lib/invoices";
import { sendReminderEmail } from "@/lib/resend";
import { buildReminderEmail } from "@/lib/reminders/email";
import { evaluateReminder } from "@/lib/reminders/eligibility";

export type ReminderRunSummary = {
  total: number;
  eligible: number;
  sent: number;
  skipped: number;
  failed: number;
  skippedReasons: Record<string, number>;
};

export type ReminderRunResult =
  | { ok: true; summary: ReminderRunSummary }
  | { ok: false; error: string };

function recordReason(summary: ReminderRunSummary, reason: string): void {
  summary.skipped++;
  summary.skippedReasons[reason] =
    (summary.skippedReasons[reason] ?? 0) + 1;
}

export async function runRemindersForUser(
  userId: string
): Promise<ReminderRunResult> {
  const invoices = await getInvoicesForUser(userId);

  const summary: ReminderRunSummary = {
    total: invoices.length,
    eligible: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    skippedReasons: {},
  };

  for (const invoice of invoices) {
    const evaluation = evaluateReminder({
      invoiceId: invoice.invoiceId,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      invoiceAmount: invoice.invoiceAmount,
      dueDate: invoice.dueDate,
      status: invoice.status,
      lastFollowUp: invoice.lastFollowUp,
      lastReminderSentAt: invoice.lastReminderSentAt,
    });

    if (!evaluation.businessEligible) {
      recordReason(summary, evaluation.reason ?? "NOT_ELIGIBLE");
      continue;
    }
    summary.eligible++;

    if (!evaluation.hasRecipient || !evaluation.recipientEmail) {
      recordReason(summary, "MISSING_RECIPIENT_EMAIL");
      continue;
    }

    const content = buildReminderEmail({
      clientName: invoice.clientName,
      invoiceId: invoice.invoiceId,
      invoiceAmount: invoice.invoiceAmount,
      dueDate: invoice.dueDate,
      status: invoice.status,
      kind: evaluation.kind!,
    });

    const result = await sendReminderEmail({
      to: evaluation.recipientEmail,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });

    if (!result.ok) {
      summary.failed++;
      recordReason(summary, result.error);
      continue;
    }

    const stamped = await prisma.invoice.updateMany({
      where: {
        invoiceId: invoice.invoiceId,
        userId,
        lastReminderSentAt:
          invoice.lastReminderSentAt === null
            ? null
            : new Date(invoice.lastReminderSentAt),
      },
      data: { lastReminderSentAt: new Date() },
    });

    if (stamped.count === 0) {
      recordReason(summary, "DUPLICATE_SEND_RACE_LOST");
      continue;
    }
    summary.sent++;
  }

  return { ok: true, summary };
}
