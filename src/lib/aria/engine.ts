/**
 * ARIA — Adaptive Response & Insight Algorithm
 * Core assessment engine. Zero AI/API calls — pure logic + Supabase queries.
 */

export type RiskLevel = "stable" | "attention" | "critical";
export type Category =
  | "depression"
  | "anxiety"
  | "stress"
  | "sleep"
  | "burnout"
  | "loneliness"
  | "substance";

export interface AssessmentScore {
  depression: number;
  anxiety: number;
  stress: number;
  sleep: number;
  burnout: number;
  loneliness: number;
  substance: number;
}

export interface ARIAQuestion {
  id: string;
  question: string;
  category: Category;
  severity: "low" | "medium" | "high";
  options: { label: string; value: number; emoji?: string }[];
  maps_to: Record<string, number>;
}

// ============================================================
// ARIA 2.0 Types
// ============================================================

/** Per-domain signal produced by triage scoring (0–3 scale) */
export interface TriageSignal {
  depression: number;   // 0–3
  anxiety: number;      // 0–3
  stress: number;       // 0–3
  sleep: number;        // 0–3
  burnout: number;      // 0–3
  loneliness: number;   // 0–3
}

/** Clinical instrument identifiers */
export type InstrumentKey =
  | "phq9"
  | "gad7"
  | "isi"
  | "pss10"
  | "maslach"
  | "ucla"
  | "audit";

/** Ordered list of instruments to administer in this session */
export type AssessmentQueue = InstrumentKey[];

/** Check-in flow state */
export type CheckinState = "triage" | "assessing" | "complete" | "crisis";

/** Per-instrument scoring configuration */
export interface InstrumentConfig {
  key: InstrumentKey;
  domain: keyof AssessmentScore;
  totalQuestions: number;
  maxScore: number;
  itemMax: number;          // max value per item
  reverseItems?: number[];  // 1-indexed question_numbers that are reverse-scored
  crisisThreshold?: number; // score at which crisis is triggered
}

/** Consistency check flag types */
export interface ConsistencyFlag {
  type: "cross_instrument" | "temporal" | "response_time";
  severity: "info" | "warning";
  message: string;
}

/** Camouflage question response for counsellor context */
export interface CamouflageResponse {
  question: string;
  answer: string;
}

/** Mixed question with source tracking */
export interface MixedQuestion {
  id: string;
  question: string;
  category: Category;
  severity: "low" | "medium" | "high";
  options: { label: string; value: number; emoji?: string }[];
  maps_to: Record<string, number>;
  sourceInstrument: InstrumentKey | null;  // null for camouflage questions
  isCamouflage: boolean;
  instrument?: InstrumentKey;
  question_number?: number;
  reverse_scored?: boolean;
}

/** Context framing variant */
export interface ContextFrame {
  id: string;
  text: string;
}

// ============================================================
// ARIA 2.0 Constants
// ============================================================

const ESCALATION_THRESHOLD = 2;  // Domain signal >= 2 triggers escalation
const MAX_INSTRUMENTS_PER_SESSION = 3;

export const INSTRUMENT_CONFIGS: Record<InstrumentKey, InstrumentConfig> = {
  phq9: {
    key: "phq9",
    domain: "depression",
    totalQuestions: 9,
    maxScore: 27,
    itemMax: 3,
    crisisThreshold: 15,
  },
  gad7: {
    key: "gad7",
    domain: "anxiety",
    totalQuestions: 7,
    maxScore: 21,
    itemMax: 3,
    crisisThreshold: 15,
  },
  isi: {
    key: "isi",
    domain: "sleep",
    totalQuestions: 7,
    maxScore: 28,
    itemMax: 4,
  },
  pss10: {
    key: "pss10",
    domain: "stress",
    totalQuestions: 10,
    maxScore: 40,
    itemMax: 4,
    reverseItems: [4, 5, 7, 8],  // PSS-10 items 4,5,7,8 are reverse-scored
    crisisThreshold: 27,
  },
  maslach: {
    key: "maslach",
    domain: "burnout",
    totalQuestions: 22,   // Full Maslach Burnout Inventory (all 3 subscales)
    maxScore: 132,        // 22 items × 6 points each
    itemMax: 6,
    crisisThreshold: 88,  // High burnout threshold
  },
  ucla: {
    key: "ucla",
    domain: "loneliness",
    totalQuestions: 20,   // Full UCLA Loneliness Scale (Version 3)
    maxScore: 80,         // 20 items × 4 points each
    itemMax: 4,
    crisisThreshold: 60,  // High loneliness threshold
  },
  audit: {
    key: "audit",
    domain: "substance",
    totalQuestions: 10,   // Alcohol Use Disorders Identification Test
    maxScore: 40,         // 10 items × 4 points each
    itemMax: 4,
    crisisThreshold: 20,  // Possible dependence threshold
  },
};

