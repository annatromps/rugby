"use server";

// The general "Contact us" form -- not tied to any specific club/player/
// coach listing (those inquiries go through submitInquiry in public.ts
// and land as contact_logs rows instead). Submissions here land in
// contact_messages for a staff member to read at /admin/messages.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/auth/dal";
import type { PublicFormState } from "./public";

// Honeypot: mirrors the one in public.ts (hidden field real visitors never
// fill in; bots that fill every input do).
function isBot(formData: FormData) {
  return Boolean(formData.get("website_url"));
}

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Your name is required."),
  email: z.string().trim().min(1, "Your email is required.").email("Enter a valid email."),
  message: z.string().trim().min(1, "Add a message.").max(2000),
});

export async function submitContactMessage(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (isBot(formData)) return { success: true };
  if (!(await checkRateLimit("contact_message"))) {
    return { error: "Too many submissions from this connection recently. Please try again in a bit." };
  }

  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, message } = parsed.data;
  await db.insert(contactMessages).values({ name, email, message });
  revalidatePath("/admin/messages");

  return { success: true };
}

export async function markContactMessageRead(id: string, isRead: boolean): Promise<void> {
  await requireAdmin();
  await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
}

export async function deleteContactMessage(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
}
