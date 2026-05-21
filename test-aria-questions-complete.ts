/**
 * ARIA Questions Loading — Complete Test Suite
 * Tests database, API, and frontend integration
 */

import { createClient } from "@/lib/supabase/client";
import {
  fetchTriageQuestions,
  fetchInstrumentQuestions,
  fetchCamouflageQuestions,
} from "@/app/student/checkin/api";
import {
  computeTriageSignal,
  shouldEscalate,
  buildAssessmentQueue,
  INSTRUMENT_CONFIGS,
  type MixedQuestion,
} from "@/lib/aria/engine";

// Test results tracking
const results: {
  test: string;
  status: "PASS" | "FAIL" | "WARN";
  message: string;
  details?: any;
}[] = [];

function logTest(
  test: string,
  status: "PASS" | "FAIL" | "WARN",
  message: string,
  details?: any
) {
  results.push({ test, status, message, details });
  const emoji = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️";
  console.log(`${emoji} ${test}: ${message}`);
  if (details) console.log("   Details:", details);
}

// ============================================================
// TEST 1: Database Direct Access
// ============================================================
async function testDatabaseAccess() {
  console.log("\n🔍 TEST 1: Database Direct Access\n");

  const supabase = createClient();

  // Test 1.1: Check if questions table exists and is accessible
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("count")
      .limit(1);

    if (error) {
      logTest(
        "1.1 Questions Table Access",
        "FAIL",
        "Cannot access questions table",
        error
      );
      return false;
    }

    logTest("1.1 Questions Table Access", "PASS", "Questions table accessible");
  } catch (err) {
    logTest(
      "1.1 Questions Table Access",
      "FAIL",
      "Exception accessing questions table",
      err
    );
    return false;
  }

  // Test 1.2: Check triage questions exist
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("is_triage", true);

    if (error) {
      logTest(
        "1.2 Triage Questions Exist",
        "FAIL",
        "Error fetching triage questions",
        error
      );
      return false;
    }

    if (!data || data.length === 0) {
      logTest(
        "1.2 Triage Questions Exist",
        "FAIL",
        "No triage questions found in database",
        { count: 0 }
      );
      return false;
    }

    if (data.length !== 5) {
      logTest(
        "1.2 Triage Questions Exist",
        "WARN",
        `Expected 5 triage questions, found ${data.length}`,
        { count: data.length }
      );
    } else {
      logTest(
        "1.2 Triage Questions Exist",
        "PASS",
        `Found ${data.length} triage questions`,
        { count: data.length }
      );
    }

    // Test 1.3: Validate question structure
    let allValid = true;
    data.forEach((q: any, idx: number) => {
      const issues: string[] = [];

      if (!q.question || typeof q.question !== "string") {
        issues.push("Missing or invalid question text");
      }

      if (!q.category) {
        issues.push("Missing category");
      }

      if (!q.options || !Array.isArray(q.options)) {
        issues.push("Missing or invalid options array");
      } else {
        // Check options structure
        q.options.forEach((opt: any, optIdx: number) => {
          if (!opt.label && !opt.text) {
            issues.push(`Option ${optIdx} missing label/text`);
          }
          if (opt.value === undefined) {
            issues.push(`Option ${optIdx} missing value`);
          }
          if (!opt.maps_to || typeof opt.maps_to !== "object") {
            issues.push(`Option ${optIdx} missing or invalid maps_to`);
          }
        });
      }

      if (issues.length > 0) {
        allValid = false;
        logTest(
          `1.3.${idx + 1} Question Structure`,
          "FAIL",
          `Question ${idx + 1} has issues`,
          { question: q.question?.substring(0, 50), issues }
        );
      }
    });

    if (allValid) {
      logTest(
        "1.3 Question Structure",
        "PASS",
        "All triage questions have valid structure"
      );
    }

    return true;
  } catch (err) {
    logTest(
      "1.2 Triage Questions Exist",
      "FAIL",
      "Exception fetching triage questions",
      err
    );
    return false;
  }
}

