"use client";

/**
 * ARIA 2.0 Check-in Page
 * State machine-driven two-phase assessment flow
 */

import { useReducer, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAnonymous } from "@/lib/anonymous-context";
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
  checkCrossInstrumentConsistency,
  checkTemporalConsistency,
  checkResponseTime,
} from "@/lib/aria/engine";
import { buildCounsellorReport } from "@/lib/aria/insights";
import { checkinReducer } from "./state-machine";
import { createInitialContext } from "./types";
import { TriagePhase } from "./TriagePhase";
import { AssessmentPhase } from "./AssessmentPhase";
import { WellnessSummary } from "./WellnessSummary";
import { CrisisScreen } from "./CrisisScreen";
import {
  fetchTriageQuestions,
  fetchInstrumentQuestions,
  fetchCamouflageQuestions,
  fetchRecentlyAskedQuestions,
  saveAssessment,
  triggerCrisisAlert,
} from "./api";
import type { Answer } from "./types";
import type { MixedQuestion } from "@/lib/aria/engine";

function CheckinFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotion = searchParams.get("emotion") ?? "okay";
  const { isAnonymous } = useAnonymous();

  const [context, dispatch] = useReducer(checkinReducer, createInitialContext());
  const [loading, setLoading] = useState(true);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  // Check if already checked in today — skip for anonymous
  useEffect(() => {
    async function checkTodayCheckin() {
      // Anonymous users skip the 24h gate entirely
      if (isAnonymous) {
        initTriage(null);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const { data: todayAssessment, error: assessmentError } = await supabase
        .from("assessments")
        .select("completed, emotion, created_at, risk_level")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();
      
      // If there's an RLS error, log it but continue (don't block check-in)
      if (assessmentError && assessmentError.code !== 'PGRST116') {
        console.error('Error checking today assessment:', assessmentError);
      }

      if (todayAssessment) {
        // Check if 24 hours have passed since last check-in
        const lastCheckin = new Date(todayAssessment.created_at || today);
        const now = new Date();
        const hoursSinceCheckin = (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60);
        
        // For critical assessments, enforce strict 24-hour cooldown regardless of completed status
        // For other assessments, only enforce if completed
        const shouldBlock = todayAssessment.risk_level === 'critical' 
          ? hoursSinceCheckin < 24 
          : todayAssessment.completed && hoursSinceCheckin < 24;
        
        if (shouldBlock) {
          // Redirect to dashboard with message
          setAlreadyCheckedIn(true);
          setLoading(false);
          setTimeout(() => {
            router.push("/student");
          }, 2000);
          return;
        }
      }

      // Not checked in yet or 24+ hours passed - proceed with initialization
      initTriage(user.id);
    }

    checkTodayCheckin();
  }, [router, isAnonymous]);

  // Initialize triage phase
  async function initTriage(userId: string | null) {
    const triageQuestions = await fetchTriageQuestions();

    if (!triageQuestions || triageQuestions.length === 0) {
      // Questions couldn't be loaded — likely RLS blocking anon access
      // Show error state
      dispatch({ type: "SET_ERROR", payload: { error: "Could not load questions. Please run migration 012 in Supabase to allow anonymous access." } });
      setLoading(false);
      return;
    }

    const contextFrame = selectContextFrame();

    dispatch({
      type: "INIT_TRIAGE",
      payload: {
        triageQuestions: triageQuestions as MixedQuestion[],
        emotion,
        userId,
        contextFrameId: contextFrame.id,
      },
    });

    setLoading(false);
  }

  // Handle triage answer
  const handleTriageAnswer = async (answer: Answer) => {
    dispatch({ type: "ANSWER_TRIAGE", payload: { answer } });

    // Check if all triage questions answered
    const newTriageAnswers = [...context.triageAnswers, answer];
    if (newTriageAnswers.length === context.triageQuestions.length) {
      // Compute triage signal
      const signal = computeTriageSignal(newTriageAnswers);
      const escalate = shouldEscalate(signal);

      dispatch({
        type: "COMPUTE_TRIAGE",
        payload: {
          signal,
          result: escalate ? "escalate" : "stable",
        },
      });

      // Stable users: skip full assessment, save triage-only result and complete
      if (!escalate) {
        await saveStableAssessment();
        return;
      }

      // Escalated users: build full assessment queue
      const queue = buildAssessmentQueue(signal);

      // Fetch questions for selected instruments
      const instrumentQuestions = await fetchInstrumentQuestions(queue);
      const camouflageQuestions = await fetchCamouflageQuestions();

      // Get recently asked questions for rotation
      const recentlyAsked = context.userId
        ? await fetchRecentlyAskedQuestions(context.userId)
        : [];

      // Select questions for each instrument with rotation
      const questionsByInstrument = new Map();
      for (const instrument of queue) {
        const config = INSTRUMENT_CONFIGS[instrument];
        const allIds = instrumentQuestions
          .filter((q) => q.instrument === instrument)
          .map((q) => q.id);

        const selectedIds = selectQuestionsForInstrument(
          instrument,
          allIds,
          recentlyAsked
        );

        const selectedQuestions = instrumentQuestions.filter((q) =>
          selectedIds.includes(q.id)
        );
        questionsByInstrument.set(instrument, selectedQuestions);
      }

      // Mix questions
      const mixedQuestions = mixQuestions(
        questionsByInstrument,
        camouflageQuestions as MixedQuestion[]
      );

      dispatch({
        type: "INIT_ASSESSMENT",
        payload: { queue, mixedQuestions },
      });
    }
  };

  // Handle assessment answer
  const handleAssessmentAnswer = async (answer: Answer) => {
    const currentQuestion = context.mixedQuestions[context.currentQuestionIndex];

    // Skip scoring for camouflage questions
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

    // Check for crisis
    const riskLevel = classifyRisk(newScores);

    dispatch({
      type: "ANSWER_QUESTION",
      payload: { answer, newScores, riskLevel },
    });

    // Trigger crisis if threshold crossed
    if (riskLevel === "critical") {
      dispatch({ type: "TRIGGER_CRISIS" });
      await saveCrisisAssessment(newScores);
      if (context.userId && !isAnonymous) {
        await triggerCrisisAlert(context.userId, isAnonymous);
      }
      return;
    }

    // Check if all questions answered
    if (context.currentQuestionIndex + 1 >= context.mixedQuestions.length) {
      await completeAssessment(newScores);
    }
  };

  // Save stable triage assessment
  const saveStableAssessment = async () => {
    // Anonymous users — never save to DB, just complete
    if (!context.userId || isAnonymous) {
      dispatch({
        type: "COMPLETE_ASSESSMENT",
        payload: { dominantConcern: "general", consistencyFlags: [] },
      });
      return;
    }

    const sessionDuration = Math.floor((Date.now() - context.sessionStartTime) / 1000);
    const allQuestionIds = context.triageQuestions.map((q) => q.id);

    const payload = {
      user_id: context.userId,
      date: new Date().toISOString().split("T")[0],
      scores: context.currentScores,
      risk_level: "stable" as const,
      emotion,
      questions_asked: allQuestionIds,
      completed: true,
      triage_result: "stable" as const,
      triage_signal: context.triageSignal || undefined,
      instruments_used: [],
      context_frame_id: context.contextFrameId,
      session_duration_seconds: sessionDuration,
    };

    const result = await saveAssessment(payload, 2, isAnonymous);
    if (!result.success) {
      dispatch({ type: "SET_ERROR", payload: { error: result.error || "Save failed" } });
      return;
    }

    dispatch({
      type: "COMPLETE_ASSESSMENT",
      payload: { dominantConcern: "general", consistencyFlags: [] },
    });
  };

  // Save crisis assessment
  const saveCrisisAssessment = async (scores: typeof context.currentScores) => {
    if (!context.userId || isAnonymous) return;

    const sessionDuration = Math.floor((Date.now() - context.sessionStartTime) / 1000);
    const allQuestionIds = [
      ...context.triageQuestions.map((q) => q.id),
      ...context.assessmentAnswers.map((a) => a.questionId),
    ];

    // Build counsellor report for crisis case
    const counsellorReport = buildCounsellorReport(
      scores,
      "critical",
      context.assessmentQueue,
      context.triageSignal!,
      [], // No consistency flags yet in crisis
      context.camouflageResponses
    );

    const payload = {
      user_id: context.userId,
      date: new Date().toISOString().split("T")[0],
      scores,
      risk_level: "critical" as const,
      emotion,
      questions_asked: allQuestionIds,
      completed: true, // Mark as completed so it shows in counsellor dashboard and triggers cooldown
      triage_result: "escalate" as const,
      triage_signal: context.triageSignal || undefined,
      instruments_used: context.assessmentQueue,
      counsellor_report: counsellorReport,
      context_frame_id: context.contextFrameId,
      session_duration_seconds: sessionDuration,
    };

    await saveAssessment(payload, 2, isAnonymous);
  };

  // Complete full assessment
  const completeAssessment = async (scores: typeof context.currentScores) => {
    // Run consistency checks
    const crossFlags = checkCrossInstrumentConsistency(scores);
    const timeFlags = checkResponseTime(
      context.triageQuestions.length + context.mixedQuestions.length,
      Math.floor((Date.now() - context.sessionStartTime) / 1000)
    );
    const consistencyFlags = [...crossFlags, ...timeFlags];

    // Find dominant concern
    const sortedDomains = (Object.keys(scores) as (keyof typeof scores)[])
      .map((domain) => ({
        domain,
        score: scores[domain],
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
      payload: { dominantConcern, consistencyFlags },
    });

    // Save assessment — skip for anonymous users
    if (!context.userId || isAnonymous) return;

    const sessionDuration = Math.floor((Date.now() - context.sessionStartTime) / 1000);
    const allQuestionIds = [
      ...context.triageQuestions.map((q) => q.id),
      ...context.assessmentAnswers.map((a) => a.questionId),
    ];

    const riskLevel = classifyRisk(scores);
    const counsellorReport = buildCounsellorReport(
      scores,
      riskLevel,
      context.assessmentQueue,
      context.triageSignal!,
      consistencyFlags,
      context.camouflageResponses
    );

    const payload = {
      user_id: context.userId,
      date: new Date().toISOString().split("T")[0],
      scores,
      risk_level: riskLevel,
      emotion,
      questions_asked: allQuestionIds,
      completed: true,
      triage_result: "escalate" as const,
      triage_signal: context.triageSignal || undefined,
      instruments_used: context.assessmentQueue,
      counsellor_report: counsellorReport,
      consistency_flags: consistencyFlags,
      camouflage_responses: context.camouflageResponses,
      context_frame_id: context.contextFrameId,
      session_duration_seconds: sessionDuration,
    };

    await saveAssessment(payload, 2, isAnonymous);
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

  // Already checked in today
  if (alreadyCheckedIn) {
    return (
      <div className="min-h-screen w-full flex font-student overflow-hidden">
        
        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-shrink-0 flex-col bg-gradient-to-br from-[#E8F5E9] via-[#F0FFF4] to-[#DCF5E8]">
          
          {/* Illustration fills the ENTIRE panel as background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center p-6 pt-24 pb-12">
            <img
              src="/illustrations/student_checkin.svg"
              alt="Check-in complete illustration"
              className="w-full h-full object-contain"
              style={{ objectPosition: "center center" }}
            />
          </div>

          {/* Gradient overlay at top — keeps logo readable */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9]/80 to-transparent z-10 pointer-events-none" />

          {/* Gradient overlay at bottom — keeps caption readable */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#DCF5E8]/90 to-transparent z-10 pointer-events-none" />

          {/* Logo — sits on top of gradient */}
          <div className="relative z-20 pt-7 pl-8">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/illustrations/Logo.svg" alt="MindSafe India" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
              <span className="text-lg font-extrabold text-[#1A1A24] tracking-tight">
                Mind<span className="text-[#3DBE29]">Safe</span>
                <span className="text-[#4A6741] font-semibold text-sm ml-1">India</span>
              </span>
            </a>
          </div>

          {/* Success badge */}
          <div className="relative z-20 mt-4 ml-8">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#3DBE29]/30 rounded-full px-4 py-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#3DBE29] animate-pulse" />
              <span className="text-xs font-bold text-[#3DBE29]">Check-in Complete</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Caption — bottom */}
          <div className="relative z-20 pb-6 text-center px-8">
            <p className="text-sm font-bold text-[#2D4A28]">
              Your consistency makes a difference 🎉
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-14">
          <div className="w-full max-w-[480px]">

            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">
              <a href="/" className="flex items-center gap-2.5">
                <img src="/illustrations/Logo.svg" alt="MindSafe India" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
                <span className="text-xl font-extrabold text-[#1A1A24] tracking-tight">
                  Mind<span className="text-[#3DBE29]">Safe</span>
                  <span className="text-[#6B7280] font-semibold text-base ml-1">India</span>
                </span>
              </a>
            </div>

            {/* Mobile illustration */}
            <div className="lg:hidden relative h-48 mb-8">
              <img
                src="/illustrations/student_checkin.svg"
                alt="Check-in complete"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Success badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[#3DBE29]/10 border border-[#3DBE29]/30 rounded-full px-4 py-2 mb-4">
                <svg className="w-4 h-4 text-[#3DBE29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-bold text-[#3DBE29]">All Set for Today</span>
              </div>

              <h1 className="text-[2rem] font-extrabold text-[#1A1A24] leading-tight tracking-tight mb-3">
                You're all set for today!
              </h1>
              <p className="text-[#6B7280] text-base leading-relaxed">
                You've already completed your check-in today. Come back tomorrow to check in again.
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-3 mb-8">
              {/* Daily check-ins card */}
              <div className="bg-[#F8FFF8] border-2 border-[#E8F5E9] rounded-xl p-4 hover:border-[#3DBE29]/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3DBE29]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#3DBE29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#1A1A24] mb-1">
                      Daily check-ins help us understand your wellness journey
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Your consistency makes a difference. Keep up the great work!
                    </p>
                  </div>
                </div>
              </div>

              {/* Next check-in card */}
              <div className="bg-[#FAFAFA] border-2 border-[#F0F0F0] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6B7280]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#1A1A24] mb-1">
                      Next check-in available in 24 hours
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      We'll see you tomorrow for your next wellness check-in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div>
              <button
                onClick={() => router.push("/student")}
                className="w-full bg-[#3DBE29] hover:bg-[#32A822] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3DBE29]/25"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>

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
      </div>
    );
  }

  // Render based on state
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
          <p className="text-sm text-[#6B7280] mb-2">Questions could not be loaded.</p>
          <p className="text-xs text-[#9CA3AF] bg-[#F9FAFB] rounded-lg p-3 font-mono">
            Run migration 012 in Supabase SQL editor to enable anonymous access.
          </p>
          <button onClick={() => router.push("/student")} className="mt-6 px-6 py-2.5 bg-[#3DBE29] text-white rounded-xl text-sm font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (context.state === "crisis") {
    return <CrisisScreen />;
  }

  if (context.state === "complete") {
    // Determine if user is truly stable based on FINAL SCORES, not triage result
    const finalRiskLevel = classifyRisk(context.currentScores);
    const isTrulyStable = finalRiskLevel === "stable";
    
    return (
      <WellnessSummary
        dominantConcern={context.dominantConcern}
        isStable={isTrulyStable}
        isAnonymous={context.isAnonymous}
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

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckinFlow />
    </Suspense>
  );
}
