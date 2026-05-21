import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

export default async function AdminCounsellorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: counsellors } = await supabase
    .from("users")
    .select("id, full_name, email, created_at")
    .eq("college_id", adminProfile?.college_id)
    .eq("role", "counsellor")
    .order("full_name");

  // eslint-disable-next-line react-hooks/purity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Session stats per counsellor
  const sessionStats = await Promise.all(
    (counsellors ?? []).map(async (c) => {
      const { count: total } = await supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("counsellor_id", c.id)
        .gte("date", thirtyDaysAgo);

      const { count: completed } = await supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("counsellor_id", c.id)
        .eq("status", "completed")
        .gte("date", thirtyDaysAgo);

      return { counsellorId: c.id, total: total ?? 0, completed: completed ?? 0 };
    })
  );

  const statsMap = new Map(sessionStats.map((s) => [s.counsellorId, s]));
  const totalSessions = sessionStats.reduce((sum, s) => sum + s.total, 0);
  const completedSessions = sessionStats.reduce((sum, s) => sum + s.completed, 0);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Counsellors</h1>
        <p className="text-[#6B7280] text-sm mt-1">Team overview and session utilization (last 30 days)</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Counsellors" value={counsellors?.length ?? 0} color="#3DBE29" />
        <StatCard label="Sessions (30d)" value={totalSessions} color="#00C9A7" />
        <StatCard
          label="Completion Rate"
          value={totalSessions > 0 ? `${Math.round((completedSessions / totalSessions) * 100)}%` : "—"}
          color="#3DBE29"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {!counsellors?.length ? (
            <div className="p-8 text-center text-[#6B7280] text-sm">
              No counsellors added yet. Use bulk onboarding in Settings to add counsellors.
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {counsellors.map((c) => {
                const stats = statsMap.get(c.id);
                const rate = stats && stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : null;
                return (
                  <div key={c.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3DBE29]/10 flex items-center justify-center text-[#3DBE29] font-bold">
                        {c.full_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1E1E2E]">{c.full_name}</p>
                        <p className="text-xs text-[#6B7280]">{c.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1E1E2E]">{stats?.total ?? 0} sessions</p>
                      <p className="text-xs text-[#6B7280]">
                        {rate !== null ? `${rate}% completion` : "No sessions yet"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
