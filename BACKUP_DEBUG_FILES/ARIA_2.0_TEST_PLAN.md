# ARIA 2.0 - Comprehensive Test Plan

## Test Status: ✅ READY FOR TESTING

All 56 questions seeded, UI bugs fixed, triage escalation logic corrected.

---

## Test Scenarios

### 1. **Stable Path (No Escalation)**

**Test Case 1.1: All Positive Answers**
- **Triage Q1 (Energy)**: "Full of energy, feeling great" (value 0)
- **Triage Q2 (Sleep)**: "Slept really well" (value 0)
- **Triage Q3 (Stress)**: "Not stressed at all" (value 0)

**Expected Result:**
- ✅ Triage signal: All domains = 0
- ✅ No escalation (shouldEscalate = false)
- ✅ Goes directly to wellness summary
- ✅ Headline: "You're doing well. Here are some ways to keep taking care of yourself."
- ✅ Shows 3 general wellness tips

**Test Case 1.2: Mostly Positive with One Mild Answer**
- **Triage Q1**: "Pretty good, mostly okay" (value 1)
- **Triage Q2**: "Okay, could be better" (value 1)
- **Triage Q3**: "A little, but managing" (value 1)

**Expected Result:**
- ✅ Triage signal: All domains = 0 (value 1 options have 0 signal)
- ✅ No escalation
- ✅ Goes to wellness summary with general tips

---

### 2. **Escalation Path (Clinical Assessment)**

**Test Case 2.1: High Depression Signal**
- **Triage Q1 (Energy)**: "Really drained or down" (value 3)
  - Maps to: depression=2, anxiety=1, burnout=2
- **Triage Q2 (Sleep)**: "Okay, could be better" (value 1)
  - Maps to: sleep=0, depression=0, anxiety=0
- **Triage Q3 (Stress)**: "A little, but managing" (value 1)
  - Maps to: stress=0, anxiety=0, burnout=0, loneliness=0

**Expected Result:**
- ✅ Triage signal: depression=2, anxiety=1, burnout=2, others=0
- ✅ Escalation triggered (depression ≥ 2, burnout ≥ 2)
- ✅ Assessment queue: [phq9, maslach] (ordered by signal strength)
- ✅ Shows mixed clinical questions from PHQ-9 and Maslach
- ✅ Camouflage questions inserted at 25%, 50%, 75%

**Test Case 2.2: High Stress Signal**
- **Triage Q1**: "A bit low, not my best" (value 2)
  - Maps to: depression=1, anxiety=0, burnout=1
- **Triage Q2**: "Didn't sleep great" (value 2)
  - Maps to: sleep=1, depression=0, anxiety=1
- **Triage Q3**: "Quite stressed" (value 2)
  - Maps to: stress=2, anxiety=1, burnout=1, loneliness=0

**Expected Result:**
- ✅ Triage signal: stress=2, anxiety=2 (1+1), burnout=2 (1+1), depression=1, sleep=1
- ✅ Escalation triggered (stress ≥ 2, anxiety ≥ 2, burnout ≥ 2)
- ✅ Assessment queue: [pss10, gad7, maslach] (max 3 instruments)
- ✅ Shows mixed questions from all 3 instruments

**Test Case 2.3: Maximum Stress (All High Answers)**
- **Triage Q1**: "Really drained or down" (value 3)
- **Triage Q2**: "Barely slept / very restless" (value 3)
- **Triage Q3**: "Overwhelmed / can't cope" (value 3)

**Expected Result:**
- ✅ Triage signal: depression=3 (capped), anxiety=3 (capped), stress=3, sleep=2, burnout=3 (capped), loneliness=1
- ✅ All domains escalate except loneliness
- ✅ Assessment queue: [phq9, maslach, gad7] (top 3 by signal)
- ✅ Shows mixed questions

---

### 3. **Crisis Detection**

**Test Case 3.1: PHQ-9 Crisis (Score ≥ 15)**
- Complete triage with high depression signal
- During PHQ-9 questions, answer with high values (2-3) for most questions
- **Critical**: PHQ-9 Q9 (suicidal ideation) = "Nearly every day" (value 3)

**Expected Result:**
- ✅ After any answer that pushes PHQ-9 score ≥ 15, crisis is triggered
- ✅ Immediately shows CrisisScreen
- ✅ Displays iCall: 9152987821
- ✅ Displays Tele-MANAS: 14416
- ✅ Warm, non-alarming message
- ✅ Assessment saved with risk_level="critical"
- ✅ Crisis alert triggered (if logged in)

