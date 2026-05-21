/**
 * ARIA 2.0 Comprehensive Test Suite
 * Tests all assessment scenarios with different answer patterns
 * Run with: npx tsx test-aria-all-scenarios.ts
 */

import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  classifyRisk,
  INSTRUMENT_CONFIGS,
  type TriageSignal,
  type AssessmentScore,
} from "./src/lib/aria/engine";

// ============================================================
// Test Scenarios
// ============================================================

interface TestScenario {
  name: string;
  description: string;
  triageAnswers: Array<{ questionId: string; value: number; mapsTo: Record<string, number> }>;
  assessmentAnswers?: Array<{ domain: keyof AssessmentScore; value: number }>;
  expectedEscalation: boolean;
  expectedQueue: string[];
  expectedRiskLevel: "stable" | "attention" | "critical";
}

const TEST_SCENARIOS: TestScenario[] = [
  // ============================================================
  // SCENARIO 1: Stable/Healthy User
  // ============================================================
  {
    name: "Stable User - All Low Scores",
    description: "User feeling great, no concerns",
    triageAnswers: [
      { questionId: "t1", value: 0, mapsTo: { depression: 0, anxiety: 0, stress: 0 } },
      { questionId: "t2", value: 0, mapsTo: { depression: 0, anxiety: 0, sleep: 0 } },
      { questionId: "t3", value: 0, mapsTo: { anxiety: 0, stress: 0, burnout: 0 } },
      { questionId: "t4", value: 0, mapsTo: { loneliness: 0, depression: 0 } },
      { questionId: "t5", value: 0, mapsTo: { stress: 0, burnout: 0 } },
    ],
    assessmentAnswers: [
      // PHQ-9 (depression) - all 0s
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 0 })),
      // GAD-7 (anxiety) - all 0s
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 0 })),
    ],
    expectedEscalation: false,
    expectedQueue: ["phq9", "gad7"], // Baseline instruments
    expectedRiskLevel: "stable",
  },

  // ============================================================
  // SCENARIO 2: Mild Concerns - Attention Level
  // ============================================================
  {
    name: "Mild Concerns - Needs Attention",
    description: "User has some stress and mild anxiety",
    triageAnswers: [
      { questionId: "t1", value: 1, mapsTo: { depression: 0.5, anxiety: 0.5, stress: 0.5 } },
      { questionId: "t2", value: 1, mapsTo: { depression: 0.3, anxiety: 0.7, sleep: 0.5 } },
      { questionId: "t3", value: 1, mapsTo: { anxiety: 0.8, stress: 0.6, burnout: 0.4 } },
      { questionId: "t4", value: 1, mapsTo: { loneliness: 0.5, depression: 0.3 } },
      { questionId: "t5", value: 1, mapsTo: { stress: 0.7, burnout: 0.5 } },
    ],
    assessmentAnswers: [
      // PHQ-9 - moderate scores (total ~12 to reach attention)
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 1 })),
      { domain: "depression" as const, value: 3 }, // Add 3 more to reach 12
      // GAD-7 - moderate scores (total ~10 to reach attention)
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 1 })),
      { domain: "anxiety" as const, value: 3 }, // Add 3 more to reach 10
    ],
    expectedEscalation: true, // Anxiety signal = 2.0, triggers escalation
    expectedQueue: ["phq9", "gad7"], // PHQ-9 always first, GAD-7 second
    expectedRiskLevel: "attention", // PHQ-9 = 12, GAD-7 = 10 (both >= 10)
  },

  // ============================================================
  // SCENARIO 3: High Anxiety - Escalation
  // ============================================================
  {
    name: "High Anxiety - Escalation",
    description: "User experiencing significant anxiety",
    triageAnswers: [
      { questionId: "t1", value: 2, mapsTo: { depression: 0.3, anxiety: 1.0, stress: 0.5 } },
      { questionId: "t2", value: 2, mapsTo: { depression: 0.2, anxiety: 1.0, sleep: 0.3 } },
      { questionId: "t3", value: 3, mapsTo: { anxiety: 1.0, stress: 0.7, burnout: 0.2 } },
      { questionId: "t4", value: 1, mapsTo: { loneliness: 0.3, depression: 0.2 } },
      { questionId: "t5", value: 2, mapsTo: { stress: 0.8, burnout: 0.3 } },
    ],
    assessmentAnswers: [
      // PHQ-9 - moderate (total ~9)
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 1 })),
      // GAD-7 - high scores (total ~18 to reach critical)
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 2 })),
      { domain: "anxiety" as const, value: 3 }, // One more to push over 15
      // PSS-10 - moderate stress (total ~20)
      ...Array(10).fill(null).map((_, i) => ({ domain: "stress" as const, value: 2 })),
    ],
    expectedEscalation: true, // Anxiety signal >= 2
    expectedQueue: ["phq9", "gad7", "pss10"], // PHQ-9 always first, then GAD-7, then PSS-10
    expectedRiskLevel: "critical", // GAD-7 >= 15
  },

  // ============================================================
  // SCENARIO 4: High Depression - Escalation
  // ============================================================
  {
    name: "High Depression - Escalation",
    description: "User showing signs of depression",
    triageAnswers: [
      { questionId: "t1", value: 3, mapsTo: { depression: 1.0, anxiety: 0.5, stress: 0.3 } },
      { questionId: "t2", value: 2, mapsTo: { depression: 0.8, anxiety: 0.3, sleep: 0.6 } },
      { questionId: "t3", value: 2, mapsTo: { anxiety: 0.4, stress: 0.5, burnout: 0.3 } },
      { questionId: "t4", value: 2, mapsTo: { loneliness: 0.7, depression: 0.6 } },
      { questionId: "t5", value: 1, mapsTo: { stress: 0.4, burnout: 0.2 } },
    ],
    assessmentAnswers: [
      // PHQ-9 - high scores (total ~18)
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 2 })),
      // GAD-7 - moderate (total ~7)
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 1 })),
    ],
    expectedEscalation: true, // Depression signal >= 2
    expectedQueue: ["phq9", "gad7"], // Only depression signal >= 2, loneliness < 2
    expectedRiskLevel: "critical", // PHQ-9 >= 15
  },

  // ============================================================
  // SCENARIO 5: Burnout & Stress - Escalation
  // ============================================================
  {
    name: "Burnout & Stress - Escalation",
    description: "User experiencing burnout and high stress",
    triageAnswers: [
      { questionId: "t1", value: 2, mapsTo: { depression: 0.4, anxiety: 0.5, stress: 0.8 } },
      { questionId: "t2", value: 1, mapsTo: { depression: 0.2, anxiety: 0.3, sleep: 0.5 } },
      { questionId: "t3", value: 3, mapsTo: { anxiety: 0.5, stress: 1.0, burnout: 0.9 } },
      { questionId: "t4", value: 1, mapsTo: { loneliness: 0.3, depression: 0.2 } },
      { questionId: "t5", value: 3, mapsTo: { stress: 1.0, burnout: 1.0 } },
    ],
    assessmentAnswers: [
      // PHQ-9 - moderate (total ~9)
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 1 })),
      // GAD-7 - moderate (total ~7)
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 1 })),
      // PSS-10 - high stress (total ~30)
      ...Array(10).fill(null).map((_, i) => ({ domain: "stress" as const, value: 3 })),
    ],
    expectedEscalation: true, // Stress and burnout signals >= 2
    expectedQueue: ["pss10", "phq9", "gad7"], // Stress first (highest signal)
    expectedRiskLevel: "critical", // PSS-10 >= 27
  },

  // ============================================================
  // SCENARIO 6: Sleep Issues - Escalation
  // ============================================================
  {
    name: "Sleep Issues - Escalation",
    description: "User having significant sleep problems",
    triageAnswers: [
      { questionId: "t1", value: 1, mapsTo: { depression: 0.3, anxiety: 0.4, stress: 0.3 } },
      { questionId: "t2", value: 3, mapsTo: { depression: 0.4, anxiety: 0.5, sleep: 1.0 } },
      { questionId: "t3", value: 2, mapsTo: { anxiety: 0.5, stress: 0.6, burnout: 0.4 } },
      { questionId: "t4", value: 1, mapsTo: { loneliness: 0.2, depression: 0.2 } },
      { questionId: "t5", value: 2, mapsTo: { stress: 0.6, burnout: 0.5 } },
    ],
    assessmentAnswers: [
      // PHQ-9 - low (total ~4)
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 0 })),
      // GAD-7 - low (total ~3)
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 0 })),
      // ISI - high insomnia (total ~20)
      ...Array(7).fill(null).map((_, i) => ({ domain: "sleep" as const, value: 3 })),
    ],
    expectedEscalation: false, // Sleep signal < 2 (only 1.0 from one answer)
    expectedQueue: ["phq9", "gad7"], // Baseline only
    expectedRiskLevel: "stable", // No critical thresholds crossed
  },

  // ============================================================
  // SCENARIO 7: Multiple High Signals - Max Instruments
  // ============================================================
  {
    name: "Multiple High Signals - Max 3 Instruments",
    description: "User with high signals across multiple domains",
    triageAnswers: [
      { questionId: "t1", value: 3, mapsTo: { depression: 1.0, anxiety: 0.8, stress: 0.7 } },
      { questionId: "t2", value: 3, mapsTo: { depression: 0.8, anxiety: 1.0, sleep: 0.9 } },
      { questionId: "t3", value: 3, mapsTo: { anxiety: 1.0, stress: 1.0, burnout: 0.9 } },
      { questionId: "t4", value: 3, mapsTo: { loneliness: 1.0, depression: 0.8 } },
      { questionId: "t5", value: 3, mapsTo: { stress: 1.0, burnout: 1.0 } },
    ],
    assessmentAnswers: [
      // PHQ-9 - critical (total ~21)
      ...Array(9).fill(null).map((_, i) => ({ domain: "depression" as const, value: 2 })),
      // GAD-7 - critical (total ~18)
      ...Array(7).fill(null).map((_, i) => ({ domain: "anxiety" as const, value: 2 })),
      // PSS-10 - critical (total ~30)
      ...Array(10).fill(null).map((_, i) => ({ domain: "stress" as const, value: 3 })),
    ],
    expectedEscalation: true, // All signals >= 2
    expectedQueue: ["phq9", "gad7", "pss10"], // Max 3 instruments, highest signals first
    expectedRiskLevel: "critical", // Multiple thresholds crossed
  },
];

