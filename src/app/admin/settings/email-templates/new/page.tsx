import { NewTemplateForm } from "./new-template-form";

export const metadata = { title: "New email template" };

export default async function NewEmailTemplatePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialType = type === "PLAYER" ? "PLAYER" : "CLUB";

  return <NewTemplateForm initialType={initialType} />;
}