// Crisis keywords — hardcoded for reliability (no AI)
const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "don't want to live",
  "want to die",
  "self harm",
  "hurt myself",
  "no reason to live",
  "better off dead",
];

export function detectCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

// Risk classification thresholds (PHQ-9 / GAD-7 / PSS aligned)
export function classifyRisk(scores: AssessmentScore): RiskLevel {
  const { depression, anxiety, stress } = scores;

  // Critical: PHQ-9 >= 15 OR GAD-7 >= 15 OR PSS >= 27
  if (depression >= 15 || anxiety >= 15 || stress >= 27) return "critical";

  // Needs Attention: PHQ-9 >= 10 OR GAD-7 >= 10 OR PSS >= 18
  if (depression >= 10 || anxiety >= 10 || stress >= 18) return "attention";

  return "stable";
}

// Determine weakest category from last 7 days of scores
export function findWeakestCategory(
  recentScores: AssessmentScore[]
): Category {
  if (!recentScores.length) return "depression";

  const totals: AssessmentScore = {
    depression: 0,
    anxiety: 0,
    stress: 0,
    sleep: 0,
    burnout: 0,
    loneliness: 0,
    substance: 0,
  };

  recentScores.forEach((s) => {
    (Object.keys(totals) as Category[]).forEach((k) => {
      totals[k] += s[k];
    });
  });

  // Normalize by max possible scores
  const maxScores: AssessmentScore = {
    depression: 27, // PHQ-9
    anxiety: 21,    // GAD-7
    stress: 40,     // PSS-10
    sleep: 28,      // ISI
    burnout: 132,   // Maslach
    loneliness: 80, // UCLA
    substance: 40,  // AUDIT
  };

  let worstCategory: Category = "depression";
  let worstRatio = 0;

  (Object.keys(totals) as Category[]).forEach((k) => {
    const avg = totals[k] / recentScores.length;
    const ratio = avg / maxScores[k];
    if (ratio > worstRatio) {
      worstRatio = ratio;
      worstCategory = k;
    }
  });

  return worstCategory;
}

// Map emotion tile selection to initial score
export function emotionToInitialScore(emotion: string): Partial<AssessmentScore> {
  const map: Record<string, Partial<AssessmentScore>> = {
    great: { depression: 0, anxiety: 0, stress: 0 },
    good: { depression: 1, anxiety: 1, stress: 2 },
    okay: { depression: 3, anxiety: 3, stress: 5 },
    low: { depression: 6, anxiety: 5, stress: 8 },
    stressed: { depression: 4, anxiety: 8, stress: 12 },
    tired: { depression: 5, anxiety: 4, stress: 10, sleep: 8 },
  };
  return map[emotion] ?? { depression: 3, anxiety: 3, stress: 5 };
}

// Check if consecutive bad days threshold is met
export function checkConsecutiveBadDays(
  riskHistory: RiskLevel[]
): { shouldAlert: boolean; days: number } {
  let consecutive = 0;
  for (let i = riskHistory.length - 1; i >= 0; i--) {
    if (riskHistory[i] === "attention" || riskHistory[i] === "critical") {
      consecutive++;
    } else {
      break;
    }
  }
  return {
    shouldAlert: consecutive >= 3,
    days: consecutive,
  };
}

// ============================================================
// ARIA 2.0 Engine Functions
// ============================================================

/**
 * Compute a TriageSignal from three triage question answers.
 * Each answer's maps_to field contributes weighted signal to each domain.
 * Domain signals are capped at 3.
 */
