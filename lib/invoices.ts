import { InvoiceStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "@/lib/overdue";

export type SerializableInvoice = {
  invoiceId: number;
  clientName: string;
  clientEmail: string | null;
  invoiceAmount: string;
  dueDate: string;
  status: "UNPAID" | "PARTIAL" | "PAID" | "OVERDUE";
  lastFollowUp: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  lastReminderSentAt: string | null;
};

async function syncOverdueInvoices(userId: string): Promise<void> {
  try {
    await prisma.invoice.updateMany({
      where: {
        userId,
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIAL] },
        dueDate: { lt: startOfToday() },
      },
      data: { status: InvoiceStatus.OVERDUE },
    });
  } catch (error) {
    console.error("Overdue synchronization failed:", error);
  }
}

export async function getInvoicesForUser(
  userId: string
): Promise<SerializableInvoice[]> {
  await syncOverdueInvoices(userId);

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map((invoice) => ({
    invoiceId: invoice.invoiceId,
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    invoiceAmount: invoice.invoiceAmount.toFixed(2),
    dueDate: invoice.dueDate.toISOString(),
    status: invoice.status,
    lastFollowUp: invoice.lastFollowUp
      ? invoice.lastFollowUp.toISOString()
      : null,
    notes: invoice.notes,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
    lastReminderSentAt: invoice.lastReminderSentAt
      ? invoice.lastReminderSentAt.toISOString()
      : null,
  }));
}

export async function getInvoices(): Promise<SerializableInvoice[] | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return getInvoicesForUser(session.user.id);
}
