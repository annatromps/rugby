import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { EditTemplateForm } from "./edit-template-form";

export const metadata = { title: "Edit email template" };

export default async function EditEmailTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1);
  if (!template) notFound();

  return <EditTemplateForm template={template} />;
}
