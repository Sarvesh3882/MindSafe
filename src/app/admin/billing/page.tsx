import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { BillingPlans } from "@/components/admin/billing-plans";

export default async function AdminBillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: admin } = await supabase.from("users").select("college_id, full_name, email").eq("id", user!.id).single();
  const { data: college } = await supabase.from("colleges").select("plan_tier, name").eq("id", admin!.college_id).single();

  return (
    <div className="space-y-8 pb-12 font-inter max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Billing & Subscription</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage your institution&apos;s MindSafe India plan.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-[#6B7280] uppercase tracking-wide font-semibold mb-1">Current Plan</p>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#1E1E2E] capitalize">{college?.plan_tier ?? "basic"}</h2>
            <span className="px-3 py-1 bg-[#F0FFF0] text-[#3DBE29] text-xs font-semibold rounded-full border border-[#3DBE29]/20">Active</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-4">
            {college?.name} is currently on the <span className="font-semibold capitalize">{college?.plan_tier}</span> plan. Your plan dictates maximum student limits and feature availability.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-bold text-[#1E1E2E] mb-4">Available Plans</h2>
        <BillingPlans currentPlan={college?.plan_tier ?? "basic"} adminInfo={admin} />
      </div>
    </div>
  );
}