export function computeTriageSignal(
  answers: { questionId: string; value: number; mapsTo: Record<string, number> }[]
): TriageSignal {
  const signal: TriageSignal = {
    depression: 0,
    anxiety: 0,
    stress: 0,
    sleep: 0,
    burnout: 0,
    loneliness: 0,
  };

  // Sum weighted contributions from all answers
  answers.forEach((answer) => {
    Object.entries(answer.mapsTo).forEach(([domain, weight]) => {
      if (domain in signal) {
        signal[domain as keyof TriageSignal] += weight;
      }
    });
  });

  // Cap each domain at 3
  (Object.keys(signal) as (keyof TriageSignal)[]).forEach((domain) => {
    signal[domain] = Math.min(signal[domain], 3);
  });

  return signal;
}

/**
 * Decide whether to escalate based on TriageSignal.
 * Returns true if any domain signal >= ESCALATION_THRESHOLD (2).
 */
export function shouldEscalate(signal: TriageSignal): boolean {
  return Object.values(signal).some((value) => value >= ESCALATION_THRESHOLD);
}

/**
 * Build an ordered Assessment_Queue from a TriageSignal.
 * - Selects instruments for all domains with signal >= ESCALATION_THRESHOLD
 * - Orders by signal strength descending
 * - Caps at MAX_INSTRUMENTS_PER_SESSION (3)
 * - ALWAYS includes at least PHQ-9 and GAD-7 as baseline (even for stable users)
 */
export function buildAssessmentQueue(signal: TriageSignal): AssessmentQueue {
  // Map domain signals to instruments
  const domainToInstrument: Record<keyof TriageSignal, InstrumentKey> = {
    depression: "phq9",
    anxiety: "gad7",
    stress: "pss10",
    sleep: "isi",
    burnout: "maslach",
    loneliness: "ucla",
  };

  // Filter domains that meet escalation threshold and map to instruments
  const instrumentsWithSignals: Array<{ instrument: InstrumentKey; signal: number }> = [];
  
  (Object.keys(signal) as (keyof TriageSignal)[]).forEach((domain) => {
    if (signal[domain] >= ESCALATION_THRESHOLD) {
      instrumentsWithSignals.push({
        instrument: domainToInstrument[domain],
        signal: signal[domain],
      });
    }
  });

  // Sort by signal strength descending
  instrumentsWithSignals.sort((a, b) => b.signal - a.signal);

  // Extract instrument keys, capped at MAX_INSTRUMENTS_PER_SESSION
  let queue = instrumentsWithSignals
    .slice(0, MAX_INSTRUMENTS_PER_SESSION)
    .map((item) => item.instrument);

  // BASELINE GUARANTEE: Stable users (no escalated domains) always get PHQ-9 + GAD-7
  // as minimum screening. Escalated users get exactly the instruments their signals indicate.
  if (queue.length === 0) {
    queue = ["phq9", "gad7"];
  }

  return queue;
}

/**
 * Select question IDs for a given instrument, applying the 14-day rotation algorithm.
 * - Excludes questions asked in the last N sessions (from questions_asked history)
 * - Falls back to least-recently-asked if all have been asked recently
 * - Returns all required question IDs for the instrument in randomized order
 */
export function selectQuestionsForInstrument(
  instrument: InstrumentKey,
  allQuestionIds: string[],
  recentlyAskedIds: string[]
): string[] {
  const config = INSTRUMENT_CONFIGS[instrument];
  const needed = config.totalQuestions;

  // Partition into fresh (not recently asked) and stale (recently asked)
  const fresh = allQuestionIds.filter((id) => !recentlyAskedIds.includes(id));
  const stale = allQuestionIds.filter((id) => recentlyAskedIds.includes(id));

  let selected: string[];

  if (fresh.length >= needed) {
    // Enough fresh questions - use only fresh
    selected = shuffle(fresh).slice(0, needed);
  } else if (fresh.length > 0) {
    // Some fresh questions - take all fresh + fill from stale (least recently asked first)
    const fillCount = needed - fresh.length;
    selected = [...fresh, ...stale.slice(0, fillCount)];
    selected = shuffle(selected);
  } else {
    // No fresh questions - all have been asked recently, use all and shuffle
    selected = shuffle(allQuestionIds).slice(0, needed);
  }

  return selected;
}

