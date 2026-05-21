import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampusTrendChart } from "@/components/admin/campus-trend-chart";
import { DepartmentBreakdown } from "@/components/admin/department-breakdown";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: students } = await supabase
    .from("users")
    .select("id, department")
    .eq("college_id", adminProfile?.college_id)
    .eq("role", "student");

  const studentIds = students?.map((s) => s.id) ?? [];

  // Fetch completed assessments from last 30 days
  // eslint-disable-next-line react-hooks/purity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: assessments } = await supabase
    .from("assessments")
    .select("user_id, date, risk_level, completed")
    .in("user_id", studentIds.length ? studentIds : ["none"])
    .eq("completed", true)
    .gte("date", thirtyDaysAgo)
    .order("date", { ascending: true });

  // Trend data grouped by date
  const trendMap = new Map<string, { stable: number; attention: number; critical: number; checkins: number }>();
  assessments?.forEach((a) => {
    const existing = trendMap.get(a.date) ?? { stable: 0, attention: 0, critical: 0, checkins: 0 };
    existing[a.risk_level as "stable" | "attention" | "critical"]++;
    existing.checkins++;
    trendMap.set(a.date, existing);
  });
  const trendData = Array.from(trendMap.entries()).map(([date, vals]) => ({
    date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    ...vals,
  }));

  // Weekly comparison
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  // eslint-disable-next-line react-hooks/purity
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const thisWeek = assessments?.filter((a) => a.date >= sevenDaysAgo) ?? [];
  const lastWeek = assessments?.filter((a) => a.date >= fourteenDaysAgo && a.date < sevenDaysAgo) ?? [];

  const thisWeekCritical = thisWeek.filter((a) => a.risk_level === "critical").length;
  const lastWeekCritical = lastWeek.filter((a) => a.risk_level === "critical").length;
  const criticalTrend = lastWeekCritical > 0
    ? Math.round(((thisWeekCritical - lastWeekCritical) / lastWeekCritical) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Analytics</h1>
        <p className="text-[#6B7280] text-sm mt-1">30-day campus wellness trends with real check-in data</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Check-ins (30d)", value: assessments?.length ?? 0, color: "#3DBE29" },
          { label: "Unique students", value: new Set(assessments?.map((a) => a.user_id)).size, color: "#00C9A7" },
          { label: "Critical this week", value: thisWeekCritical, color: "#FF6B6B" },
          { label: "Critical trend", value: `${criticalTrend > 0 ? "+" : ""}${criticalTrend}%`, color: criticalTrend > 0 ? "#FF6B6B" : "#3DBE29" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <p className="text-sm text-[#6B7280]">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Wellness Trend (30 days)</CardTitle>
          <p className="text-sm text-[#6B7280]">Daily distribution of student risk levels</p>
        </CardHeader>
        <CardContent>
          <CampusTrendChart data={trendData} />
        </CardContent>
      </Card>

      {/* Department breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
          <p className="text-sm text-[#6B7280]">Wellness distribution by department</p>
        </CardHeader>
        <CardContent>
          <DepartmentBreakdown students={students ?? []} assessments={assessments ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
