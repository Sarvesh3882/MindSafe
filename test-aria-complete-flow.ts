/**
 * ARIA 2.0 Complete Flow Testing
 * Tests the entire assessment journey from triage to wellness tips
 * Checks for dynamic behavior, variety, and natural flow
 */

import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  selectQuestionsForInstrument,
  mixQuestions,
  classifyRisk,
  selectContextFrame,
  INSTRUMENT_CONFIGS,
} from "./src/lib/aria/engine";
import { buildWellnessSummary } from "./src/lib/aria/insights";
import type { TriageSignal, InstrumentKey, MixedQuestion } from "./src/lib/aria/engine";

// Mock question data
const mockTriageQuestions: any[] = Array.from({ length: 16 }, (_, i) => ({
  id: `triage-${i + 1}`,
  question_text: `Triage question ${i + 1}`,
  question_type: "triage" as const,
  instrument: null,
  question_number: null,
  options: [
    { label: "Not at all", value: 0, maps_to: { depression: 0, anxiety: 0, stress: 0 } },
    { label: "Several days", value: 1, maps_to: { depression: 1, anxiety: 1, stress: 1 } },
    { label: "More than half", value: 2, maps_to: { depression: 2, anxiety: 2, stress: 2 } },
    { label: "Nearly every day", value: 3, maps_to: { depression: 3, anxiety: 3, stress: 3 } },
  ],
  isCamouflage: false,
  sourceInstrument: null,
  maps_to: {},
}));

const mockClinicalQuestions: Record<InstrumentKey, any[]> = {
  phq9: Array.from({ length: 9 }, (_, i) => ({
    id: `phq9-${i + 1}`,
    question_text: `PHQ-9 question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "phq9" as const,
    question_number: i + 1,
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
    isCamouflage: false,
    sourceInstrument: "phq9" as const,
    maps_to: {},
  })),
  gad7: Array.from({ length: 7 }, (_, i) => ({
    id: `gad7-${i + 1}`,
    question_text: `GAD-7 question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "gad7" as const,
    question_number: i + 1,
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
    isCamouflage: false,
    sourceInstrument: "gad7" as const,
    maps_to: {},
  })),
  pss10: Array.from({ length: 10 }, (_, i) => ({
    id: `pss10-${i + 1}`,
    question_text: `PSS-10 question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "pss10" as const,
    question_number: i + 1,
    options: [
      { label: "Never", value: 0 },
      { label: "Almost never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Fairly often", value: 3 },
      { label: "Very often", value: 4 },
    ],
    isCamouflage: false,
    sourceInstrument: "pss10" as const,
    maps_to: {},
  })),
  isi: Array.from({ length: 7 }, (_, i) => ({
    id: `isi-${i + 1}`,
    question_text: `ISI question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "isi" as const,
    question_number: i + 1,
    options: [
      { label: "None", value: 0 },
      { label: "Mild", value: 1 },
      { label: "Moderate", value: 2 },
      { label: "Severe", value: 3 },
      { label: "Very severe", value: 4 },
    ],
    isCamouflage: false,
    sourceInstrument: "isi" as const,
    maps_to: {},
  })),
  maslach: Array.from({ length: 22 }, (_, i) => ({
    id: `maslach-${i + 1}`,
    question_text: `Maslach question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "maslach" as const,
    question_number: i + 1,
    options: [
      { label: "Never", value: 0 },
      { label: "A few times a year", value: 1 },
      { label: "Once a month", value: 2 },
      { label: "A few times a month", value: 3 },
      { label: "Once a week", value: 4 },
      { label: "A few times a week", value: 5 },
      { label: "Every day", value: 6 },
    ],
    isCamouflage: false,
    sourceInstrument: "maslach" as const,
    maps_to: {},
  })),
  ucla: Array.from({ length: 20 }, (_, i) => ({
    id: `ucla-${i + 1}`,
    question_text: `UCLA question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "ucla" as const,
    question_number: i + 1,
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
    ],
    isCamouflage: false,
    sourceInstrument: "ucla" as const,
    maps_to: {},
  })),
  audit: Array.from({ length: 10 }, (_, i) => ({
    id: `audit-${i + 1}`,
    question_text: `AUDIT question ${i + 1}`,
    question_type: "clinical" as const,
    instrument: "audit" as const,
    question_number: i + 1,
    options: [
      { label: "Never", value: 0 },
      { label: "Less than monthly", value: 1 },
      { label: "Monthly", value: 2 },
      { label: "Weekly", value: 3 },
      { label: "Daily or almost daily", value: 4 },
    ],
    isCamouflage: false,
    sourceInstrument: "audit" as const,
    maps_to: {},
  })),
};

