"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { pricingPlans } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";

// Features are edited as one-per-line in a textarea and stored as a jsonb
// string array -- simplest editing experience for a short bullet list
// without building a repeating-field-array UI.
function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const PlanSchema = z.object({
  name: z.string().trim().min(1, "Give this plan a name."),
  priceLabel: z.string().trim().min(1, "Add a price, e.g. \"$49\" or \"Free\"."),
  billingPeriod: z.string().trim().optional(),
  tagline: z.string().trim().optional(),
  features: z.string().optional(),
  isFeatured: z.string().optional(), // checkbox: "on" or absent
  isActive: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type PlanFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function createPricingPlan(
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  await requireAdmin();

  const parsed = PlanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { name, priceLabel, billingPeriod, tagline, features, isFeatured, isActive, sortOrder } = parsed.data;

  await db.insert(pricingPlans).values({
    name,
    priceLabel,
    billingPeriod: billingPeriod || null,
    tagline: tagline || null,
    features: parseFeatures(features ?? ""),
    isFeatured: isFeatured === "on",
    isActive: isActive === "on",
    sortOrder,
  });

  revalidatePath("/admin/settings/pricing");
  revalidatePath("/pricing");
  redirect("/admin/settings/pricing");
}

export async function updatePricingPlan(
  id: string,
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  await requireAdmin();

  const parsed = PlanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { name, priceLabel, billingPeriod, tagline, features, isFeatured, isActive, sortOrder } = parsed.data;

  await db
    .update(pricingPlans)
    .set({
      name,
      priceLabel,
      billingPeriod: billingPeriod || null,
      tagline: tagline || null,
      features: parseFeatures(features ?? ""),
      isFeatured: isFeatured === "on",
      isActive: isActive === "on",
      sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(pricingPlans.id, id));

  revalidatePath("/admin/settings/pricing");
  revalidatePath("/pricing");
  redirect("/admin/settings/pricing");
}

export async function deletePricingPlan(id: string) {
  await requireAdmin();
  await db.delete(pricingPlans).where(eq(pricingPlans.id, id));
  revalidatePath("/admin/settings/pricing");
  revalidatePath("/pricing");
}

export async function togglePricingPlanActive(id: string, isActive: boolean) {
  await requireAdmin();
  await db.update(pricingPlans).set({ isActive, updatedAt: new Date() }).where(eq(pricingPlans.id, id));
  revalidatePath("/admin/settings/pricing");
  revalidatePath("/pricing");
}
