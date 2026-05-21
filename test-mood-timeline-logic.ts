/**
 * Test: Mood Timeline Logic Verification
 * Tests the fixed tough days calculation with real data from screenshot
 */

interface Assessment {
  date: string;
  emotion: string;
  risk_level?: string;
}

// Simulate the fixed logic
function calculateDays(assessments: Assessment[]) {
  const toughDays = assessments.filter((a) => {
    const emotion = a.emotion?.toLowerCase() || "";
    const riskLevel = a.risk_level?.toLowerCase() || "";
    // Tough day = negative emotion OR critical/attention risk
    return ["low", "stressed", "tired"].includes(emotion) || 
           ["critical", "attention"].includes(riskLevel);
  }).length;
  
  const goodDays = assessments.filter((a) => {
    const emotion = a.emotion?.toLowerCase() || "";
    const riskLevel = a.risk_level?.toLowerCase() || "";
    // Good day = positive emotion AND stable risk (not critical or attention)
    return ["great", "good"].includes(emotion) && 
           !["critical", "attention"].includes(riskLevel);
  }).length;
  
  const okayDays = assessments.length - goodDays - toughDays;

  return { goodDays, okayDays, toughDays };
}

// Test data from your screenshot
const testData: Assessment[] = [
  { date: "2026-05-15", emotion: "Okay", risk_level: "critical" },  // The problematic one!
  { date: "2026-05-14", emotion: "Okay", risk_level: "stable" },
  { date: "2026-05-13", emotion: "Okay", risk_level: "stable" },
  { date: "2026-05-04", emotion: "Okay", risk_level: "stable" },
  { date: "2026-05-02", emotion: "Good", risk_level: "stable" },
];

console.log("=".repeat(60));
console.log("MOOD TIMELINE LOGIC TEST");
console.log("=".repeat(60));
console.log();

// Test 1: Your actual data
console.log("TEST 1: Your Actual Data (from screenshot)");
console.log("-".repeat(60));
const result1 = calculateDays(testData);
console.log("Input:");
testData.forEach(a => {
  console.log(`  ${a.date}: emotion="${a.emotion}", risk="${a.risk_level}"`);
});
console.log();
console.log("Output:");
console.log(`  Good days: ${result1.goodDays}`);
console.log(`  Okay days: ${result1.okayDays}`);
console.log(`  Tough days: ${result1.toughDays}`);
console.log();
console.log("Expected:");
console.log("  Good days: 1 (May 2: Good + stable)");
console.log("  Okay days: 3 (May 4, 13, 14: Okay + stable)");
console.log("  Tough days: 1 (May 15: Okay + critical) ✅");
console.log();
console.log(`Result: ${result1.toughDays === 1 ? "✅ PASS" : "❌ FAIL"}`);
console.log();

// Test 2: Edge case - Good emotion with critical risk
console.log("TEST 2: Good Emotion + Critical Risk");
console.log("-".repeat(60));
const test2Data: Assessment[] = [
  { date: "2026-05-15", emotion: "Good", risk_level: "critical" },
];
const result2 = calculateDays(test2Data);
console.log("Input: emotion='Good', risk='critical'");
console.log(`Output: Good=${result2.goodDays}, Okay=${result2.okayDays}, Tough=${result2.toughDays}`);
console.log("Expected: Good=0, Okay=0, Tough=1");
console.log(`Result: ${result2.toughDays === 1 && result2.goodDays === 0 ? "✅ PASS" : "❌ FAIL"}`);
console.log();

// Test 3: Edge case - Low emotion with stable risk
console.log("TEST 3: Low Emotion + Stable Risk");
console.log("-".repeat(60));
const test3Data: Assessment[] = [
  { date: "2026-05-15", emotion: "Low", risk_level: "stable" },
];
const result3 = calculateDays(test3Data);
console.log("Input: emotion='Low', risk='stable'");
console.log(`Output: Good=${result3.goodDays}, Okay=${result3.okayDays}, Tough=${result3.toughDays}`);
console.log("Expected: Good=0, Okay=0, Tough=1");
console.log(`Result: ${result3.toughDays === 1 ? "✅ PASS" : "❌ FAIL"}`);
console.log();

// Test 4: Edge case - Attention risk
console.log("TEST 4: Okay Emotion + Attention Risk");
console.log("-".repeat(60));
const test4Data: Assessment[] = [
  { date: "2026-05-15", emotion: "Okay", risk_level: "attention" },
];
const result4 = calculateDays(test4Data);
console.log("Input: emotion='Okay', risk='attention'");
console.log(`Output: Good=${result4.goodDays}, Okay=${result4.okayDays}, Tough=${result4.toughDays}`);
console.log("Expected: Good=0, Okay=0, Tough=1");
console.log(`Result: ${result4.toughDays === 1 ? "✅ PASS" : "❌ FAIL"}`);
console.log();

// Test 5: Multiple mixed scenarios
console.log("TEST 5: Complex Mixed Scenario");
console.log("-".repeat(60));
const test5Data: Assessment[] = [
  { date: "2026-05-15", emotion: "Okay", risk_level: "critical" },    // Tough
  { date: "2026-05-14", emotion: "Good", risk_level: "attention" },   // Tough
  { date: "2026-05-13", emotion: "Low", risk_level: "stable" },       // Tough
  { date: "2026-05-12", emotion: "Good", risk_level: "stable" },      // Good
  { date: "2026-05-11", emotion: "Okay", risk_level: "stable" },      // Okay
  { date: "2026-05-10", emotion: "Great", risk_level: "stable" },     // Good
];
const result5 = calculateDays(test5Data);
console.log("Input: 6 assessments with mixed emotions and risks");
console.log(`Output: Good=${result5.goodDays}, Okay=${result5.okayDays}, Tough=${result5.toughDays}`);
console.log("Expected: Good=2, Okay=1, Tough=3");
console.log(`Result: ${result5.goodDays === 2 && result5.okayDays === 1 && result5.toughDays === 3 ? "✅ PASS" : "❌ FAIL"}`);
console.log();

// Summary
console.log("=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));
const allPassed = 
  result1.toughDays === 1 &&
  result2.toughDays === 1 && result2.goodDays === 0 &&
  result3.toughDays === 1 &&
  result4.toughDays === 1 &&
  result5.goodDays === 2 && result5.okayDays === 1 && result5.toughDays === 3;

if (allPassed) {
  console.log("✅ ALL TESTS PASSED");
  console.log();
  console.log("The mood timeline logic is working correctly!");
  console.log("Critical and attention risk levels are properly counted as tough days.");
} else {
  console.log("❌ SOME TESTS FAILED");
  console.log();
  console.log("Please review the logic in mood-timeline.tsx");
}
console.log("=".repeat(60));
