/**
 * ARIA 2.0 Check-in Flow Types
 * Type definitions for the state machine-driven assessment flow
 */

import type {
  AssessmentScore,
  TriageSignal,
  InstrumentKey,
  MixedQuestion,
  RiskLevel,
  ConsistencyFlag,
  CamouflageResponse,
} from "@/lib/aria/engine";

/** Check-in flow state */
export type CheckinState = "triage" | "assessing" | "complete" | "crisis" | "error";

/** Answer record for a single question */
export interface Answer {
  questionId: string;
  value: number;
  mapsTo: Record<string, number>;
  timestamp: number;
}

/** Check-in context - all state for the current session */
export interface CheckinContext {
  // Current state
  state: CheckinState;
  
  // Session metadata
  sessionStartTime: number;
  emotion: string;
  userId: string | null;
  isAnonymous: boolean;
  
  // Triage phase
  triageQuestions: MixedQuestion[];
  triageAnswers: Answer[];
  triageSignal: TriageSignal | null;
  triageResult: "stable" | "escalate" | null;
  
  // Assessment phase
  assessmentQueue: InstrumentKey[];
  mixedQuestions: MixedQuestion[];
  currentQuestionIndex: number;
  assessmentAnswers: Answer[];
  
  // Scoring
  currentScores: AssessmentScore;
  riskLevel: RiskLevel;
  dominantConcern: keyof AssessmentScore | "general";
  
  // Consistency tracking
  consistencyFlags: ConsistencyFlag[];
  camouflageResponses: CamouflageResponse[];
  
  // Context frame
  contextFrameId: string;
  
  // Error handling
  error: string | null;
  saveAttempts: number;
}

/** State machine actions */
export type CheckinAction =
  | { type: "INIT_TRIAGE"; payload: { triageQuestions: MixedQuestion[]; emotion: string; userId: string | null; contextFrameId: string } }
  | { type: "ANSWER_TRIAGE"; payload: { answer: Answer } }
  | { type: "COMPUTE_TRIAGE"; payload: { signal: TriageSignal; result: "stable" | "escalate" } }
  | { type: "INIT_ASSESSMENT"; payload: { queue: InstrumentKey[]; mixedQuestions: MixedQuestion[] } }
  | { type: "ANSWER_QUESTION"; payload: { answer: Answer; newScores: AssessmentScore; riskLevel: RiskLevel } }
  | { type: "TRIGGER_CRISIS" }
  | { type: "COMPLETE_ASSESSMENT"; payload: { dominantConcern: keyof AssessmentScore | "general"; consistencyFlags: ConsistencyFlag[] } }
  | { type: "SET_ERROR"; payload: { error: string } }
  | { type: "RETRY_SAVE" };

/** Initial state factory */
export function createInitialContext(): CheckinContext {
  return {
    state: "triage",
    sessionStartTime: Date.now(),
    emotion: "",
    userId: null,
    isAnonymous: true,
    triageQuestions: [],
    triageAnswers: [],
    triageSignal: null,
    triageResult: null,
    assessmentQueue: [],
    mixedQuestions: [],
    currentQuestionIndex: 0,
    assessmentAnswers: [],
    currentScores: {
      depression: 0,
      anxiety: 0,
      stress: 0,
      sleep: 0,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    },
    riskLevel: "stable",
    dominantConcern: "general",
    consistencyFlags: [],
    camouflageResponses: [],
    contextFrameId: "standard",
    error: null,
    saveAttempts: 0,
  };
}
