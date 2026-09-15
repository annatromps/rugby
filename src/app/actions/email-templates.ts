"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";

const TARGET_TYPES = ["CLUB", "PLAYER"] as const;

const TemplateSchema = z.object({
  targetType: z.enum(TARGET_TYPES),
  name: z.string().trim().min(1, "Give this template a name."),
  subject: z.string().trim().min(1, "Subject is required."),
  body: z.string().trim().min(1, "Body is required."),
  isDefault: z.string().optional(), // checkbox: "on" or absent
});

export type TemplateFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

// If this template is being made the default, clear the flag on every
// other template of the same targetType first -- "at most one default per
// type" is enforced here rather than in the database.
async function clearOtherDefaults(targetType: (typeof TARGET_TYPES)[number]) {
  // The caller sets its own row's isDefault back to true right after this.
  await db.update(emailTemplates).set({ isDefault: false }).where(eq(emailTemplates.targetType, targetType));
}

export async function createEmailTemplate(
  _prevState: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  await requireAdmin();

  const parsed = TemplateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { targetType, name, subject, body, isDefault } = parsed.data;
  const makeDefault = isDefault === "on";

  if (makeDefault) {
    await clearOtherDefaults(targetType);
  }

  await db.insert(emailTemplates).values({
    targetType,
    name,
    subject,
    body,
    isDefault: makeDefault,
  });

  revalidatePath("/admin/settings/email-templates");
  revalidatePath("/admin/clubs");
  revalidatePath("/admin/players");
  redirect(`/admin/settings/email-templates?type=${targetType}`);
}

export async function updateEmailTemplate(
  id: string,
  _prevState: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  await requireAdmin();

  const parsed = TemplateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { targetType, name, subject, body, isDefault } = parsed.data;
  const makeDefault = isDefault === "on";

  if (makeDefault) {
    await clearOtherDefaults(targetType);
  }

  await db
    .update(emailTemplates)
    .set({ targetType, name, subject, body, isDefault: makeDefault, updatedAt: new Date() })
    .where(eq(emailTemplates.id, id));

  revalidatePath("/admin/settings/email-templates");
  revalidatePath("/admin/clubs");
  revalidatePath("/admin/players");
  redirect(`/admin/settings/email-templates?type=${targetType}`);
}

export async function deleteEmailTemplate(id: string, targetType: string) {
  await requireAdmin();
  await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  revalidatePath("/admin/settings/email-templates");
  revalidatePath("/admin/clubs");
  revalidatePath("/admin/players");
  redirect(`/admin/settings/email-templates?type=${targetType}`);
}

export async function setDefaultEmailTemplate(id: string, targetType: "CLUB" | "PLAYER") {
  await requireAdmin();
  await clearOtherDefaults(targetType);
  await db.update(emailTemplates).set({ isDefault: true }).where(eq(emailTemplates.id, id));
  revalidatePath("/admin/settings/email-templates");
  revalidatePath("/admin/clubs");
  revalidatePath("/admin/players");
}
