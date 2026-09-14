"use server";

// Public, unauthenticated server actions for the marketing site: self-serve
// sign-up (players/clubs registering themselves) and inquiries sent from a
// player/club profile page. Nothing here calls requireAdmin() -- these are
// meant to be reachable by anyone. Submissions land with
// source: "SELF_SUBMITTED", status: "NEW", and isPublished: false so they
// show up in the normal admin pipeline (src/app/admin/players,
// src/app/admin/clubs) for review, but stay off the public site
// (src/app/players, src/app/clubs) until a staff member approves and
// publishes them. Inquiries are written as ordinary contact_logs rows so
// they show up in the same contact history the admin already sees on a
// player/club page.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { players, clubs, positionNeeds, contactLogs } from "@/lib/db/schema";
import { PLAYER_LEVELS } from "@/lib/constants";
import { optionalEnum } from "@/lib/validation";

export type PublicFormState =
  | { success: true }
  | { success?: false; error?: string; fieldErrors?: Record<string, string[]> }
  | undefined;

// Honeypot: a field real visitors never see or fill in (hidden via CSS in
// the form), but bots that blindly fill every input will. If it's non-empty
// we pretend to succeed without writing anything.
function isBot(formData: FormData) {
  return Boolean(formData.get("website_url"));
}

// ---------- Player sign-up ----------

const PlayerApplicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().min(1, "Email is required so clubs can reach you.").email("Enter a valid email."),
  phone: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  currentCountry: z.string().trim().optional(),
  position: z.string().trim().min(1, "Position is required."),
  secondaryPosition: z.string().trim().optional(),
  level: optionalEnum(PLAYER_LEVELS),
  currentClub: z.string().trim().optional(),
  yearsExperience: z.coerce.number().int().min(0).max(60).optional(),
  highlightUrl: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
  needsAccommodation: z.coerce.boolean().optional(),
});

export async function submitPlayerApplication(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (isBot(formData)) return { success: true };

  const raw = Object.fromEntries(formData);
  const parsed = PlayerApplicationSchema.safeParse({
    ...raw,
    needsAccommodation: raw.needsAccommodation === "on",
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await db.insert(players).values({
    ...parsed.data,
    source: "SELF_SUBMITTED",
    status: "NEW",
    isPublished: false,
  });

  revalidatePath("/admin/players");
  return { success: true };
}

// ---------- Club sign-up ----------

const ClubApplicationSchema = z.object({
  name: z.string().trim().min(1, "Club name is required."),
  country: z.string().trim().min(1, "Country is required."),
  region: z.string().trim().optional(),
  league: z.string().trim().optional(),
  level: optionalEnum(PLAYER_LEVELS),
  website: z.string().trim().optional(),
  contactName: z.string().trim().min(1, "A contact name is required."),
  contactEmail: z.string().trim().min(1, "Email is required so players can reach you.").email("Enter a valid email."),
  contactPhone: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
  // Optional: let a club post its first vacancy right away.
  neededPosition: z.string().trim().optional(),
  neededLevel: optionalEnum(PLAYER_LEVELS),
});

export async function submitClubApplication(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (isBot(formData)) return { success: true };

  const parsed = ClubApplicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { neededPosition, neededLevel, ...clubFields } = parsed.data;

  const [club] = await db
    .insert(clubs)
    .values({
      ...clubFields,
      source: "SELF_SUBMITTED",
      status: "NEW",
      isPublished: false,
    })
    .returning({ id: clubs.id });

  if (neededPosition) {
    await db.insert(positionNeeds).values({
      clubId: club.id,
      position: neededPosition,
      level: neededLevel,
    });
  }

  revalidatePath("/admin/clubs");
  return { success: true };
}

// ---------- Inquiries from a player/club profile page ----------

const InquirySchema = z.object({
  name: z.string().trim().min(1, "Your name is required."),
  email: z.string().trim().min(1, "Your email is required.").email("Enter a valid email."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1, "Add a short message.").max(2000),
});

export async function submitInquiry(
  target: { playerId?: string; clubId?: string },
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (isBot(formData)) return { success: true };

  const parsed = InquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, phone, message } = parsed.data;
  const summary = `Website inquiry from ${name} (${email}${phone ? `, ${phone}` : ""}): ${message}`;

  await db.insert(contactLogs).values({
    playerId: target.playerId,
    clubId: target.clubId,
    method: "EMAIL",
    summary,
  });

  if (target.playerId) revalidatePath(`/admin/players/${target.playerId}`);
  if (target.clubId) revalidatePath(`/admin/clubs/${target.clubId}`);

  return { success: true };
}
