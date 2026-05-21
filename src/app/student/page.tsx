import { Suspense } from "react";
import { StudentDashboardClient } from "@/components/student/dashboard-client";
import { DashboardSkeleton } from "@/components/student/dashboard-skeleton";
import { buildStudentInsight } from "@/lib/aria/insights";
import type { AssessmentScore } from "@/lib/aria/engine";

// Revalidate every 60 seconds for better performance
export const revalidate = 60;

const DEV_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

interface CheckinStatus {
  canCheckIn: boolean;
  lastCheckinTime: string | null;
  nextAvailableTime: string | null;
  hoursRemaining: number | null;
}

function getCheckinStatus(assessments: { date: string; created_at?: string; completed?: boolean }[]): CheckinStatus {
  const today = new Date().toISOString().split("T")[0];
  const todayAssessment = assessments.find((a) => a.date === today && a.completed);
  
  if (!todayAssessment) {
    return {
      canCheckIn: true,
      lastCheckinTime: null,
      nextAvailableTime: null,
      hoursRemaining: null,
    };
  }

  const lastCheckinTime = todayAssessment.created_at || todayAssessment.date;
  const lastCheckin = new Date(lastCheckinTime);
  const now = new Date();
  const hoursSinceCheckin = (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60);
  
  // Allow check-in if 24+ hours have passed
  if (hoursSinceCheckin >= 24) {
    return {
      canCheckIn: true,
      lastCheckinTime: lastCheckinTime,
      nextAvailableTime: null,
      hoursRemaining: null,
    };
  }

  // Calculate next available time (24 hours from last check-in)
  const nextAvailable = new Date(lastCheckin.getTime() + 24 * 60 * 60 * 1000);
  const hoursRemaining = Math.ceil((nextAvailable.getTime() - now.getTime()) / (1000 * 60 * 60));

  return {
    canCheckIn: false,
    lastCheckinTime: lastCheckinTime,
    nextAvailableTime: nextAvailable.toISOString(),
    hoursRemaining: hoursRemaining,
  };
}

// Mock data for dev/preview
const MOCK_PROFILE = { id: "dev", full_name: "Arjun Sharma", email: "student@demo.in", department: "Computer Science", year: 3, avatar_url: null };
const MOCK_MOOD_TREND = [
  { date: "2026-04-21", emotion: "good" },
  { date: "2026-04-22", emotion: "okay" },
  { date: "2026-04-23", emotion: "stressed" },
  { date: "2026-04-24", emotion: "low" },
  { date: "2026-04-25", emotion: "okay" },
  { date: "2026-04-26", emotion: "good" },
  { date: "2026-04-27", emotion: "great" },
];
const MOCK_SCORES: AssessmentScore = { depression: 4, anxiety: 6, stress: 10, sleep: 5, burnout: 8, loneliness: 3, substance: 0 };
const MOCK_SESSIONS = [
  { id: "1", date: "2026-04-30", time: "10:00", type: "online", status: "scheduled", counsellor: { full_name: "Dr. Priya Sharma" } },
];

export default async function StudentDashboardPage() {
  if (DEV_MODE) {
    const insight = buildStudentInsight(MOCK_SCORES, "great", MOCK_MOOD_TREND.map(m => m.emotion));
    const checkinStatus = getCheckinStatus([{ date: new Date().toISOString().split("T")[0], created_at: new Date().toISOString(), completed: true }]);
    return (
      <StudentDashboardClient
        profile={MOCK_PROFILE}
        checkedInToday={true}
        todayEmotion="great"
        insight={insight}
        moodTrend={MOCK_MOOD_TREND}
        upcomingSessions={MOCK_SESSIONS}
        checkinStatus={checkinStatus}
      />
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Anonymous user — show empty dashboard with mock-like defaults
  if (!user) {
    return (
      <StudentDashboardClient
        profile={{ full_name: "Guest", email: "" }}
        checkedInToday={false}
        todayEmotion={null}
        insight={null}
        moodTrend={[]}
        upcomingSessions={[]}
        checkinStatus={{ canCheckIn: true, lastCheckinTime: null, nextAvailableTime: null, hoursRemaining: null }}
      />
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Parallel queries for better performance
  const [profileResult, assessmentsResult, sessionsResult] = await Promise.all([
    supabase
      .from("users")
      .select("id, full_name, email, department, year, avatar_url")
      .eq("id", user.id)
      .single(),
    supabase
      .from("assessments")
      .select("date, emotion, scores, risk_level, completed, created_at")
      .eq("user_id", user.id)
      .gte("date", sevenDaysAgo)
      .order("date", { ascending: true }),
    supabase
      .from("sessions")
      .select("id, date, time, type, status, counsellor:counsellor_id(full_name)")
      .eq("student_id", user.id)
      .eq("status", "scheduled")
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(3),
  ]);

  const profile = profileResult.data;
  const recentAssessments = assessmentsResult.data;
  const upcomingSessions = sessionsResult.data;

  const todayAssessment = recentAssessments?.find((a) => a.date === today) ?? null;
  const recentEmotions = recentAssessments?.map((a) => a.emotion).filter(Boolean) ?? [];
  const latestScores = recentAssessments?.[recentAssessments.length - 1]?.scores as AssessmentScore | undefined;
  const latestEmotion = recentAssessments?.[recentAssessments.length - 1]?.emotion ?? "okay";
  const insight = latestScores ? buildStudentInsight(latestScores, latestEmotion, recentEmotions) : null;
  const moodTrend = recentAssessments?.map((a) => ({ date: a.date, emotion: a.emotion as string })) ?? [];
  const checkinStatus = getCheckinStatus(recentAssessments ?? []);

  const normalisedSessions = (upcomingSessions ?? []).map((s) => ({
    id: s.id as string, date: s.date as string, time: s.time as string,
    type: s.type as string, status: s.status as string,
    counsellor: Array.isArray(s.counsellor) ? (s.counsellor[0] as { full_name: string } | undefined) ?? null : (s.counsellor as { full_name: string } | null),
  }));

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StudentDashboardClient
        profile={profile}
        checkedInToday={!!todayAssessment?.completed}
        todayEmotion={todayAssessment?.emotion ?? null}
        insight={insight}
        moodTrend={moodTrend}
        upcomingSessions={normalisedSessions}
        checkinStatus={checkinStatus}
      />
    </Suspense>
  );
}

function calculateStreak(assessments: { date: string }[]): number {
  if (!assessments.length) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    if (assessments.find((a) => a.date === dateStr)) streak++;
    else if (i > 0) break;
  }
  return streak;
}
