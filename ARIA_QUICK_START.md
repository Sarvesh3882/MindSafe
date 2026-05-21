# 🚀 ARIA Assessment - Quick Start Guide

## ⚡ IMMEDIATE ACTIONS (Do This Now)

### Step 1: Stop and Restart Dev Server
```bash
# Press Ctrl+C to stop current server
# Then run:
rmdir /s /q .next
npm run dev
```

### Step 2: Clear Browser Cache
1. Open Chrome
2. Press `Ctrl + Shift + Delete`
3. Select "Cached images and files"
4. Click "Clear data"
5. OR: Right-click refresh button → "Empty Cache and Hard Reload"

### Step 3: Open Console and Test
1. Go to `http://localhost:3000/student/checkin`
2. Press `F12` to open DevTools
3. Click "Console" tab
4. Answer the 5 triage questions
5. **WATCH THE CONSOLE LOGS**

---

## 🔍 What You Should See in Console

### After Triage (5 questions):
```
=== TRIAGE COMPLETE ===
Triage Signal: { depression: 2, anxiety: 1, stress: 2, sleep: 1, burnout: 0, loneliness: 0 }
Should Escalate: true
Assessment Queue: ["phq9", "gad7", "pss10"]
=======================
```

### During Assessment (each question):
```
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
```

### At the End:
```
=== RENDERING WELLNESS SUMMARY ===
Dominant concern: depression
Is stable: false
Scores: { depression: 12, anxiety: 8, stress: 10, sleep: 0, burnout: 0, loneliness: 0, substance: 0 }
==================================

=== BUILD WELLNESS SUMMARY ===
Dominant concern: depression
Is stable: false
Scores received: { depression: 12, anxiety: 8, stress: 10, ... }
Calculated severity: moderate
Score for depression: 12
Selected headline: "You've been carrying some weight lately. Here are some things that might help."
==============================
```

---

## ✅ SUCCESS = You Should See:
- ✅ Different headlines for different scores
- ✅ Different tips for different severity levels
- ✅ Scores increasing: 0 → 2 → 5 → 8 → 12
- ✅ Assessment runs after triage (not "You're all set" immediately)

## ❌ FAILURE = If You See:
- ❌ "You're all set" appears right after triage
- ❌ Same generic tips for all tests
- ❌ Scores stay at 0 throughout
- ❌ No console logs appearing

---

## 🐛 If Scores Stay at 0

This means the `maps_to` field in your database is wrong. 

### Fix It:
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run migration 038:

```sql
-- Copy and paste the entire content of:
-- supabase/migrations/038_verify_and_fix_maps_to.sql
```

OR run this quick fix:

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

-- Verify fix
SELECT instrument, COUNT(*) as total, 
       COUNT(CASE WHEN maps_to ? 'depression' THEN 1 END) as depression_mapped,
       COUNT(CASE WHEN maps_to ? 'anxiety' THEN 1 END) as anxiety_mapped,
       COUNT(CASE WHEN maps_to ? 'stress' THEN 1 END) as stress_mapped
FROM questions
WHERE instrument IN ('phq9', 'gad7', 'pss10')
GROUP BY instrument;
```

---

## 📊 Test Different Scenarios

### Test 1: Stable User (Low Scores)
**How to answer triage:**
- Select "Not at all" or "Several days" for all questions

**Expected result:**
- Queue: `["phq9", "gad7"]`
- Scores: depression: 0-5, anxiety: 0-5
- Headline: "You're doing well" or "You've been feeling a bit low lately"
- Tips: Gentle (sleep, exercise, mindfulness)

### Test 2: Moderate Anxiety
**How to answer triage:**
- Select "More than half the days" for anxiety-related questions

**Expected result:**
- Queue: `["phq9", "gad7", "pss10"]`
- Scores: anxiety: 8-14, depression: 5-10
- Headline: "Your mind has been working overtime"
- Tips: Breathing exercises, grounding techniques

### Test 3: High Depression
**How to answer triage:**
- Select "Nearly every day" for depression-related questions

**Expected result:**
- Queue: `["phq9", "gad7"]` or more
- Scores: depression: 15+
- Headline: "You've been going through a really tough time"
- Tips: Professional support, crisis resources

---

## 📁 Files Changed (Summary)

### Logic Fixes:
1. ✅ `src/lib/aria/engine.ts` - Always run PHQ-9 + GAD-7 baseline
2. ✅ `src/app/student/checkin/page.tsx` - Remove stable skip
3. ✅ `src/app/student/checkin/state-machine.ts` - Fix transitions
4. ✅ `src/lib/aria/insights.ts` - Personalized tips

### Debug Logging:
1. ✅ `src/app/student/checkin/page.tsx` - Score tracking
2. ✅ `src/lib/aria/insights.ts` - Summary tracking

### Database Fix:
1. ✅ `supabase/migrations/038_verify_and_fix_maps_to.sql` - Fix maps_to field

---

## 🆘 Still Broken? Do This:

1. **Take a screenshot of console logs**
2. **Check Supabase questions table:**
   - Go to Table Editor → `questions`
   - Filter: `instrument = 'phq9'`
   - Check the `maps_to` column
   - Should be: `{"depression": 1}`
   - NOT: `{"phq9": 1}` ❌

3. **Share with me:**
   - Console log screenshot
   - Sample question from Supabase (copy the `maps_to` value)

---

## 📝 Quick Checklist

Before reporting issues, verify:
- [ ] Dev server restarted
- [ ] `.next` folder deleted
- [ ] Browser cache cleared (hard reload)
- [ ] Console open during test
- [ ] Tested with different answer patterns
- [ ] Checked `maps_to` field in Supabase

---

## 🎯 Bottom Line

**The fixes are in place.** The most likely issue is:
1. Dev server not restarted
2. Browser cache not cleared
3. `maps_to` field in database is wrong

Follow the steps above and it should work! 🚀
