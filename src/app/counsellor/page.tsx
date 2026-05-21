import { StatCard } from "@/components/ui/stat-card";
import { RiskBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const DEV_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

const MOCK_STUDENTS = [
  { id: "1", full_name: "Arjun Sharma", department: "Computer Science", year: 3, latestAssessment: { risk_level: "critical" } },
  { id: "2", full_name: "Priya Patel", department: "Mechanical Engg", year: 2, latestAssessment: { risk_level: "attention" } },
  { id: "3", full_name: "Rahul Verma", department: "Civil Engg", year: 4, latestAssessment: { risk_level: "stable" } },
  { id: "4", full_name: "Sneha Iyer", department: "Electronics", year: 1, latestAssessment: { risk_level: "stable" } },
  { id: "5", full_name: "Karan Mehta", department: "Computer Science", year: 3, latestAssessment: { risk_level: "attention" } },
];
const MOCK_SESSIONS = [
  { id: "1", time: "10:00", type: "online", status: "scheduled", student: { full_name: "Arjun Sharma" } },
  { id: "2", time: "14:00", type: "offline", status: "scheduled", student: { full_name: "Priya Patel" } },
];
const MOCK_ALERTS = [
  { id: "1", type: "score_spike", triggered_at: new Date().toISOString(), student: { full_name: "Arjun Sharma" } },
];

export default async function CounsellorDashboardPage() {
  if (DEV_MODE) {
    return <CounsellorDashboard
      students={MOCK_STUDENTS}
      todaySessions={MOCK_SESSIONS}
      alerts={MOCK_ALERTS}
      critical={1} attention={2}
    />;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("users").select("*, college_id").eq("id", user!.id).single();
  const { data: students } = await supabase.from("users").select("id, full_name, department, year")
    .eq("college_id", profile?.college_id).eq("role", "student");

  const studentIds = students?.map((s) => s.id) ?? [];
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: assessments } = await supabase.from("assessments")
    .select("user_id, risk_level, date, emotion, scores, counsellor_reviewed")
    .in("user_id", studentIds.length ? studentIds : ["none"])
    .gte("date", thirtyDaysAgo).order("date", { ascending: false });

  // Build triage list with smart risk display logic
  const latestByStudent = new Map<string, typeof assessments extends (infer T)[] | null ? T : never>();
  const unreviewedCriticalStudents = new Set<string>();
  
  assessments?.forEach((a) => {
    // Track unreviewed critical assessments
    if (a.risk_level === 'critical' && !a.counsellor_reviewed) {
      unreviewedCriticalStudents.add(a.user_id);
    }
    // Track latest assessment per student
    if (!latestByStudent.has(a.user_id)) {
      latestByStudent.set(a.user_id, a);
    }
  });

  const triageList = students?.map((s) => {
    const latestAssessment = latestByStudent.get(s.id);
    // If student has unreviewed critical assessment, show as critical regardless of latest
    const displayRiskLevel = unreviewedCriticalStudents.has(s.id) 
      ? 'critical' 
      : latestAssessment?.risk_level;
    
    return {
      ...s,
      latestAssessment: latestAssessment ? {
        ...latestAssessment,
        risk_level: displayRiskLevel // Override with display risk level
      } : undefined
    };
  })
    .sort((a, b) => {
      const order = { critical: 0, attention: 1, stable: 2, undefined: 3 };
      return (order[(a.latestAssessment?.risk_level ?? "undefined") as keyof typeof order] ?? 3) -
             (order[(b.latestAssessment?.risk_level ?? "undefined") as keyof typeof order] ?? 3);
    }) ?? [];

  const critical = triageList.filter((s) => s.latestAssessment?.risk_level === "critical").length;
  const attention = triageList.filter((s) => s.latestAssessment?.risk_level === "attention").length;

  const { data: todaySessions } = await supabase.from("sessions")
    .select("*, student:student_id(full_name)").eq("counsellor_id", user!.id)
    .eq("date", today).order("time", { ascending: true });

  const { data: alerts } = await supabase.from("alerts")
    .select("*, student:student_id(full_name)").eq("resolved", false)
    .in("student_id", studentIds.length ? studentIds : ["none"])
    .order("triggered_at", { ascending: false }).limit(5);

  return <CounsellorDashboard students={triageList} todaySessions={todaySessions ?? []} alerts={alerts ?? []} critical={critical} attention={attention} />;
}

function CounsellorDashboard({ students, todaySessions, alerts, critical, attention }: {
  students: { id: string; full_name: string; department?: string | null; year?: number | null; latestAssessment?: { risk_level: string } }[];
  todaySessions: Record<string, unknown>[];
  alerts: Record<string, unknown>[];
  critical: number;
  attention: number;
}) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div className="space-y-6 pb-12">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#00C9A7] to-[#00B396] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{greeting}, Counsellor</h1>
            <p className="text-white/90 text-sm">
              {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {alerts.length > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                </svg>
                <span className="font-semibold text-sm">{alerts.length} Alert{alerts.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-semibold text-sm">{todaySessions.length} Session{todaySessions.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#00C9A7] to-[#00B396] rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black mb-1">{students.length}</p>
          <p className="text-sm text-white/90 font-medium">Total Students</p>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B6B] to-[#EF4444] rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black mb-1">{critical}</p>
          <p className="text-sm text-white/90 font-medium">Critical Priority</p>
        </div>

        <div className="bg-gradient-to-br from-[#FF9F43] to-[#F97316] rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black mb-1">{attention}</p>
          <p className="text-sm text-white/90 font-medium">Needs Attention</p>
        </div>

        <div className="bg-gradient-to-br from-[#5BDBC4] to-[#4AC9B3] rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black mb-1">{todaySessions.length}</p>
          <p className="text-sm text-white/90 font-medium">Today&apos;s Sessions</p>
        </div>
      </div>

      {/* Quick Actions - Wellness Recommendations */}
      <Link href="/counsellor/prescriptions" className="block group">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#00C9A7] to-[#3DBE29] rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-300">
          {/* Decorative background circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -right-2 top-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>

              {/* Text */}
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Counselor Tools</p>
                <h3 className="text-xl font-bold leading-tight">Wellness Recommendations</h3>
                <p className="text-sm text-white/80 mt-1">Share guidance, coping strategies, and follow-up support</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:translate-x-1 transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Feature pills — SVG icons only, no emojis */}
          <div className="relative mt-5 pt-4 border-t border-white/20 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
              Recommendations
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Messaging
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Meeting Links
            </div>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triage list */}
        <div className="lg:col-span-2">
          <Card className="border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFB] to-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1E293B]">Student Triage</CardTitle>
                  <p className="text-sm text-[#64748B] mt-1">Sorted by priority — critical first</p>
                </div>
                <Link href="/counsellor/students" className="text-sm font-semibold text-[#00C9A7] hover:text-[#00B396] transition-colors flex items-center gap-1">
                  View All
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {students.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#E0FAF5] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth={2} className="w-12 h-12">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className="text-[#64748B] text-sm font-medium">No students assigned yet</p>
                  <p className="text-[#94A3B8] text-xs mt-1">Students will appear here once assigned to you</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {students.slice(0, 15).map((s) => (
                    <Link key={s.id} href={`/counsellor/students/${s.id}`}>
                      <div className="flex items-center justify-between px-6 py-4 hover:bg-[#E0FAF5]/40 transition-all cursor-pointer group relative">
                        {/* Risk level indicator bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          s.latestAssessment?.risk_level === 'critical' ? 'bg-[#FF6B6B]' :
                          s.latestAssessment?.risk_level === 'attention' ? 'bg-[#FF9F43]' :
                          s.latestAssessment?.risk_level === 'stable' ? 'bg-[#10B981]' :
                          'bg-[#E2E8F0]'
                        }`} />
                        
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00C9A7] to-[#00B396] flex items-center justify-center text-white font-bold text-base shadow-sm">
                            {s.full_name?.[0] ?? "S"}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#1E293B] group-hover:text-[#00C9A7] transition-colors">{s.full_name}</p>
                            <p className="text-xs text-[#64748B] mt-0.5">{s.department ?? "—"} · Year {s.year ?? "—"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {s.latestAssessment ? (
                            <RiskBadge level={s.latestAssessment.risk_level as "stable" | "attention" | "critical"} />
                          ) : (
                            <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-3 py-1.5 rounded-full font-medium">No data</span>
                          )}
                          <svg viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} className="w-4 h-4 group-hover:stroke-[#00C9A7] transition-colors">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <Card className="border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#E0FAF5] to-white">
              <CardTitle className="text-base text-[#1E293B] flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth={2} className="w-5 h-5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Today&apos;s Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4 space-y-3">
              {!todaySessions.length ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#E0FAF5] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth={2} className="w-8 h-8">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">No sessions scheduled</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Enjoy your free day!</p>
                </div>
              ) : (
                todaySessions.map((s) => (
                  <div key={s.id as string} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#00C9A7] hover:bg-[#E0FAF5]/30 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#5BDBC4] to-[#4AC9B3] flex items-center justify-center text-white flex-shrink-0">
                      <span className="text-xs font-bold">{(s.time as string).split(':')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] truncate">{(s.student as { full_name: string } | null)?.full_name ?? "Student"}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {s.time as string} · 
                        <span className="capitalize ml-1">{s.type as string}</span>
                      </p>
                    </div>
                    <span className="text-xs bg-[#E0FAF5] text-[#00B396] px-2.5 py-1 rounded-full font-semibold capitalize flex-shrink-0">
                      {s.status as string}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E2E8F0] shadow-sm">
            <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#FEF2F2] to-white">
              <CardTitle className="text-base flex items-center gap-2 text-[#1E293B]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth={2} className="w-5 h-5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Active Alerts
                {alerts.length > 0 && (
                  <span className="w-6 h-6 rounded-full bg-[#FF6B6B] text-white text-xs flex items-center justify-center font-bold ml-auto">
                    {alerts.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4 space-y-3">
              {!alerts.length ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-sm font-medium text-[#10B981]">All Clear!</p>
                  <p className="text-xs text-[#64748B] mt-1">No active alerts today</p>
                </div>
              ) : (
                alerts.map((a) => (
                  <div key={a.id as string} className="flex items-start gap-3 p-3 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2]/50 hover:bg-[#FEF2F2] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B6B] mt-2 flex-shrink-0 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B]">{(a.student as { full_name: string } | null)?.full_name ?? "Student"}</p>
                      <p className="text-xs text-[#64748B] capitalize mt-0.5">{(a.type as string).replace(/_/g, " ")}</p>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {new Date(a.triggered_at as string).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-[#00C9A7] hover:text-[#00B396] transition-colors flex-shrink-0">
                      View
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
