/**
 * ARIA Engine Logic Tests — pure JS, no imports needed
 * Tests all critical paths: triage, escalation, scoring, risk classification
 */

// ── Replicate engine constants ──────────────────────────────────────────────
const ESCALATION_THRESHOLD = 2;
const MAX_INSTRUMENTS = 3;

const INSTRUMENT_CONFIGS = {
  phq9:    { domain: "depression", totalQuestions: 9,  maxScore: 27, itemMax: 3, crisisThreshold: 15 },
  gad7:    { domain: "anxiety",    totalQuestions: 7,  maxScore: 21, itemMax: 3, crisisThreshold: 15 },
  isi:     { domain: "sleep",      totalQuestions: 7,  maxScore: 28, itemMax: 4 },
  pss10:   { domain: "stress",     totalQuestions: 10, maxScore: 40, itemMax: 4, reverseItems: [4,5,7,8], crisisThreshold: 27 },
  maslach: { domain: "burnout",    totalQuestions: 22, maxScore: 132, itemMax: 6, crisisThreshold: 88 },
  ucla:    { domain: "loneliness", totalQuestions: 20, maxScore: 80,  itemMax: 4, crisisThreshold: 60 },
  audit:   { domain: "substance",  totalQuestions: 10, maxScore: 40,  itemMax: 4, crisisThreshold: 20 },
};

const DOMAIN_TO_INSTRUMENT = {
  depression: "phq9", anxiety: "gad7", stress: "pss10",
  sleep: "isi", burnout: "maslach", loneliness: "ucla",
};

// ── Engine functions ─────────────────────────────────────────────────────────
function computeTriageSignal(answers) {
  const signal = { depression:0, anxiety:0, stress:0, sleep:0, burnout:0, loneliness:0 };
  answers.forEach(a => {
    Object.entries(a.mapsTo).forEach(([domain, weight]) => {
      if (domain in signal) signal[domain] += weight;
    });
  });
  Object.keys(signal).forEach(d => { signal[d] = Math.min(signal[d], 3); });
  return signal;
}

function shouldEscalate(signal) {
  return Object.values(signal).some(v => v >= ESCALATION_THRESHOLD);
}

function buildAssessmentQueue(signal) {
  const withSignals = Object.entries(signal)
    .filter(([, v]) => v >= ESCALATION_THRESHOLD)
    .map(([domain, v]) => ({ instrument: DOMAIN_TO_INSTRUMENT[domain], signal: v }))
    .sort((a, b) => b.signal - a.signal)
    .slice(0, MAX_INSTRUMENTS)
    .map(x => x.instrument);
  return withSignals.length === 0 ? ["phq9", "gad7"] : withSignals;
}

function classifyRisk(scores) {
  const { depression, anxiety, stress } = scores;
  if (depression >= 15 || anxiety >= 15 || stress >= 27) return "critical";
  if (depression >= 10 || anxiety >= 10 || stress >= 18) return "attention";
  return "stable";
}

function accumulateScore(current, value, mapsTo, config, questionNumber) {
  const domain = config.domain;
  const multiplier = mapsTo[domain] ?? 0;
  const isReverse = config.reverseItems?.includes(questionNumber) ?? false;
  const contribution = isReverse
    ? (config.itemMax - value) * multiplier
    : value * multiplier;
  return Math.min(current + contribution, config.maxScore);
}

// ── Test harness ─────────────────────────────────────────────────────────────
let passed = 0, failed = 0;
function test(name, condition, got, expected) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    console.log(`     got:      ${JSON.stringify(got)}`);
    console.log(`     expected: ${JSON.stringify(expected)}`);
    failed++;
  }
}

// ── CASE 1: All-positive triage → stable, no escalation ──────────────────────
console.log("\n═══ CASE 1: All-positive triage (stable user) ═══");
const stableAnswers = [
  { mapsTo: { depression:0, burnout:0 } },
  { mapsTo: { sleep:0, depression:0, anxiety:0 } },
  { mapsTo: { stress:0, anxiety:0, burnout:0 } },
  { mapsTo: { loneliness:0, depression:0 } },
  { mapsTo: { anxiety:0, stress:0 } },
];
const stableSig = computeTriageSignal(stableAnswers);
test("No domain reaches threshold", !shouldEscalate(stableSig), shouldEscalate(stableSig), false);
const stableQ = buildAssessmentQueue(stableSig);
test("Stable queue = [phq9, gad7]", JSON.stringify(stableQ) === '["phq9","gad7"]', stableQ, ["phq9","gad7"]);
test("Stable risk", classifyRisk({depression:2,anxiety:1,stress:5,sleep:0,burnout:0,loneliness:0,substance:0}) === "stable", null, "stable");

