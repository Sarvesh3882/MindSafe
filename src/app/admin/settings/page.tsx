import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkOnboardingForm } from "@/components/admin/bulk-onboarding-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: college } = await supabase
    .from("colleges")
    .select("*")
    .eq("id", adminProfile?.college_id)
    .single();

  const { count: studentCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("college_id", adminProfile?.college_id)
    .eq("role", "student");

  const { count: counsellorCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("college_id", adminProfile?.college_id)
    .eq("role", "counsellor");

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Settings</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage your institution&apos;s MindSafe configuration.</p>
      </div>

      {/* College info */}
      <Card>
        <CardHeader>
          <CardTitle>Institution Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "College Name", value: college?.name ?? "—" },
              { label: "Plan", value: college?.plan_tier ? college.plan_tier.charAt(0).toUpperCase() + college.plan_tier.slice(1) : "—" },
              { label: "Students enrolled", value: studentCount ?? 0 },
              { label: "Counsellors", value: counsellorCount ?? 0 },
              { label: "Max students", value: college?.max_students ?? "—" },
              { label: "Status", value: college?.active ? "✅ Active" : "❌ Inactive" },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8F9FF] rounded-xl p-4">
                <p className="text-xs text-[#6B7280] font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-[#1E1E2E] mt-1">{String(item.value)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk onboarding */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Onboarding</CardTitle>
          <p className="text-sm text-[#6B7280]">Upload a CSV to create multiple student or counsellor accounts at once.</p>
        </CardHeader>
        <CardContent>
          <BulkOnboardingForm collegeId={adminProfile?.college_id ?? ""} />
        </CardContent>
      </Card>

      {/* Privacy notice */}
      <Card className="border-[#3DBE29]/20 bg-[#F5FFF5]">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#1E1E2E] mb-2">🔒 Privacy Architecture</h3>
          <ul className="space-y-1.5 text-sm text-[#6B7280]">
            <li>• Admin dashboard shows zero student names — anonymized always</li>
            <li>• Supabase Row Level Security enforces data separation at database level</li>
            <li>• All health data encrypted with AES-256</li>
            <li>• DPDP Act 2023 compliant — no PII stored with clinical scores</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
