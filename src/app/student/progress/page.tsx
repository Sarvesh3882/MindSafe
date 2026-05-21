import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildStudentInsight } from "@/lib/aria/insights";
import type { AssessmentScore } from "@/lib/aria/engine";
import Image from "next/image";
import Link from "next/link";

export default async function StudentProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Anonymous users have no stored progress
  const rawAssessments = user ? (await supabase
    .from("assessments")
    .select("date, emotion, scores")
    .eq("user_id", user.id)
    .gte("date", thirtyDaysAgo)
    .order("date", { ascending: true })).data : [];

  const totalCheckins = rawAssessments?.length ?? 0;

  const latest = rawAssessments?.[rawAssessments.length - 1];
  const recentEmotions = rawAssessments?.map((a) => a.emotion).filter(Boolean) ?? [];
  const insight = latest?.scores
    ? buildStudentInsight(latest.scores as AssessmentScore, latest.emotion, recentEmotions)
    : null;

  return (
    <div className="font-student space-y-8 pb-12">
      {/* Page header with illustration */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E2E]">My Progress</h1>
          <p className="text-[#6B7280] text-sm mt-1">Your wellness journey — one day at a time.</p>
        </div>
        <div className="hidden sm:block relative h-20 w-24 opacity-80">
          <Image src="/illustrations/meditation-rafiki.svg" alt="Wellness progress illustration" fill className="object-contain" />
        </div>
      </div>

      {/* Summary stat card */}
      <div className="glass rounded-3xl p-6 border border-white/60 text-center">
        <div className="text-4xl font-bold text-[#3DBE29] mb-2">{totalCheckins}</div>
        <div className="text-sm text-[#6B7280] font-medium">Total check-ins this month</div>
      </div>

      {/* Insight card */}
      {insight && (
        <div className="glass rounded-3xl p-6 border border-white/60 flex items-start gap-4">
          <span className="text-3xl mt-0.5">{insight.emoji}</span>
          <div>
            <p className="font-semibold text-[#1E1E2E]">{insight.headline}</p>
            <p className="text-sm text-[#6B7280] mt-1">{insight.subtext}</p>
            <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/60 border border-white/80 text-[#3DBE29]">
              {insight.trendLabel}
            </span>
          </div>
        </div>
      )}

      {/* Encouragement card */}
      {totalCheckins === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-white/60">
          <div className="relative h-40 w-40 mx-auto mb-4">
            <Image src="/illustrations/thinking-face-rafiki.svg" alt="No data yet illustration" fill className="object-contain" />
          </div>
          <h3 className="font-semibold text-[#1E1E2E] mb-2">Start your wellness journey</h3>
          <p className="text-sm text-[#6B7280] mb-4">Complete your first check-in to start tracking your progress.</p>
          <Link href="/student/checkin" className="inline-flex items-center gap-2 bg-[#3DBE29] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#32A822] transition-colors">
            Start check-in →
          </Link>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 text-center border border-white/60 bg-gradient-to-r from-[#3DBE29]/5 to-[#00C9A7]/5">
          <h3 className="font-semibold text-[#1E1E2E] mb-2">You're doing great! 🌟</h3>
          <p className="text-sm text-[#6B7280] mb-4">
            You've checked in {totalCheckins} {totalCheckins === 1 ? "time" : "times"} this month.
          </p>
          <p className="text-xs text-[#6B7280]">
            Keep checking in daily — small steps add up to big changes.
          </p>
        </div>
      )}

      {/* Resources suggestion */}
      <div className="glass rounded-3xl p-6 border border-white/60 flex items-center gap-4">
        <div className="text-4xl">📚</div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#1E1E2E]">Explore wellness resources</h3>
          <p className="text-sm text-[#6B7280] mt-1">
            Discover breathing exercises, meditations, and articles tailored to your needs.
          </p>
        </div>
        <Link href="/student/resources">
          <button className="bg-[#3DBE29] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#32A822] transition-colors">
            Browse
          </button>
        </Link>
      </div>
    </div>
  );
}
