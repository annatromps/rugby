"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { players, contactLogs, accommodationRequests } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { RECORD_STATUSES, PLAYER_LEVELS, CONTACT_METHODS } from "@/lib/constants";
import { optionalEnum } from "@/lib/validation";

const PlayerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  currentCountry: z.string().trim().optional(),
  position: z.string().trim().min(1, "Position is required."),
  secondaryPosition: z.string().trim().optional(),
  level: optionalEnum(PLAYER_LEVELS),
  currentClub: z.string().trim().optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  highlightUrl: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  needsAccommodation: z.coerce.boolean().optional(),
});

export type PlayerFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function createPlayer(
  _prevState: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = PlayerSchema.safeParse({
    ...raw,
    needsAccommodation: raw.needsAccommodation === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const [player] = await db.insert(players).values(parsed.data).returning({ id: players.id });

  revalidatePath("/admin/players");
  redirect(`/admin/players/${player.id}`);
}

export async function updatePlayer(playerId: string, formData: FormData): Promise<PlayerFormState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = PlayerSchema.safeParse({
    ...raw,
    needsAccommodation: raw.needsAccommodation === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(players)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(players.id, playerId));

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin/players");
}

export async function updatePlayerStatus(playerId: string, status: string) {
  await requireAdmin();
  if (!RECORD_STATUSES.includes(status as (typeof RECORD_STATUSES)[number])) {
    throw new Error("Invalid status");
  }

  await db
    .update(players)
    .set({ status: status as (typeof RECORD_STATUSES)[number], updatedAt: new Date() })
    .where(eq(players.id, playerId));

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin/players");
}

const ContactLogSchema = z.object({
  method: z.enum(CONTACT_METHODS),
  summary: z.string().trim().min(1, "Add a short summary of the contact."),
});

export async function logPlayerContact(playerId: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = ContactLogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.insert(contactLogs).values({ playerId, adminId: admin.id, ...parsed.data });
  revalidatePath(`/admin/players/${playerId}`);
}

const AccommodationSchema = z.object({
  city: z.string().trim().optional(),
  moveInDate: z.string().trim().optional(),
  budgetNote: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function requestAccommodation(playerId: string, formData: FormData) {
  await requireAdmin();
  const parsed = AccommodationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.insert(accommodationRequests).values({
    playerId,
    city: parsed.data.city,
    moveInDate: parsed.data.moveInDate ? new Date(parsed.data.moveInDate) : undefined,
    budgetNote: parsed.data.budgetNote,
    notes: parsed.data.notes,
  });

  await db
    .update(players)
    .set({ needsAccommodation: true, updatedAt: new Date() })
    .where(eq(players.id, playerId));

  revalidatePath(`/admin/players/${playerId}`);
}

export async function updateAccommodationStatus(requestId: string, playerId: string, status: string) {
  await requireAdmin();
  await db
    .update(accommodationRequests)
    .set({ status: status as never, updatedAt: new Date() })
    .where(eq(accommodationRequests.id, requestId));
  revalidatePath(`/admin/players/${playerId}`);
}
