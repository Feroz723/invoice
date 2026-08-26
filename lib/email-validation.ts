const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export function normalizeClientEmail(
  value: unknown
): { ok: true; email: string } | { ok: false } {
  if (typeof value !== "string") {
    return { ok: false };
  }
  const email = value.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false };
  }
  return { ok: true, email };
}
