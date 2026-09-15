import { createPricingPlan } from "@/app/actions/pricing";
import { PlanForm } from "../plan-form";

export const metadata = { title: "New plan" };

export default function NewPricingPlanPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">New pricing plan</h1>
      <PlanForm action={createPricingPlan} submitLabel="Create plan" />
    </div>
  );
}