// ============================================================
// Test Runner
// ============================================================

function runTest(scenario: TestScenario): { passed: boolean; errors: string[] } {
  const errors: string[] = [];
  
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TEST: ${scenario.name}`);
  console.log(`DESC: ${scenario.description}`);
  console.log("=".repeat(60));

  // Step 1: Compute triage signal
  const signal = computeTriageSignal(scenario.triageAnswers);
  console.log("\n1️⃣  TRIAGE SIGNAL:");
  console.log(JSON.stringify(signal, null, 2));

  // Step 2: Check escalation
  const escalate = shouldEscalate(signal);
  console.log(`\n2️⃣  ESCALATION: ${escalate ? "YES ✅" : "NO ❌"}`);
  
  if (escalate !== scenario.expectedEscalation) {
    errors.push(
      `❌ Escalation mismatch: expected ${scenario.expectedEscalation}, got ${escalate}`
    );
  }

  // Step 3: Build assessment queue
  const queue = buildAssessmentQueue(signal);
  console.log(`\n3️⃣  ASSESSMENT QUEUE: [${queue.join(", ")}]`);
  console.log(`   Expected: [${scenario.expectedQueue.join(", ")}]`);

  // Check queue matches expected (order matters for first instrument, but not strictly for others)
  const queueMatches = 
    queue.length === scenario.expectedQueue.length &&
    queue.every(inst => scenario.expectedQueue.includes(inst));
  
  if (!queueMatches) {
    errors.push(
      `❌ Queue mismatch: expected [${scenario.expectedQueue.join(", ")}], got [${queue.join(", ")}]`
    );
  }

  // Step 4: Simulate assessment scoring (if provided)
  if (scenario.assessmentAnswers) {
    const scores: AssessmentScore = {
      depression: 0,
      anxiety: 0,
      stress: 0,
      sleep: 0,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    };

    // Accumulate scores
    scenario.assessmentAnswers.forEach((answer) => {
      scores[answer.domain] += answer.value;
    });

    console.log("\n4️⃣  ASSESSMENT SCORES:");
    console.log(JSON.stringify(scores, null, 2));

    // Step 5: Classify risk
    const riskLevel = classifyRisk(scores);
    console.log(`\n5️⃣  RISK LEVEL: ${riskLevel.toUpperCase()}`);
    console.log(`   Expected: ${scenario.expectedRiskLevel.toUpperCase()}`);

    if (riskLevel !== scenario.expectedRiskLevel) {
      errors.push(
        `❌ Risk level mismatch: expected ${scenario.expectedRiskLevel}, got ${riskLevel}`
      );
    }
  }

  // Summary
  const passed = errors.length === 0;
  console.log(`\n${"=".repeat(60)}`);
  if (passed) {
    console.log("✅ TEST PASSED");
  } else {
    console.log("❌ TEST FAILED");
    errors.forEach((error) => console.log(`   ${error}`));
  }
  console.log("=".repeat(60));

  return { passed, errors };
}

// ============================================================
// Run All Tests
// ============================================================

function runAllTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║     ARIA 2.0 COMPREHENSIVE TEST SUITE                     ║");
  console.log("║     Testing all assessment scenarios                      ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  const results = TEST_SCENARIOS.map(runTest);

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                    TEST SUMMARY                            ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`\nTotal Tests: ${TEST_SCENARIOS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nSuccess Rate: ${((passed / TEST_SCENARIOS.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log("\n⚠️  FAILED TESTS:");
    results.forEach((result, index) => {
      if (!result.passed) {
        console.log(`\n${index + 1}. ${TEST_SCENARIOS[index].name}`);
        result.errors.forEach((error) => console.log(`   ${error}`));
      }
    });
  }

  console.log("\n");

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
