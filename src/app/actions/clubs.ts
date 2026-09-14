"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { clubs, contactLogs, positionNeeds } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { RECORD_STATUSES, PLAYER_LEVELS, CONTACT_METHODS } from "@/lib/constants";
import { optionalEnum } from "@/lib/validation";

const ClubSchema = z.object({
  name: z.string().trim().min(1, "Club name is required."),
  country: z.string().trim().min(1, "Country is required."),
  region: z.string().trim().optional(),
  league: z.string().trim().optional(),
  level: optionalEnum(PLAYER_LEVELS),
  website: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type ClubFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function createClub(
  _prevState: ClubFormState,
  formData: FormData,
): Promise<ClubFormState> {
  await requireAdmin();

  const parsed = ClubSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const [club] = await db.insert(clubs).values(parsed.data).returning({ id: clubs.id });

  revalidatePath("/admin/clubs");
  redirect(`/admin/clubs/${club.id}`);
}

export async function updateClub(clubId: string, formData: FormData): Promise<ClubFormState> {
  await requireAdmin();

  const parsed = ClubSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(clubs)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(clubs.id, clubId));

  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath("/admin/clubs");
}

export async function updateClubStatus(clubId: string, status: string) {
  await requireAdmin();
  if (!RECORD_STATUSES.includes(status as (typeof RECORD_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await db
    .update(clubs)
    .set({ status: status as (typeof RECORD_STATUSES)[number], updatedAt: new Date() })
    .where(eq(clubs.id, clubId));

  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath("/admin/clubs");
}

// Publish gate for self-submitted clubs: a new sign-up lands with
// isPublished: false so it never appears on the public site until a staff
// member reviews it and flips this on.
export async function setClubPublished(clubId: string, isPublished: boolean) {
  await requireAdmin();

  const [club] = await db
    .update(clubs)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(clubs.id, clubId))
    .returning({ id: clubs.id });

  if (!club) throw new Error("Club not found");

  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
  revalidatePath(`/clubs/${clubId}`);
  revalidatePath("/");
}

// A manual staff signal (not tied to the review/publish gate above) that
// this club has actually been checked. Shown as a badge on the public
// site once published.
export async function setClubVerified(clubId: string, isVerified: boolean) {
  await requireAdmin();

  const [club] = await db
    .update(clubs)
    .set({ isVerified, updatedAt: new Date() })
    .where(eq(clubs.id, clubId))
    .returning({ id: clubs.id });

  if (!club) throw new Error("Club not found");

  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath("/admin/clubs");
  revalidatePath(`/clubs/${clubId}`);
}

const PositionNeedSchema = z.object({
  position: z.string().trim().min(1, "Position is required."),
  level: optionalEnum(PLAYER_LEVELS),
  notes: z.string().trim().optional(),
});

export async function addPositionNeed(clubId: string, formData: FormData) {
  await requireAdmin();
  const parsed = PositionNeedSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.insert(positionNeeds).values({ clubId, ...parsed.data });
  revalidatePath(`/admin/clubs/${clubId}`);
}

export async function togglePositionFilled(positionNeedId: string, clubId: string, filled: boolean) {
  await requireAdmin();
  await db.update(positionNeeds).set({ filled }).where(eq(positionNeeds.id, positionNeedId));
  revalidatePath(`/admin/clubs/${clubId}`);
}

const ContactLogSchema = z.object({
  method: z.enum(CONTACT_METHODS),
  summary: z.string().trim().min(1, "Add a short summary of the contact."),
});

export async function logClubContact(clubId: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = ContactLogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.insert(contactLogs).values({ clubId, adminId: admin.id, ...parsed.data });
  revalidatePath(`/admin/clubs/${clubId}`);
}
