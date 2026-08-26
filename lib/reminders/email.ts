import { formatDate, formatINR } from "@/lib/format";
import type { ReminderKind } from "./eligibility";

export type ReminderEmailInput = {
  clientName: string;
  invoiceId: number;
  invoiceAmount: string;
  dueDate: string;
  status: string;
  kind: ReminderKind;
};

export type ReminderEmailContent = {
  subject: string;
  html: string;
  text: string;
};

export function buildReminderEmail(
  input: ReminderEmailInput
): ReminderEmailContent {
  const amount = formatINR(input.invoiceAmount);
  const due = formatDate(input.dueDate);
  const isOverdueKind = input.kind === "OVERDUE";

  // Clean, spam-safe subject line (no emojis or all-caps trigger words)
  const subject = isOverdueKind
    ? `Payment Reminder: Invoice #${input.invoiceId} (${amount}) is Overdue`
    : `Payment Reminder: Invoice #${input.invoiceId} (${amount}) Due ${due}`;

  const opening = isOverdueKind
    ? `Our records show that invoice #${input.invoiceId} for ${amount} was due on ${due} and remains unpaid.`
    : `This is a polite reminder that invoice #${input.invoiceId} for ${amount} is due on ${due}.`;

  const closing = isOverdueKind
    ? "Please arrange for payment at your earliest convenience. If payment has already been sent, please disregard this notice."
    : "Please process payment by the due date. If payment has already been sent, thank you and please disregard this notice.";

  const text = [
    `Hello ${input.clientName},`,
    "",
    opening,
    closing,
    "",
    "Invoice Details:",
    `- Invoice ID: #${input.invoiceId}`,
    `- Amount Due: ${amount}`,
    `- Due Date: ${due}`,
    `- Status: ${input.status}`,
    "",
    "Thank you for your business.",
  ].join("\n");

  const statusBg = isOverdueKind ? "#f43f5e" : "#00f3ff";
  const statusColor = isOverdueKind ? "#ffffff" : "#090d16";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(subject)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 32px; border-bottom: 1px solid #1e293b; }
          .brand { font-size: 20px; font-weight: 800; color: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
          .brand span { color: #00f3ff; }
          .content { padding: 32px; }
          .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px; }
          .message { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .card { background-color: #090d16; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .card-header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #00f3ff; margin-bottom: 8px; }
          .amount { font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; background-color: ${statusBg}; color: ${statusColor}; }
          .footer { padding: 20px 32px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">Invoice<span>Tracker</span></div>
          </div>
          <div class="content">
            <h1 class="greeting">Hello ${escapeHtml(input.clientName)},</h1>
            <p class="message">${escapeHtml(opening)}</p>
            <p class="message">${escapeHtml(closing)}</p>

            <div class="card">
              <div class="card-header">Invoice #${input.invoiceId}</div>
              <div class="amount">${escapeHtml(amount)}</div>
              <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 12px;">Due Date: <strong>${escapeHtml(due)}</strong></div>
              <div>Status: <span class="badge">${escapeHtml(input.status)}</span></div>
            </div>

            <p class="message" style="margin-bottom: 0;">Thank you for your prompt attention to this matter.</p>
          </div>
          <div class="footer">
            Sent via Invoice Tracker — https://invoice.techpick.tech
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
