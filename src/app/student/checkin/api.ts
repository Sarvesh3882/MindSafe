/**
 * Assessment API Utilities
 * Handles assessment persistence with retry logic
 */

import { createClient } from "@/lib/supabase/client";
import type {
  AssessmentScore,
  RiskLevel,
  TriageSignal,
  InstrumentKey,
  ConsistencyFlag,
  CamouflageResponse,
} from "@/lib/aria/engine";

export interface AssessmentPayload {
  user_id: string;
  date: string;
  scores: AssessmentScore;
  risk_level: RiskLevel;
  emotion: string;
  questions_asked: string[];
  completed: boolean;
  triage_result: "stable" | "escalate";
  triage_signal?: TriageSignal;
  instruments_used?: InstrumentKey[];
  counsellor_report?: unknown;
  consistency_flags?: ConsistencyFlag[];
  camouflage_responses?: CamouflageResponse[];
  context_frame_id?: string;
  session_duration_seconds?: number;
}

/**
 * Delay utility for exponential backoff
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Save assessment with retry logic
 * Retries up to 2 times with exponential backoff (500ms, 1000ms)
 * 
 * GUEST MODE: Returns success immediately without saving to Supabase
 * This allows unlimited guest tests without consuming database resources
 */
export async function saveAssessment(
  payload: AssessmentPayload,
  maxRetries = 2,
  isGuest = false
): Promise<{ success: boolean; error?: string }> {
  // Guest mode: Skip database write entirely
  if (isGuest) {
    console.log("Guest mode: Assessment not saved to database");
    return { success: true };
  }

  const supabase = createClient();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { error } = await supabase
        .from("assessments")
        .upsert(payload, { onConflict: "user_id,date" });

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error(`Save attempt ${attempt + 1} failed:`, err);

      // If this was the last attempt, return error
      if (attempt === maxRetries) {
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to save assessment. Please try again.",
        };
      }

      // Wait before retrying (exponential backoff)
      await delay(500 * Math.pow(2, attempt));
    }
  }

  return {
    success: false,
    error: "Failed to save assessment after multiple attempts.",
  };
}

/**
 * Trigger crisis alert
 * Calls the alerts API to notify counsellor
 * 
 * GUEST MODE: Returns success immediately without triggering alert
 */
export async function triggerCrisisAlert(
  userId: string,
  isGuest = false
): Promise<{ success: boolean; error?: string }> {
  // Guest mode: Skip alert trigger
  if (isGuest) {
    console.log("Guest mode: Crisis alert not triggered");
    return { success: true };
  }

  try {
    const response = await fetch("/api/alerts/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        type: "score_spike",
        riskLevel: "critical",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to trigger crisis alert");
    }

    return { success: true };
  } catch (err) {
    console.error("Crisis alert failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send alert",
    };
  }
}

/**
 * Fetch triage questions from Supabase
 * Returns 5 random questions from the pool to prevent pattern recognition
 */
export async function fetchTriageQuestions() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("is_triage", true);

  if (error) {
    console.error("Failed to fetch triage questions:", error);
    return [];
  }

  // Shuffle all questions
  const shuffled = (data || []).sort(() => Math.random() - 0.5);
  
  // Normalize options: DB uses "text" field, component expects "label"
  const normalized = shuffled.slice(0, 5).map((q: any) => ({
    ...q,
    options: (q.options || []).map((opt: any) => ({
      ...opt,
      label: opt.label ?? opt.text ?? "",
    })),
  }));

  return normalized;
}

/**
 * Fetch clinical questions for given instruments
 */
export async function fetchInstrumentQuestions(instruments: InstrumentKey[]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .in("instrument", instruments)
    .order("instrument")
    .order("question_number");

  if (error) {
    console.error("Failed to fetch instrument questions:", error);
    return [];
  }

  // Normalize options: DB uses "text" field, component expects "label"
  return (data || []).map((q: any) => ({
    ...q,
    options: (q.options || []).map((opt: any) => ({
      ...opt,
      label: opt.label ?? opt.text ?? "",
    })),
  }));
}

/**
 * Fetch camouflage questions
 */
export async function fetchCamouflageQuestions() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("is_camouflage", true)
    .limit(3);

  if (error) {
    console.error("Failed to fetch camouflage questions:", error);
    return [];
  }

  // Normalize options: DB uses "text" field, component expects "label"
  return (data || []).map((q: any) => ({
    ...q,
    options: (q.options || []).map((opt: any) => ({
      ...opt,
      label: opt.label ?? opt.text ?? "",
    })),
  }));
}

/**
 * Fetch recently asked question IDs for rotation algorithm
 */
export async function fetchRecentlyAskedQuestions(
  userId: string,
  days = 14
): Promise<string[]> {
  const supabase = createClient();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data, error } = await supabase
    .from("assessments")
    .select("questions_asked")
    .eq("user_id", userId)
    .gte("date", cutoffDate.toISOString().split("T")[0])
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to fetch recent questions:", error);
    return [];
  }

  // Flatten and deduplicate
  const allQuestions = data?.flatMap((a) => a.questions_asked || []) || [];
  return Array.from(new Set(allQuestions));
}

/**
 * Check if user has completed assessment today
 */
export async function hasCompletedToday(
  userId: string
): Promise<{ completed: boolean; assessment?: unknown }> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .eq("completed", true)
    .single();

  if (error) {
    return { completed: false };
  }

  return { completed: true, assessment: data };
}
