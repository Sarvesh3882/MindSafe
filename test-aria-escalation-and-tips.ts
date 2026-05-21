/**
 * ARIA Assessment - Comprehensive Test Suite
 * Tests escalation logic and wellness tips for all scenarios
 */

import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  classifyRisk,
  type TriageSignal,
  type AssessmentScore,
  type InstrumentKey,
} from "./src/lib/aria/engine";

import { buildWellnessSummary } from "./src/lib/aria/insights";

// ============================================================
// TEST SCENARIOS
// ============================================================

interface TestScenario {
  name: string;
  triageAnswers: Array<{ questionId: string; value: number; mapsTo: Record<string, number> }>;
  expectedSignal: Partial<TriageSignal>;
  expectedEscalate: boolean;
  expectedQueue: string[];
  finalScores: AssessmentScore;
  expectedRisk: "stable" | "attention" | "critical";
  expectedHeadlineContains: string;
  expectedTipKeywords: string[];
}

const TEST_SCENARIOS: TestScenario[] = [
  // ============================================================
  // SCENARIO 1: Stable User (Low Scores)
  // ============================================================
  {
    name: "Stable User - All Low Scores",
    triageAnswers: [
      { questionId: "t1", value: 0, mapsTo: { depression: 0.3, anxiety: 0.2, stress: 0.1 } },
      { questionId: "t2", value: 0, mapsTo: { anxiety: 0.4, stress: 0.2 } },
      { questionId: "t3", value: 1, mapsTo: { stress: 0.3, sleep: 0.2 } },
      { questionId: "t4", value: 0, mapsTo: { depression: 0.2, sleep: 0.3 } },
      { questionId: "t5", value: 0, mapsTo: { anxiety: 0.2, burnout: 0.1 } },
    ],
    expectedSignal: { depression: 0, anxiety: 0, stress: 0 },
    expectedEscalate: false,
    expectedQueue: ["phq9", "gad7"], // Baseline guarantee
    finalScores: {
      depression: 3,
      anxiety: 2,
      stress: 1,
      sleep: 0,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "stable",
    expectedHeadlineContains: "doing well",
    expectedTipKeywords: ["sleep", "exercise", "self-care", "breath"],
  },

  // ============================================================
  // SCENARIO 2: Moderate Anxiety
  // ============================================================
  {
    name: "Moderate Anxiety - Should Escalate",
    triageAnswers: [
      { questionId: "t1", value: 1, mapsTo: { depression: 0.3, anxiety: 0.2 } },
      { questionId: "t2", value: 2, mapsTo: { anxiety: 0.8, stress: 0.2 } },
      { questionId: "t3", value: 2, mapsTo: { anxiety: 0.7, stress: 0.3 } },
      { questionId: "t4", value: 1, mapsTo: { depression: 0.2, sleep: 0.3 } },
      { questionId: "t5", value: 2, mapsTo: { anxiety: 0.6, stress: 0.2 } },
    ],
    expectedSignal: { anxiety: 2, stress: 1 },
    expectedEscalate: true,
    expectedQueue: ["phq9", "gad7", "pss10"],
    finalScores: {
      depression: 5,
      anxiety: 12,
      stress: 8,
      sleep: 2,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "attention",
    expectedHeadlineContains: "anxious",
    expectedTipKeywords: ["breath", "grounding", "5-4-3-2-1", "calm"],
  },

  // ============================================================
  // SCENARIO 3: High Depression (Critical)
  // ============================================================
  {
    name: "High Depression - Critical Risk",
    triageAnswers: [
      { questionId: "t1", value: 3, mapsTo: { depression: 0.9, anxiety: 0.1 } },
      { questionId: "t2", value: 2, mapsTo: { depression: 0.7, stress: 0.2 } },
      { questionId: "t3", value: 3, mapsTo: { depression: 0.8, sleep: 0.2 } },
      { questionId: "t4", value: 2, mapsTo: { depression: 0.6, anxiety: 0.3 } },
      { questionId: "t5", value: 2, mapsTo: { depression: 0.5, stress: 0.3 } },
    ],
    expectedSignal: { depression: 3, anxiety: 0, stress: 1 },
    expectedEscalate: true,
    expectedQueue: ["phq9", "gad7", "pss10"],
    finalScores: {
      depression: 18,
      anxiety: 6,
      stress: 5,
      sleep: 3,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "critical",
    expectedHeadlineContains: "tough time",
    expectedTipKeywords: ["counsellor", "support", "alone", "professional"],
  },

  // ============================================================
  // SCENARIO 4: High Stress
  // ============================================================
  {
    name: "High Stress - Should Escalate",
    triageAnswers: [
      { questionId: "t1", value: 1, mapsTo: { depression: 0.2, stress: 0.5 } },
      { questionId: "t2", value: 2, mapsTo: { stress: 0.9, anxiety: 0.1 } },
      { questionId: "t3", value: 3, mapsTo: { stress: 0.8, burnout: 0.2 } },
      { questionId: "t4", value: 2, mapsTo: { stress: 0.7, sleep: 0.2 } },
      { questionId: "t5", value: 2, mapsTo: { stress: 0.6, anxiety: 0.3 } },
    ],
    expectedSignal: { stress: 3, anxiety: 0, depression: 0 },
    expectedEscalate: true,
    expectedQueue: ["pss10", "phq9", "gad7"],
    finalScores: {
      depression: 4,
      anxiety: 5,
      stress: 28,
      sleep: 4,
      burnout: 2,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "critical",
    expectedHeadlineContains: "pressure",
    expectedTipKeywords: ["stress", "break", "control", "overwhelm"],
  },

  // ============================================================
  // SCENARIO 5: Sleep Issues
  // ============================================================
  {
    name: "Sleep Issues - Should Escalate",
    triageAnswers: [
      { questionId: "t1", value: 1, mapsTo: { sleep: 0.6, stress: 0.2 } },
      { questionId: "t2", value: 2, mapsTo: { sleep: 0.8, anxiety: 0.1 } },
      { questionId: "t3", value: 2, mapsTo: { sleep: 0.7, depression: 0.2 } },
      { questionId: "t4", value: 1, mapsTo: { sleep: 0.5, stress: 0.3 } },
      { questionId: "t5", value: 1, mapsTo: { sleep: 0.4, anxiety: 0.2 } },
    ],
    expectedSignal: { sleep: 2, stress: 0, anxiety: 0 },
    expectedEscalate: true,
    expectedQueue: ["isi", "phq9", "gad7"],
    finalScores: {
      depression: 3,
      anxiety: 4,
      stress: 6,
      sleep: 16,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "attention",
    expectedHeadlineContains: "sleep",
    expectedTipKeywords: ["sleep", "rest", "night", "bed"],
  },

  // ============================================================
  // SCENARIO 6: Burnout
  // ============================================================
  {
    name: "Academic Burnout - Should Escalate",
    triageAnswers: [
      { questionId: "t1", value: 2, mapsTo: { burnout: 0.7, stress: 0.2 } },
      { questionId: "t2", value: 2, mapsTo: { burnout: 0.8, depression: 0.1 } },
      { questionId: "t3", value: 3, mapsTo: { burnout: 0.9, stress: 0.1 } },
      { questionId: "t4", value: 2, mapsTo: { burnout: 0.6, sleep: 0.2 } },
      { questionId: "t5", value: 1, mapsTo: { burnout: 0.5, anxiety: 0.2 } },
    ],
    expectedSignal: { burnout: 3, stress: 0, depression: 0 },
    expectedEscalate: true,
    expectedQueue: ["maslach", "phq9", "gad7"],
    finalScores: {
      depression: 5,
      anxiety: 4,
      stress: 8,
      sleep: 6,
      burnout: 45,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "attention",
    expectedHeadlineContains: "burnout",
    expectedTipKeywords: ["burnout", "rest", "recharge", "break"],
  },

  // ============================================================
  // SCENARIO 7: Multi-Domain (Anxiety + Stress)
  // ============================================================
  {
    name: "Multi-Domain - Anxiety + Stress",
    triageAnswers: [
      { questionId: "t1", value: 2, mapsTo: { anxiety: 0.6, stress: 0.3 } },
      { questionId: "t2", value: 2, mapsTo: { anxiety: 0.7, depression: 0.2 } },
      { questionId: "t3", value: 3, mapsTo: { stress: 0.8, anxiety: 0.2 } },
      { questionId: "t4", value: 2, mapsTo: { stress: 0.6, sleep: 0.2 } },
      { questionId: "t5", value: 2, mapsTo: { anxiety: 0.5, stress: 0.4 } },
    ],
    expectedSignal: { anxiety: 2, stress: 2, depression: 0 },
    expectedEscalate: true,
    expectedQueue: ["gad7", "pss10", "phq9"],
    finalScores: {
      depression: 6,
      anxiety: 14,
      stress: 20,
      sleep: 5,
      burnout: 3,
      loneliness: 0,
      substance: 0,
    },
    expectedRisk: "attention",
    expectedHeadlineContains: "anxious",
    expectedTipKeywords: ["breath", "grounding", "stress", "calm"],
  },
];

// ============================================================
// TEST RUNNER
// ============================================================

function runTests() {
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║  ARIA ASSESSMENT - COMPREHENSIVE TEST SUITE                   ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  let passedTests = 0;
  let failedTests = 0;
  const failures: string[] = [];

  TEST_SCENARIOS.forEach((scenario, index) => {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`TEST ${index + 1}: ${scenario.name}`);
    console.log("=".repeat(70));

    let scenarioPassed = true;

    // Test 1: Triage Signal
    console.log("\n📊 Testing Triage Signal...");
    const signal = computeTriageSignal(scenario.triageAnswers);
    console.log("   Computed Signal:", signal);
    console.log("   Expected Signal:", scenario.expectedSignal);

    Object.keys(scenario.expectedSignal).forEach((key) => {
      const domain = key as keyof TriageSignal;
      if (signal[domain] !== scenario.expectedSignal[domain]) {
        console.log(`   ❌ FAIL: ${domain} signal mismatch`);
        failures.push(`${scenario.name}: ${domain} signal mismatch`);
        scenarioPassed = false;
      }
    });

    // Test 2: Escalation Decision
    console.log("\n🚨 Testing Escalation Decision...");
    const escalate = shouldEscalate(signal);
    console.log(`   Should Escalate: ${escalate}`);
    console.log(`   Expected: ${scenario.expectedEscalate}`);

    if (escalate !== scenario.expectedEscalate) {
      console.log("   ❌ FAIL: Escalation decision mismatch");
      failures.push(`${scenario.name}: Escalation decision mismatch`);
      scenarioPassed = false;
    } else {
      console.log("   ✅ PASS: Escalation decision correct");
    }

    // Test 3: Assessment Queue
    console.log("\n📋 Testing Assessment Queue...");
    const queue = buildAssessmentQueue(signal);
    console.log("   Generated Queue:", queue);
    console.log("   Expected Queue:", scenario.expectedQueue);

    // Check if queue contains expected instruments (order may vary)
    const queueMatches = scenario.expectedQueue.every((inst) => queue.includes(inst as InstrumentKey));
    if (!queueMatches || queue.length !== scenario.expectedQueue.length) {
      console.log("   ❌ FAIL: Assessment queue mismatch");
      failures.push(`${scenario.name}: Assessment queue mismatch`);
      scenarioPassed = false;
    } else {
      console.log("   ✅ PASS: Assessment queue correct");
    }

    // Test 4: Risk Classification
    console.log("\n⚠️  Testing Risk Classification...");
    const risk = classifyRisk(scenario.finalScores);
    console.log(`   Classified Risk: ${risk}`);
    console.log(`   Expected Risk: ${scenario.expectedRisk}`);

    if (risk !== scenario.expectedRisk) {
      console.log("   ❌ FAIL: Risk classification mismatch");
      failures.push(`${scenario.name}: Risk classification mismatch`);
      scenarioPassed = false;
    } else {
      console.log("   ✅ PASS: Risk classification correct");
    }

    // Test 5: Wellness Tips
    console.log("\n💡 Testing Wellness Tips...");
    const summary = buildWellnessSummary(
      scenario.finalScores.depression >= 10 ? "depression" :
      scenario.finalScores.anxiety >= 10 ? "anxiety" :
      scenario.finalScores.stress >= 18 ? "stress" :
      scenario.finalScores.sleep >= 14 ? "sleep" :
      scenario.finalScores.burnout >= 40 ? "burnout" :
      "general",
      !escalate,
      scenario.finalScores
    );

    console.log("   Headline:", summary.headline);
    console.log("   Tips Count:", summary.tips.length);
    console.log("   Tips:");
    summary.tips.forEach((tip, i) => {
      console.log(`     ${i + 1}. ${tip.text.substring(0, 60)}...`);
    });

    // Check headline contains expected text
    const headlineMatch = summary.headline.toLowerCase().includes(
      scenario.expectedHeadlineContains.toLowerCase()
    );
    if (!headlineMatch) {
      console.log(`   ❌ FAIL: Headline doesn't contain "${scenario.expectedHeadlineContains}"`);
      failures.push(`${scenario.name}: Headline mismatch`);
      scenarioPassed = false;
    } else {
      console.log("   ✅ PASS: Headline contains expected text");
    }

    // Check tips contain expected keywords
    const allTipsText = summary.tips.map((t) => t.text.toLowerCase()).join(" ");
    const keywordMatches = scenario.expectedTipKeywords.filter((keyword) =>
      allTipsText.includes(keyword.toLowerCase())
    );

    console.log(`   Expected Keywords: ${scenario.expectedTipKeywords.join(", ")}`);
    console.log(`   Found Keywords: ${keywordMatches.join(", ")}`);

    if (keywordMatches.length === 0) {
      console.log("   ❌ FAIL: No expected keywords found in tips");
      failures.push(`${scenario.name}: Tips don't contain expected keywords`);
      scenarioPassed = false;
    } else {
      console.log(`   ✅ PASS: Found ${keywordMatches.length}/${scenario.expectedTipKeywords.length} expected keywords`);
    }

    // Test 6: Tips are different (not generic)
    const tipsAreDifferent = summary.tips.some((tip) =>
      tip.text.length > 50 && !tip.text.includes("You're doing well")
    );

    if (!tipsAreDifferent && scenario.expectedRisk !== "stable") {
      console.log("   ❌ FAIL: Tips appear too generic for non-stable user");
      failures.push(`${scenario.name}: Tips too generic`);
      scenarioPassed = false;
    } else {
      console.log("   ✅ PASS: Tips are appropriately specific");
    }

    // Scenario Result
    if (scenarioPassed) {
      console.log(`\n✅ SCENARIO PASSED: ${scenario.name}`);
      passedTests++;
    } else {
      console.log(`\n❌ SCENARIO FAILED: ${scenario.name}`);
      failedTests++;
    }
  });

  // ============================================================
  // FINAL RESULTS
  // ============================================================

  console.log("\n\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║  TEST RESULTS                                                  ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  console.log(`Total Tests: ${TEST_SCENARIOS.length}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / TEST_SCENARIOS.length) * 100).toFixed(1)}%\n`);

  if (failures.length > 0) {
    console.log("Failed Tests:");
    failures.forEach((failure, i) => {
      console.log(`  ${i + 1}. ${failure}`);
    });
  }

  if (failedTests === 0) {
    console.log("🎉 ALL TESTS PASSED! ARIA assessment system is working correctly.\n");
  } else {
    console.log("⚠️  Some tests failed. Review the output above for details.\n");
  }

  return failedTests === 0;
}

// Run tests
runTests();