// ── CASE 2: High anxiety triage → escalate to GAD-7 ──────────────────────────
console.log("\n═══ CASE 2: High anxiety triage ═══");
const anxietyAnswers = [
  { mapsTo: { depression:0, burnout:0 } },
  { mapsTo: { sleep:2, depression:1, anxiety:2 } },  // bad sleep → anxiety signal
  { mapsTo: { stress:2, anxiety:1, burnout:1 } },
  { mapsTo: { loneliness:0, depression:0 } },
  { mapsTo: { anxiety:3, stress:2 } },               // very anxious
];
const anxSig = computeTriageSignal(anxietyAnswers);
test("Anxiety signal >= 2", anxSig.anxiety >= 2, anxSig.anxiety, ">=2");
test("Should escalate", shouldEscalate(anxSig), shouldEscalate(anxSig), true);
const anxQ = buildAssessmentQueue(anxSig);
test("Queue includes gad7", anxQ.includes("gad7"), anxQ, "includes gad7");

// ── CASE 3: Poor sleep → escalate to ISI ─────────────────────────────────────
console.log("\n═══ CASE 3: Poor sleep triage ═══");
const sleepAnswers = [
  { mapsTo: { depression:0, burnout:0 } },
  { mapsTo: { sleep:3, depression:1, anxiety:2 } },  // barely slept
  { mapsTo: { stress:0, anxiety:0, burnout:0 } },
  { mapsTo: { loneliness:0, depression:0 } },
  { mapsTo: { anxiety:0, stress:0 } },
];
const sleepSig = computeTriageSignal(sleepAnswers);
test("Sleep signal >= 2", sleepSig.sleep >= 2, sleepSig.sleep, ">=2");
const sleepQ = buildAssessmentQueue(sleepSig);
test("Queue includes isi", sleepQ.includes("isi"), sleepQ, "includes isi");

// ── CASE 4: Lonely → escalate to UCLA ────────────────────────────────────────
console.log("\n═══ CASE 4: Loneliness triage ═══");
const lonelyAnswers = [
  { mapsTo: { depression:0, burnout:0 } },
  { mapsTo: { sleep:0, depression:0, anxiety:0 } },
  { mapsTo: { stress:0, anxiety:0, burnout:0 } },
  { mapsTo: { loneliness:3, depression:2 } },        // very alone
  { mapsTo: { anxiety:0, stress:0 } },
];
const lonelySig = computeTriageSignal(lonelyAnswers);
test("Loneliness signal >= 2", lonelySig.loneliness >= 2, lonelySig.loneliness, ">=2");
const lonelyQ = buildAssessmentQueue(lonelySig);
test("Queue includes ucla", lonelyQ.includes("ucla"), lonelyQ, "includes ucla");

// ── CASE 5: Burnout → escalate to Maslach ────────────────────────────────────
console.log("\n═══ CASE 5: Burnout triage ═══");
const burnoutAnswers = [
  { mapsTo: { depression:2, burnout:2 } },           // very drained
  { mapsTo: { sleep:0, depression:0, anxiety:0 } },
  { mapsTo: { stress:2, anxiety:1, burnout:2 } },    // overwhelmed
  { mapsTo: { loneliness:0, depression:0 } },
  { mapsTo: { anxiety:0, stress:0 } },
];
const burnoutSig = computeTriageSignal(burnoutAnswers);
test("Burnout signal >= 2", burnoutSig.burnout >= 2, burnoutSig.burnout, ">=2");
const burnoutQ = buildAssessmentQueue(burnoutSig);
test("Queue includes maslach", burnoutQ.includes("maslach"), burnoutQ, "includes maslach");

// ── CASE 6: Max instruments cap (3) ──────────────────────────────────────────
console.log("\n═══ CASE 6: Multiple escalations capped at 3 instruments ═══");
const allBadAnswers = [
  { mapsTo: { depression:2, burnout:2 } },
  { mapsTo: { sleep:3, depression:1, anxiety:2 } },
  { mapsTo: { stress:3, anxiety:2, burnout:2 } },
  { mapsTo: { loneliness:3, depression:2 } },
  { mapsTo: { anxiety:3, stress:2 } },
];
const allBadSig = computeTriageSignal(allBadAnswers);
const allBadQ = buildAssessmentQueue(allBadSig);
test("Queue capped at 3", allBadQ.length <= 3, allBadQ.length, "<=3");
test("Queue has at least 1 instrument", allBadQ.length >= 1, allBadQ.length, ">=1");

