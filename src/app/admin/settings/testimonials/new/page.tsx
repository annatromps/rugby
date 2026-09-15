import { createTestimonial } from "@/app/actions/testimonials";
import { TestimonialForm } from "../testimonial-form";

export const metadata = { title: "New testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">New testimonial</h1>
      <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" />
    </div>
  );
}
