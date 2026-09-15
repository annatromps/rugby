import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { updateTestimonial } from "@/app/actions/testimonials";
import { TestimonialForm } from "../testimonial-form";

export const metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  if (!testimonial) notFound();

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Edit testimonial</h1>
      <TestimonialForm action={updateTestimonial.bind(null, testimonial.id)} testimonial={testimonial} submitLabel="Save changes" />
    </div>
  );
}