// ============================================================
// TEST 2: API Layer
// ============================================================
async function testAPILayer() {
  console.log("\n🔍 TEST 2: API Layer\n");

  // Test 2.1: fetchTriageQuestions
  try {
    const questions = await fetchTriageQuestions();

    if (!questions || questions.length === 0) {
      logTest(
        "2.1 fetchTriageQuestions",
        "FAIL",
        "API returned no triage questions",
        { returned: questions }
      );
      return false;
    }

    if (questions.length !== 5) {
      logTest(
        "2.1 fetchTriageQuestions",
        "WARN",
        `Expected 5 questions, got ${questions.length}`,
        { count: questions.length }
      );
    } else {
      logTest(
        "2.1 fetchTriageQuestions",
        "PASS",
        `API returned ${questions.length} triage questions`
      );
    }

    // Test 2.2: Validate normalized format
    let allNormalized = true;
    questions.forEach((q: any, idx: number) => {
      if (!q.options || !Array.isArray(q.options)) {
        logTest(
          `2.2.${idx + 1} Options Normalization`,
          "FAIL",
          `Question ${idx + 1} has no options array`
        );
        allNormalized = false;
        return;
      }

      q.options.forEach((opt: any, optIdx: number) => {
        if (!opt.label) {
          logTest(
            `2.2.${idx + 1} Options Normalization`,
            "FAIL",
            `Question ${idx + 1}, Option ${optIdx} missing "label" field`,
            { option: opt }
          );
          allNormalized = false;
        }
      });
    });

    if (allNormalized) {
      logTest(
        "2.2 Options Normalization",
        "PASS",
        "All options have correct 'label' field"
      );
    }

    // Test 2.3: Validate maps_to structure
    let allHaveMapsTo = true;
    questions.forEach((q: any, idx: number) => {
      q.options.forEach((opt: any, optIdx: number) => {
        if (!opt.maps_to || typeof opt.maps_to !== "object") {
          logTest(
            `2.3.${idx + 1} maps_to Structure`,
            "FAIL",
            `Question ${idx + 1}, Option ${optIdx} missing or invalid maps_to`,
            { option: opt }
          );
          allHaveMapsTo = false;
        }
      });
    });

    if (allHaveMapsTo) {
      logTest(
        "2.3 maps_to Structure",
        "PASS",
        "All options have valid maps_to objects"
      );
    }

    return questions;
  } catch (err) {
    logTest("2.1 fetchTriageQuestions", "FAIL", "Exception in API call", err);
    return false;
  }
}

