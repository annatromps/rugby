import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pricingPlans } from "@/lib/db/schema";
import { updatePricingPlan } from "@/app/actions/pricing";
import { PlanForm } from "../plan-form";

export const metadata = { title: "Edit plan" };

export default async function EditPricingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [plan] = await db.select().from(pricingPlans).where(eq(pricingPlans.id, id)).limit(1);
  if (!plan) notFound();

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Edit pricing plan</h1>
      <PlanForm action={updatePricingPlan.bind(null, plan.id)} plan={plan} submitLabel="Save changes" />
    </div>
  );
}
