"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { accounts, adminUsers } from "@/lib/db/schema";
import { createSessionCookie } from "@/lib/auth/session";
import { createPortalSessionCookie } from "@/lib/auth/portal-session";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email/send";

const SITE_URL = "https://kickoff-rugby.vercel.app"; // keep in sync with src/app/layout.tsx

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export type ForgotPasswordState =
  | { message: string }
  | { error: string; email?: string }
  | undefined;

const EmailSchema = z.string().trim().toLowerCase().email();

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  // Same message whether or not the account exists -- otherwise this form
  // becomes a way to check which emails have accounts on the site.
  const genericMessage = {
    message: "If an account exists for that email, we've sent a link to reset the password.",
  };

  if (!(await checkRateLimit("password_reset"))) {
    return { error: "Too many attempts from this connection recently. Please try again in a bit." };
  }

  const rawEmail = formData.get("email");
  const emailForDisplay = typeof rawEmail === "string" ? rawEmail : undefined;

  const parsed = EmailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { error: "Enter a valid email.", email: emailForDisplay };
  }
  const email = parsed.data;

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto;">
      <p style="font-size: 15px; color: #171717;">Someone asked to reset the password for this Kickoff Rugby Recruitment account.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #171717; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reset password</a>
      </p>
      <p style="font-size: 13px; color: #64748b;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    </div>`;

  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (admin) {
    await db
      .update(adminUsers)
      .set({ resetToken: token, resetTokenExpiresAt: expiresAt })
      .where(eq(adminUsers.id, admin.id));
    await sendEmail({ to: admin.email, subject: "Reset your Kickoff Rugby password", html: emailHtml });
    return genericMessage;
  }

  const [account] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
  if (account) {
    await db
      .update(accounts)
      .set({ resetToken: token, resetTokenExpiresAt: expiresAt })
      .where(eq(accounts.id, account.id));
    await sendEmail({ to: account.email, subject: "Reset your Kickoff Rugby password", html: emailHtml });
    return genericMessage;
  }

  return genericMessage;
}

export type ResetPasswordState = { error: string } | undefined;

const ResetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = ResetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Something went wrong. Try again." };
  }

  const { token, password } = parsed.data;
  const now = new Date();
  const invalidError = { error: "This reset link is invalid or has expired. Request a new one." };
  const passwordHash = await bcrypt.hash(password, 10);

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(and(eq(adminUsers.resetToken, token), gt(adminUsers.resetTokenExpiresAt, now)))
    .limit(1);
  if (admin) {
    await db
      .update(adminUsers)
      .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
      .where(eq(adminUsers.id, admin.id));
    await createSessionCookie({ adminId: admin.id, email: admin.email, role: admin.role });
    redirect("/admin");
  }

  const [account] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.resetToken, token), gt(accounts.resetTokenExpiresAt, now)))
    .limit(1);
  if (account) {
    await db
      .update(accounts)
      .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
      .where(eq(accounts.id, account.id));
    await createPortalSessionCookie({ accountId: account.id, email: account.email, name: account.name });
    redirect("/");
  }

  return invalidError;
}
