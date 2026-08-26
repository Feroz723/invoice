"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { normalizeClientEmail } from "@/lib/email-validation";
import { prisma } from "@/lib/prisma";

export type RegisterState = {
  error?: string;
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export async function register(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const rawEmail = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const emailResult = normalizeClientEmail(rawEmail);

  const errors: NonNullable<RegisterState["errors"]> = {};
  if (!rawEmail.trim()) {
    errors.email = "Email is required.";
  } else if (!emailResult.ok) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const email = (emailResult as { ok: true; email: string }).email;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({ data: { email, passwordHash } });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "An account with this email already exists." };
    }
    throw error;
  }

  redirect("/login");
}
