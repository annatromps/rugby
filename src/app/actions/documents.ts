"use server";

// Admin-side upload/remove for a player's application documents (passport,
// CV, cover letter). See the schema comment on `players` in
// src/lib/db/schema.ts: these are ADMIN-ONLY -- never rendered on any
// public page, only on the admin player detail page -- because a passport
// scan and a CV are sensitive/personal, unlike the headshot in photos.ts
// which is meant to be shown publicly.
//
// A player can also attach these documents themselves when they apply
// through the public join-as-player form (see submitPlayerApplication in
// src/app/actions/public.ts, which uploads via uploadDocumentFile below
// before the row exists yet). This file covers the admin's ability to add,
// replace, or remove them afterwards.

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { validateDocument, type DocumentKind } from "@/lib/document-validation";

export type DocumentUploadResult = { error?: string } | undefined;

async function deleteQuietly(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // Best-effort -- a delete failure (already gone, transient error)
    // should never block the update the caller is waiting on.
  }
}

// Uploads a validated document file to Blob storage and returns its URL
// plus the original file name (shown in the admin UI so staff see
// "passport.pdf" instead of a raw blob URL). Shared by the admin actions
// below and by the public application form, which uploads documents
// before the player row exists.
export async function uploadDocumentFile(
  kind: DocumentKind,
  file: File,
): Promise<{ url: string; fileName: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const blob = await put(`players/${kind}/${crypto.randomUUID()}.${ext}`, file, {
    access: "public",
  });
  return { url: blob.url, fileName: file.name };
}

async function getExisting(playerId: string, kind: DocumentKind): Promise<string | null> {
  const [row] =
    kind === "passport"
      ? await db.select({ url: players.passportUrl }).from(players).where(eq(players.id, playerId)).limit(1)
      : kind === "cv"
        ? await db.select({ url: players.cvUrl }).from(players).where(eq(players.id, playerId)).limit(1)
        : await db.select({ url: players.coverLetterUrl }).from(players).where(eq(players.id, playerId)).limit(1);
  return row?.url ?? null;
}

async function setColumns(playerId: string, kind: DocumentKind, url: string | null, fileName: string | null) {
  const updatedAt = new Date();
  if (kind === "passport") {
    await db.update(players).set({ passportUrl: url, passportFileName: fileName, updatedAt }).where(eq(players.id, playerId));
  } else if (kind === "cv") {
    await db.update(players).set({ cvUrl: url, cvFileName: fileName, updatedAt }).where(eq(players.id, playerId));
  } else {
    await db
      .update(players)
      .set({ coverLetterUrl: url, coverLetterFileName: fileName, updatedAt })
      .where(eq(players.id, playerId));
  }
}

export async function uploadPlayerDocument(
  playerId: string,
  kind: DocumentKind,
  formData: FormData,
): Promise<DocumentUploadResult> {
  await requireAdmin();
  const file = formData.get("document") as File | null;
  const error = validateDocument(file);
  if (error) return { error };

  const existingUrl = await getExisting(playerId, kind);
  const { url, fileName } = await uploadDocumentFile(kind, file!);
  await setColumns(playerId, kind, url, fileName);
  await deleteQuietly(existingUrl);

  revalidatePath(`/admin/players/${playerId}`);
}

export async function removePlayerDocument(playerId: string, kind: DocumentKind): Promise<void> {
  await requireAdmin();
  const existingUrl = await getExisting(playerId, kind);
  await setColumns(playerId, kind, null, null);
  await deleteQuietly(existingUrl);

  revalidatePath(`/admin/players/${playerId}`);
}
