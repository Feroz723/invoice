"use server";

import { auth } from "@/lib/auth";
import {
  runRemindersForUser,
  type ReminderRunResult,
} from "@/lib/reminders/runner";
import { sendReminderEmail } from "@/lib/resend";

export async function sendReminders(): Promise<ReminderRunResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "You must be signed in." };
  }

  try {
    return await runRemindersForUser(userId);
  } catch (error) {
    console.error("sendReminders failed:", error);
    return { ok: false, error: "Could not prepare reminders. Please try again." };
  }
}

export async function sendTestEmailAction(targetEmail: string): Promise<{ ok: boolean; message: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const emailToUse = targetEmail || session.user.email || "delivered@resend.dev";

  try {
    const result = await sendReminderEmail({
      to: emailToUse,
      subject: "Test Payment Reminder — Invoice Tracker",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0284c7;">⚡ Invoice Tracker Test Email</h2>
          <p>Hello!</p>
          <p>This is a live test notification verifying that <strong>Invoice Tracker</strong> email delivery is functioning properly.</p>
          <p>Your automated email reminder system is active and ready.</p>
        </div>
      `,
      text: "Invoice Tracker Test Email - Your automated reminder system is active and ready.",
    });

    if (result.ok) {
      return { ok: true, message: `Test email sent successfully to ${emailToUse}! Message ID: ${result.providerMessageId}` };
    } else {
      return { ok: false, message: `Email sending error: ${result.errorMessage || result.error}` };
    }
  } catch (err) {
    return { ok: false, message: `Failed to send email: ${String(err)}` };
  }
}
