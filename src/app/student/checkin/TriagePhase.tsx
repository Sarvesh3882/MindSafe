"use client";

import Image from "next/image";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import type { MixedQuestion } from "@/lib/aria/engine";
import type { Answer } from "./types";

interface TriagePhaseProps {
  questions: MixedQuestion[];
  currentIndex: number;
  onAnswer: (answer: Answer) => void;
}

export function TriagePhase({ questions, currentIndex, onAnswer }: TriagePhaseProps) {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const handleAnswer = (value: number, optionMapsTo?: Record<string, number>) => {
    // Use the option-level maps_to (per-option signal weights) not the question-level one
    const mapsTo = optionMapsTo || currentQuestion.maps_to || {};
    onAnswer({ questionId: currentQuestion.id, value, mapsTo, timestamp: Date.now() });
  };

  return (
    <div className="bg-white font-student">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#3DBE29] to-[#00C9A7]" />

      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="MindSafe" width={32} height={32} className="w-8 h-8" />
            <span className="text-base font-extrabold text-[#1A1A24] tracking-tight">
              Mind<span className="text-[#3DBE29]">Safe</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-3 py-1.5 rounded-full">
            Daily Check-in
          </span>
        </div>

        {/* Intro text */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A24] leading-tight mb-2">
            How are you doing today?
          </h1>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            A few quick questions to understand how you're feeling. Takes less than 2 minutes.
          </p>
        </div>

        <ProgressBar
          currentStep={currentIndex + 1}
          totalSteps={questions.length}
          phase="triage"
        />
      </div>

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Bottom illustration */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10 pb-8">
        <div className="flex items-center justify-center opacity-30">
          <Image
            src="/illustrations/student_checkin.svg"
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
