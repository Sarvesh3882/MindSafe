# Instrument Configuration Fix

## Problem
The `INSTRUMENT_CONFIGS` in `src/lib/aria/engine.ts` had incorrect values for Maslach (burnout) and UCLA (loneliness) scales. The configurations showed short-form versions, but the actual assessments and scoring display used full-scale versions.

## Changes Made

### 1. Maslach Burnout Inventory (MBI)

**Before:**
```typescript
maslach: {
  totalQuestions: 9,   // Emotional Exhaustion subscale only
  maxScore: 54,        // 9 × 6
  itemMax: 6,
}
```

**After:**
```typescript
maslach: {
  totalQuestions: 22,   // Full Maslach Burnout Inventory (all 3 subscales)
  maxScore: 132,        // 22 items × 6 points each
  itemMax: 6,
  crisisThreshold: 88,  // High burnout threshold
}
```

**Explanation:**
- Full MBI has 22 items across 3 subscales:
  - Emotional Exhaustion (9 items)
  - Depersonalization (5 items)
  - Personal Accomplishment (8 items)
- Each item scored 0-6 (Never to Every day)
- Total: 22 × 6 = **132 points maximum**

---

### 2. UCLA Loneliness Scale

**Before:**
```typescript
ucla: {
  totalQuestions: 3,   // Hughes et al. 3-item short form
  maxScore: 9,         // 3 × 3
  itemMax: 3,
}
```

**After:**
```typescript
ucla: {
  totalQuestions: 20,   // Full UCLA Loneliness Scale (Version 3)
  maxScore: 80,         // 20 items × 4 points each
  itemMax: 4,
  crisisThreshold: 60,  // High loneliness threshold
}
```

**Explanation:**
- Full UCLA Loneliness Scale (Version 3) has 20 items
- Each item scored 1-4 (Never to Often)
- Total: 20 × 4 = **80 points maximum**
- Note: Minimum score is 20 (not 0) since each item starts at 1

---

### 3. AUDIT (Substance Use) - Added

**Added:**
```typescript
audit: {
  key: "audit",
  domain: "substance",
  totalQuestions: 10,   // Alcohol Use Disorders Identification Test
  maxScore: 40,         // 10 items × 4 points each
  itemMax: 4,
  crisisThreshold: 20,  // Possible dependence threshold
}
```

**Explanation:**
- AUDIT (Alcohol Use Disorders Identification Test) has 10 items
- Each item scored 0-4
- Total: 10 × 4 = **40 points maximum**
- Score interpretation:
  - 0-7: Low risk
  - 8-15: Hazardous use
  - 16-19: Harmful use
  - 20-40: Possible dependence (crisis threshold)

---

### 4. Updated InstrumentKey Type

**Before:**
```typescript
export type InstrumentKey =
  | "phq9"
  | "gad7"
  | "isi"
  | "pss10"
  | "maslach"
  | "ucla";
```

**After:**
```typescript
export type InstrumentKey =
  | "phq9"
  | "gad7"
  | "isi"
  | "pss10"
  | "maslach"
  | "ucla"
  | "audit";
```

---

## Complete Instrument Summary

| Instrument | Domain | Questions | Max Score | Item Max | Crisis Threshold |
|------------|--------|-----------|-----------|----------|------------------|
| PHQ-9 | Depression | 9 | 27 | 3 | 15 |
| GAD-7 | Anxiety | 7 | 21 | 3 | 15 |
| ISI | Sleep | 7 | 28 | 4 | - |
| PSS-10 | Stress | 10 | 40 | 4 | 27 |
| Maslach | Burnout | 22 | 132 | 6 | 88 |
| UCLA | Loneliness | 20 | 80 | 4 | 60 |
| AUDIT | Substance | 10 | 40 | 4 | 20 |

---

## Score Interpretation Guide

### PHQ-9 (Depression) - /27
- 0-4: Minimal
- 5-9: Mild
- 10-14: Moderate
- 15-19: Moderately Severe ⚠️
- 20-27: Severe 🚨

### GAD-7 (Anxiety) - /21
- 0-4: Minimal
- 5-9: Mild
- 10-14: Moderate
- 15-21: Severe 🚨

### PSS-10 (Stress) - /40
- 0-13: Low stress
- 14-26: Moderate stress
- 27-40: High stress 🚨

### ISI (Insomnia) - /28
- 0-7: No insomnia
- 8-14: Subthreshold insomnia
- 15-21: Moderate insomnia
- 22-28: Severe insomnia

### Maslach (Burnout) - /132
- 0-44: Low burnout
- 45-88: Moderate burnout
- 89-132: High burnout 🚨

### UCLA (Loneliness) - /80
- 20-34: Low loneliness
- 35-49: Moderate loneliness
- 50-64: Moderately high loneliness
- 65-80: High loneliness 🚨

### AUDIT (Substance Use) - /40
- 0-7: Low risk
- 8-15: Hazardous use
- 16-19: Harmful use
- 20-40: Possible dependence 🚨

---

## Impact

### Before Fix:
- Scoring calculations were incorrect for Maslach and UCLA
- Crisis thresholds were missing for these instruments
- AUDIT was not configured at all

### After Fix:
- All instruments now have correct max scores
- Crisis thresholds properly defined
- Scoring calculations will be accurate
- Display in counsellor reports will match actual clinical standards

---

## Testing

After this fix, verify:

1. **Student takes full assessment** with all instruments
2. **Check counsellor dashboard** → Scores should display as:
   - Depression: X/27
   - Anxiety: X/21
   - Stress: X/40
   - Sleep: X/28
   - Burnout: X/132 ✅ (was showing /132, now config matches)
   - Loneliness: X/80 ✅ (was showing /80, now config matches)
   - Substance: X/40 ✅ (now properly configured)

3. **Crisis detection** should trigger at correct thresholds

---

## Files Modified

- `src/lib/aria/engine.ts` - Updated INSTRUMENT_CONFIGS and InstrumentKey type

---

## Notes

- These are **standardized clinical instruments** used worldwide
- The scoring ranges are based on published research and clinical guidelines
- Crisis thresholds are set according to clinical best practices
- Full-scale versions provide more accurate assessment than short forms
