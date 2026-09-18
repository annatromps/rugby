"use server";

// The public "Athlete services" form at /services -- CV help, accommodation
// help, visa/relocation support. Submissions land in service_requests for a
// staff member to triage at /admin/services. Mirrors contact.ts's pattern.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { serviceRequests, serviceRequestStatusEnum, serviceTypeEnum } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/auth/dal";
import type { PublicFormState } from "./public";

// Honeypot: mirrors the one in public.ts/contact.ts.
function isBot(formData: FormData) {
  return Boolean(formData.get("website_url"));
}

const ServiceRequestSchema = z.object({
  name: z.string().trim().min(1, "Your name is required."),
  email: z.string().trim().min(1, "Your email is required.").email("Enter a valid email."),
  phone: z.string().trim().optional(),
  serviceType: z.enum(serviceTypeEnum.enumValues, {
    message: "Choose which service you're interested in.",
  }),
  message: z.string().trim().max(2000).optional(),
});

export async function submitServiceRequest(
  _prevState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (isBot(formData)) return { success: true };
  if (!(await checkRateLimit("service_request"))) {
    return { error: "Too many submissions from this connection recently. Please try again in a bit." };
  }

  const parsed = ServiceRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    serviceType: formData.get("serviceType"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, phone, serviceType, message } = parsed.data;
  await db.insert(serviceRequests).values({
    name,
    email,
    phone: phone || null,
    serviceType,
    message: message || null,
  });
  revalidatePath("/admin/services");

  return { success: true };
}

export async function updateServiceRequestStatus(
  id: string,
  status: (typeof serviceRequestStatusEnum.enumValues)[number],
): Promise<void> {
  await requireAdmin();
  await db.update(serviceRequests).set({ status }).where(eq(serviceRequests.id, id));
  revalidatePath("/admin/services");
}

export async function deleteServiceRequest(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(serviceRequests).where(eq(serviceRequests.id, id));
  revalidatePath("/admin/services");
}