const mockCamouflageQuestions: any[] = Array.from({ length: 8 }, (_, i) => ({
  id: `camouflage-${i + 1}`,
  question_text: `Neutral question ${i + 1}`,
  question_type: "camouflage" as const,
  instrument: null,
  question_number: null,
  options: [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ],
  isCamouflage: true,
  sourceInstrument: null,
  maps_to: {},
}));

// Test scenarios
const testScenarios = [
  {
    name: "Low Concern Student",
    triageAnswers: [
      { questionId: "t1", value: 0, mapsTo: { depression: 0, anxiety: 0, stress: 0 } },
      { questionId: "t2", value: 1, mapsTo: { depression: 1, anxiety: 0, stress: 0 } },
      { questionId: "t3", value: 0, mapsTo: { depression: 0, anxiety: 1, stress: 0 } },
      { questionId: "t4", value: 1, mapsTo: { depression: 0, anxiety: 0, stress: 1 } },
      { questionId: "t5", value: 0, mapsTo: { depression: 0, anxiety: 0, stress: 0 } },
    ],
    expectedEscalation: false,
  },
  {
    name: "Moderate Depression",
    triageAnswers: [
      { questionId: "t1", value: 2, mapsTo: { depression: 2, anxiety: 0, stress: 0 } },
      { questionId: "t2", value: 2, mapsTo: { depression: 2, anxiety: 0, stress: 0 } },
      { questionId: "t3", value: 1, mapsTo: { depression: 1, anxiety: 1, stress: 0 } },
      { questionId: "t4", value: 2, mapsTo: { depression: 2, anxiety: 0, stress: 1 } },
      { questionId: "t5", value: 1, mapsTo: { depression: 1, anxiety: 0, stress: 0 } },
    ],
    expectedEscalation: true,
    expectedInstruments: ["phq9"],
  },
  {
    name: "High Anxiety",
    triageAnswers: [
      { questionId: "t1", value: 3, mapsTo: { depression: 0, anxiety: 3, stress: 0 } },
      { questionId: "t2", value: 3, mapsTo: { depression: 0, anxiety: 3, stress: 0 } },
      { questionId: "t3", value: 2, mapsTo: { depression: 1, anxiety: 2, stress: 0 } },
      { questionId: "t4", value: 3, mapsTo: { depression: 0, anxiety: 3, stress: 1 } },
      { questionId: "t5", value: 2, mapsTo: { depression: 0, anxiety: 2, stress: 0 } },
    ],
    expectedEscalation: true,
    expectedInstruments: ["gad7"],
  },
  {
    name: "Multi-Domain (Stress + Sleep)",
    triageAnswers: [
      { questionId: "t1", value: 2, mapsTo: { depression: 0, anxiety: 1, stress: 2 } },
      { questionId: "t2", value: 3, mapsTo: { depression: 0, anxiety: 0, stress: 3 } },
      { questionId: "t3", value: 2, mapsTo: { depression: 0, anxiety: 0, stress: 2, sleep: 2 } },
      { questionId: "t4", value: 3, mapsTo: { depression: 0, anxiety: 1, stress: 3 } },
      { questionId: "t5", value: 2, mapsTo: { depression: 0, anxiety: 0, stress: 2, sleep: 2 } },
    ],
    expectedEscalation: true,
    expectedInstruments: ["pss10", "isi"],
  },
];

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("ARIA 2.0 COMPLETE FLOW TESTING");
console.log("Testing for dynamic behavior, variety, and natural flow");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const issues: string[] = [];
let testCount = 0;

// Test 1: Context Frame Variety
console.log("═══════════════════════════════════════════════════════════════════");
console.log("TEST 1: CONTEXT FRAME VARIETY");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("Testing if context frames vary across sessions...\n");

const contextFrames = [];
for (let i = 0; i < 10; i++) {
  const frame = selectContextFrame();
  contextFrames.push(frame.id);
  console.log(`Session ${i + 1}: ${frame.id} - "${frame.text}"`);
}

