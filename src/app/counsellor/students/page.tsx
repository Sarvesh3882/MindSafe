import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import Link from "next/link";

export default async function CounsellorStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: students } = await supabase
    .from("users")
    .select("id, full_name, email, department, year")
    .eq("college_id", profile?.college_id)
    .eq("role", "student")
    .order("full_name");

  const studentIds = students?.map((s) => s.id) ?? [];

  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: assessments } = await supabase
    .from("assessments")
    .select("user_id, risk_level, date")
    .in("user_id", studentIds.length ? studentIds : ["none"])
    .gte("date", sevenDaysAgo)
    .order("date", { ascending: false });

  const latestByStudent = new Map<string, string>();
  assessments?.forEach((a) => {
    if (!latestByStudent.has(a.user_id)) latestByStudent.set(a.user_id, a.risk_level);
  });

  const sorted = [...(students ?? [])].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, attention: 1, stable: 2 };
    return (order[latestByStudent.get(a.id) ?? "stable"] ?? 2) - (order[latestByStudent.get(b.id) ?? "stable"] ?? 2);
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">All Students</h1>
        <p className="text-[#6B7280] text-sm mt-1">{students?.length ?? 0} students · sorted by priority</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280] text-sm">No students found.</div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {sorted.map((s) => {
                const risk = latestByStudent.get(s.id) as "stable" | "attention" | "critical" | undefined;
                return (
                  <Link key={s.id} href={`/counsellor/students/${s.id}`}>
                    <div className="flex items-center justify-between px-6 py-4 hover:bg-[#F5FFF5] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#3DBE29]/10 flex items-center justify-center text-[#3DBE29] font-bold text-sm">
                          {s.full_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1E1E2E]">{s.full_name}</p>
                          <p className="text-xs text-[#6B7280]">{s.department ?? "—"} · Year {s.year ?? "—"} · {s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {risk ? (
                          <RiskBadge level={risk} />
                        ) : (
                          <span className="text-xs text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">No data</span>
                        )}
                        <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2} className="w-4 h-4">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
