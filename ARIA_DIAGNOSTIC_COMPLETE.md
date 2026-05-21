# ARIA COMPLETE DIAGNOSTIC & FIX GUIDE

## 🔍 PROBLEM SUMMARY
- Assessment shows "You're all set" for all tests
- Tips are not personalized
- Escalation not working properly

## 🎯 ROOT CAUSE ANALYSIS

The issue is that **scores are not being accumulated during the assessment**. The `context.currentScores` remains empty, so the wellness summary has no data to work with.

## ✅ COMPLETE FIX CHECKLIST

### FILE 1: `src/app/student/checkin/page.tsx`
**Line ~240-260: handleAssessmentAnswer function**

**PROBLEM:** Scores might not be accumulating correctly

**CHECK THIS CODE:**
```typescript
const handleAssessmentAnswer = async (answer: Answer) => {
  const currentQuestion = context.mixedQuestions[context.currentQuestionIndex];

  // Skip scoring for camouflage questions
  let newScores = { ...context.currentScores };
  if (!currentQuestion.isCamouflage && currentQuestion.sourceInstrument) {
    const config = INSTRUMENT_CONFIGS[currentQuestion.sourceInstrument];
    const domain = config.domain;

    newScores[domain] = accumulateScore(
      context.currentScores[domain],
      answer.value,
      answer.mapsTo,
      config,
      currentQuestion.question_number || 1
    );
  }
```

**ADD DEBUG LOGGING:**
```typescript
const handleAssessmentAnswer = async (answer: Answer) => {
  const currentQuestion = context.mixedQuestions[context.currentQuestionIndex];

  console.log('=== ANSWER RECEIVED ===');
  console.log('Question:', currentQuestion.question);
  console.log('Answer value:', answer.value);
  console.log('Is camouflage:', currentQuestion.isCamouflage);
  console.log('Source instrument:', currentQuestion.sourceInstrument);

  // Skip scoring for camouflage questions
  let newScores = { ...context.currentScores };
  if (!currentQuestion.isCamouflage && currentQuestion.sourceInstrument) {
    const config = INSTRUMENT_CONFIGS[currentQuestion.sourceInstrument];
    const domain = config.domain;

    console.log('Scoring for domain:', domain);
    console.log('Current score:', context.currentScores[domain]);
    console.log('Maps to:', answer.mapsTo);

    newScores[domain] = accumulateScore(
      context.currentScores[domain],
      answer.value,
      answer.mapsTo,
      config,
      currentQuestion.question_number || 1
    );

    console.log('New score:', newScores[domain]);
  }

  console.log('All scores:', newScores);
  console.log('======================');
```

---

### FILE 2: `src/lib/aria/engine.ts`
**Line ~380-420: accumulateScore function**

**VERIFY THIS FUNCTION EXISTS AND WORKS:**
```typescript
export function accumulateScore(
  currentScore: number,
  optionValue: number,
  mapsTo: Record<string, number>,
  instrumentConfig: InstrumentConfig,
  questionNumber: number
): number {
  const domain = instrumentConfig.domain;
  const multiplier = mapsTo[domain] ?? 0;

  // Check if this question is reverse-scored
  const isReverse = instrumentConfig.reverseItems?.includes(questionNumber) ?? false;

  let contribution: number;
  if (isReverse) {
    // Reverse scoring: (itemMax - optionValue) * multiplier
    contribution = (instrumentConfig.itemMax - optionValue) * multiplier;
  } else {
    // Normal scoring: optionValue * multiplier
    contribution = optionValue * multiplier;
  }

  const newScore = currentScore + contribution;

  // Cap at instrument maximum
  return Math.min(newScore, instrumentConfig.maxScore);
}
```

---

### FILE 3: `src/app/student/checkin/types.ts`
**CHECK: Initial scores should be 0**

```typescript
export function createInitialContext(): CheckinContext {
  return {
    state: "triage",
    // ... other fields ...
    currentScores: {
      depression: 0,
      anxiety: 0,
      stress: 0,
      sleep: 0,
      burnout: 0,
      loneliness: 0,
      substance: 0,
    },
    // ... other fields ...
  };
}
```

