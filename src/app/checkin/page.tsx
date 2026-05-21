"use client";

/**
 * Public Check-in Page (Guest/Anonymous Access)
 * Standalone page without authentication requirement
 */

import { useReducer, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  selectQuestionsForInstrument,
  mixQuestions,
  accumulateScore,
  classifyRisk,
  selectContextFrame,
  INSTRUMENT_CONFIGS,
} from "@/lib/aria/engine";
import { buildCounsellorReport } from "@/lib/aria/insights";
import { checkinReducer } from "@/app/student/checkin/state-machine";
import { createInitialContext } from "@/app/student/checkin/types";
import { TriagePhase } from "@/app/student/checkin/TriagePhase";
import { AssessmentPhase } from "@/app/student/checkin/AssessmentPhase";
import { WellnessSummary } from "@/app/student/checkin/WellnessSummary";
import { CrisisScreen } from "@/app/student/checkin/CrisisScreen";
import {
  fetchTriageQuestions,
  fetchInstrumentQuestions,
  fetchCamouflageQuestions,
} from "@/app/student/checkin/api";
import type { Answer } from "@/app/student/checkin/types";
import type { MixedQuestion } from "@/lib/aria/engine";

function PublicCheckinFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotion = searchParams.get("emotion") ?? "okay";

  const [context, dispatch] = useReducer(checkinReducer, createInitialContext());
  const [loading, setLoading] = useState(true);

  // Initialize triage phase (always anonymous for public page)
  useEffect(() => {
    async function initTriage() {
      const triageQuestions = await fetchTriageQuestions();

      if (!triageQuestions || triageQuestions.length === 0) {
        dispatch({ type: "SET_ERROR", payload: { error: "Could not load questions. Please try again later." } });
        setLoading(false);
        return;
      }

      const contextFrame = selectContextFrame();

      dispatch({
        type: "INIT_TRIAGE",
        payload: {
          triageQuestions: triageQuestions as MixedQuestion[],
          emotion,
          userId: null, // Always null for public/guest
          contextFrameId: contextFrame.id,
        },
      });

      setLoading(false);
    }

    initTriage();
  }, [emotion]);

  // Handle triage answer
  const handleTriageAnswer = async (answer: Answer) => {
    dispatch({ type: "ANSWER_TRIAGE", payload: { answer } });

    const newTriageAnswers = [...context.triageAnswers, answer];
    if (newTriageAnswers.length === 5) {
      const signal = computeTriageSignal(newTriageAnswers);
      const escalate = shouldEscalate(signal);

      dispatch({
        type: "COMPUTE_TRIAGE",
        payload: {
          signal,
          result: escalate ? "escalate" : "stable",
        },
      });

      if (escalate) {
        const queue = buildAssessmentQueue(signal);
        const instrumentQuestions = await fetchInstrumentQuestions(queue);
        const camouflageQuestions = await fetchCamouflageQuestions();

        const questionsByInstrument = new Map();
        for (const instrument of queue) {
          const allIds = instrumentQuestions
            .filter((q) => q.instrument === instrument)
            .map((q) => q.id);

          const selectedIds = selectQuestionsForInstrument(instrument, allIds, []);
          const selectedQuestions = instrumentQuestions.filter((q) =>
            selectedIds.includes(q.id)
          );
          questionsByInstrument.set(instrument, selectedQuestions);
        }

        const mixedQuestions = mixQuestions(
          questionsByInstrument,
          camouflageQuestions as MixedQuestion[]
        );

        dispatch({
          type: "INIT_ASSESSMENT",
          payload: { queue, mixedQuestions },
        });
      } else {
        // Stable - complete without saving
        dispatch({
          type: "COMPLETE_ASSESSMENT",
          payload: { dominantConcern: "general", consistencyFlags: [] },
        });
      }
    }
  };

  // Handle assessment answer
  const handleAssessmentAnswer = async (answer: Answer) => {
    const currentQuestion = context.mixedQuestions[context.currentQuestionIndex];

    let newScores = { ...context.currentScores };
    if (!currentQuestion.isCamouflage && currentQuestion.sourceInstrument) {
      const config = INSTRUMENT_CONFIGS[currentQuestion.sourceInstrument];
      const domain = config.domain;

      newScores[domain] = accumulateScore(
        context.currentScores[domain],
        answer.value,
        answer.mapsTo,
        config,
        currentQuestion.question_number || 1
      );
    }

    const riskLevel = classifyRisk(newScores);

    dispatch({
      type: "ANSWER_QUESTION",
      payload: { answer, newScores, riskLevel },
    });

    if (riskLevel === "critical") {
      dispatch({ type: "TRIGGER_CRISIS" });
      return;
    }

    if (context.currentQuestionIndex + 1 >= context.mixedQuestions.length) {
      const sortedDomains = (Object.keys(newScores) as (keyof typeof newScores)[])
        .map((domain) => ({
          domain,
          score: newScores[domain],
          config: Object.values(INSTRUMENT_CONFIGS).find((c) => c.domain === domain),
        }))
        .filter((item) => item.config)
        .sort((a, b) => {
          const aPct = a.score / (a.config?.maxScore || 1);
          const bPct = b.score / (b.config?.maxScore || 1);
          return bPct - aPct;
        });

      const dominantConcern = sortedDomains[0]?.domain || "general";

      dispatch({
        type: "COMPLETE_ASSESSMENT",
        payload: { dominantConcern, consistencyFlags: [] },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3DBE29] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280] text-sm">Getting your check-in ready...</p>
        </div>
      </div>
    );
  }

  if (context.state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-student px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F0] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A24] mb-2">Check-in unavailable</h2>
          <p className="text-sm text-[#6B7280] mb-6">{context.error || "Questions could not be loaded."}</p>
          <button onClick={() => router.push("/")} className="px-6 py-2.5 bg-[#3DBE29] text-white rounded-xl text-sm font-bold">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (context.state === "crisis") {
    return <CrisisScreen />;
  }

  if (context.state === "complete") {
    return (
      <WellnessSummary
        dominantConcern={context.dominantConcern}
        isStable={context.triageResult === "stable"}
        isAnonymous={true}
        scores={context.currentScores}
      />
    );
  }

  if (context.state === "triage") {
    return (
      <TriagePhase
        questions={context.triageQuestions}
        currentIndex={context.triageAnswers.length}
        onAnswer={handleTriageAnswer}
      />
    );
  }

  if (context.state === "assessing") {
    return (
      <AssessmentPhase
        questions={context.mixedQuestions}
        currentIndex={context.currentQuestionIndex}
        onAnswer={handleAssessmentAnswer}
      />
    );
  }

  return null;
}

export default function PublicCheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicCheckinFlow />
    </Suspense>
  );
}
