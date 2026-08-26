import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create account — Invoice Tracker",
};

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Create account</h1>
      <SignupForm />
    </>
  );
}
