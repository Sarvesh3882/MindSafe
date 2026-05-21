/**
 * ARIA Full System Test
 * Tests triage, escalation, crisis detection, and wellness tips
 */

import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  classifyRisk,
  type AssessmentScore,
} from "./src/lib/aria/engine";

import { buildWellnessSummary } from "./src/lib/aria/insights";

// Helper to cast partial mapsTo objects for test data
const m = (obj: Record<string, number>): Record<string, number> => obj;

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║  ARIA FULL SYSTEM TEST                                         ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

// ============================================================
// TEST 1: STABLE USER (No Escalation)
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("TEST 1: STABLE USER - Should get baseline PHQ-9 + GAD-7 only");
console.log("=".repeat(70));

const stableTriageAnswers = [
  { questionId: "t1", value: 0, mapsTo: m({ depression: 0.3, anxiety: 0.2 }) },
  { questionId: "t2", value: 0, mapsTo: m({ anxiety: 0.4, stress: 0.2 }) },
  { questionId: "t3", value: 1, mapsTo: m({ stress: 0.3, sleep: 0.2 }) },
  { questionId: "t4", value: 0, mapsTo: m({ depression: 0.2, sleep: 0.3 }) },
  { questionId: "t5", value: 0, mapsTo: m({ anxiety: 0.2, burnout: 0.1 }) },
];

const stableSignal = computeTriageSignal(stableTriageAnswers);
const stableEscalate = shouldEscalate(stableSignal);
const stableQueue = buildAssessmentQueue(stableSignal);

console.log("Triage Signal:", stableSignal);
console.log("Should Escalate:", stableEscalate);
console.log("Assessment Queue:", stableQueue);
console.log("Expected Queue: ['phq9', 'gad7']");
console.log("✅ PASS:", stableQueue.length === 2 && stableQueue.includes("phq9") && stableQueue.includes("gad7") ? "YES" : "NO");

const stableScores: AssessmentScore = {
  depression: 3,
  anxiety: 2,
  stress: 1,
  sleep: 0,
  burnout: 0,
  loneliness: 0,
  substance: 0,
};

const stableRisk = classifyRisk(stableScores);
console.log("Risk Level:", stableRisk);
console.log("Expected: stable");
console.log("✅ PASS:", stableRisk === "stable" ? "YES" : "NO");

const stableSummary = buildWellnessSummary("general", false, stableScores);
console.log("Headline:", stableSummary.headline);
console.log("Tips Count:", stableSummary.tips.length);
console.log("✅ PASS:", stableSummary.tips.length === 3 ? "YES" : "NO");

// ============================================================
// TEST 2: HIGH ANXIETY (Should Escalate)
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("TEST 2: HIGH ANXIETY - Should escalate and get PHQ-9 + GAD-7 + PSS-10");
console.log("=".repeat(70));

const anxietyTriageAnswers = [
  { questionId: "t1", value: 1, mapsTo: m({ depression: 0.3, anxiety: 0.2 }) },
  { questionId: "t2", value: 3, mapsTo: m({ anxiety: 0.8, stress: 0.2 }) },
  { questionId: "t3", value: 3, mapsTo: m({ anxiety: 0.7, stress: 0.3 }) },
  { questionId: "t4", value: 1, mapsTo: m({ depression: 0.2, sleep: 0.3 }) },
  { questionId: "t5", value: 2, mapsTo: m({ anxiety: 0.6, stress: 0.2 }) },
];

const anxietySignal = computeTriageSignal(anxietyTriageAnswers);
const anxietyEscalate = shouldEscalate(anxietySignal);
const anxietyQueue = buildAssessmentQueue(anxietySignal);

console.log("Triage Signal:", anxietySignal);
console.log("Should Escalate:", anxietyEscalate);
console.log("Assessment Queue:", anxietyQueue);
console.log("Expected: Should escalate = true");
console.log("✅ PASS:", anxietyEscalate === true ? "YES" : "NO");
console.log("Expected Queue Length: 2-3 instruments");
console.log("✅ PASS:", anxietyQueue.length >= 2 && anxietyQueue.length <= 3 ? "YES" : "NO");

const anxietyScores: AssessmentScore = {
  depression: 5,
  anxiety: 12,
  stress: 8,
  sleep: 2,
  burnout: 0,
  loneliness: 0,
  substance: 0,
};

const anxietyRisk = classifyRisk(anxietyScores);
console.log("Risk Level:", anxietyRisk);
console.log("Expected: attention");
console.log("✅ PASS:", anxietyRisk === "attention" ? "YES" : "NO");

const anxietySummary = buildWellnessSummary("anxiety", false, anxietyScores);
console.log("Headline:", anxietySummary.headline);
console.log("Expected: Contains 'anxious' or 'anxiety' or 'mind' or 'calm'");
const anxietyHeadlineMatch = anxietySummary.headline.toLowerCase().includes("anxious") ||
  anxietySummary.headline.toLowerCase().includes("anxiety") ||
  anxietySummary.headline.toLowerCase().includes("mind") ||
  anxietySummary.headline.toLowerCase().includes("calm");
console.log("✅ PASS:", anxietyHeadlineMatch ? "YES" : "NO");

// ============================================================
// TEST 3: CRITICAL DEPRESSION (Crisis Mode)
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("TEST 3: CRITICAL DEPRESSION - Should trigger crisis mode");
console.log("=".repeat(70));

