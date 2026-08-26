import { Resend } from "resend";

export type SendReminderResult =
  | { ok: true; providerMessageId: string }
  | {
      ok: false;
      error:
        | "EMAIL_NOT_CONFIGURED"
        | "SENDER_NOT_CONFIGURED"
        | "PROVIDER_ERROR";
      errorMessage?: string;
    };

export async function sendReminderEmail(message: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendReminderResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REMINDER_FROM_EMAIL;

  if (!apiKey) {
    return { ok: false, error: "EMAIL_NOT_CONFIGURED", errorMessage: "RESEND_API_KEY is not configured in .env" };
  }
  if (!from) {
    return { ok: false, error: "SENDER_NOT_CONFIGURED", errorMessage: "REMINDER_FROM_EMAIL is not configured in .env" };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });

    if (result.error || !result.data) {
      console.error("Resend rejected reminder email:", result.error);
      return {
        ok: false,
        error: "PROVIDER_ERROR",
        errorMessage: result.error?.message || "Provider error",
      };
    }

    return { ok: true, providerMessageId: result.data.id };
  } catch (error) {
    console.error("sendReminderEmail failed:", error);
    return { ok: false, error: "PROVIDER_ERROR", errorMessage: String(error) };
  }
}