// ── CASE 7: Risk classification thresholds ───────────────────────────────────
console.log("\n═══ CASE 7: Risk classification ═══");
const base = { sleep:0, burnout:0, loneliness:0, substance:0 };
test("PHQ-9 < 10 = stable",    classifyRisk({...base, depression:9,  anxiety:0,  stress:0})  === "stable",   null, "stable");
test("PHQ-9 = 10 = attention", classifyRisk({...base, depression:10, anxiety:0,  stress:0})  === "attention", null, "attention");
test("PHQ-9 = 15 = critical",  classifyRisk({...base, depression:15, anxiety:0,  stress:0})  === "critical",  null, "critical");
test("GAD-7 = 10 = attention", classifyRisk({...base, depression:0,  anxiety:10, stress:0})  === "attention", null, "attention");
test("GAD-7 = 15 = critical",  classifyRisk({...base, depression:0,  anxiety:15, stress:0})  === "critical",  null, "critical");
test("PSS-10 = 18 = attention",classifyRisk({...base, depression:0,  anxiety:0,  stress:18}) === "attention", null, "attention");
test("PSS-10 = 27 = critical", classifyRisk({...base, depression:0,  anxiety:0,  stress:27}) === "critical",  null, "critical");
test("All zero = stable",      classifyRisk({...base, depression:0,  anxiety:0,  stress:0})  === "stable",    null, "stable");

// ── CASE 8: Score accumulation (PHQ-9 normal scoring) ────────────────────────
console.log("\n═══ CASE 8: Score accumulation ═══");
const phq9Config = INSTRUMENT_CONFIGS.phq9;
let score = 0;
// 9 questions × value 3 = max 27
for (let i = 1; i <= 9; i++) {
  score = accumulateScore(score, 3, { depression: 1 }, phq9Config, i);
}
test("PHQ-9 max score = 27", score === 27, score, 27);

let score2 = 0;
for (let i = 1; i <= 9; i++) {
  score2 = accumulateScore(score2, 0, { depression: 1 }, phq9Config, i);
}
test("PHQ-9 min score = 0", score2 === 0, score2, 0);

// ── CASE 9: PSS-10 reverse scoring ───────────────────────────────────────────
console.log("\n═══ CASE 9: PSS-10 reverse scoring ═══");
const pss10Config = INSTRUMENT_CONFIGS.pss10;
// Q4 is reverse-scored: value=0 should contribute itemMax(4) × multiplier
const reverseScore = accumulateScore(0, 0, { stress: 1 }, pss10Config, 4);
test("PSS-10 Q4 reverse: value=0 → contribution=4", reverseScore === 4, reverseScore, 4);
const normalScore = accumulateScore(0, 3, { stress: 1 }, pss10Config, 1);
test("PSS-10 Q1 normal: value=3 → contribution=3", normalScore === 3, normalScore, 3);

// ── CASE 10: Crisis keyword detection ────────────────────────────────────────
console.log("\n═══ CASE 10: Crisis detection via score threshold ═══");
const crisisScores = { depression:15, anxiety:0, stress:0, sleep:0, burnout:0, loneliness:0, substance:0 };
test("PHQ-9=15 triggers critical", classifyRisk(crisisScores) === "critical", null, "critical");
const nearCrisis = { depression:14, anxiety:0, stress:0, sleep:0, burnout:0, loneliness:0, substance:0 };
test("PHQ-9=14 is attention not critical", classifyRisk(nearCrisis) === "attention", null, "attention");

// ── CASE 11: Triage signal capping at 3 ──────────────────────────────────────
console.log("\n═══ CASE 11: Triage signal capped at 3 ═══");
const overloadAnswers = [
  { mapsTo: { depression:3 } },
  { mapsTo: { depression:3 } },
  { mapsTo: { depression:3 } },
  { mapsTo: { depression:3 } },
  { mapsTo: { depression:3 } },
];
const overloadSig = computeTriageSignal(overloadAnswers);
test("Signal capped at 3 even with sum=15", overloadSig.depression === 3, overloadSig.depression, 3);

// ── CASE 12: Stress-only escalation → PSS-10 (not PHQ-9/GAD-7) ──────────────
console.log("\n═══ CASE 12: Stress-only escalation ═══");
const stressOnlyAnswers = [
  { mapsTo: { depression:0, burnout:0 } },
  { mapsTo: { sleep:0, depression:0, anxiety:0 } },
  { mapsTo: { stress:3, anxiety:1, burnout:1 } },
  { mapsTo: { loneliness:0, depression:0 } },
  { mapsTo: { anxiety:0, stress:2 } },
];
const stressOnlySig = computeTriageSignal(stressOnlyAnswers);
const stressOnlyQ = buildAssessmentQueue(stressOnlySig);
test("Stress-only queue includes pss10", stressOnlyQ.includes("pss10"), stressOnlyQ, "includes pss10");
test("Stress-only queue does NOT force phq9", !stressOnlyQ.includes("phq9") || stressOnlySig.depression >= 2, stressOnlyQ, "no forced phq9");

// ── FINAL SUMMARY ─────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(55));
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log("═".repeat(55));
if (failed > 0) {
  console.log("\n  ⚠️  Some tests failed — review above.");
  process.exit(1);
} else {
  console.log("\n  🎉 All ARIA engine tests passed!");
  process.exit(0);
}
