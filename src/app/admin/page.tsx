import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { Suspense } from "react";
import AdminDashboardLoading from "./loading";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEV_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

const MOCK_TREND = [
  { date: "21 Apr", stable: 120, attention: 30, critical: 5, checkins: 155 },
  { date: "22 Apr", stable: 115, attention: 35, critical: 8, checkins: 158 },
  { date: "23 Apr", stable: 125, attention: 28, critical: 4, checkins: 157 },
  { date: "24 Apr", stable: 130, attention: 25, critical: 3, checkins: 158 },
  { date: "25 Apr", stable: 128, attention: 27, critical: 6, checkins: 161 },
  { date: "26 Apr", stable: 135, attention: 22, critical: 2, checkins: 159 },
  { date: "27 Apr", stable: 140, attention: 18, critical: 1, checkins: 159 },
];
const MOCK_STUDENTS = [
  { id: "1", department: "Computer Science" }, { id: "2", department: "Computer Science" },
  { id: "3", department: "Mechanical Engg" }, { id: "4", department: "Civil Engg" },
  { id: "5", department: "Electronics" }, { id: "6", department: "Electronics" },
];
const MOCK_ASSESSMENTS = [
  { user_id: "1", date: "2026-04-27", risk_level: "stable" },
  { user_id: "2", date: "2026-04-27", risk_level: "attention" },
  { user_id: "3", date: "2026-04-27", risk_level: "stable" },
  { user_id: "4", date: "2026-04-27", risk_level: "critical" },
  { user_id: "5", date: "2026-04-27", risk_level: "stable" },
  { user_id: "6", date: "2026-04-27", risk_level: "attention" },
];
const MOCK_ALERTS = [
  { id: "1", type: "score_spike", triggered_at: new Date().toISOString(), resolved: false },
  { id: "2", type: "crisis_keyword", triggered_at: new Date().toISOString(), resolved: false },
];
const MOCK_COUNSELLORS = [
  { id: "1", full_name: "Dr. Priya Sharma" },
  { id: "2", full_name: "Mr. Rahul Nair" },
];

export default async function AdminDashboardPage() {
  if (DEV_MODE) {
    return <AdminDashboardClient
      total={159} stable={140} attention={18} critical={1} checkedIn={159}
      trendData={MOCK_TREND} students={MOCK_STUDENTS} assessments={MOCK_ASSESSMENTS}
    />;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const { createServiceRoleClient } = await import("@/lib/supabase/service-role");
  
  // Use regular client to get current user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Use service role client to fetch data (bypasses RLS)
  const serviceSupabase = createServiceRoleClient();

  const { data: adminProfile } = await serviceSupabase.from("users").select("college_id").eq("id", user!.id).single();
  const collegeId = adminProfile?.college_id;

  const { data: students } = await serviceSupabase.from("users").select("id, department")
    .eq("college_id", collegeId).eq("role", "student");

  const studentIds = students?.map((s) => s.id) ?? [];
  const total = studentIds.length;

  // Fetch ALL assessments (no date filter) - like counsellor does
  const { data: allAssessments } = await serviceSupabase.from("assessments")
    .select("user_id, date, risk_level, completed")
    .in("user_id", studentIds.length ? studentIds : ["none"])
    .order("date", { ascending: false });

  // Calculate latest risk levels (from all assessments)
  const latestByStudent = new Map<string, string>();
  allAssessments?.forEach((a) => { 
    if (!latestByStudent.has(a.user_id)) {
      latestByStudent.set(a.user_id, a.risk_level);
    }
  });

  const stable = [...latestByStudent.values()].filter((r) => r === "stable").length;
  const attention = [...latestByStudent.values()].filter((r) => r === "attention").length;
  const critical = [...latestByStudent.values()].filter((r) => r === "critical").length;
  const checkedIn = latestByStudent.size;

  // Build trend data from ALL assessments (we'll filter by time range in the client)
  const trendMap = new Map<string, { stable: number; attention: number; critical: number; checkins: number }>();
  allAssessments?.forEach((a) => {
    const existing = trendMap.get(a.date) ?? { stable: 0, attention: 0, critical: 0, checkins: 0 };
    existing[a.risk_level as "stable" | "attention" | "critical"]++;
    existing.checkins++;
    trendMap.set(a.date, existing);
  });
  
  const trendData = Array.from(trendMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, vals]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), 
      ...vals,
    }));

  return <AdminDashboardClient total={total} stable={stable} attention={attention} critical={critical}
    checkedIn={checkedIn} trendData={trendData} students={students ?? []}
    assessments={allAssessments ?? []} />;
}