/**
 * Accumulate a score for one answer, applying reverse scoring if needed.
 * Returns the new domain score, capped at the instrument maximum.
 */
export function accumulateScore(
  currentScore: number,
  optionValue: number,
  mapsTo: Record<string, number>,
  instrumentConfig: InstrumentConfig,
  questionNumber: number
): number {
  const domain = instrumentConfig.domain;
  const multiplier = mapsTo[domain] ?? 0;

  // Check if this question is reverse-scored
  const isReverse = instrumentConfig.reverseItems?.includes(questionNumber) ?? false;

  let contribution: number;
  if (isReverse) {
    // Reverse scoring: (itemMax - optionValue) * multiplier
    contribution = (instrumentConfig.itemMax - optionValue) * multiplier;
  } else {
    // Normal scoring: optionValue * multiplier
    contribution = optionValue * multiplier;
  }

  const newScore = currentScore + contribution;

  // Cap at instrument maximum
  return Math.min(newScore, instrumentConfig.maxScore);
}

/**
 * Mix questions from multiple instruments into a single randomized sequence.
 * Camouflage questions are distributed throughout to prevent pattern recognition.
 * Ensures no more than 4 consecutive clinical questions.
 */
export function mixQuestions(
  instrumentQuestions: Map<InstrumentKey, MixedQuestion[]>,
  camouflageQuestions: MixedQuestion[]
): MixedQuestion[] {
  // Flatten all instrument questions with metadata
  const allQuestions: MixedQuestion[] = [];
  
  for (const [instrument, questions] of instrumentQuestions.entries()) {
    for (const q of questions) {
      allQuestions.push({
        ...q,
        sourceInstrument: instrument,
        isCamouflage: false,
      });
    }
  }
  
  // Shuffle clinical questions for variety
  const shuffledClinical = shuffle(allQuestions);
  
  // Shuffle camouflage questions for variety
  const shuffledCamouflage = shuffle([...camouflageQuestions]);
  
  // Build mixed array with max 4 consecutive clinical questions
  const result: MixedQuestion[] = [];
  let clinicalIndex = 0;
  let camouflageIndex = 0;
  let consecutiveClinical = 0;
  
  while (clinicalIndex < shuffledClinical.length || camouflageIndex < shuffledCamouflage.length) {
    // Insert camouflage if we've had 4 consecutive clinical OR randomly (30% chance)
    const shouldInsertCamouflage = 
      (consecutiveClinical >= 4 || (consecutiveClinical >= 2 && Math.random() < 0.3)) &&
      camouflageIndex < shuffledCamouflage.length;
    
    if (shouldInsertCamouflage) {
      result.push({
        ...shuffledCamouflage[camouflageIndex],
        sourceInstrument: null,
        isCamouflage: true,
      });
      camouflageIndex++;
      consecutiveClinical = 0;
    } else if (clinicalIndex < shuffledClinical.length) {
      result.push(shuffledClinical[clinicalIndex]);
      clinicalIndex++;
      consecutiveClinical++;
    } else {
      // No more clinical questions, add remaining camouflage
      result.push({
        ...shuffledCamouflage[camouflageIndex],
        sourceInstrument: null,
        isCamouflage: true,
      });
      camouflageIndex++;
      consecutiveClinical = 0;
    }
  }
  
  return result;
}

/**
 * Check cross-instrument consistency for unusual score patterns.
 */
