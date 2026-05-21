# ARIA Questions Loading — Test Instructions

## Critical Feature Testing

This is a **CRITICAL** feature that cannot be compromised. Follow these steps to thoroughly test ARIA questions loading.

---

## Option 1: Browser-Based Test (Recommended) ✅

### Step 1: Access Test Page
Open your browser and go to:
```
http://localhost:3001/test-aria
```
(or whatever port your Next.js dev server is running on)

### Step 2: Review Results
The page will automatically run all tests and show:
- ✅ **Green**: Test passed
- ❌ **Red**: Test failed (critical issue)
- ⚠️ **Yellow**: Warning (non-critical)

### Step 3: Check Summary
Look at the summary box:
- **All tests passed**: ARIA is ready ✅
- **Any failures**: Run the fix script (see below)

---

## Option 2: Manual Browser Test 🧪

### Test 1: Guest Check-in Flow
1. Open: `http://localhost:3001/checkin`
2. Select any emotion tile (e.g., "Okay")
3. **Expected**: 5 triage questions should load
4. **If fails**: Error message appears saying "Could not load questions"

### Test 2: Student Check-in Flow
1. Login as a student
2. Go to: `http://localhost:3001/student/checkin`
3. Select any emotion tile
4. **Expected**: 5 triage questions should load
5. Answer all 5 questions
6. **Expected**: Either see "All done" or additional assessment questions

### Test 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors:
   - ❌ `Failed to fetch triage questions`
   - ❌ `Could not load questions`
   - ❌ Any Supabase RLS errors

---

## Option 3: Database Verification 🗄️

### Run in Supabase SQL Editor:

```sql
-- Test 1: Check triage questions exist
SELECT COUNT(*) FROM questions WHERE is_triage = TRUE;
-- Expected: 5

-- Test 2: View all triage questions
SELECT 
  question,
  category,
  jsonb_array_length(options) AS option_count
FROM questions
WHERE is_triage = TRUE
ORDER BY created_at;
-- Expected: 5 rows with 4 options each

-- Test 3: Check options format
SELECT 
  question,
  options->0->>'label' AS first_option_label,
  options->0->>'maps_to' AS first_option_maps_to
FROM questions
WHERE is_triage = TRUE;
-- Expected: All should have "label" field (not null)

-- Test 4: Test anonymous access
SET ROLE anon;
SELECT COUNT(*) FROM questions WHERE is_triage = TRUE;
RESET ROLE;
-- Expected: 5 (not 0)

-- Test 5: Check RLS policy
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'questions';
-- Expected: Should include "Anyone can read questions" with SELECT
```

---

## If Tests Fail ❌

### Quick Fix (2 minutes):

1. **Open Supabase SQL Editor**
2. **Copy and paste entire content of:**
   ```
   FIX_ARIA_QUESTIONS_LOADING.sql
   ```
3. **Run the script**
4. **Verify output shows:**
   ```
   status: "Triage Questions Loaded"
   count: 5
   
   test: "Anonymous Access Test"
   accessible_questions: 5
   ```
5. **Refresh browser and test again**

---

## Critical Test Checklist ✓

Use this checklist to ensure ARIA is production-ready:

### Database Layer
- [ ] 5 triage questions exist in database
- [ ] All questions have `is_triage = TRUE`
- [ ] All options have `label` field (not `text`)
- [ ] All options have `maps_to` object
- [ ] RLS policy allows anonymous access

### API Layer
- [ ] `fetchTriageQuestions()` returns 5 questions
- [ ] Options are normalized (have `label` field)
- [ ] No errors in API calls

### Frontend Layer
- [ ] Guest check-in loads questions
- [ ] Student check-in loads questions
- [ ] Questions display correctly
- [ ] Options are clickable
- [ ] No console errors

### ARIA Engine
- [ ] `computeTriageSignal()` works
- [ ] `shouldEscalate()` returns boolean
- [ ] `buildAssessmentQueue()` returns instruments
- [ ] Signal values are 0-3 range
- [ ] Queue has 0-3 instruments

### End-to-End Flow
- [ ] User can select emotion
- [ ] Triage questions load
- [ ] User can answer all 5 questions
- [ ] Signal is computed correctly
- [ ] Escalation decision is made
- [ ] Assessment queue is built (if escalated)
- [ ] Instrument questions load (if escalated)
- [ ] Assessment completes successfully

---

## Expected Behavior 📋

### Stable User (Low Scores)
1. Answers 5 triage questions
2. All answers are 0-1 (low severity)
3. Signal: All domains < 2
4. Decision: **STABLE**
5. Queue: `["phq9", "gad7"]` (baseline screening)
6. Completes PHQ-9 and GAD-7
7. Sees results and recommendations

### Escalated User (High Scores)
1. Answers 5 triage questions
2. Some answers are 2-3 (high severity)
3. Signal: Some domains >= 2
4. Decision: **ESCALATE**
5. Queue: Up to 3 instruments based on signal
6. Completes all queued instruments
7. Sees results and counsellor recommendation

---

## Common Issues & Solutions 🔧

### Issue 1: "Could not load questions"
**Cause**: RLS policy blocking anonymous access  
**Fix**: Run `FIX_ARIA_QUESTIONS_LOADING.sql`

### Issue 2: Questions show but options missing
**Cause**: Options format mismatch (text vs label)  
**Fix**: Run `FIX_ARIA_QUESTIONS_LOADING.sql`

### Issue 3: Signal computation fails
**Cause**: Missing `maps_to` in options  
**Fix**: Run `FIX_ARIA_QUESTIONS_LOADING.sql`

### Issue 4: Only 3-4 questions load
**Cause**: Incomplete seed data  
**Fix**: Run `FIX_ARIA_QUESTIONS_LOADING.sql`

### Issue 5: Authenticated users work, guests don't
**Cause**: RLS policy requires authentication  
**Fix**: Run migration 012 or full fix script

---

## Production Readiness Criteria ✅

ARIA is **PRODUCTION READY** when:

1. ✅ All database tests pass
2. ✅ All API tests pass
3. ✅ All frontend tests pass
4. ✅ All engine tests pass
5. ✅ End-to-end flow works for both guest and authenticated users
6. ✅ No console errors
7. ✅ No RLS errors
8. ✅ Questions load in < 1 second
9. ✅ Signal computation is accurate
10. ✅ Escalation logic works correctly

---

## Test Results Log 📝

Record your test results here:

**Date**: _______________  
**Tester**: _______________

| Test | Status | Notes |
|------|--------|-------|
| Database Access | ⬜ Pass ⬜ Fail | |
| Triage Questions Count | ⬜ Pass ⬜ Fail | |
| Options Format | ⬜ Pass ⬜ Fail | |
| RLS Policy | ⬜ Pass ⬜ Fail | |
| API Layer | ⬜ Pass ⬜ Fail | |
| Guest Check-in | ⬜ Pass ⬜ Fail | |
| Student Check-in | ⬜ Pass ⬜ Fail | |
| ARIA Engine | ⬜ Pass ⬜ Fail | |
| End-to-End Flow | ⬜ Pass ⬜ Fail | |

**Overall Status**: ⬜ READY FOR PRODUCTION ⬜ NEEDS FIXES

**Action Items**:
- [ ] _______________________________________________
- [ ] _______________________________________________
- [ ] _______________________________________________

---

## Support 🆘

If tests continue to fail after running the fix script:

1. Check Supabase logs for errors
2. Verify `.env.local` has correct Supabase credentials
3. Ensure migrations are applied in order
4. Check browser console for detailed error messages
5. Review `ARIA_QUESTIONS_FIX_SUMMARY.md` for detailed troubleshooting

