"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { coaches, contactLogs } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { RECORD_STATUSES, CONTACT_METHODS } from "@/lib/constants";

const CoachSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  currentCountry: z.string().trim().optional(),
  specialization: z.string().trim().min(1, "Specialization is required."),
  coachingLevel: z.string().trim().optional(),
  currentClub: z.string().trim().optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  highlightUrl: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type CoachFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function createCoach(
  _prevState: CoachFormState,
  formData: FormData,
): Promise<CoachFormState> {
  await requireAdmin();

  const parsed = CoachSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const [coach] = await db.insert(coaches).values(parsed.data).returning({ id: coaches.id });

  revalidatePath("/admin/coaches");
  redirect(`/admin/coaches/${coach.id}`);
}

export async function updateCoach(coachId: string, formData: FormData): Promise<CoachFormState> {
  await requireAdmin();

  const parsed = CoachSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(coaches)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(coaches.id, coachId));

  revalidatePath(`/admin/coaches/${coachId}`);
  revalidatePath("/admin/coaches");
}

export async function updateCoachStatus(coachId: string, status: string) {
  await requireAdmin();
  if (!RECORD_STATUSES.includes(status as (typeof RECORD_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await db
    .update(coaches)
    .set({ status: status as (typeof RECORD_STATUSES)[number], updatedAt: new Date() })
    .where(eq(coaches.id, coachId));

  revalidatePath(`/admin/coaches/${coachId}`);
  revalidatePath("/admin/coaches");
}

// See the matching comment on setPlayerPublished in actions/players.ts.
export async function setCoachPublished(coachId: string, isPublished: boolean) {
  await requireAdmin();

  const [coach] = await db
    .update(coaches)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(coaches.id, coachId))
    .returning({ id: coaches.id });

  if (!coach) throw new Error("Coach not found");

  revalidatePath(`/admin/coaches/${coachId}`);
  revalidatePath("/admin/coaches");
  revalidatePath("/coaches");
  revalidatePath(`/coaches/${coachId}`);
  revalidatePath("/");
}

export async function setCoachVerified(coachId: string, isVerified: boolean) {
  await requireAdmin();

  const [coach] = await db
    .update(coaches)
    .set({ isVerified, updatedAt: new Date() })
    .where(eq(coaches.id, coachId))
    .returning({ id: coaches.id });

  if (!coach) throw new Error("Coach not found");

  revalidatePath(`/admin/coaches/${coachId}`);
  revalidatePath("/admin/coaches");
  revalidatePath(`/coaches/${coachId}`);
}

const ContactLogSchema = z.object({
  method: z.enum(CONTACT_METHODS),
  summary: z.string().trim().min(1, "Add a short summary of the contact."),
});

export async function logCoachContact(coachId: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = ContactLogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.insert(contactLogs).values({ coachId, adminId: admin.id, ...parsed.data });
  revalidatePath(`/admin/coaches/${coachId}`);
}
