"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CrisisScreen() {
  const router = useRouter();

  return (
    <div className="bg-white font-student">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#4A90E2] to-[#00C9A7]" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#4A90E2] to-[#00C9A7] shadow-lg shadow-[#4A90E2]/30 mb-5"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-pulse" />
              <span className="text-xs font-bold text-[#3B82F6]">Support Available Now</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A24] leading-tight mb-3">
              We're here for you
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed max-w-md mx-auto">
              It sounds like you're going through a really tough time. You don't have to face this alone — there are people ready to listen and support you.
            </p>
          </motion.div>
        </motion.div>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#1A1A24]">Talk to someone right now</h2>
        </motion.div>

        {/* Helpline cards */}
        <div className="space-y-3 mb-8">

          {/* iCall */}
          <motion.a
            href="tel:9152987821"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(74,144,226,0.12)" }}
            className="block bg-white rounded-2xl border-2 border-[#BFDBFE] p-5 hover:border-[#4A90E2]/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                <svg className="w-6 h-6 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-[#1A1A24] text-sm">iCall — TISS Mumbai</h3>
                  <span className="text-xs font-semibold text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-full">Free</span>
                </div>
                <p className="text-xl font-black text-[#4A90E2] mb-1">9152987821</p>
                <p className="text-xs text-[#6B7280]">Mon–Sat, 8 AM–10 PM · English, Hindi & more</p>
              </div>
              <svg className="w-5 h-5 text-[#4A90E2] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.a>

          {/* Tele-MANAS */}
          <motion.a
            href="tel:14416"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.42 }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(74,144,226,0.12)" }}
            className="block bg-white rounded-2xl border-2 border-[#BFDBFE] p-5 hover:border-[#4A90E2]/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                <svg className="w-6 h-6 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-[#1A1A24] text-sm">Tele-MANAS</h3>
                  <span className="text-xs font-semibold text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-full">24×7</span>
                  <span className="text-xs font-semibold text-[#3DBE29] bg-[#F0FFF4] px-2 py-0.5 rounded-full">Toll-free</span>
                </div>
                <p className="text-xl font-black text-[#4A90E2] mb-1">14416</p>
                <p className="text-xs text-[#6B7280]">National helpline · Ministry of Health · Multilingual</p>
              </div>
              <svg className="w-5 h-5 text-[#4A90E2] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.a>
        </div>

        {/* Soft support note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-gradient-to-br from-[#F0FFF4] to-[#F8FFF8] border-2 border-[#3DBE29]/20 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3DBE29]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-[#374151] leading-relaxed">
              Not ready to call right now? That's okay. You can talk to Saathi, our AI wellness companion, or reach out to a counsellor through your dashboard whenever you feel ready.
            </p>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/illustrations/Student_in_stress_need_help.svg"
            alt=""
            width={180}
            height={140}
            className="object-contain opacity-60"
          />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
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
          Your responses are private and secure
        </p>
      </div>
    </div>
  );
}