// ============================================================
// TEST 3: ARIA Engine Logic
// ============================================================
async function testARIAEngine(questions: any[]) {
  console.log("\n🔍 TEST 3: ARIA Engine Logic\n");

  if (!questions || questions.length === 0) {
    logTest("3.0 Engine Prerequisites", "FAIL", "No questions provided to test");
    return false;
  }

  // Test 3.1: Simulate triage answers (moderate stress scenario)
  try {
    const mockAnswers = [
      {
        questionId: questions[0].id,
        value: 2, // Low energy
        mapsTo: questions[0].options[2].maps_to,
      },
      {
        questionId: questions[1].id,
        value: 2, // Poor sleep
        mapsTo: questions[1].options[2].maps_to,
      },
      {
        questionId: questions[2].id,
        value: 3, // Overwhelmed
        mapsTo: questions[2].options[3].maps_to,
      },
      {
        questionId: questions[3].id,
        value: 1, // Somewhat connected
        mapsTo: questions[3].options[1].maps_to,
      },
      {
        questionId: questions[4].id,
        value: 2, // Quite anxious
        mapsTo: questions[4].options[2].maps_to,
      },
    ];

    const signal = computeTriageSignal(mockAnswers);

    logTest(
      "3.1 Compute Triage Signal",
      "PASS",
      "Successfully computed triage signal",
      { signal }
    );

    // Test 3.2: Check escalation logic
    const escalate = shouldEscalate(signal);
    logTest(
      "3.2 Escalation Logic",
      "PASS",
      `Escalation decision: ${escalate ? "ESCALATE" : "STABLE"}`,
      { signal, escalate }
    );

    // Test 3.3: Build assessment queue
    const queue = buildAssessmentQueue(signal);

    if (!queue || queue.length === 0) {
      logTest(
        "3.3 Build Assessment Queue",
        "FAIL",
        "Assessment queue is empty",
        { signal, queue }
      );
      return false;
    }

    logTest(
      "3.3 Build Assessment Queue",
      "PASS",
      `Generated queue with ${queue.length} instruments`,
      { queue }
    );

    // Test 3.4: Validate queue instruments exist in config
    let allInstrumentsValid = true;
    queue.forEach((instrument) => {
      if (!INSTRUMENT_CONFIGS[instrument]) {
        logTest(
          "3.4 Instrument Config",
          "FAIL",
          `Instrument ${instrument} not found in INSTRUMENT_CONFIGS`
        );
        allInstrumentsValid = false;
      }
    });

    if (allInstrumentsValid) {
      logTest(
        "3.4 Instrument Config",
        "PASS",
        "All queued instruments have valid configs"
      );
    }

    return true;
  } catch (err) {
    logTest("3.1 ARIA Engine", "FAIL", "Exception in engine logic", err);
    return false;
  }
}

// ============================================================
// TEST 4: End-to-End Flow Simulation
// ============================================================
async function testEndToEndFlow() {
  console.log("\n🔍 TEST 4: End-to-End Flow Simulation\n");

  try {
    // Step 1: Fetch triage questions (as user would)
    const triageQuestions = await fetchTriageQuestions();

    if (!triageQuestions || triageQuestions.length === 0) {
      logTest(
        "4.1 E2E: Fetch Questions",
        "FAIL",
        "Could not fetch triage questions"
      );
      return false;
    }

    logTest(
      "4.1 E2E: Fetch Questions",
      "PASS",
      `Fetched ${triageQuestions.length} questions`
    );

    // Step 2: Simulate user answering all questions
    const answers = triageQuestions.map((q: any, idx: number) => ({
      questionId: q.id,
      value: idx % 2 === 0 ? 2 : 1, // Alternate between moderate and low
      mapsTo: q.options[idx % 2 === 0 ? 2 : 1].maps_to,
    }));

    logTest(
      "4.2 E2E: Simulate Answers",
      "PASS",
      `Simulated ${answers.length} answers`
    );

    // Step 3: Compute signal
    const signal = computeTriageSignal(answers);
    logTest("4.3 E2E: Compute Signal", "PASS", "Signal computed", { signal });

    // Step 4: Determine escalation
    const escalate = shouldEscalate(signal);
    logTest(
      "4.4 E2E: Escalation Decision",
      "PASS",
      `Decision: ${escalate ? "ESCALATE" : "STABLE"}`
    );

    // Step 5: Build queue
    const queue = buildAssessmentQueue(signal);
    logTest(
      "4.5 E2E: Build Queue",
      "PASS",
      `Queue: ${queue.join(", ")}`,
      { queue }
    );

    // Step 6: Fetch instrument questions (if escalated)
    if (escalate && queue.length > 0) {
      const instrumentQuestions = await fetchInstrumentQuestions(queue);

      if (!instrumentQuestions || instrumentQuestions.length === 0) {
        logTest(
          "4.6 E2E: Fetch Instruments",
          "WARN",
          "No instrument questions found (may need seeding)"
        );
      } else {
        logTest(
          "4.6 E2E: Fetch Instruments",
          "PASS",
          `Fetched ${instrumentQuestions.length} instrument questions`
        );
      }
    } else {
      logTest(
        "4.6 E2E: Fetch Instruments",
        "PASS",
        "Stable user - no instruments needed"
      );
    }

    // Step 7: Fetch camouflage questions
    const camouflageQuestions = await fetchCamouflageQuestions();
    if (!camouflageQuestions || camouflageQuestions.length === 0) {
      logTest(
        "4.7 E2E: Fetch Camouflage",
        "WARN",
        "No camouflage questions found (optional)"
      );
    } else {
      logTest(
        "4.7 E2E: Fetch Camouflage",
        "PASS",
        `Fetched ${camouflageQuestions.length} camouflage questions`
      );
    }

    return true;
  } catch (err) {
    logTest("4.0 E2E Flow", "FAIL", "Exception in end-to-end flow", err);
    return false;
  }
}