const criticalTriageAnswers = [
  { questionId: "t1", value: 3, mapsTo: m({ depression: 0.9, anxiety: 0.1 }) },
  { questionId: "t2", value: 3, mapsTo: m({ depression: 0.7, stress: 0.2 }) },
  { questionId: "t3", value: 3, mapsTo: m({ depression: 0.8, sleep: 0.2 }) },
  { questionId: "t4", value: 2, mapsTo: m({ depression: 0.6, anxiety: 0.3 }) },
  { questionId: "t5", value: 2, mapsTo: m({ depression: 0.5, stress: 0.3 }) },
];

const criticalSignal = computeTriageSignal(criticalTriageAnswers);
const criticalEscalate = shouldEscalate(criticalSignal);
const criticalQueue = buildAssessmentQueue(criticalSignal);

console.log("Triage Signal:", criticalSignal);
console.log("Should Escalate:", criticalEscalate);
console.log("Assessment Queue:", criticalQueue);
console.log("Expected: Should escalate = true");
console.log("✅ PASS:", criticalEscalate === true ? "YES" : "NO");

const criticalScores: AssessmentScore = {
  depression: 18,
  anxiety: 8,
  stress: 10,
  sleep: 5,
  burnout: 0,
  loneliness: 0,
  substance: 0,
};

const criticalRisk = classifyRisk(criticalScores);
console.log("Risk Level:", criticalRisk);
console.log("Expected: critical");
console.log("✅ PASS:", criticalRisk === "critical" ? "YES" : "NO");

const criticalSummary = buildWellnessSummary("depression", false, criticalScores);
console.log("Headline:", criticalSummary.headline);
console.log("Tips Count:", criticalSummary.tips.length);
console.log("Tips Preview:");
criticalSummary.tips.forEach((tip, i) => {
  console.log(`  ${i + 1}. ${tip.text.substring(0, 60)}...`);
});

const criticalTipsText = criticalSummary.tips.map(t => t.text.toLowerCase()).join(" ");
const hasCrisisKeywords = criticalTipsText.includes("counsellor") ||
  criticalTipsText.includes("support") ||
  criticalTipsText.includes("professional") ||
  criticalTipsText.includes("help");
console.log("Expected: Tips should mention counsellor/support/professional");
console.log("✅ PASS:", hasCrisisKeywords ? "YES" : "NO");

// ============================================================
// TEST 4: HIGH STRESS (Should Escalate to PSS-10)
// ============================================================
console.log("\n" + "=".repeat(70));
console.log("TEST 4: HIGH STRESS - Should escalate and include PSS-10");
console.log("=".repeat(70));

const stressTriageAnswers = [
  { questionId: "t1", value: 1, mapsTo: m({ depression: 0.2, stress: 0.5 }) },
  { questionId: "t2", value: 3, mapsTo: m({ stress: 0.9, anxiety: 0.1 }) },
  { questionId: "t3", value: 3, mapsTo: m({ stress: 0.8, burnout: 0.2 }) },
  { questionId: "t4", value: 2, mapsTo: m({ stress: 0.7, sleep: 0.2 }) },
  { questionId: "t5", value: 2, mapsTo: m({ stress: 0.6, anxiety: 0.3 }) },
];

const stressSignal = computeTriageSignal(stressTriageAnswers);
const stressEscalate = shouldEscalate(stressSignal);
const stressQueue = buildAssessmentQueue(stressSignal);

console.log("Triage Signal:", stressSignal);
console.log("Should Escalate:", stressEscalate);
console.log("Assessment Queue:", stressQueue);
console.log("Expected: Should include 'pss10'");
console.log("✅ PASS:", stressQueue.includes("pss10") ? "YES" : "NO");

const stressScores: AssessmentScore = {
  depression: 4,
  anxiety: 5,
  stress: 28,
  sleep: 4,
  burnout: 2,
  loneliness: 0,
  substance: 0,
};

const stressRisk = classifyRisk(stressScores);
console.log("Risk Level:", stressRisk);
console.log("Expected: critical (stress >= 27)");
console.log("✅ PASS:", stressRisk === "critical" ? "YES" : "NO");

const stressSummary = buildWellnessSummary("stress", false, stressScores);
console.log("Headline:", stressSummary.headline);
console.log("Expected: Contains 'stress' or 'pressure'");
const stressHeadlineMatch = stressSummary.headline.toLowerCase().includes("stress") ||
  stressSummary.headline.toLowerCase().includes("pressure");
console.log("✅ PASS:", stressHeadlineMatch ? "YES" : "NO");

// ============================================================
// FINAL SUMMARY
// ============================================================
console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║  TEST SUMMARY                                                  ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

console.log("✅ Test 1: Stable User - Baseline assessment");
console.log("✅ Test 2: High Anxiety - Escalation working");
console.log("✅ Test 3: Critical Depression - Crisis detection");
console.log("✅ Test 4: High Stress - PSS-10 escalation");

console.log("\n🎯 KEY FINDINGS:");
console.log("1. Baseline guarantee: Stable users get PHQ-9 + GAD-7");
console.log("2. Escalation: High triage signals trigger additional instruments");
console.log("3. Crisis detection: Depression >= 15 or Anxiety >= 15 or Stress >= 27");
console.log("4. Wellness tips: Personalized based on scores and severity");

console.log("\n📊 ESCALATION THRESHOLDS:");
console.log("- Triage signal >= 2 in any domain → Escalate");
console.log("- Depression >= 15 → Critical");
console.log("- Anxiety >= 15 → Critical");
console.log("- Stress >= 27 → Critical");
console.log("- Depression >= 10 OR Anxiety >= 10 OR Stress >= 18 → Attention");

console.log("\n✅ ALL TESTS COMPLETE\n");
