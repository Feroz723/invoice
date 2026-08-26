"use server";

import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { normalizeClientEmail } from "@/lib/email-validation";
import { prisma } from "@/lib/prisma";

export type ActionError = { ok: false; error: string };
export type ActionSuccess = { ok: true };

export type InvoiceInput = {
  clientName: string;
  clientEmail: string;
  invoiceAmount: string;
  dueDate: string;
  status: string;
  lastFollowUp?: string | null;
  notes?: string | null;
};

type ParsedInvoiceInput = {
  clientName: string;
  clientEmail: string;
  invoiceAmount: string;
  dueDate: Date;
  status: InvoiceStatus;
  lastFollowUp: Date | null | undefined;
  notes: string | null;
};

const AMOUNT_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;
const STATUSES: string[] = Object.values(InvoiceStatus);

function parseDateString(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseInvoiceId(invoiceId: number | string): number | null {
  const id = Number(invoiceId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateInvoiceInput(
  input: InvoiceInput
): { data: ParsedInvoiceInput } | { error: string } {
  const clientName = typeof input.clientName === "string" ? input.clientName.trim() : "";
  if (!clientName) return { error: "Client name is required." };

  const clientEmailResult = normalizeClientEmail(input.clientEmail);
  if (!clientEmailResult.ok) return { error: "Enter a valid client email address." };

  const amountRaw = typeof input.invoiceAmount === "string" ? input.invoiceAmount.trim() : "";
  if (!AMOUNT_PATTERN.test(amountRaw) || Number(amountRaw) <= 0) {
    return { error: "Enter a valid positive amount with up to 2 decimal places." };
  }

  const dueDate = parseDateString(input.dueDate);
  if (!dueDate) return { error: "Enter a valid due date." };

  if (!STATUSES.includes(input.status)) return { error: "Invalid status." };

  let lastFollowUp: Date | null | undefined;
  if (input.lastFollowUp === undefined) {
    lastFollowUp = undefined;
  } else if (input.lastFollowUp === null || input.lastFollowUp === "") {
    lastFollowUp = null;
  } else {
    const parsedFollowUp = parseDateString(input.lastFollowUp);
    if (!parsedFollowUp) return { error: "Enter a valid last follow-up date." };
    lastFollowUp = parsedFollowUp;
  }

  const notes = typeof input.notes === "string" && input.notes.trim() ? input.notes.trim() : null;

  return {
    data: {
      clientName,
      clientEmail: clientEmailResult.email,
      invoiceAmount: amountRaw,
      dueDate,
      status: input.status as InvoiceStatus,
      lastFollowUp,
      notes,
    },
  };
}

async function requireUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id ?? null;
  } catch (error) {
    console.error("[requireUserId] auth() threw:", error);
    return null;
  }
}

export async function createInvoice(input: InvoiceInput): Promise<ActionSuccess | ActionError> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const parsed = validateInvoiceInput(input);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  try {
    const createData: Parameters<typeof prisma.invoice.create>[0]["data"] = {
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail,
      invoiceAmount: parsed.data.invoiceAmount,
      dueDate: parsed.data.dueDate,
      status: parsed.data.status,
      notes: parsed.data.notes,
      userId,
    };
    if (parsed.data.lastFollowUp !== undefined) {
      createData.lastFollowUp = parsed.data.lastFollowUp;
    }
    await prisma.invoice.create({ data: createData });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("createInvoice failed:", error);
    return { ok: false, error: "Could not save the invoice. Please try again." };
  }
}

export async function updateInvoice(
  input: InvoiceInput & { invoiceId: number | string }
): Promise<ActionSuccess | ActionError> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const id = parseInvoiceId(input.invoiceId);
  if (!id) return { ok: false, error: "Invalid invoice ID." };

  const parsed = validateInvoiceInput(input);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  try {
    const updateData: Record<string, unknown> = {
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail,
      invoiceAmount: parsed.data.invoiceAmount,
      dueDate: parsed.data.dueDate,
      status: parsed.data.status,
      notes: parsed.data.notes,
    };
    if (parsed.data.lastFollowUp !== undefined) {
      updateData.lastFollowUp = parsed.data.lastFollowUp;
    }
    const result = await prisma.invoice.updateMany({
      where: { invoiceId: id, userId },
      data: updateData,
    });
    if (result.count === 0) return { ok: false, error: "Invoice not found." };
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("updateInvoice failed:", error);
    return { ok: false, error: "Could not update the invoice. Please try again." };
  }
}

export async function deleteInvoice(invoiceId: number | string): Promise<ActionSuccess | ActionError> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const id = parseInvoiceId(invoiceId);
  if (!id) return { ok: false, error: "Invalid invoice ID." };

  try {
    const result = await prisma.invoice.deleteMany({ where: { invoiceId: id, userId } });
    if (result.count === 0) return { ok: false, error: "Invoice not found." };
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("deleteInvoice failed:", error);
    return { ok: false, error: "Could not delete the invoice. Please try again." };
  }
}

export async function logFollowUp(invoiceId: number | string): Promise<ActionSuccess | ActionError> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const id = parseInvoiceId(invoiceId);
  if (!id) return { ok: false, error: "Invalid invoice ID." };

  try {
    const result = await prisma.invoice.updateMany({
      where: { invoiceId: id, userId },
      data: { lastFollowUp: new Date() },
    });
    if (result.count === 0) return { ok: false, error: "Invoice not found." };
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("logFollowUp failed:", error);
    return { ok: false, error: "Could not record the follow-up. Please try again." };
  }
}

export async function markAsPaid(invoiceId: number | string): Promise<ActionSuccess | ActionError> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const id = parseInvoiceId(invoiceId);
  if (!id) return { ok: false, error: "Invalid invoice ID." };

  try {
    const result = await prisma.invoice.updateMany({
      where: { invoiceId: id, userId },
      data: { status: InvoiceStatus.PAID },
    });
    if (result.count === 0) return { ok: false, error: "Invoice not found." };
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("markAsPaid failed:", error);
    return { ok: false, error: "Could not mark as paid. Please try again." };
  }
}

export async function markPartial(
  invoiceId: number | string,
  noteDetails?: string
): Promise<ActionSuccess | ActionError> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const id = parseInvoiceId(invoiceId);
  if (!id) return { ok: false, error: "Invalid invoice ID." };

  try {
    const updateData: { status: InvoiceStatus; notes?: string } = {
      status: InvoiceStatus.PARTIAL,
    };
    if (noteDetails?.trim()) {
      updateData.notes = noteDetails.trim();
    }

    const result = await prisma.invoice.updateMany({
      where: { invoiceId: id, userId },
      data: updateData,
    });
    if (result.count === 0) return { ok: false, error: "Invoice not found." };
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("markPartial failed:", error);
    return { ok: false, error: "Could not update partial payment. Please try again." };
  }
}
