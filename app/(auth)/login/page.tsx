import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Invoice Tracker",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Sign in</h1>
      <LoginForm />
    </>
  );
}
