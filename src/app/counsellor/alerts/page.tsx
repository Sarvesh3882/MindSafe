import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ResolveAlertButton } from "@/components/counsellor/resolve-alert-button";
import Link from "next/link";

const ALERT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  score_spike: { label: "Score Spike", color: "#FF6B6B", bg: "#FFF0F0" },
  crisis_keyword: { label: "Crisis Keyword", color: "#FF6B6B", bg: "#FFF0F0" },
  consecutive_bad_days: { label: "Consecutive Bad Days", color: "#FF9F43", bg: "#FFF8F0" },
  missed_session: { label: "Missed Session", color: "#FF9F43", bg: "#FFF8F0" },
};

export default async function CounsellorAlertsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: students } = await supabase
    .from("users").select("id").eq("college_id", profile?.college_id).eq("role", "student");

  const studentIds = students?.map((s) => s.id) ?? [];

  const { data: openAlerts } = await supabase
    .from("alerts")
    .select("*, student:student_id(id, full_name, department)")
    .in("student_id", studentIds.length ? studentIds : ["none"])
    .eq("resolved", false)
    .order("triggered_at", { ascending: false });

  const { data: resolvedAlerts } = await supabase
    .from("alerts")
    .select("*, student:student_id(id, full_name, department)")
    .in("student_id", studentIds.length ? studentIds : ["none"])
    .eq("resolved", true)
    .order("resolved_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Alerts</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          {openAlerts?.length ?? 0} open · {resolvedAlerts?.length ?? 0} resolved
        </p>
      </div>

      {/* Open alerts */}
      <section>
        <h2 className="text-base font-semibold text-[#1E1E2E] mb-3 flex items-center gap-2">
          Open Alerts
          {(openAlerts?.length ?? 0) > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#FF6B6B] text-white text-xs flex items-center justify-center">
              {openAlerts?.length}
            </span>
          )}
        </h2>
        {!openAlerts?.length ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-sm text-[#6B7280]">All students stable — no open alerts.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {openAlerts.map((a) => {
              const config = ALERT_LABELS[a.type] ?? { label: a.type, color: "#6B7280", bg: "#F8F9FF" };
              const student = a.student as { id: string; full_name: string; department?: string } | null;
              return (
                <Card key={a.id} className="border-l-4" style={{ borderLeftColor: config.color }}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: config.bg, color: config.color }}>
                        {student?.full_name?.[0] ?? "S"}
                      </div>
                      <div>
                        <Link href={`/counsellor/students/${student?.id}`} className="text-sm font-semibold text-[#1E1E2E] hover:text-[#3DBE29]">
                          {student?.full_name ?? "Student"}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: config.bg, color: config.color }}>
                            {config.label}
                          </span>
                          <span className="text-xs text-[#6B7280]">
                            {new Date(a.triggered_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ResolveAlertButton alertId={a.id} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Resolved */}
      {(resolvedAlerts?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-base font-semibold text-[#1E1E2E] mb-3">Resolved</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E5E7EB]">
                {resolvedAlerts!.map((a) => {
                  const config = ALERT_LABELS[a.type] ?? { label: a.type, color: "#6B7280", bg: "#F8F9FF" };
                  const student = a.student as { full_name: string } | null;
                  return (
                    <div key={a.id} className="flex items-center justify-between px-6 py-3 opacity-60">
                      <div>
                        <p className="text-sm font-medium text-[#1E1E2E]">{student?.full_name ?? "Student"}</p>
                        <p className="text-xs text-[#6B7280]">{config.label} · Resolved {a.resolved_at ? new Date(a.resolved_at).toLocaleDateString("en-IN") : "—"}</p>
                      </div>
                      <span className="text-xs bg-[#F0FFF0] text-[#3DBE29] px-2 py-1 rounded-full font-semibold">✓ Resolved</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
