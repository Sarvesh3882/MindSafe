import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { anonymizeStudent } from "@/lib/utils";

const ALERT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  score_spike: { label: "Score Spike", color: "#FF6B6B", bg: "#FFF0F0" },
  crisis_keyword: { label: "Crisis Keyword", color: "#FF6B6B", bg: "#FFF0F0" },
  consecutive_bad_days: { label: "Consecutive Bad Days", color: "#FF9F43", bg: "#FFF8F0" },
  missed_session: { label: "Missed Session", color: "#FF9F43", bg: "#FFF8F0" },
};

export default async function AdminAlertsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from("users").select("college_id").eq("id", user!.id).single();

  const { data: students } = await supabase
    .from("users").select("id").eq("college_id", adminProfile?.college_id).eq("role", "student");

  const studentIds = students?.map((s) => s.id) ?? [];

  const { data: openAlerts } = await supabase
    .from("alerts")
    .select("id, student_id, type, triggered_at, resolved")
    .in("student_id", studentIds.length ? studentIds : ["none"])
    .eq("resolved", false)
    .order("triggered_at", { ascending: false });

  const { data: resolvedAlerts } = await supabase
    .from("alerts")
    .select("id, student_id, type, triggered_at, resolved_at")
    .in("student_id", studentIds.length ? studentIds : ["none"])
    .eq("resolved", true)
    .order("resolved_at", { ascending: false })
    .limit(30);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Crisis Alerts</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          All student identities anonymized · {openAlerts?.length ?? 0} open · {resolvedAlerts?.length ?? 0} resolved
        </p>
      </div>

      {/* Open */}
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
              <p className="text-sm text-[#6B7280]">All students stable today — no open alerts.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E5E7EB]">
                {openAlerts.map((a) => {
                  const config = ALERT_LABELS[a.type] ?? { label: a.type, color: "#6B7280", bg: "#F8F9FF" };
                  return (
                    <div key={a.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: config.color }} />
                        <div>
                          {/* Admin sees anonymized ID only — never student name */}
                          <p className="text-sm font-semibold text-[#1E1E2E]">{anonymizeStudent(a.student_id)}</p>
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
                      <span className="text-xs bg-[#FFF0F0] text-[#FF6B6B] px-3 py-1 rounded-full font-semibold">Open</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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
                  return (
                    <div key={a.id} className="flex items-center justify-between px-6 py-3 opacity-60">
                      <div>
                        <p className="text-sm font-medium text-[#1E1E2E]">{anonymizeStudent(a.student_id)}</p>
                        <p className="text-xs text-[#6B7280]">{config.label} · Resolved {new Date(a.resolved_at).toLocaleDateString("en-IN")}</p>
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