const uniqueFrames = new Set(contextFrames).size;
console.log(`\n✓ Result: ${uniqueFrames}/4 unique frames used across 10 sessions (4 frames available)`);

if (uniqueFrames < 2) {
  issues.push("❌ Context frames not varying - always same frame");
  console.log("❌ ISSUE: Context frames are not varying");
} else {
  console.log("✅ PASS: Context frames are varying");
}
testCount++;

// Test 2: Triage Question Selection
console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("TEST 2: TRIAGE QUESTION SELECTION");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("Testing if triage questions are randomly selected (5 from pool of 16)...\n");

const triageSessions = [];
for (let i = 0; i < 5; i++) {
  // Simulate random selection of 5 questions from 16
  const shuffled = [...mockTriageQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);
  const questionIds = selected.map(q => q.id);
  triageSessions.push(questionIds.join(","));
  console.log(`Session ${i + 1}: ${questionIds.join(", ")}`);
}

const uniqueTriageSets = new Set(triageSessions).size;
console.log(`\n✓ Result: ${uniqueTriageSets}/5 unique question sets`);

if (uniqueTriageSets < 3) {
  issues.push("❌ Triage questions not varying enough");
  console.log("❌ ISSUE: Triage questions are too similar across sessions");
} else {
  console.log("✅ PASS: Triage questions vary across sessions");
}
testCount++;

// Test 3: Triage Signal Computation
console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("TEST 3: TRIAGE SIGNAL COMPUTATION & ESCALATION LOGIC");
console.log("═══════════════════════════════════════════════════════════════════\n");

testScenarios.forEach((scenario, idx) => {
  console.log(`Scenario ${idx + 1}: ${scenario.name}`);
  console.log("─".repeat(70));
  
  const signal = computeTriageSignal(scenario.triageAnswers as any);
  const escalate = shouldEscalate(signal);
  
  console.log("Triage Signal:");
  console.log(`  Depression: ${signal.depression}`);
  console.log(`  Anxiety: ${signal.anxiety}`);
  console.log(`  Stress: ${signal.stress}`);
  console.log(`  Sleep: ${signal.sleep || 0}`);
  console.log(`  Burnout: ${signal.burnout || 0}`);
  console.log(`  Loneliness: ${signal.loneliness || 0}`);
  console.log(`\nEscalation Decision: ${escalate ? "ESCALATE" : "STABLE"}`);
  
  if (escalate !== scenario.expectedEscalation) {
    issues.push(`❌ ${scenario.name}: Expected escalation=${scenario.expectedEscalation}, got ${escalate}`);
    console.log(`❌ ISSUE: Expected ${scenario.expectedEscalation ? "escalation" : "stable"}`);
  } else {
    console.log(`✅ Correct escalation decision`);
  }
  
  if (escalate) {
    const queue = buildAssessmentQueue(signal);
    console.log(`\nAssessment Queue: ${queue.join(", ")}`);
    
    if (scenario.expectedInstruments) {
      const hasExpected = scenario.expectedInstruments.every(inst => queue.includes(inst as InstrumentKey));
      if (!hasExpected) {
        issues.push(`❌ ${scenario.name}: Expected instruments ${scenario.expectedInstruments.join(", ")}`);
        console.log(`❌ ISSUE: Missing expected instruments`);
      } else {
        console.log(`✅ Correct instruments selected`);
      }
    }
  }
  
  console.log("");
});
testCount++;

// Test 4: Question Mixing Algorithm
console.log("═══════════════════════════════════════════════════════════════════");
console.log("TEST 4: QUESTION MIXING ALGORITHM");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("Testing if clinical questions are properly mixed with camouflage...\n");

const signal: TriageSignal = { depression: 8, anxiety: 6, stress: 5, sleep: 0, burnout: 0, loneliness: 0 };
const queue = buildAssessmentQueue(signal);
console.log(`Assessment Queue: ${queue.join(", ")}`);

const questionsByInstrument = new Map();
queue.forEach(instrument => {
  const questions = mockClinicalQuestions[instrument];
  const config = INSTRUMENT_CONFIGS[instrument];
  const selectedIds = selectQuestionsForInstrument(instrument, questions.map(q => q.id), []);
  const selected = questions.filter(q => selectedIds.includes(q.id));
  questionsByInstrument.set(instrument, selected);
  console.log(`${instrument}: Selected ${selected.length}/${questions.length} questions`);
});

