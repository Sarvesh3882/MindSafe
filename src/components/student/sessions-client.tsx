"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MeetingLink } from "@/components/meetings/MeetingLink";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-[#F0FFF0] text-[#3DBE29] border border-[#3DBE29]/20",
  completed: "bg-[#F8F9FF] text-[#6B7280] border border-[#E5E7EB]",
  cancelled: "bg-[#FFF0F0] text-[#FF6B6B] border border-[#FF6B6B]/20",
  no_show: "bg-[#FFF8F0] text-[#FF9F43] border border-[#FF9F43]/20",
};

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

interface SessionsClientProps {
  upcoming: Array<Record<string, unknown>>;
  past: Array<Record<string, unknown>>;
}

export function SessionsClient({ upcoming, past }: SessionsClientProps) {
  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="font-student space-y-8 pb-12"
    >
      {/* Header with Hero Banner */}
      <motion.div {...fadeInUp} className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-[#3DBE29]/15 to-[#00C9A7]/15 blur-xl opacity-50" />
        <div className="absolute -top-6 right-24 w-32 h-32 rounded-full bg-gradient-to-br from-[#00C9A7]/10 to-[#3DBE29]/10 blur-2xl opacity-40" />
        
        <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/40 bg-white">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-[#FAFFFE] via-45% to-[#F0FFF4] to-100%" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 items-center min-h-[280px]">
            {/* Left side - Text content */}
            <div className="relative z-20 p-8 lg:py-10 lg:pl-12 lg:pr-8 space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-[2.5rem] lg:text-[3rem] font-black text-[#1A1A24] leading-[1.1] tracking-tight">
                  Your Sessions
                </h1>
                <p className="text-[#6B7280] text-base lg:text-lg font-medium mt-2">
                  Confidential, safe, and always on your terms.
                </p>
              </motion.div>
              
              {/* CTA Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-xl"
              >
                <Link href="/student/sessions/book">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(61, 190, 41, 0.25)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white text-base font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Book a Session
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            
            {/* Right side - Illustration */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative lg:w-[380px] xl:w-[420px] h-56 lg:h-[280px] flex-shrink-0"
            >
              {/* Fade overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0" style={{ 
                  background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 8%, rgba(255,255,255,0.6) 15%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.1) 35%, transparent 45%)'
                }} />
              </div>
              
              {/* Illustration */}
              <div className="absolute inset-0 lg:-right-4">
                <Image
                  src="/illustrations/counsellor_booksession.svg"
                  alt="Book counselling session"
                  fill
                  priority
                  className="object-cover object-left-top lg:object-contain"
                  style={{ objectPosition: 'left center' }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Bottom shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/[0.02] to-transparent pointer-events-none" />
          
          {/* Edge glow */}
          <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/20 pointer-events-none" />
        </div>
      </motion.div>

      {/* Upcoming Sessions */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#1E1E2E] uppercase tracking-wider flex items-center gap-2">
            <svg className="w-5 h-5 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upcoming ({upcoming.length})
          </h2>
        </div>
        
        {upcoming.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass rounded-3xl p-12 text-center border border-white/60 bg-gradient-to-br from-white to-[#F0FFF4]/30"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="relative h-48 w-48 mx-auto mb-6"
            >
              <Image 
                src="/illustrations/Student_in_stress_need_help.svg" 
                alt="No sessions illustration" 
                fill 
                className="object-contain drop-shadow-lg" 
              />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-xl font-bold text-[#1E1E2E] mb-2"
            >
              No upcoming sessions
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-[#6B7280] text-sm mb-6 max-w-md mx-auto"
            >
              Book a confidential session with a counsellor whenever you&apos;re ready. We&apos;re here to support you.
            </motion.p>
            <Link href="/student/sessions/book">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 16px rgba(61, 190, 41, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#3DBE29] text-[#3DBE29] text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#F0FFF0] transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Book Your First Session
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            {upcoming.map((s) => <SessionCard key={s.id as string} session={s} />)}
          </motion.div>
        )}
      </motion.section>

      {/* Past Sessions */}
      {past.length > 0 && (
        <motion.section
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1E1E2E] uppercase tracking-wider flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Past Sessions ({past.length})
            </h2>
          </div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            {past.map((s) => <SessionCard key={s.id as string} session={s} past />)}
          </motion.div>
        </motion.section>
      )}
    </motion.div>
  );
}

function SessionCard({ session, past }: { session: Record<string, unknown>; past?: boolean }) {
  const counsellor = session.counsellor as { full_name: string } | null;
  const status = session.status as string;
  const statusStyle = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  
  // Create start and end times for the meeting link
  const sessionDate = session.date as string;
  const sessionTime = session.time as string;
  const [hours, minutes] = sessionTime.split(':');
  const startDateTime = new Date(`${sessionDate}T${hours}:${minutes}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour session

  return (
    <motion.div 
      variants={{
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 }
      }}
      whileHover={past ? {} : { x: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`glass rounded-2xl p-5 border border-white/60 space-y-4 ${past ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3DBE29]/20 to-[#00C9A7]/20 flex items-center justify-center text-[#3DBE29] font-bold text-lg shadow-sm"
          >
            {counsellor?.full_name?.[0] ?? "C"}
          </motion.div>
          <div>
            <p className="text-base font-bold text-[#1E1E2E]">{counsellor?.full_name ?? "Counsellor"}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#6B7280] flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {sessionDate}
              </span>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs text-[#6B7280] flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sessionTime}
              </span>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs text-[#6B7280] capitalize">{session.type as string}</span>
            </div>
          </div>
        </div>
        <motion.span
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`text-xs font-bold px-4 py-2 rounded-full capitalize shadow-sm ${statusStyle}`}
        >
          {status.replace('_', ' ')}
        </motion.span>
      </div>
      
      {/* Meeting Link Component - only for scheduled sessions */}
      {status === 'scheduled' && !past && (
        <MeetingLink
          sessionId={session.id as string}
          sessionStartTime={startDateTime.toISOString()}
          sessionEndTime={endDateTime.toISOString()}
          sessionStatus={status}
          initialMeetingLink={session.meeting_link as string | null}
        />
      )}
    </motion.div>
  );
}
