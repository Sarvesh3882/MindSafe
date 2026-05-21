"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { HeroBanner } from "@/components/student/hero-banner";
import { EmptyState } from "@/components/student/empty-state";
import { MoodTrendChart, CheckinCountdown } from "@/components/student/lazy-components";
import { SubscriptionPopup } from "@/components/student/subscription-popup";
import { useAnonymous } from "@/lib/anonymous-context";
import type { StudentInsight } from "@/lib/aria/insights";

// Optimized animation variants - GPU accelerated only
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as any }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

interface Props {
  profile: { full_name: string; email: string } | null;
  checkedInToday: boolean;
  todayEmotion: string | null;
  insight: StudentInsight | null;
  moodTrend: { date: string; emotion: string }[];
  upcomingSessions: {
    id: string;
    date: string;
    time: string;
    type: string;
    status: string;
    counsellor: { full_name: string } | null;
  }[];
  checkinStatus: {
    canCheckIn: boolean;
    lastCheckinTime: string | null;
    nextAvailableTime: string | null;
    hoursRemaining: number | null;
  };
}

const EMOTIONS = [
  { key: "great", emoji: "😄", label: "Great", bg: "#F0FFF0" },
  { key: "good",  emoji: "🙂", label: "Good",  bg: "#F0F9FF" },
  { key: "okay",  emoji: "😐", label: "Okay",  bg: "#FAFAFA" },
  { key: "low",   emoji: "😔", label: "Low",   bg: "#FFF8F0" },
  { key: "stressed", emoji: "😟", label: "Stressed", bg: "#FFF0F0" },
  { key: "tired", emoji: "😴", label: "Tired", bg: "#F5F0FF" },
];

const EMOTION_EMOJI: Record<string, string> = {
  great: "😄", good: "🙂", okay: "😐", low: "😔", stressed: "😟", tired: "😴",
};