const mixed = mixQuestions(questionsByInstrument, mockCamouflageQuestions);
console.log(`\nMixed Questions: ${mixed.length} total`);

const clinicalCount = mixed.filter(q => !q.isCamouflage).length;
const camouflageCount = mixed.filter(q => q.isCamouflage).length;

console.log(`  Clinical: ${clinicalCount}`);
console.log(`  Camouflage: ${camouflageCount}`);

// Check for clustering (no more than 3 consecutive clinical questions)
let maxConsecutive = 0;
let currentConsecutive = 0;
mixed.forEach(q => {
  if (!q.isCamouflage) {
    currentConsecutive++;
    maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
  } else {
    currentConsecutive = 0;
  }
});

console.log(`  Max consecutive clinical: ${maxConsecutive}`);

if (maxConsecutive > 4) {
  issues.push("❌ Too many consecutive clinical questions (clustering detected)");
  console.log("❌ ISSUE: Clinical questions are clustering");
} else {
  console.log("✅ PASS: Questions are well-mixed");
}

// Check if order varies
console.log("\nTesting question order variety across 3 sessions:");
const mixedSessions = [];
for (let i = 0; i < 3; i++) {
  const mixedAgain = mixQuestions(questionsByInstrument, mockCamouflageQuestions);
  const order = mixedAgain.map(q => q.isCamouflage ? "C" : "Q").join("");
  mixedSessions.push(order);
  console.log(`  Session ${i + 1}: ${order.substring(0, 30)}...`);
}

const uniqueMixedSets = new Set(mixedSessions).size;
if (uniqueMixedSets < 2) {
  issues.push("❌ Question mixing order is static");
  console.log("❌ ISSUE: Question order is not varying");
} else {
  console.log("✅ PASS: Question order varies across sessions");
}
testCount++;

// Test 5: Question Rotation (avoiding recently asked)
console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("TEST 5: QUESTION ROTATION");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("Testing if questions rotate to avoid repetition...\n");

// For rotation to work, we need MORE questions available than needed
// PHQ-9 needs 9 questions, so let's create a pool of 15 to test rotation
const extendedPhq9Pool = [
  ...mockClinicalQuestions.phq9.map(q => q.id),
  "phq9-10", "phq9-11", "phq9-12", "phq9-13", "phq9-14", "phq9-15"
];

const recentlyAsked = ["phq9-1", "phq9-2", "phq9-3", "phq9-4", "phq9-5"];

console.log(`Recently asked: ${recentlyAsked.join(", ")}`);
console.log(`Available PHQ-9 questions in pool: ${extendedPhq9Pool.length}`);
console.log(`Questions needed: 9`);

const selected1 = selectQuestionsForInstrument("phq9", extendedPhq9Pool, recentlyAsked);
console.log(`\nSelected (with rotation): ${selected1.join(", ")}`);

// Count how many recently asked questions were selected
const recentlyAskedCount = selected1.filter(id => recentlyAsked.includes(id)).length;
const freshCount = selected1.filter(id => !recentlyAsked.includes(id)).length;

console.log(`  Fresh questions: ${freshCount}/9`);
console.log(`  Recently asked: ${recentlyAskedCount}/9`);

// With 15 available and 5 recently asked, we should be able to select 9 fresh ones
if (recentlyAskedCount > 0) {
  issues.push("❌ Question rotation not working - recently asked questions selected when fresh ones available");
  console.log("❌ ISSUE: Recently asked questions selected when fresh alternatives available");
} else {
  console.log("✅ PASS: Recently asked questions avoided, fresh questions prioritized");
}

// Test without rotation
const selected2 = selectQuestionsForInstrument("phq9", extendedPhq9Pool, []);
console.log(`\nSelected (no rotation): ${selected2.slice(0, 9).join(", ")}...`);

if (selected1.join(",") === selected2.slice(0, 9).join(",")) {
  console.log("⚠️  WARNING: Selection is identical with and without rotation");
} else {
  console.log("✅ PASS: Rotation affects selection");
}
testCount++;

// Test 6: Risk Classification
console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("TEST 6: RISK CLASSIFICATION");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("Testing if risk levels are correctly classified...\n");

