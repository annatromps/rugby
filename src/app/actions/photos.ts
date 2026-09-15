"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, clubs, coaches } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";

export type PhotoUploadResult = { error?: string } | undefined;

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const fromType = file.type.split("/").pop();
  return fromType || "jpg";
}

function validate(file: File | null): string | null {
  if (!file || file.size === 0) return "Choose an image to upload.";
  if (!file.type.startsWith("image/")) return "That file doesn't look like an image.";
  if (file.size > MAX_BYTES) return "Images must be under 5MB.";
  return null;
}

// Deletes the previous blob (if any) after a successful replace/removal so
// storage doesn't quietly accumulate orphaned files. Best-effort: a delete
// failure (already gone, transient error) should never block the update
// the admin is waiting on.
async function deleteQuietly(url: string | null) {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // ignore
  }
}

async function uploadTo(prefix: string, file: File): Promise<string> {
  const blob = await put(`${prefix}/${crypto.randomUUID()}.${extensionFor(file)}`, file, {
    access: "public",
  });
  return blob.url;
}

// ---------- Players ----------

export async function uploadPlayerPhoto(playerId: string, formData: FormData): Promise<PhotoUploadResult> {
  await requireAdmin();
  const file = formData.get("photo") as File | null;
  const error = validate(file);
  if (error) return { error };

  const [existing] = await db.select({ photoUrl: players.photoUrl }).from(players).where(eq(players.id, playerId)).limit(1);
  const url = await uploadTo("players", file!);
  await db.update(players).set({ photoUrl: url, updatedAt: new Date() }).where(eq(players.id, playerId));
  await deleteQuietly(existing?.photoUrl ?? null);

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath(`/players/${playerId}`);
  revalidatePath("/players");
}

export async function removePlayerPhoto(playerId: string): Promise<void> {
  await requireAdmin();
  const [existing] = await db.select({ photoUrl: players.photoUrl }).from(players).where(eq(players.id, playerId)).limit(1);
  await db.update(players).set({ photoUrl: null, updatedAt: new Date() }).where(eq(players.id, playerId));
  await deleteQuietly(existing?.photoUrl ?? null);

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath(`/players/${playerId}`);
  revalidatePath("/players");
}

// ---------- Coaches ----------

export async function uploadCoachPhoto(coachId: string, formData: FormData): Promise<PhotoUploadResult> {
  await requireAdmin();
  const file = formData.get("photo") as File | null;
  const error = validate(file);
  if (error) return { error };

  const [existing] = await db.select({ photoUrl: coaches.photoUrl }).from(coaches).where(eq(coaches.id, coachId)).limit(1);
  const url = await uploadTo("coaches", file!);
  await db.update(coaches).set({ photoUrl: url, updatedAt: new Date() }).where(eq(coaches.id, coachId));
  await deleteQuietly(existing?.photoUrl ?? null);

  revalidatePath(`/admin/coaches/${coachId}`);
  revalidatePath(`/coaches/${coachId}`);
  revalidatePath("/coaches");
}

export async function removeCoachPhoto(coachId: string): Promise<void> {
  await requireAdmin();
  const [existing] = await db.select({ photoUrl: coaches.photoUrl }).from(coaches).where(eq(coaches.id, coachId)).limit(1);
  await db.update(coaches).set({ photoUrl: null, updatedAt: new Date() }).where(eq(coaches.id, coachId));
  await deleteQuietly(existing?.photoUrl ?? null);

  revalidatePath(`/admin/coaches/${coachId}`);
  revalidatePath(`/coaches/${coachId}`);
  revalidatePath("/coaches");
}

// ---------- Clubs (crest) ----------

export async function uploadClubCrest(clubId: string, formData: FormData): Promise<PhotoUploadResult> {
  await requireAdmin();
  const file = formData.get("photo") as File | null;
  const error = validate(file);
  if (error) return { error };

  const [existing] = await db.select({ crestUrl: clubs.crestUrl }).from(clubs).where(eq(clubs.id, clubId)).limit(1);
  const url = await uploadTo("clubs", file!);
  await db.update(clubs).set({ crestUrl: url, updatedAt: new Date() }).where(eq(clubs.id, clubId));
  await deleteQuietly(existing?.crestUrl ?? null);

  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath(`/clubs/${clubId}`);
  revalidatePath("/clubs");
}

export async function removeClubCrest(clubId: string): Promise<void> {
  await requireAdmin();
  const [existing] = await db.select({ crestUrl: clubs.crestUrl }).from(clubs).where(eq(clubs.id, clubId)).limit(1);
  await db.update(clubs).set({ crestUrl: null, updatedAt: new Date() }).where(eq(clubs.id, clubId));
  await deleteQuietly(existing?.crestUrl ?? null);

  revalidatePath(`/admin/clubs/${clubId}`);
  revalidatePath(`/clubs/${clubId}`);
  revalidatePath("/clubs");
}
