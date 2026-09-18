"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { accounts, adminUsers } from "@/lib/db/schema";
import { createPortalSessionCookie, clearPortalSessionCookie } from "@/lib/auth/portal-session";
import { createSessionCookie } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

const SignUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export type PortalAuthState =
  | { error: string; email?: string }
  | { fieldErrors: { name?: string[]; email?: string[]; password?: string[] }; email?: string }
  | undefined;

export async function signUpAccount(
  _prevState: PortalAuthState,
  formData: FormData,
): Promise<PortalAuthState> {
  if (!(await checkRateLimit("account_signup"))) {
    return { error: "Too many attempts from this connection recently. Please try again in a bit." };
  }

  const parsed = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const [existing] = await db.select({ id: accounts.id }).from(accounts).where(eq(accounts.email, email)).limit(1);
  if (existing) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [account] = await db
    .insert(accounts)
    .values({ name, email, passwordHash })
    .returning({ id: accounts.id });

  await createPortalSessionCookie({ accountId: account.id, email, name });
  redirect("/");
}

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export async function logInAccount(
  _prevState: PortalAuthState,
  formData: FormData,
): Promise<PortalAuthState> {
  const submittedEmail = formData.get("email");
  const emailForDisplay = typeof submittedEmail === "string" ? submittedEmail : undefined;

  if (!(await checkRateLimit("account_login"))) {
    return {
      error: "Too many attempts from this connection recently. Please try again in a bit.",
      email: emailForDisplay,
    };
  }

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, email: emailForDisplay };
  }

  const { email, password } = parsed.data;
  const genericError = { error: "Incorrect email or password.", email: emailForDisplay };

  const [account] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
  if (account) {
    const passwordMatches = await bcrypt.compare(password, account.passwordHash);
    if (passwordMatches) {
      await createPortalSessionCookie({ accountId: account.id, email: account.email, name: account.name });
      redirect("/");
    }
  }

  // This same "Log in" form is the only login link most visitors ever see
  // (the separate staff login lives at /login, linked quietly from the
  // footer). Rather than making staff remember a second URL, fall back to
  // checking admin credentials here too, so one login box works for everyone.
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (admin) {
    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (passwordMatches) {
      await createSessionCookie({ adminId: admin.id, email: admin.email, role: admin.role });
      redirect("/admin");
    }
  }

  return genericError;
}

export async function logOutAccount() {
  await clearPortalSessionCookie();
  redirect("/");
}
