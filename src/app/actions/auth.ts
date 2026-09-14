"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { createSessionCookie, clearSessionCookie } from "@/lib/auth/session";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginState =
  | { error: string }
  | { fieldErrors: { email?: string[]; password?: string[] } }
  | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  // Same generic error whether the email doesn't exist or the password is
  // wrong -- don't help an attacker enumerate valid admin emails.
  const genericError = { error: "Incorrect email or password." };

  if (!admin) {
    return genericError;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    return genericError;
  }

  await createSessionCookie({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