**Test Case 3.2: GAD-7 Crisis (Score ≥ 15)**
- Complete triage with high anxiety signal
- During GAD-7 questions, answer with "Nearly every day" (value 3) for 5+ questions

**Expected Result:**
- ✅ Crisis triggered when GAD-7 score ≥ 15
- ✅ Shows CrisisScreen with helplines

**Test Case 3.3: PSS-10 Crisis (Score ≥ 27)**
- Complete triage with high stress signal
- During PSS-10 questions, answer with high values
- **Remember**: Items 4, 5, 7, 8 are reverse-scored

**Expected Result:**
- ✅ Crisis triggered when PSS-10 score ≥ 27
- ✅ Reverse scoring applied correctly (items 4,5,7,8)

---

### 4. **Question Mixing & Camouflage**

**Test Case 4.1: Camouflage Insertion**
- Complete triage with escalation
- Count total questions in assessment phase

**Expected Result:**
- ✅ Questions are mixed across instruments (not grouped)
- ✅ Camouflage questions appear at ~25%, ~50%, ~75% progress
- ✅ Camouflage questions have no clinical impact on scores
- ✅ Student cannot tell which questions "count"

**Test Case 4.2: Question Rotation (14-day)**
- Complete assessment as logged-in user
- Wait 1 day, complete another assessment
- Compare questions asked

**Expected Result:**
- ✅ Different questions selected from same instrument
- ✅ Recently asked questions avoided (14-day rotation)
- ✅ All questions eventually cycled through

---

### 5. **Reverse Scoring (PSS-10)**

**Test Case 5.1: PSS-10 Reverse Items**
- Complete triage with high stress signal
- During PSS-10 assessment:
  - Q4 (reverse): "In the last month, how often have you felt confident..." → Answer "Very often" (value 4)
  - Q5 (reverse): "...felt that things were going your way?" → Answer "Very often" (value 4)
  - Q7 (reverse): "...been able to control irritations..." → Answer "Very often" (value 4)
  - Q8 (reverse): "...felt that you were on top of things?" → Answer "Very often" (value 4)

**Expected Result:**
- ✅ Reverse items scored as: 4 - value = 0 (best score)
- ✅ High "Very often" answers on reverse items LOWER the stress score
- ✅ Total PSS-10 score calculated correctly

---

### 6. **Wellness Tips**

**Test Case 6.1: Depression Tips**
- Complete assessment with high depression score (but < 15)

**Expected Result:**
- ✅ Headline: "You've been carrying some weight lately..."
- ✅ Shows 3 depression-specific tips:
  - 🚶 "Even a 10-minute walk outside..."
  - 📓 "Try writing down three small things..."
  - 📞 "Reach out to one person today..."
- ✅ Each tip shows source: "Behavioral Activation (techniques.md)"

**Test Case 6.2: Anxiety Tips**
- Complete assessment with high anxiety score

**Expected Result:**
- ✅ Shows 3 anxiety-specific tips (box breathing, grounding, etc.)
- ✅ Sources from techniques.md

**Test Case 6.3: Stress Tips**
- Complete assessment with high stress score

**Expected Result:**
- ✅ Shows 3 stress-specific tips
- ✅ Sources from techniques.md

---

### 7. **Anonymous vs Logged-In User**

**Test Case 7.1: Anonymous User**
- Complete check-in without logging in

**Expected Result:**
- ✅ Assessment completes successfully
- ✅ No data saved to Supabase
- ✅ Wellness summary shows "Create account" prompt
- ✅ No error messages

**Test Case 7.2: Logged-In User**
- Log in as student
- Complete check-in

**Expected Result:**
- ✅ Assessment saved to database
- ✅ All fields populated correctly:
  - user_id, date, scores, risk_level, emotion
  - triage_result, triage_signal, instruments_used
  - counsellor_report, consistency_flags
  - camouflage_responses, context_frame_id
  - session_duration_seconds
- ✅ No "Create account" prompt

---

### 8. **Performance & Loading**

**Test Case 8.1: Initial Load Time**
- Navigate to /student/checkin

**Expected Result:**
- ✅ Page loads within 2 seconds
- ✅ Shows loading spinner while fetching triage questions
- ✅ First question appears smoothly

