"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  phase: "triage" | "assessing";
}

export function ProgressBar({ currentStep, totalSteps, phase }: ProgressBarProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${phase === "triage" ? "bg-[#3DBE29]" : "bg-[#00C9A7]"}`} />
          <span className="text-sm font-semibold text-[#374151]">
            {phase === "triage" ? "Quick check-in" : "Understanding how you're doing"}
          </span>
        </div>
        <span className="text-xs font-bold text-[#9CA3AF] bg-[#F3F4F6] px-2.5 py-1 rounded-full">
          {currentStep} / {totalSteps}
        </span>
      </div>

      {/* Track */}
      <div
        className="w-full h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${Math.round(progress)}%`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#3DBE29] to-[#00C9A7]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-2 px-0.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i < currentStep ? "bg-[#3DBE29]" : "bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