---

### FILE 4: `src/app/student/checkin/state-machine.ts`
**Line ~60-80: ANSWER_QUESTION case**

**VERIFY THIS CODE:**
```typescript
case "ANSWER_QUESTION": {
  const newAnswers = [...state.assessmentAnswers, action.payload.answer];
  const nextIndex = state.currentQuestionIndex + 1;

  // Check if this is a camouflage question
  const currentQuestion = state.mixedQuestions[state.currentQuestionIndex];
  const newCamouflageResponses = currentQuestion?.isCamouflage
    ? [
        ...state.camouflageResponses,
        {
          question: currentQuestion.question,
          answer: currentQuestion.options.find(
            (opt) => opt.value === action.payload.answer.value
          )?.label || "",
        },
      ]
    : state.camouflageResponses;

  return {
    ...state,
    assessmentAnswers: newAnswers,
    currentQuestionIndex: nextIndex,
    currentScores: action.payload.newScores,  // ← THIS MUST UPDATE
    riskLevel: action.payload.riskLevel,
    camouflageResponses: newCamouflageResponses,
  };
}
```

---

## 🧪 TESTING PROCEDURE

### Step 1: Add Debug Logging
Add the console.log statements to `handleAssessmentAnswer` as shown above.

### Step 2: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 3: Clear Browser Cache
- Hard refresh: Ctrl + Shift + R
- Or open DevTools → Application → Clear storage

### Step 4: Run Check-in
1. Go to check-in page
2. Answer 5 triage questions
3. **Watch the console** - you should see:
   - "=== TRIAGE COMPLETE ===" with signal and queue
   - "=== ANSWER RECEIVED ===" for each assessment question
   - Scores accumulating (depression: 0 → 2 → 5 → 8, etc.)

### Step 5: Check Final Scores
At the end, you should see in console:
```
All scores: {
  depression: 12,
  anxiety: 8,
  stress: 10,
  ...
}
```

If scores are all 0, the problem is in `accumulateScore` or `mapsTo` data.

---

## 🚨 COMMON ISSUES

### Issue 1: Scores Stay at 0
**Cause:** `mapsTo` doesn't have the correct domain key
**Fix:** Check that question `maps_to` field matches instrument domain

### Issue 2: "You're all set" appears immediately
**Cause:** State machine jumping to "complete" too early
**Fix:** Already fixed in state-machine.ts

### Issue 3: Tips are generic
**Cause:** `buildWellnessSummary` not receiving scores
**Fix:** Already fixed in insights.ts

---

## 📊 EXPECTED BEHAVIOR

### Stable User (Low Scores)
- Triage: All low answers
- Queue: `["phq9", "gad7"]`
- Scores: depression: 3, anxiety: 2
- Tips: Gentle, preventive (sleep, exercise, mindfulness)

### Moderate Anxiety
- Triage: High anxiety signals
- Queue: `["phq9", "gad7", "pss10"]` or similar
- Scores: anxiety: 12, depression: 6
- Tips: Grounding techniques, breathing exercises

### High Depression (Critical)
- Triage: High depression signals
- Queue: `["phq9", "gad7"]` or more
- Scores: depression: 18, anxiety: 8
- Tips: Professional support, crisis resources

---

## ✅ VERIFICATION CHECKLIST

- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Console shows triage signal
- [ ] Console shows assessment queue
- [ ] Console shows scores accumulating
- [ ] Final scores are non-zero
- [ ] Tips are different for different tests
- [ ] Headlines match the concern

---

## 🔧 IF STILL BROKEN

Run this in browser console during check-in:
```javascript
// After completing assessment, check context
console.log('Context scores:', window.__NEXT_DATA__);
```

Or add this to page.tsx before WellnessSummary:
```typescript
console.log('=== RENDERING WELLNESS SUMMARY ===');
console.log('Dominant concern:', context.dominantConcern);
console.log('Is stable:', context.triageResult === "stable");
console.log('Scores:', context.currentScores);
console.log('==================================');
```

This will show exactly what data is being passed to the summary component.
