"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroBannerProps {
  userName: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export function HeroBanner({ userName }: HeroBannerProps) {
  const firstName = userName?.split(" ")[0] ?? "there";
  
  return (
    <div className="relative">
      {/* Static decorative elements - no animation for better performance */}
      <div className="absolute -top-4 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-[#3DBE29]/15 to-[#00C9A7]/15 blur-xl opacity-50" />
      <div className="absolute -top-6 right-24 w-32 h-32 rounded-full bg-gradient-to-br from-[#00C9A7]/10 to-[#3DBE29]/10 blur-2xl opacity-40" />
      
      <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/40 bg-white">
        {/* Base background - clean white to soft green gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-[#FAFFFE] via-45% to-[#F0FFF4] to-100%" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 items-center min-h-[320px]">
          {/* Left side - Text content - subtle animations */}
          <div className="relative z-20 p-8 lg:py-12 lg:pl-14 lg:pr-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-[2.5rem] lg:text-[3rem] font-black text-[#1A1A24] leading-[1.1] tracking-tight flex items-center gap-3">
                Good {getGreeting()}, {firstName}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="inline-block origin-[70%_70%]"
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-[#6B7280] text-base lg:text-lg font-medium">
                How are you feeling today?
              </p>
            </motion.div>
            
            {/* Wellness companion card - subtle hover animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              className="relative rounded-[20px] p-5 bg-white/80 backdrop-blur-sm border-l-[3px] border-[#3DBE29] shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-w-xl transition-shadow duration-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Professional icon - subtle pulse */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="relative flex-shrink-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3DBE29] to-[#2DA821] flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#3DBE29] mb-2 leading-tight">
                    WELLNESS COMPANION
                  </p>
                  <p className="text-[13px] lg:text-sm text-[#3D4958] leading-relaxed font-medium">
                    Track your mood daily and get personalized insights to support your mental wellness journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right side - Illustration - fade in */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative lg:w-[440px] xl:w-[500px] h-64 lg:h-[320px] flex-shrink-0"
          >
            {/* Multi-step fade overlay - creates smooth transition from white to illustration */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0" style={{ 
                background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 8%, rgba(255,255,255,0.6) 15%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.1) 35%, transparent 45%)'
              }} />
            </div>
            
            {/* Illustration container */}
            <div className="absolute inset-0 lg:-right-4">
              <Image
                src="/illustrations/student_dashboard.svg"
                alt="Student wellness illustration"
                fill
                priority
                className="object-cover object-left-top lg:object-contain"
                style={{ 
                  objectPosition: 'left center',
                }}
              />
            </div>
            
            {/* Subtle vignette on edges */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center right, transparent 40%, rgba(240,255,244,0.3) 100%)'
            }} />
          </motion.div>
        </div>
        
        {/* Bottom subtle shadow for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/[0.02] to-transparent pointer-events-none" />
        
        {/* Improved edge glow effect */}
        <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/20 pointer-events-none" />
      </div>
    </div>
  );
}
