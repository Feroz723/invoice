import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { runRemindersForUser } from "@/lib/reminders/runner";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorizedCronRequest(request.headers.get("authorization"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const aggregate = {
    ok: true,
    usersProcessed: 0,
    usersFailed: 0,
    total: 0,
    eligible: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  try {
    const users = await prisma.user.findMany({ select: { id: true } });

    for (const user of users) {
      try {
        const result = await runRemindersForUser(user.id);
        aggregate.usersProcessed++;
        if (result.ok) {
          aggregate.total += result.summary.total;
          aggregate.eligible += result.summary.eligible;
          aggregate.sent += result.summary.sent;
          aggregate.skipped += result.summary.skipped;
          aggregate.failed += result.summary.failed;
        } else {
          aggregate.usersFailed++;
          console.error(
            `Reminder run failed for a user: ${result.error}`
          );
        }
      } catch (error) {
        aggregate.usersFailed++;
        console.error("Reminder run threw for a user:", error);
      }
    }

    return NextResponse.json(aggregate);
  } catch (error) {
    console.error("Cron reminder execution failed:", error);
    return NextResponse.json(
      { ok: false, error: "Reminder processing failed." },
      { status: 500 }
    );
  }
}
