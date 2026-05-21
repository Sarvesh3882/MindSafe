# ARIA Assessment Debug Instructions

## 🚨 CRITICAL: Follow These Steps Exactly

### Step 1: Stop Dev Server
Press `Ctrl + C` in your terminal to stop the current dev server.

### Step 2: Clear Next.js Cache
Run these commands:
```bash
rmdir /s /q .next
npm run dev
```

### Step 3: Clear Browser Cache
1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or press: `Ctrl + Shift + Delete` → Clear "Cached images and files"

### Step 4: Run Check-in and Watch Console
1. Go to `http://localhost:3000/student/checkin`
2. Open browser console (F12 → Console tab)
3. Answer the 5 triage questions
4. **Watch for these logs:**

#### After Triage (5 questions):
```
=== TRIAGE COMPLETE ===
Triage Signal: { depression: 2, anxiety: 1, stress: 2, ... }
Should Escalate: true
Assessment Queue: ["phq9", "gad7", "pss10"]
=======================
```

#### During Assessment (each question):
```
=== ANSWER RECEIVED ===
Question: "Over the last 2 weeks, how often have you felt down..."
Answer value: 2
Is camouflage: false
Source instrument: "phq9"
Question number: 1
Scoring for domain: depression
Current score: 0
Maps to: { depression: 1 }
Instrument config: { key: "phq9", domain: "depression", ... }
New score for depression: 2
All scores after this answer: { depression: 2, anxiety: 0, ... }
======================
```

#### Before Wellness Summary:
```
=== RENDERING WELLNESS SUMMARY ===
Dominant concern: depression
Is stable: false
Is anonymous: false
Scores: { depression: 12, anxiety: 8, stress: 10, ... }
Triage result: escalate
Assessment queue: ["phq9", "gad7", "pss10"]
==================================

=== BUILD WELLNESS SUMMARY ===
Dominant concern: depression
Is stable: false
Scores received: { depression: 12, anxiety: 8, ... }
==============================
Calculated severity: moderate
Score for depression: 12
Selected headline: "You've been carrying some weight lately..."
```

---

## 🔍 What to Check

### ✅ GOOD SIGNS (Working Correctly):
- Triage signal shows non-zero values
- Assessment queue has instruments (not empty)
- Scores accumulate: 0 → 2 → 5 → 8 → 12
- Different headlines for different scores
- Tips vary based on severity

### ❌ BAD SIGNS (Still Broken):
- Scores stay at 0 throughout
- "You're all set" appears immediately after triage
- Same generic tips for all tests
- No "=== ANSWER RECEIVED ===" logs during assessment

---

## 🐛 If Scores Stay at 0

This means `mapsTo` field is missing or incorrect. Check:

1. **Question data in database:**
   - Go to Supabase → Table Editor → `questions`
   - Check a PHQ-9 question
   - Verify `maps_to` column has: `{"depression": 1}`
   - NOT: `{"phq9": 1}` ❌

2. **If `maps_to` is wrong, run this SQL:**
```sql
-- Fix PHQ-9 questions
UPDATE questions
SET maps_to = '{"depression": 1}'::jsonb
WHERE instrument = 'phq9';

-- Fix GAD-7 questions
UPDATE questions
SET maps_to = '{"anxiety": 1}'::jsonb
WHERE instrument = 'gad7';

-- Fix PSS-10 questions
UPDATE questions
SET maps_to = '{"stress": 1}'::jsonb
WHERE instrument = 'pss10';

-- Fix ISI questions
UPDATE questions
SET maps_to = '{"sleep": 1}'::jsonb
WHERE instrument = 'isi';
```

---

## 🧪 Test Scenarios

### Test 1: Stable User (Low Scores)
**Triage answers:** All "Not at all" or "Several days"
**Expected:**
- Queue: `["phq9", "gad7"]`
- Scores: depression: 0-5, anxiety: 0-5
- Headline: "You've been feeling a bit low lately" or "You're doing well"
- Tips: Gentle, preventive (sleep, exercise, mindfulness)

### Test 2: Moderate Anxiety
**Triage answers:** High anxiety signals (select "More than half the days")
**Expected:**
- Queue: `["phq9", "gad7", "pss10"]` or similar
- Scores: anxiety: 8-14, depression: 5-10
- Headline: "Your mind has been working overtime"
- Tips: Grounding techniques, breathing exercises, 5-4-3-2-1

### Test 3: High Depression (Critical)
**Triage answers:** High depression signals (select "Nearly every day")
**Expected:**
- Queue: `["phq9", "gad7"]` or more
- Scores: depression: 15+, anxiety: 8+
- Headline: "You've been going through a really tough time"
- Tips: Professional support, crisis resources, counsellor contact

---

## 📊 Expected Console Output (Full Flow)

```
=== TRIAGE COMPLETE ===
Triage Signal: { depression: 2, anxiety: 1, stress: 2, sleep: 1, burnout: 0, loneliness: 0 }
Should Escalate: true
Assessment Queue: ["phq9", "gad7", "pss10"]
=======================

=== ANSWER RECEIVED ===
Question: "Little interest or pleasure in doing things"
Answer value: 2
Is camouflage: false
Source instrument: "phq9"
Question number: 1
Scoring for domain: depression
Current score: 0
Maps to: { depression: 1 }
New score for depression: 2
All scores after this answer: { depression: 2, anxiety: 0, stress: 0, ... }
======================

[... more answers ...]

=== RENDERING WELLNESS SUMMARY ===
Dominant concern: depression
Is stable: false
Scores: { depression: 12, anxiety: 8, stress: 10, sleep: 0, burnout: 0, loneliness: 0, substance: 0 }
==================================

=== BUILD WELLNESS SUMMARY ===
Dominant concern: depression
Is stable: false
Scores received: { depression: 12, anxiety: 8, stress: 10, ... }
==============================
Calculated severity: moderate
Score for depression: 12
Selected headline: "You've been carrying some weight lately. Here are some things that might help."
```

---

## 🆘 If Still Broken After All This

1. **Take a screenshot of the console logs**
2. **Check Supabase:**
   - Go to Table Editor → `questions`
   - Export a few PHQ-9 questions as CSV
   - Check the `maps_to` column format
3. **Share the console logs with me**

---

## ✅ Success Criteria

- [ ] Triage signal shows non-zero values
- [ ] Assessment queue is not empty
- [ ] Scores accumulate during assessment
- [ ] Final scores are non-zero
- [ ] Headlines change based on scores
- [ ] Tips are different for different severity levels
- [ ] No "You're all set" for all tests

---

## 📝 Files Changed

1. `src/app/student/checkin/page.tsx` - Added debug logging to `handleAssessmentAnswer`
2. `src/lib/aria/insights.ts` - Added debug logging to `buildWellnessSummary`

All changes are **debug logging only** - no logic changes. The fixes from the previous session are still in place.
