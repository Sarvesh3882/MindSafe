# Wellness Tips Testing Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Quick Test Instructions

### 1. Start the Development Server
```bash
cd mindsafe-india
npm run dev
```

### 2. Test Scenarios

#### Test A: Stable Triage (General Tips)
1. Navigate to: `http://localhost:3000/student/checkin?emotion=okay`
2. Answer all 5 triage questions with low-concern options (e.g., "Not at all", "Rarely")
3. **Expected Result:**
   - Headline: "You're doing well. Here are some ways to keep taking care of yourself."
   - 3 random tips from general pool
4. **Repeat 3 times** - verify different tips shown each time

#### Test B: Single Domain - Low Severity (Depression)
1. Navigate to: `http://localhost:3000/student/checkin?emotion=low`
2. Answer triage questions to trigger depression escalation
3. Answer clinical questions with low scores (e.g., "Several days", "Not at all")
4. **Expected Result:**
   - Headline: "You've been feeling a bit low lately..."
   - 3 tips from depression low-severity pool
   - Tips include: walking, journaling, sunlight
5. **Repeat 3 times** - verify different tip combinations

#### Test C: Single Domain - Moderate Severity (Anxiety)
1. Navigate to: `http://localhost:3000/student/checkin?emotion=anxious`
2. Answer triage questions to trigger anxiety escalation
3. Answer clinical questions with moderate scores (e.g., "More than half the days")
4. **Expected Result:**
   - Headline: "Your mind has been working overtime..."
   - 3 tips from anxiety moderate-severity pool
   - Tips include: writing worries, 5-4-3-2-1 grounding, focusing on one thing
5. **Repeat 3 times** - verify different tip combinations

#### Test D: Single Domain - High Severity (Stress)
1. Navigate to: `http://localhost:3000/student/checkin?emotion=stressed`
2. Answer triage questions to trigger stress escalation
3. Answer clinical questions with high scores (e.g., "Very often", "Nearly every day")
4. **Expected Result:**
   - Headline: "You've been under intense pressure..."
   - 3 tips from stress high-severity pool
   - Tips include: asking for help, counsellor support, permission to be imperfect
5. **Repeat 3 times** - verify different tip combinations

#### Test E: Multi-Domain (Stress + Anxiety)
1. Navigate to: `http://localhost:3000/student/checkin?emotion=overwhelmed`
2. Answer triage questions to trigger multiple escalations
3. Answer clinical questions with high stress AND moderate anxiety scores
4. **Expected Result:**
   - Headline: "You've been under intense pressure..." (stress is dominant)
   - 2 tips from stress high-severity + 1 tip from anxiety moderate-severity
5. **Repeat 3 times** - verify different tip combinations

### 3. What to Verify

For each test:
- ✅ Headline matches severity level
- ✅ Tips are appropriate for severity (gentle for low, urgent for high)
- ✅ Tips vary across repeated sessions
- ✅ No duplicate tips within a single session
- ✅ All tips have emoji, text, and source
- ✅ Tips are clinically appropriate and actionable

### 4. Expected Tip Counts by Domain

| Domain | Low Severity | Moderate Severity | High Severity | Total |
|--------|--------------|-------------------|---------------|-------|
| Depression | 3 | 3 | 3 | 9 |
| Anxiety | 3 | 3 | 3 | 9 |
| Stress | 3 | 3 | 3 | 9 |
| Sleep | 3 | 3 | 3 | 9 |
| Burnout | 3 | 3 | 3 | 9 |
| Loneliness | 3 | 3 | 3 | 9 |
| Substance | 3 | 3 | 3 | 9 |
| General | 6 (any severity) | - | - | 6 |
| **TOTAL** | - | - | - | **81** |

### 5. Severity Calculation Reference

| Instrument | Max Score | Low (<40%) | Moderate (40-69%) | High (≥70%) |
|------------|-----------|------------|-------------------|-------------|
| PHQ-9 (Depression) | 27 | 0-10 | 11-18 | 19-27 |
| GAD-7 (Anxiety) | 21 | 0-8 | 9-14 | 15-21 |
| PSS-10 (Stress) | 40 | 0-15 | 16-27 | 28-40 |
| ISI (Sleep) | 28 | 0-11 | 12-19 | 20-28 |
| Maslach (Burnout) | 132 | 0-52 | 53-91 | 92-132 |
| UCLA (Loneliness) | 80 | 0-31 | 32-55 | 56-80 |

### 6. Sample Tip Examples by Severity

#### Depression Tips
- **Low:** "Even a 10-minute walk outside can shift your mood..."
- **Moderate:** "Reach out to one person today — a friend, a family member, anyone..."
- **High:** "You don't have to go through this alone. Talking to a counsellor can genuinely help."

#### Anxiety Tips
- **Low:** "Try box breathing: breathe in for 4 counts, hold for 4, out for 4, hold for 4..."
- **Moderate:** "Try 5-4-3-2-1 grounding: Name 5 things you see, 4 you can touch..."
- **High:** "If you're having a panic attack, remember: it will pass. Focus on slow breathing..."

#### Stress Tips
- **Low:** "Take one 5-minute break today where you do absolutely nothing..."
- **Moderate:** "Try progressive muscle relaxation: tense and release each muscle group..."
- **High:** "You're carrying too much. It's okay to ask for help, take a break, or say no..."

### 7. Browser Console Verification

Open browser console (F12) and check for:
- No JavaScript errors
- No React warnings
- Smooth transitions between phases

### 8. Mobile Testing

Test on mobile viewport (Chrome DevTools → Toggle Device Toolbar):
- Tips display correctly on small screens
- Text is readable
- Emojis render properly
- Buttons are tappable

## Success Criteria

✅ **Variety:** Different tips shown across multiple sessions
✅ **Relevance:** Tips match severity level (gentle → urgent)
✅ **Multi-domain:** Mixed tips when multiple concerns present
✅ **Clinical validity:** All tips are evidence-based and actionable
✅ **User experience:** Smooth, responsive, no errors
✅ **Accessibility:** Screen readers can read tips properly

## Troubleshooting

### Issue: Same tips shown every time
**Cause:** Randomization not working
**Fix:** Check `shuffleArray()` function in `insights.ts`

### Issue: Wrong severity tips shown
**Cause:** Severity calculation incorrect
**Fix:** Check `calculateSeverity()` thresholds (40%, 70%)

### Issue: No tips shown
**Cause:** Scores not passed to component
**Fix:** Verify `scores={context.currentScores}` in `page.tsx`

### Issue: TypeScript errors
**Cause:** Type mismatch
**Fix:** Verify `WellnessTip` interface includes `severity` field

## Next Steps After Testing

1. **Gather user feedback** on tip relevance and helpfulness
2. **Track tip effectiveness** (which tips lead to Saathi engagement?)
3. **Add more tips** to expand variety (target: 12-15 per domain)
4. **Implement tip rating** (thumbs up/down for each tip)
5. **Add temporal tracking** (avoid showing same tips within 7 days)

## Documentation

- Full implementation details: `WELLNESS_TIPS_DYNAMIC.md`
- Code changes: `src/lib/aria/insights.ts`, `src/app/student/checkin/WellnessSummary.tsx`, `src/app/student/checkin/page.tsx`
- Source techniques: `techniques.md`
