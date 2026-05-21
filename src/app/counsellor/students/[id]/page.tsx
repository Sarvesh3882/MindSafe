import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { SessionNotesEditor } from "@/components/counsellor/session-notes-editor";
import { SessionNotesHistory } from "@/components/counsellor/session-notes-history";
import { EscalateToAdminButton } from "@/components/counsellor/escalate-to-admin-button";
import { MoodTimeline } from "@/components/counsellor/mood-timeline";
import { RiskLevelHistory } from "@/components/counsellor/risk-level-history";
import { ClinicalScoreTrends } from "@/components/counsellor/clinical-score-trends";
import { buildCounsellorView } from "@/lib/aria/insights";
import type { AssessmentScore, RiskLevel } from "@/lib/aria/engine";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // ── 1. Authenticate counsellor ──────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  // ── 2. Fetch data in parallel (3x faster!) ──────────────────────────────────
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [
    { data: counsellor },
    { data: student },
    { data: assessments },
    { data: sessions }
  ] = await Promise.all([
    // Counsellor info
    supabase
      .from("users")
      .select("id, college_id")
      .eq("id", user.id)
      .eq("role", "counsellor")
      .single(),
    
    // Student info
    supabase
      .from("users")
      .select("id, full_name, email, department, year, phone, college_id")
      .eq("id", id)
      .eq("role", "student")
      .single(),
    
    // Assessments (last 30 days)
    supabase
      .from("assessments")
      .select("date, risk_level, scores, emotion")
      .eq("user_id", id)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: true }),
    
    // Sessions (last 10)
    supabase
      .from("sessions")
      .select("id, date, time, type, status, notes")
      .eq("student_id", id)
      .order("date", { ascending: false })
      .limit(10)
  ]);

  if (!counsellor) notFound();
  if (!student) notFound();

  // College isolation check — return 404 if student belongs to a different college
  if (student.college_id !== counsellor.college_id) notFound();

  // ── 3. Build clinical view from latest assessment ───────────────────────────
  const latestAssessment = assessments?.[assessments.length - 1] ?? null;
  const hasAssessments = (assessments?.length ?? 0) > 0;

  const clinicalView =
    latestAssessment?.scores
      ? buildCounsellorView(
          latestAssessment.scores as AssessmentScore,
          latestAssessment.risk_level as RiskLevel
        )
      : null;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Teal initials circle */}
          <div className="w-14 h-14 rounded-full bg-[#E0FAF5] flex items-center justify-center text-[#00C9A7] font-bold text-xl">
            {student.full_name?.[0] ?? "S"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E2E]">{student.full_name}</h1>
            <p className="text-[#6B7280] text-sm">
              {student.department ?? "—"} · Year {student.year ?? "—"} · {student.email}
            </p>
          </div>
        </div>
        {clinicalView && (
          <div className="flex items-center gap-3">
            <RiskBadge level={clinicalView.riskLevel} />
            <EscalateToAdminButton studentId={id} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column — trends + sessions ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Clinical Summary card */}
          {clinicalView && (
            <Card className="border-l-4" style={{ borderLeftColor: clinicalView.riskColor }}>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                  Clinical Summary
                </p>
                <p className="text-sm text-[#1E1E2E]">{clinicalView.aiSummary}</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Primary concern: <strong>{clinicalView.dominantConcern}</strong>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Clinical score trends chart */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Score Trends (30 Days)</CardTitle>
              <p className="text-xs text-[#6B7280]">PHQ-9, GAD-7, PSS-10, ISI scores over time</p>
            </CardHeader>
            <CardContent>
              {hasAssessments ? (
                <ClinicalScoreTrends assessments={assessments ?? []} />
              ) : (
                <div className="flex items-center justify-center h-48 text-sm text-[#6B7280]">
                  No check-in data in the last 30 days
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Timeline</CardTitle>
              <p className="text-xs text-[#6B7280]">Daily emotions and risk levels</p>
            </CardHeader>
            <CardContent>
              {hasAssessments ? (
                <MoodTimeline assessments={assessments ?? []} />
              ) : (
                <div className="flex items-center justify-center h-24 text-sm text-[#6B7280]">
                  No check-in data in the last 30 days
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session history */}
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!sessions?.length ? (
                <p className="p-6 text-sm text-[#6B7280]">No sessions yet.</p>
              ) : (
                <div className="divide-y divide-[#E5E7EB]">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1E1E2E]">
                          {s.date} at {s.time}
                        </p>
                        <p className="text-xs text-[#6B7280] capitalize">
                          {s.type} · {s.status}
                        </p>
                      </div>
                      {s.notes && (
                        <span className="text-xs font-semibold text-[#00C9A7] bg-[#E0FAF5] px-2 py-1 rounded-full">
                          Has notes
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column — clinical scores + notes ────────────────────────── */}
        <div className="space-y-4">

          {/* Risk Level History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Level History</CardTitle>
              <p className="text-xs text-[#6B7280]">Changes over time</p>
            </CardHeader>
            <CardContent>
              {hasAssessments ? (
                <RiskLevelHistory assessments={assessments ?? []} />
              ) : (
                <div className="flex items-center justify-center h-24 text-sm text-[#6B7280]">
                  No check-in data in the last 30 days
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical scores — score + severity label (counsellor only) */}
          {clinicalView && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clinical Scores</CardTitle>
                <p className="text-xs text-[#6B7280]">
                  {latestAssessment?.date} · Counsellor view only
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {clinicalView.clinicalScores.map((s) => (
                  <div key={s.instrument}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[#6B7280] font-medium">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E1E2E]">
                          {s.score}/{s.maxScore}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full font-semibold text-xs"
                          style={{
                            backgroundColor: `${s.severityColor}20`,
                            color: s.severityColor,
                          }}
                        >
                          {s.severity}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${s.percentage}%`,
                          backgroundColor: s.severityColor,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">{s.instrument}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Session notes editor */}
          <SessionNotesEditor studentId={id} studentName={student.full_name} />
          
          {/* Session notes history */}
          <SessionNotesHistory studentId={id} />
        </div>
      </div>
    </div>
  );
}