export function checkCrossInstrumentConsistency(
  scores: AssessmentScore
): ConsistencyFlag[] {
  const flags: ConsistencyFlag[] = [];
  
  // High PHQ-9 but zero GAD-7 is unusual (depression and anxiety are highly comorbid)
  if (scores.depression >= 15 && scores.anxiety === 0) {
    flags.push({
      type: "cross_instrument",
      severity: "warning",
      message: "High depression score (PHQ-9 ≥15) with zero anxiety score (GAD-7 = 0) is unusual. Depression and anxiety are typically comorbid. Consider follow-up to clarify.",
    });
  }
  
  // High GAD-7 but zero PHQ-9 is less unusual but still worth noting
  if (scores.anxiety >= 15 && scores.depression === 0) {
    flags.push({
      type: "cross_instrument",
      severity: "info",
      message: "High anxiety score (GAD-7 ≥15) with zero depression score (PHQ-9 = 0). While less common, this can occur with pure anxiety presentations.",
    });
  }
  
  // High stress (PSS-10) but low depression and anxiety suggests external stressors
  if (scores.stress >= 27 && scores.depression < 10 && scores.anxiety < 10) {
    flags.push({
      type: "cross_instrument",
      severity: "info",
      message: "High stress (PSS-10 ≥27) with low depression and anxiety suggests acute external stressors rather than mood disorder. Explore situational factors.",
    });
  }
  
  // High burnout with low stress is contradictory
  if (scores.burnout >= 40 && scores.stress < 14) {
    flags.push({
      type: "cross_instrument",
      severity: "warning",
      message: "High burnout (≥40) with low stress (<14) is contradictory. Burnout is a stress-related syndrome. Consider response validity.",
    });
  }
  
  return flags;
}

/**
 * Check temporal consistency between current and previous assessment.
 */
export function checkTemporalConsistency(
  currentScores: AssessmentScore,
  previousScores: AssessmentScore | null,
  daysBetween: number
): ConsistencyFlag[] {
  const flags: ConsistencyFlag[] = [];
  
  if (!previousScores || daysBetween > 7) {
    return flags;  // Only check if previous assessment was within 7 days
  }
  
  // Check each domain for large jumps
  const domains: (keyof AssessmentScore)[] = [
    "depression", "anxiety", "stress", "sleep", "burnout", "loneliness"
  ];
  
  for (const domain of domains) {
    const current = currentScores[domain];
    const previous = previousScores[domain];
    const change = Math.abs(current - previous);
    const config = Object.values(INSTRUMENT_CONFIGS).find(c => c.domain === domain);
    
    if (!config) continue;
    
    // Flag if score changed by >10 points in ≤2 days
    if (daysBetween <= 2 && change > 10) {
      flags.push({
        type: "temporal",
        severity: "warning",
        message: `${domain.charAt(0).toUpperCase() + domain.slice(1)} score changed by ${change} points in ${daysBetween} day(s). Large rapid changes may indicate crisis escalation or response inconsistency.`,
      });
    }
  }
  
  return flags;
}

/**
 * Check response time for unusually fast completion.
 */
export function checkResponseTime(
  totalQuestions: number,
  sessionDurationSeconds: number
): ConsistencyFlag[] {
  const flags: ConsistencyFlag[] = [];
  
  // Minimum expected time: 5 seconds per question (reading + selecting)
  const minimumExpectedSeconds = totalQuestions * 5;
  
  if (sessionDurationSeconds < minimumExpectedSeconds) {
    const avgSecondsPerQuestion = sessionDurationSeconds / totalQuestions;
    flags.push({
      type: "response_time",
      severity: "warning",
      message: `Assessment completed in ${sessionDurationSeconds}s (${avgSecondsPerQuestion.toFixed(1)}s per question). Rapid completion may indicate insufficient engagement. Consider follow-up.`,
    });
  }
  
  // Also flag if ALL questions answered in <30 seconds total (extreme rushing)
  if (sessionDurationSeconds < 30) {
    flags.push({
      type: "response_time",
      severity: "warning",
      message: `Assessment completed in under 30 seconds. Scores may not be reliable. Recommend re-assessment or direct conversation.`,
    });
  }
  
  return flags;
}

/**
 * Select a random context framing variant for the session.
 */
export function selectContextFrame(): ContextFrame {
  const CONTEXT_FRAMES: ContextFrame[] = [
    {
      id: "standard",
      text: "Over the last 2 weeks, how often have you been bothered by the following?",
    },
    {
      id: "busy_days",
      text: "Thinking about the last 2 weeks, especially during your busiest days, how often have you been bothered by the following?",
    },
    {
      id: "including_weekends",
      text: "Over the past 2 weeks, including weekends, how often have you been bothered by the following?",
    },
    {
      id: "overall_pattern",
      text: "Looking back over the last 2 weeks as a whole, how often have you been bothered by the following?",
    },
  ];
  
  return CONTEXT_FRAMES[Math.floor(Math.random() * CONTEXT_FRAMES.length)];
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
