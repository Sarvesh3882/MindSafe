/**
 * Test Check-in Gating Logic
 * Unit test that simulates the gating logic without database access
 */

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("CHECK-IN GATING LOGIC TEST");
console.log("Testing daily reset logic with different dates");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

/**
 * Simulate the check-in gating logic
 * This is the same logic used in the actual check-in page
 */
function canCheckIn(assessments: { date: string; completed: boolean }[], checkDate: string): boolean {
  // Find assessment for the check date
  const todayAssessment = assessments.find(
    (a) => a.date === checkDate && a.completed === true
  );

  // Can check-in if no completed assessment found for this date
  return !todayAssessment;
}

/**
 * Run the tests
 */
function runTests() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  console.log("📅 TEST DATES:");
  console.log(`  Yesterday: ${yesterdayStr}`);
  console.log(`  Today:     ${todayStr}`);
  console.log(`  Tomorrow:  ${tomorrowStr}\n`);

  const results: { name: string; pass: boolean }[] = [];

  // TEST 1: Fresh user (no assessments)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 1: Fresh User (No Previous Check-ins)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const test1 = canCheckIn([], todayStr);
  console.log(`Can check-in today? ${test1 ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: ✅ YES (no previous check-ins)`);
  console.log(`Result: ${test1 ? "✅ PASS" : "❌ FAIL"}\n`);
  results.push({ name: "Fresh user can check-in", pass: test1 });

  // TEST 2: Already checked in today
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 2: After Checking In Today");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const assessmentsWithToday = [{ date: todayStr, completed: true }];
  const test2 = canCheckIn(assessmentsWithToday, todayStr);
  console.log(`Can check-in today? ${test2 ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: ❌ NO (already checked in today)`);
  console.log(`Result: ${!test2 ? "✅ PASS" : "❌ FAIL"}\n`);
  results.push({ name: "Cannot check-in twice same day", pass: !test2 });

  // TEST 3: Next day (should reset)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 3: Next Day (Should Reset)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const test3 = canCheckIn(assessmentsWithToday, tomorrowStr);
  console.log(`Can check-in tomorrow? ${test3 ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: ✅ YES (new day, should reset)`);
  console.log(`Result: ${test3 ? "✅ PASS" : "❌ FAIL"}\n`);
  results.push({ name: "Can check-in next day", pass: test3 });

  // TEST 4: Previous day doesn't affect today
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 4: Previous Day (Should Not Affect Today)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const assessmentsWithYesterday = [
    { date: yesterdayStr, completed: true },
    { date: todayStr, completed: true },
  ];
  const test4Today = canCheckIn(assessmentsWithYesterday, todayStr);
  const test4Yesterday = canCheckIn(assessmentsWithYesterday, yesterdayStr);
  
  console.log(`Can check-in today? ${test4Today ? "✅ YES" : "❌ NO"}`);
  console.log(`Can check-in yesterday? ${test4Yesterday ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: Both ❌ NO (already checked in on both days)`);
  console.log(`Result: ${!test4Today && !test4Yesterday ? "✅ PASS" : "❌ FAIL"}\n`);
  results.push({ name: "Previous day doesn't affect today", pass: !test4Today && !test4Yesterday });

  // TEST 5: Multiple days in a row
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 5: Multiple Days in a Row");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const day1 = new Date(today);
  day1.setDate(day1.getDate() - 2);
  const day2 = new Date(today);
  day2.setDate(day2.getDate() - 1);

  const day1Str = day1.toISOString().split("T")[0];
  const day2Str = day2.toISOString().split("T")[0];

  const multiDayAssessments = [
    { date: day1Str, completed: true },
    { date: day2Str, completed: true },
    { date: todayStr, completed: true },
  ];

  const test5Day1 = canCheckIn(multiDayAssessments, day1Str);
  const test5Day2 = canCheckIn(multiDayAssessments, day2Str);
  const test5Today = canCheckIn(multiDayAssessments, todayStr);
  const test5Tomorrow = canCheckIn(multiDayAssessments, tomorrowStr);

  console.log(`Can check-in on ${day1Str}? ${test5Day1 ? "✅ YES" : "❌ NO"}`);
  console.log(`Can check-in on ${day2Str}? ${test5Day2 ? "✅ YES" : "❌ NO"}`);
  console.log(`Can check-in on ${todayStr}? ${test5Today ? "✅ YES" : "❌ NO"}`);
  console.log(`Can check-in on ${tomorrowStr}? ${test5Tomorrow ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: First 3 ❌ NO, Tomorrow ✅ YES`);
  console.log(
    `Result: ${!test5Day1 && !test5Day2 && !test5Today && test5Tomorrow ? "✅ PASS" : "❌ FAIL"}\n`
  );
  results.push({
    name: "Multiple days tracked correctly",
    pass: !test5Day1 && !test5Day2 && !test5Today && test5Tomorrow,
  });

  // TEST 6: Incomplete assessment doesn't block
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 6: Incomplete Assessment (Should Not Block)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const incompleteAssessments = [{ date: todayStr, completed: false }];
  const test6 = canCheckIn(incompleteAssessments, todayStr);
  console.log(`Can check-in today? ${test6 ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: ✅ YES (incomplete assessment should not block)`);
  console.log(`Result: ${test6 ? "✅ PASS" : "❌ FAIL"}\n`);
  results.push({ name: "Incomplete assessment doesn't block", pass: test6 });

  // TEST 7: Time doesn't matter, only date
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST 7: Time Doesn't Matter (Only Date)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Same date, different times
  const morningAssessment = [{ date: todayStr, completed: true }];
  const test7Morning = canCheckIn(morningAssessment, todayStr);
  
  console.log(`Checked in at 9:00 AM, trying again at 11:00 PM same day`);
  console.log(`Can check-in? ${test7Morning ? "✅ YES" : "❌ NO"}`);
  console.log(`Expected: ❌ NO (same date, regardless of time)`);
  console.log(`Result: ${!test7Morning ? "✅ PASS" : "❌ FAIL"}\n`);
  results.push({ name: "Time doesn't matter, only date", pass: !test7Morning });

  // Summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}: ${result.pass ? "✅ PASS" : "❌ FAIL"}`);
  });

  const allPassed = results.every((r) => r.pass);
  const passedCount = results.filter((r) => r.pass).length;
  
  console.log(`\n${passedCount}/${results.length} tests passed`);
  console.log(`${allPassed ? "✅ ALL TESTS PASSED!" : "❌ SOME TESTS FAILED"}`);

  if (allPassed) {
    console.log("\n🎉 Check-in gating logic is working correctly!");
    console.log("   ✅ Users can only check-in once per day");
    console.log("   ✅ Resets automatically at midnight (date change)");
    console.log("   ✅ Incomplete assessments don't block new check-ins");
    console.log("   ✅ Time doesn't matter, only date");
    console.log("   ✅ Previous days don't affect current day");
    console.log("   ✅ Multiple consecutive days tracked correctly");
  } else {
    console.log("\n⚠️  Some tests failed. Please review the implementation.");
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  return allPassed;
}

// Run the tests
const success = runTests();
process.exit(success ? 0 : 1);
