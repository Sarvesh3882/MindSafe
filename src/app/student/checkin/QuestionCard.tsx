"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { MixedQuestion } from "@/lib/aria/engine";

interface QuestionCardProps {
  question: MixedQuestion;
  onAnswer: (value: number, mapsTo?: Record<string, number>) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, onAnswer, questionNumber, totalQuestions }: QuestionCardProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cardVariants = {
    initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 40, scale: 0.98 },
    animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 },
    exit: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -40, scale: 0.98 },
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] as any };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className="w-full max-w-2xl mx-auto px-4 sm:px-6"
      >
        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-6 sm:p-8 mb-5">
          {/* Question number badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#3DBE29] to-[#00C9A7] text-white text-xs font-bold flex-shrink-0">
              {questionNumber}
            </span>
            <div className="flex-1 h-px bg-[#F0F0F0]" />
          </div>

          {/* Question text */}
          <p
            className="text-lg sm:text-xl font-semibold text-[#1A1A24] leading-relaxed"
            role="heading"
            aria-level={2}
          >
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3" role="radiogroup" aria-label={question.question}>
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(option.value, (option as any).maps_to)}
              className="w-full min-h-[56px] px-5 py-4 text-left bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#3DBE29] hover:bg-[#F0FFF4] hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3DBE29]/40 focus:ring-offset-2 group"
              role="radio"
              aria-checked="false"
              tabIndex={0}
            >
              <div className="flex items-center gap-4">
                {/* Option indicator */}
                <div className="w-5 h-5 rounded-full border-2 border-[#D1D5DB] group-hover:border-[#3DBE29] flex items-center justify-center flex-shrink-0 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3DBE29] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {option.emoji && (
                  <span className="text-xl flex-shrink-0" aria-hidden="true">
                    {option.emoji}
                  </span>
                )}

                <span className="text-base text-[#374151] font-medium group-hover:text-[#1A1A24] transition-colors">
                  {(option as any).text ?? option.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Question {questionNumber} of {totalQuestions}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