**Test Case 8.2: Question Transitions**
- Answer questions and observe transitions

**Expected Result:**
- ✅ Transitions ≤ 350ms (per design spec)
- ✅ Smooth animations (no jank)
- ✅ Respects prefers-reduced-motion

---

### 9. **Edge Cases**

**Test Case 9.1: Network Failure During Assessment**
- Start assessment
- Disconnect network
- Try to complete

**Expected Result:**
- ✅ Graceful error handling
- ✅ User-friendly error message
- ✅ Option to retry

**Test Case 9.2: Rapid Clicking**
- Click answer buttons rapidly

**Expected Result:**
- ✅ Only one answer registered per question
- ✅ No duplicate submissions
- ✅ Smooth progression

**Test Case 9.3: Browser Back Button**
- Start assessment
- Click browser back button

**Expected Result:**
- ✅ Assessment state preserved OR
- ✅ User warned about losing progress

---

## Known Issues to Verify

### ✅ FIXED
1. ~~Question options showing as empty boxes~~ → Fixed: Changed `option.label` to `option.text || option.label`
2. ~~Triage not escalating~~ → Fixed: Extract `maps_to` from selected option, not question level
3. ~~Database missing questions~~ → Fixed: Re-seeded after migrations

### ⚠️ TO VERIFY
1. **Consistency checks** - Are cross-instrument and temporal checks working?
2. **Context framing** - Is context_frame_id being saved correctly?
3. **Counsellor report** - Is the full report being generated and saved?
4. **14-day rotation** - Does question rotation work across multiple assessments?

---

## Testing Checklist

### Phase 1: Basic Flow
- [ ] Stable path (no escalation)
- [ ] Escalation path (clinical assessment)
- [ ] Question options display correctly
- [ ] Progress bar updates correctly

### Phase 2: Crisis Detection
- [ ] PHQ-9 crisis (≥15)
- [ ] GAD-7 crisis (≥15)
- [ ] PSS-10 crisis (≥27)
- [ ] Crisis screen shows correct helplines

### Phase 3: Scoring & Logic
- [ ] Reverse scoring (PSS-10 items 4,5,7,8)
- [ ] Triage signal computation
- [ ] Assessment queue ordering
- [ ] Question mixing algorithm

### Phase 4: Wellness Tips
- [ ] Depression tips
- [ ] Anxiety tips
- [ ] Stress tips
- [ ] Sleep tips
- [ ] Burnout tips
- [ ] Loneliness tips
- [ ] General tips (stable path)

### Phase 5: Data Persistence
- [ ] Anonymous user (no save)
- [ ] Logged-in user (full save)
- [ ] All database fields populated
- [ ] Counsellor report generated

### Phase 6: Edge Cases
- [ ] Network failure handling
- [ ] Rapid clicking protection
- [ ] Browser back button
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Test Data

### Database Verification Query
```sql
-- Check recent assessments
SELECT 
  user_id,
  date,
  risk_level,
  triage_result,
  instruments_used,
  completed,
  session_duration_seconds
FROM assessments
ORDER BY created_at DESC
LIMIT 10;
```

### Question Count Verification
```sql
-- Should return 56 total
SELECT 
  CASE 
    WHEN is_triage THEN 'Triage'
    WHEN is_camouflage THEN 'Camouflage'
    WHEN instrument IS NOT NULL THEN UPPER(instrument)
    ELSE 'Other'
  END as question_type,
  COUNT(*) as count
FROM questions
GROUP BY question_type
ORDER BY question_type;
```

---

## Success Criteria

✅ **All test cases pass**
✅ **No console errors**
✅ **Smooth user experience**
✅ **Correct wellness tips for each domain**
✅ **Crisis detection works reliably**
✅ **Data saved correctly for logged-in users**
✅ **Anonymous users can complete without errors**
✅ **Mobile-responsive (< 640px)**
✅ **Accessible (WCAG 2.1 AA)**

---

## Next Steps After Testing

1. **If bugs found**: Document in GitHub issues with screenshots
2. **If all passes**: Mark ARIA 2.0 as production-ready
3. **Performance optimization**: If load times > 2s, investigate
4. **User testing**: Get feedback from 5-10 students
5. **Counsellor dashboard**: Build view for counsellor reports

---

**Test Date**: _____________
**Tester**: _____________
**Result**: ⬜ PASS | ⬜ FAIL | ⬜ NEEDS WORK