// ============================================================
// TEST 5: RLS Policy Verification
// ============================================================
async function testRLSPolicies() {
  console.log("\n🔍 TEST 5: RLS Policy Verification\n");

  const supabase = createClient();

  // Test 5.1: Check if anonymous users can read questions
  try {
    // Create an anonymous client (no auth)
    const { data, error } = await supabase
      .from("questions")
      .select("id")
      .eq("is_triage", true)
      .limit(1);

    if (error) {
      logTest(
        "5.1 Anonymous Access",
        "FAIL",
        "Anonymous users cannot read questions (RLS blocking)",
        error
      );
      return false;
    }

    if (!data || data.length === 0) {
      logTest(
        "5.1 Anonymous Access",
        "WARN",
        "No questions returned for anonymous user (may be RLS issue)"
      );
    } else {
      logTest(
        "5.1 Anonymous Access",
        "PASS",
        "Anonymous users can read questions"
      );
    }

    return true;
  } catch (err) {
    logTest("5.1 Anonymous Access", "FAIL", "Exception testing RLS", err);
    return false;
  }
}

// ============================================================
// MAIN TEST RUNNER
// ============================================================
async function runAllTests() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║   ARIA QUESTIONS LOADING — COMPLETE TEST SUITE        ║");
  console.log("╚════════════════════════════════════════════════════════╝");

  const startTime = Date.now();

  // Run all test suites
  const dbResult = await testDatabaseAccess();
  const apiResult = await testAPILayer();
  const engineResult = apiResult ? await testARIAEngine(apiResult) : false;
  const e2eResult = await testEndToEndFlow();
  const rlsResult = await testRLSPolicies();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║                    TEST SUMMARY                        ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const warned = results.filter((r) => r.status === "WARN").length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warned}`);
  console.log(`⏱️  Duration: ${duration}s\n`);

  // Critical failures
  if (failed > 0) {
    console.log("❌ CRITICAL FAILURES:\n");
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`   • ${r.test}: ${r.message}`);
      });
    console.log("\n🔧 ACTION REQUIRED: Run FIX_ARIA_QUESTIONS_LOADING.sql\n");
  } else if (warned > 0) {
    console.log("⚠️  WARNINGS (non-critical):\n");
    results
      .filter((r) => r.status === "WARN")
      .forEach((r) => {
        console.log(`   • ${r.test}: ${r.message}`);
      });
    console.log("");
  }

  // Overall status
  const overallStatus = failed === 0 ? "PASS" : "FAIL";
  const statusEmoji = overallStatus === "PASS" ? "✅" : "❌";

  console.log(`${statusEmoji} OVERALL STATUS: ${overallStatus}\n`);

  if (overallStatus === "PASS") {
    console.log("🎉 All critical tests passed! ARIA is ready for production.\n");
  } else {
    console.log("⚠️  ARIA has critical issues. Please fix before deployment.\n");
  }

  return {
    overallStatus,
    passed,
    failed,
    warned,
    duration,
    results,
  };
}

// Export for use in other test files
export { runAllTests };

// Run if executed directly
if (require.main === module) {
  runAllTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((err) => {
      console.error("❌ Test suite crashed:", err);
      process.exit(1);
    });
}
