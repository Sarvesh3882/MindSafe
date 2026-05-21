"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { ReactElement } from "react";

const TYPE_EMOJI: Record<string, string> = {
  video: "🎥",
  article: "📖",
  exercise: "🏃",
  meditation: "🧘",
  breathing: "💨",
};

const TYPE_ICONS: Record<string, ReactElement> = {
  video: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  article: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  exercise: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  meditation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  breathing: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  ),
};

const CATEGORIES = ["All", "Stress", "Sleep", "Anxiety", "Focus", "Relationships"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Stress: { bg: "bg-[#FFF8F0]", text: "text-[#FF9F43]", border: "border-[#FF9F43]/20" },
  Sleep: { bg: "bg-[#F5F0FF]", text: "text-[#8B5CF6]", border: "border-[#8B5CF6]/20" },
  Anxiety: { bg: "bg-[#FFF0F0]", text: "text-[#FF6B6B]", border: "border-[#FF6B6B]/20" },
  Focus: { bg: "bg-[#F0F9FF]", text: "text-[#3B82F6]", border: "border-[#3B82F6]/20" },
  Relationships: { bg: "bg-[#FFF0F8]", text: "text-[#EC4899]", border: "border-[#EC4899]/20" },
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

interface ResourcesClientProps {
  resources: Array<Record<string, unknown>>;
  recommendations: Array<Record<string, unknown>>;
  hasScores: boolean;
}

export function ResourcesClient({ resources, recommendations, hasScores }: ResourcesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(r => (r.category as string) === selectedCategory);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="font-student space-y-8 pb-12"
    >
      {/* Hero Banner */}
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
                  Wellness Resources
                </h1>
                <p className="text-[#6B7280] text-base lg:text-lg font-medium mt-2">
                  Curated tools to help you feel better, one step at a time.
                </p>
              </motion.div>
              
              {/* Stats Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-4 max-w-xl"
              >
                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-sm">
                  <div className="text-2xl font-black text-[#3DBE29]">{resources.length}</div>
                  <div className="text-xs text-[#6B7280] font-medium">Resources</div>
                </div>
                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-sm">
                  <div className="text-2xl font-black text-[#00C9A7]">{CATEGORIES.length - 1}</div>
                  <div className="text-xs text-[#6B7280] font-medium">Categories</div>
                </div>
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
                  src="/illustrations/Student_using_laptop_welness.svg"
                  alt="Wellness resources"
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

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <motion.section
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1E1E2E] flex items-center gap-2">
              <svg className="w-6 h-6 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Recommended for You
            </h2>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="text-xs bg-[#F0FFF0] text-[#3DBE29] px-3 py-1.5 rounded-full font-bold border border-[#3DBE29]/20 shadow-sm"
            >
              Based on your check-ins
            </motion.span>
          </div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recommendations.map((r) => (
              <ResourceCard key={r.id as string} resource={r} recommended />
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Category Filter */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-3xl p-6 border border-white/60"
      >
        <h3 className="text-sm font-bold text-[#1E1E2E] uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Browse by Category
        </h3>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                selectedCategory === cat
                  ? "bg-[#3DBE29] text-white border-[#3DBE29] shadow-md"
                  : "border-[#E5E7EB] text-[#6B7280] hover:border-[#3DBE29] hover:text-[#3DBE29] bg-white"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* All Resources Grid */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <h2 className="text-lg font-bold text-[#1E1E2E] mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#3DBE29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {selectedCategory === "All" ? "All Resources" : `${selectedCategory} Resources`}
          <span className="text-sm font-normal text-[#6B7280]">({filteredResources.length})</span>
        </h2>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredResources.map((r) => (
            <ResourceCard key={r.id as string} resource={r} />
          ))}
        </motion.div>
      </motion.section>

      {/* Encouragement to Check-in */}
      {!hasScores && (
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass rounded-3xl p-10 text-center border border-white/60 bg-gradient-to-br from-[#F0FFF0] to-white"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="relative h-32 w-32 mx-auto mb-6"
          >
            <Image 
              src="/illustrations/Student_Wellness_tips.svg" 
              alt="Get personalized recommendations" 
              fill 
              className="object-contain drop-shadow-lg" 
            />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-xl font-bold text-[#1E1E2E] mb-2"
          >
            Get Personalized Recommendations
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="text-sm text-[#6B7280] mb-6 max-w-md mx-auto"
          >
            Complete your daily check-in to see resources tailored specifically to your needs and wellness goals.
          </motion.p>
          <Link href="/student/checkin">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(61, 190, 41, 0.25)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#3DBE29] to-[#00C9A7] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check In Now
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

function ResourceCard({ resource, recommended }: { resource: Record<string, unknown>; recommended?: boolean }) {
  const type = resource.type as string;
  const title = resource.title as string;
  const category = resource.category as string;
  const duration = resource.duration as string | undefined;
  const url = resource.url as string | undefined;

  const categoryStyle = CATEGORY_COLORS[category] || { bg: "bg-[#F8F9FF]", text: "text-[#6B7280]", border: "border-[#E5E7EB]" };

  return (
    <motion.div 
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`rounded-2xl p-6 border-2 transition-all cursor-pointer ${
        recommended 
          ? "border-[#3DBE29]/40 bg-gradient-to-br from-[#F0FFF0] to-white shadow-md" 
          : "border-white/60 bg-white shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3DBE29]/10 to-[#00C9A7]/10 flex items-center justify-center text-[#3DBE29]"
        >
          {TYPE_ICONS[type] || TYPE_EMOJI[type] || "📌"}
        </motion.div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
          {category}
        </span>
      </div>
      <h4 className="font-bold text-[#1E1E2E] text-base leading-snug mb-2">{title}</h4>
      {duration && (
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {duration}
        </div>
      )}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#3DBE29] font-bold hover:gap-3 transition-all"
        >
          Open Resource
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      ) : (
        <button className="inline-flex items-center gap-2 text-sm text-[#3DBE29] font-bold hover:gap-3 transition-all">
          Start Now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      )}
      {recommended && (
        <div className="mt-3 pt-3 border-t border-[#3DBE29]/20">
          <div className="flex items-center gap-1.5 text-xs text-[#3DBE29] font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Recommended for you
          </div>
        </div>
      )}
    </motion.div>
  );
}
