"use client";

import Image from "next/image";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import type { MixedQuestion } from "@/lib/aria/engine";
import type { Answer } from "./types";

interface AssessmentPhaseProps {
  questions: MixedQuestion[];
  currentIndex: number;
  onAnswer: (answer: Answer) => void;
}

export function AssessmentPhase({ questions, currentIndex, onAnswer }: AssessmentPhaseProps) {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const handleAnswer = (value: number, optionMapsTo?: Record<string, number>) => {
    const answer: Answer = {
      questionId: currentQuestion.id,
      value,
      // Use option-level maps_to if provided, fall back to question-level
      mapsTo: optionMapsTo || currentQuestion.maps_to,
      timestamp: Date.now(),
    };
    onAnswer(answer);
  };

  return (
    <div className="bg-white font-student">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#00C9A7] to-[#3DBE29]" />

      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="MindSafe" width={32} height={32} className="w-8 h-8" />
            <span className="text-base font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#3DBE29]">Safe</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-[#00C9A7] bg-[#F0FFFE] border border-[#00C9A7]/20 px-3 py-1.5 rounded-full">
            Deeper Check-in
          </span>
        </div>

        {/* Intro text */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A24] leading-tight mb-2">
            Let's understand better
          </h1>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            A few more questions to help us support you better. There are no right or wrong answers.
          </p>
        </div>

        <ProgressBar
          currentStep={currentIndex + 1}
          totalSteps={questions.length}
          phase="assessing"
        />
      </div>

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Bottom */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10 pb-8">
        <div className="flex items-center justify-center opacity-25">
          <Image
            src="/illustrations/Student_Wellness_tips.svg"
            alt=""
            width={180}
            height={120}
            className="object-contain"
          />
        </div>
        <p className="text-center text-xs text-[#D1D5DB] mt-4 flex items-center justify-center gap-1.5">
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
