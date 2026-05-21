"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { buildWellnessSummary } from "@/lib/aria/insights";
import type { AssessmentScore } from "@/lib/aria/engine";

interface WellnessSummaryProps {
  dominantConcern: keyof AssessmentScore | "general";
  isStable: boolean;
  isAnonymous: boolean;
  scores?: AssessmentScore;
}

// Map tip content to a professional SVG icon based on keywords
function TipIcon({ text, source }: { text: string; source: string }) {
  const combined = (text + source).toLowerCase();

  // Breathing / calm
  if (combined.includes("breath") || combined.includes("box breathing") || combined.includes("calm") || combined.includes("nervous system")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }
  // Walk / movement / exercise
  if (combined.includes("walk") || combined.includes("movement") || combined.includes("physical") || combined.includes("exercise")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 4a1 1 0 100-2 1 1 0 000 2zm-1 3l-2 5h4l1 5M9 7l-3 5" />
      </svg>
    );
  }
  // Sleep
  if (combined.includes("sleep") || combined.includes("rest") || combined.includes("night")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  }
  // Music / sound
  if (combined.includes("music") || combined.includes("song") || combined.includes("podcast") || combined.includes("sound")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    );
  }
  // Writing / journal
  if (combined.includes("write") || combined.includes("journal") || combined.includes("note")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  }
  // Connect / talk / reach out
  if (combined.includes("reach out") || combined.includes("connect") || combined.includes("talk") || combined.includes("message") || combined.includes("counsellor")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  }
  // Grounding / mindfulness
  if (combined.includes("ground") || combined.includes("mindful") || combined.includes("present") || combined.includes("moment")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }
  // Crisis / help
  if (combined.includes("crisis") || combined.includes("icall") || combined.includes("self-harm") || combined.includes("support")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  // Default — leaf/wellness
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

export function WellnessSummary({ dominantConcern, isStable, isAnonymous, scores }: WellnessSummaryProps) {
  const router = useRouter();
  const { headline, tips, sectionHeading } = buildWellnessSummary(dominantConcern, isStable, scores);

  return (
    <div className="bg-white font-student">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#3DBE29] to-[#00C9A7]" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── COMPLETION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#3DBE29] to-[#00C9A7] shadow-lg shadow-[#3DBE29]/30 mb-5"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F0FFF4] border border-[#3DBE29]/20 rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3DBE29] animate-pulse" />
              <span className="text-xs font-bold text-[#3DBE29]">Check-in Complete</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A24] leading-tight mb-3">
              You're all set!
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed max-w-md mx-auto">
              Thank you for taking the time to check in with yourself today.
            </p>
          </motion.div>
        </motion.div>

        {/* ── HEADLINE CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-gradient-to-br from-[#F0FFF4] to-[#F8FFF8] border-2 border-[#3DBE29]/20 rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
          {/* Decorative circle */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#3DBE29]/8" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#00C9A7]/8" />

          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#3DBE29]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-[#3DBE29]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-base text-[#1A1A24] leading-relaxed font-medium">{headline}</p>
          </div>
        </motion.div>

        {/* ── WELLNESS TIPS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#F0FFF4] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#3DBE29]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#1A1A24]">{sectionHeading}</h2>
          </div>

          <div className="space-y-3">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + index * 0.08 }}
                className="bg-white rounded-xl border border-[#F0F0F0] p-5 hover:border-[#3DBE29]/30 hover:shadow-sm transition-all group"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-[#F8FFF8] border border-[#E8F5E9] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F0FFF4] transition-colors text-[#3DBE29]">
                    <TipIcon text={tip.text} source={tip.source} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#374151] leading-relaxed mb-1.5">{tip.text}</p>
                    <p className="text-xs text-[#9CA3AF] font-medium">{tip.source}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── ILLUSTRATION ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/illustrations/Student_Wellness_tips.svg"
            alt="Wellness illustration"
            width={220}
            height={160}
            className="object-contain opacity-80"
          />
        </motion.div>

        {/* ── ANONYMOUS PROMPT ── */}
        {isAnonymous && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-5 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1E40AF] mb-1">Track your progress over time</p>
                <p className="text-xs text-[#3B82F6] leading-relaxed mb-3">
                  Create an account to access personalized support and see your wellness trends.
                </p>
                <button
                  onClick={() => router.push("/signup/student")}
                  className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-xs font-bold hover:bg-[#2563EB] transition-colors"
                >
                  Create account
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push("/student/chat")}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#3DBE29]/25 active:scale-[0.98] transition-all"
          >
            <Image src="/illustrations/chatbot_logo.svg" alt="" width={20} height={20} className="w-5 h-5" />
            Talk to Saathi
          </button>
          <button
            onClick={() => router.push("/student")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#E5E7EB] text-[#374151] rounded-xl font-bold text-sm hover:border-[#3DBE29]/40 hover:bg-[#F9FAFB] active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </motion.div>

        {/* Privacy note */}
        <p className="text-center text-xs text-[#D1D5DB] mt-6 flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Your wellness data is private and secure
        </p>
      </div>
    </div>
  );
}