// Insight card colours — never red for students
const INSIGHT_STYLES = {
  green:  { bg: "from-[#3DBE29]/10 to-[#00C9A7]/10", text: "#3DBE29" },
  yellow: { bg: "from-[#FF9F43]/10 to-[#FFD700]/10", text: "#FF9F43" },
  blue:   { bg: "from-[#00C9A7]/10 to-[#4A90E2]/10", text: "#00C9A7" },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export function StudentDashboardClient({
  profile, checkedInToday, todayEmotion, insight, moodTrend, upcomingSessions, checkinStatus,
}: Props) {
  const router = useRouter();
  const { isAnonymous } = useAnonymous();
  const [popupFeature, setPopupFeature] = useState<"chat" | "sessions" | null>(null);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="font-student space-y-8 pb-12"
    >
      {/* Subscription popup for anonymous users */}
      <SubscriptionPopup
        open={popupFeature !== null}
        onClose={() => setPopupFeature(null)}
        feature={popupFeature ?? "chat"}
      />

      {/* Simplified background - static gradients only */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#3DBE29]/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4A90E2]/8 blur-[100px]" />
      </div>

      {/* Anonymous mode banner */}
      {isAnonymous && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#FFF8E7] to-[#FFFBF0] border-2 border-[#FF9F43]/30 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FF9F43]/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#FF9F43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1A1A24]">You're browsing as a Guest</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Take unlimited tests. Your data won't be saved. Chat & sessions require an account.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => router.push("/signup/student")}
              className="px-3 py-1.5 bg-[#3DBE29] text-white text-xs font-bold rounded-lg hover:bg-[#32A822] transition-colors"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-3 py-1.5 border border-[#E5E7EB] text-[#374151] text-xs font-semibold rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Banner */}
      <motion.div {...fadeInUp}>
        <HeroBanner userName={profile?.full_name ?? "there"} />
      </motion.div>

      {/* ── Check-in / Done card ── Subtle animations */}
      {/* Anonymous users can always check in — no 24h gate */}
      {(!checkedInToday && checkinStatus.canCheckIn) || isAnonymous ? (
        <motion.div 
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass rounded-3xl p-6 shadow-sm border border-white/60"
        >
          <h2 className="text-sm font-bold text-[#1E1E2E] mb-4 uppercase tracking-wider">How are you feeling right now?</h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-3 sm:grid-cols-6 gap-3"
          >
            {EMOTIONS.map((e) => (
              <motion.button
                key={e.label}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => router.push(`/student/checkin?emotion=${e.label.toLowerCase()}`)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-white/50 hover:border-[#3DBE29] hover:bg-white transition-colors shadow-sm"
                style={{ backgroundColor: e.bg }}
              >
                <span className="text-3xl">{e.emoji}</span>
                <span className="text-xs font-semibold text-[#6B7280]">{e.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      ) : checkedInToday && !checkinStatus.canCheckIn && !isAnonymous ? (
        <motion.div 
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          className="glass rounded-3xl p-6 shadow-sm border border-white/60 bg-gradient-to-r from-[#3DBE29]/10 to-[#00C9A7]/10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-24 h-24 flex-shrink-0"
            >
              <Image 
                src="/illustrations/student_checkin.svg"
                alt="Check-in complete"
                width={96}
                height={96}
                className="object-contain drop-shadow-lg"
              />
            </motion.div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-[#1E1E2E]">
                You're all set for today! 🎉
              </h2>
              <p className="text-[#6B7280] text-sm mt-1">
                You checked in feeling <strong className="capitalize text-[#3DBE29]">{todayEmotion}</strong>.
              </p>
              {checkinStatus.nextAvailableTime && (
                <div className="mt-3">
                  <CheckinCountdown nextAvailableTime={checkinStatus.nextAvailableTime} />
                </div>
              )}
              <p className="text-xs text-[#6B7280] mt-2 opacity-75">
                Your consistent tracking helps us provide better support. 🌿
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* ── Wellness insight card ── Subtle animations */}
      {insight && (
        <motion.div 
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          className={`glass rounded-3xl p-6 shadow-sm border border-white/60 bg-gradient-to-r ${INSIGHT_STYLES[insight.color].bg} transition-shadow`}
        >
          <div className="flex items-start gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="relative w-16 h-16 flex-shrink-0"
            >
              <Image 
                src="/illustrations/Student_Wellness_tips.svg"
                alt="Wellness tips"
                width={64}
                height={64}
                loading="lazy"
                className="object-contain drop-shadow-md"
              />
            </motion.div>
            <div className="flex-1">
              <p className="font-semibold text-[#1E1E2E]">
                {insight.headline}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">
                {insight.subtext}
              </p>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                whileHover={{ scale: 1.05 }}
                className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/50 shadow-sm border border-white cursor-default"
                style={{ color: INSIGHT_STYLES[insight.color].text }}
              >
                {insight.trendLabel}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Quick action cards ── */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-sm font-bold text-[#1E1E2E] mb-4 uppercase tracking-wider">Quick Actions</h3>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <QuickCard 
            emoji="🧘" 
            title="Wellness Exercises" 
            desc="Breathing techniques & guided relaxation" 
            href="/student/resources" 
            color="#00C9A7"
            illustration="Student_using_laptop_welness.svg"
          />
          <QuickCard 
            emoji="🌿" 
            title="My Recommendations" 
            desc="View wellness guidance and message counselor" 
            href={isAnonymous ? undefined : "/student/prescriptions"}
            onAnonymousClick={isAnonymous ? () => setPopupFeature("sessions") : undefined}
            color="#3DBE29"
            illustration="Student_Wellness_tips.svg"
            locked={isAnonymous}
          />
          <QuickCard 
            emoji="💬" 
            title="Book Counsellor" 
            desc="Schedule a confidential one-on-one session" 
            href={isAnonymous ? undefined : "/student/sessions"}
            onAnonymousClick={isAnonymous ? () => setPopupFeature("sessions") : undefined}
            color="#3DBE29"
            illustration="counsellor_booksession.svg"
            locked={isAnonymous}
          />
          <QuickCard 
            emoji="🤖" 
            title="Chat with Saathi" 
            desc="24/7 AI wellness companion for instant support" 
            href={isAnonymous ? undefined : "/student/chat"}
            onAnonymousClick={isAnonymous ? () => setPopupFeature("chat") : undefined}
            color="#4A90E2"
            illustration="chatbot_logo.svg"
            locked={isAnonymous}
          />
        </motion.div>
      </motion.div>

      {/* ── Upcoming sessions — hidden for anonymous ── */}
      {!isAnonymous && (
        upcomingSessions.length > 0 ? (
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <h3 className="text-sm font-bold text-[#1E1E2E] mb-3 uppercase tracking-wider">Upcoming sessions</h3>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-3"
            >
              {upcomingSessions.map((s) => (
                <motion.div 
                  key={s.id}
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ x: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="glass rounded-2xl p-4 shadow-sm border border-white/60 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3DBE29]/10 flex items-center justify-center text-[#3DBE29] font-bold">
                      {s.counsellor?.full_name?.[0] ?? "C"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1E1E2E]">{s.counsellor?.full_name ?? "Counsellor"}</p>
                      <p className="text-xs text-[#6B7280]">{s.date} at {s.time} · {s.type}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-white text-[#3DBE29] border border-[#3DBE29]/20 font-semibold px-3 py-1 rounded-full shadow-sm">
                    Scheduled
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <h3 className="text-sm font-bold text-[#1E1E2E] mb-3 uppercase tracking-wider">Upcoming sessions</h3>
            <EmptyState
              illustration="Student_in_stress_need_help.svg"
              title="No upcoming sessions yet"
              description="Book a session with a counsellor to get personalized support and guidance"
              ctaText="Book Session"
              ctaHref="/student/sessions"
            />
          </motion.div>
        )
      )}

      {/* ── Saathi chat button — removed from here, now in layout ── */}
    </motion.div>
  );
}

function QuickCard({ 
  emoji, 
  title, 
  desc, 
  href, 
  color,
  illustration,
  locked,
  onAnonymousClick,
}: { 
  emoji: string; 
  title: string; 
  desc: string; 
  href?: string; 
  color: string;
  illustration?: string;
  locked?: boolean;
  onAnonymousClick?: () => void;
}) {
  const getIcon = () => {
    if (title.includes("Wellness")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    } else if (title.includes("Recommendation")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    } else if (title.includes("Prescription")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (title.includes("Counsellor")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    }
  };

  const cardContent = (
    <motion.div 
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-gray-200 cursor-pointer h-full group relative"
    >
      {/* Lock badge for anonymous */}
      {locked && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF9F43]/15 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#FF9F43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
      )}

      {/* Icon at top */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {getIcon()}
      </motion.div>
      
      {/* Illustration */}
      {illustration && (
        <div className="relative h-40 mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white">
          <Image 
            src={`/illustrations/${illustration}`}
            alt={title}
            fill
            loading="lazy"
            className={`object-contain p-3 group-hover:scale-105 transition-transform duration-300 ${locked ? "opacity-60" : ""}`}
          />
        </div>
      )}
      
      {/* Text content */}
      <div>
        <h4 className="font-bold text-[#1A1A24] text-base mb-2 group-hover:text-[#3DBE29] transition-colors">
          {title}
          {locked && <span className="ml-2 text-xs font-semibold text-[#FF9F43] bg-[#FF9F43]/10 px-2 py-0.5 rounded-full">Account required</span>}
        </h4>
        <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  if (locked && onAnonymousClick) {
    return <div onClick={onAnonymousClick}>{cardContent}</div>;
  }

  return href ? <Link href={href}>{cardContent}</Link> : cardContent;
}
