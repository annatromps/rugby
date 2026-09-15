"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";

const TestimonialSchema = z.object({
  quote: z.string().trim().min(1, "Add the quote text."),
  authorName: z.string().trim().min(1, "Add an author name."),
  authorRole: z.string().trim().optional(),
  isActive: z.string().optional(), // checkbox: "on" or absent
  sortOrder: z.coerce.number().int().default(0),
});

export type TestimonialFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireAdmin();

  const parsed = TestimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { quote, authorName, authorRole, isActive, sortOrder } = parsed.data;

  await db.insert(testimonials).values({
    quote,
    authorName,
    authorRole: authorRole || null,
    isActive: isActive === "on",
    sortOrder,
  });

  revalidatePath("/admin/settings/testimonials");
  revalidatePath("/");
  redirect("/admin/settings/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireAdmin();

  const parsed = TestimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { quote, authorName, authorRole, isActive, sortOrder } = parsed.data;

  await db
    .update(testimonials)
    .set({
      quote,
      authorName,
      authorRole: authorRole || null,
      isActive: isActive === "on",
      sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, id));

  revalidatePath("/admin/settings/testimonials");
  revalidatePath("/");
  redirect("/admin/settings/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/admin/settings/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  await requireAdmin();
  await db.update(testimonials).set({ isActive, updatedAt: new Date() }).where(eq(testimonials.id, id));
  revalidatePath("/admin/settings/testimonials");
  revalidatePath("/");
}
