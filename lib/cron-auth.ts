import { createHash, timingSafeEqual } from "node:crypto";

export function isAuthorizedCronRequest(
  authorizationHeader: string | null | undefined
): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !authorizationHeader) {
    return false;
  }

  const match = /^Bearer\s+(.+)$/i.exec(authorizationHeader.trim());
  if (!match) {
    return false;
  }

  const providedHash = createHash("sha256").update(match[1]).digest();
  const expectedHash = createHash("sha256").update(secret).digest();
  return timingSafeEqual(providedHash, expectedHash);
}