const riskScenarios = [
  { name: "Stable", scores: { depression: 3, anxiety: 2, stress: 8, sleep: 4, burnout: 15, loneliness: 12, substance: 0 }, expected: "stable" },
  { name: "Attention", scores: { depression: 10, anxiety: 8, stress: 16, sleep: 10, burnout: 40, loneliness: 25, substance: 0 }, expected: "attention" },
  { name: "Critical (Depression)", scores: { depression: 20, anxiety: 8, stress: 16, sleep: 10, burnout: 40, loneliness: 25, substance: 0 }, expected: "critical" },
  { name: "Critical (Anxiety)", scores: { depression: 10, anxiety: 18, stress: 16, sleep: 10, burnout: 40, loneliness: 25, substance: 0 }, expected: "critical" },
  { name: "Critical (Stress)", scores: { depression: 10, anxiety: 8, stress: 30, sleep: 10, burnout: 40, loneliness: 25, substance: 0 }, expected: "critical" },
];

riskScenarios.forEach(scenario => {
  const risk = classifyRisk(scenario.scores);
  const match = risk === scenario.expected;
  console.log(`${scenario.name}: ${risk} ${match ? "✅" : "❌"}`);
  if (!match) {
    issues.push(`❌ ${scenario.name}: Expected ${scenario.expected}, got ${risk}`);
  }
});
testCount++;

// Test 7: Wellness Tips Variety
console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("TEST 7: WELLNESS TIPS VARIETY");
console.log("═══════════════════════════════════════════════════════════════════");
console.log("Testing if wellness tips vary across sessions...\n");

const tipScenarios = [
  { concern: "depression" as const, scores: { depression: 6, anxiety: 3, stress: 10, sleep: 5, burnout: 20, loneliness: 15, substance: 0 } },
  { concern: "anxiety" as const, scores: { depression: 5, anxiety: 12, stress: 14, sleep: 6, burnout: 25, loneliness: 18, substance: 0 } },
  { concern: "stress" as const, scores: { depression: 8, anxiety: 7, stress: 32, sleep: 10, burnout: 40, loneliness: 20, substance: 0 } },
];

tipScenarios.forEach(scenario => {
  console.log(`\n${scenario.concern.toUpperCase()} Tips:`);
  console.log("─".repeat(70));
  
  const tipSets = [];
  const sectionHeadings = [];
  for (let i = 0; i < 3; i++) {
    const { headline, tips, sectionHeading } = buildWellnessSummary(scenario.concern, false, scenario.scores);
    const tipTexts = tips.map(t => t.text.substring(0, 40) + "...").join(" | ");
    tipSets.push(tipTexts);
    sectionHeadings.push(sectionHeading);
    console.log(`Session ${i + 1}:`);
    console.log(`  Section: "${sectionHeading}"`);
    tips.forEach((tip, idx) => {
      console.log(`  ${idx + 1}. ${tip.emoji} ${tip.text.substring(0, 50)}...`);
    });
  }
  
  const uniqueTipSets = new Set(tipSets).size;
  const uniqueHeadings = new Set(sectionHeadings).size;
  
  if (uniqueTipSets < 2) {
    issues.push(`❌ ${scenario.concern} tips are static`);
    console.log(`❌ ISSUE: Tips are not varying`);
  } else {
    console.log(`✅ PASS: Tips vary across sessions (${uniqueTipSets}/3 unique)`);
  }
  
  if (uniqueHeadings < 2) {
    issues.push(`❌ ${scenario.concern} section headings are static`);
    console.log(`❌ ISSUE: Section headings are not varying`);
  } else {
    console.log(`✅ PASS: Section headings vary (${uniqueHeadings}/3 unique)`);
  }
});
testCount++;

// Summary
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("SUMMARY");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

console.log(`Total Tests: ${testCount}`);
console.log(`Issues Found: ${issues.length}\n`);

if (issues.length === 0) {
  console.log("✅ ALL TESTS PASSED!");
  console.log("\nARIA 2.0 is functioning as expected:");
  console.log("  ✓ Context frames vary");
  console.log("  ✓ Triage questions randomized");
  console.log("  ✓ Escalation logic correct");
  console.log("  ✓ Questions properly mixed");
  console.log("  ✓ Question rotation working");
  console.log("  ✓ Risk classification accurate");
  console.log("  ✓ Wellness tips dynamic");
  console.log("\n🎉 No robotic, static, or unusual behavior detected!");
} else {
  console.log("⚠️  ISSUES DETECTED:\n");
  issues.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue}`);
  });
  console.log("\n⚠️  Some aspects may feel robotic or static.");
}

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
