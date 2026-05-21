# ARIA Questions Loading Issue — Fix Summary

## Issue Description
The ARIA assessment triage questions were not loading properly, causing the check-in flow to fail with the error:
> "Could not load questions. Please run migration 012 in Supabase to allow anonymous access."

## Root Causes Identified

### 1. **RLS Policy Blocking Anonymous Access**
The `questions` table had a restrictive RLS policy:
```sql
CREATE POLICY "Authenticated users can read questions" 
  ON questions FOR SELECT 
  USING (auth.uid() IS NOT NULL);
```

This blocked **anonymous/guest users** from accessing triage questions, which is needed for the public check-in flow.

### 2. **Triage Questions Not Seeded**
The triage questions may not have been properly seeded in the database, or the `is_triage` flag was not set correctly.

### 3. **Options Format Mismatch**
Some seed files used `"text"` field in options, but the frontend expects `"label"`:
- **Database**: `{"text": "Great — feeling motivated", ...}`
- **Frontend expects**: `{"label": "Great — feeling motivated", ...}`

## Solution Applied

### Fix 1: Update RLS Policy ✓
**File**: `FIX_ARIA_QUESTIONS_LOADING.sql`

Replaced the restrictive policy with a permissive one:
```sql
DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;

CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);
```

This allows both authenticated and anonymous users to read questions (safe because questions are public assessment items).

### Fix 2: Reseed Triage Questions ✓
**File**: `FIX_ARIA_QUESTIONS_LOADING.sql`

Cleared and reseeded 5 triage questions covering all 6 domains:
1. **T1**: Energy/Mood → depression, burnout
2. **T2**: Sleep → sleep, depression, anxiety
3. **T3**: Stress/Overwhelm → stress, anxiety, burnout
4. **T4**: Social Connection → loneliness, depression
5. **T5**: Anxiety/Worry → anxiety, stress

Each question has:
- Proper `is_triage = TRUE` flag
- Options with `"label"` field (not `"text"`)
- Correct `maps_to` structure for domain signal weighting

### Fix 3: Normalize Options Format ✓
**File**: `FIX_ARIA_QUESTIONS_LOADING.sql`

Added a migration to convert any remaining `"text"` fields to `"label"`:
```sql
UPDATE questions
SET options = (
  SELECT jsonb_agg(
    jsonb_set(elem - 'text', '{label}', elem->'text')
  )
  FROM jsonb_array_elements(options) elem
)
WHERE options::text LIKE '%"text":%';
```

## How to Apply the Fix

### Option 1: Run the Complete Fix Script (Recommended)
```bash
# In Supabase SQL Editor, run:
mindsafe-india/FIX_ARIA_QUESTIONS_LOADING.sql
```

This script:
1. Updates the RLS policy
2. Reseeds triage questions
3. Fixes options format
4. Verifies the fix

### Option 2: Run Individual Migrations
```bash
# 1. Allow anonymous access
mindsafe-india/supabase/migrations/012_allow_anon_read_questions.sql

# 2. Seed triage questions
mindsafe-india/supabase/seed_triage_questions.sql

# 3. Fix options format
mindsafe-india/supabase/migrations/034_fix_question_options_format.sql
```

## Verification Steps

### 1. Check Triage Questions Count
```sql
SELECT COUNT(*) FROM questions WHERE is_triage = TRUE;
-- Expected: 5
```

### 2. Verify Options Format
```sql
SELECT 
  question,
  options->0->>'label' AS first_option
FROM questions
WHERE is_triage = TRUE;
-- Should show "label" field, not "text"
```

### 3. Test Anonymous Access
```sql
SET ROLE anon;
SELECT COUNT(*) FROM questions WHERE is_triage = TRUE;
RESET ROLE;
-- Should return 5 (not 0)
```

### 4. Test in Browser
1. Open the check-in page: `/student/checkin` or `/checkin` (guest mode)
2. Select an emotion tile
3. Verify that 5 triage questions load properly
4. No error message should appear

## Technical Details

### Frontend Code
**File**: `src/app/student/checkin/api.ts`

The `fetchTriageQuestions()` function:
```typescript
export async function fetchTriageQuestions() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("is_triage", true);
  
  if (error) {
    console.error("Failed to fetch triage questions:", error);
    return [];
  }
  
  // Normalize options: DB uses "text" field, component expects "label"
  const normalized = (data || []).map((q: any) => ({
    ...q,
    options: (q.options || []).map((opt: any) => ({
      ...opt,
      label: opt.label ?? opt.text ?? "",
    })),
  }));
  
  return normalized;
}
```

### Error Handling
**File**: `src/app/student/checkin/page.tsx`

```typescript
async function initTriage(userId: string | null) {
  const triageQuestions = await fetchTriageQuestions();
  
  if (!triageQuestions || triageQuestions.length === 0) {
    dispatch({ 
      type: "SET_ERROR", 
      payload: { 
        error: "Could not load questions. Please run migration 012 in Supabase to allow anonymous access." 
      } 
    });
    setLoading(false);
    return;
  }
  
  // Continue with triage initialization...
}
```

## Related Files

### Migrations
- `supabase/migrations/001_initial_schema.sql` — Initial schema with restrictive RLS
- `supabase/migrations/012_allow_anon_read_questions.sql` — Fix RLS for anonymous access
- `supabase/migrations/034_fix_question_options_format.sql` — Fix options format

### Seed Files
- `supabase/seed_triage_questions.sql` — Triage questions seed data

### Frontend
- `src/app/student/checkin/api.ts` — Question fetching logic
- `src/app/student/checkin/page.tsx` — Check-in page with error handling
- `src/lib/aria/engine.ts` — ARIA assessment engine

### Fix Scripts
- `FIX_ARIA_QUESTIONS_LOADING.sql` — Complete fix (all-in-one)
- `VERIFY_ARIA_QUESTIONS.sql` — Diagnostic queries

## Status
✅ **Issue Identified**: RLS policy blocking anonymous access + missing/malformed triage questions  
✅ **Fix Created**: Complete SQL script with RLS update, reseeding, and format normalization  
⏳ **Pending**: Apply fix to Supabase database  

## Next Steps
1. Run `FIX_ARIA_QUESTIONS_LOADING.sql` in Supabase SQL Editor
2. Verify with `VERIFY_ARIA_QUESTIONS.sql`
3. Test the check-in flow in browser (both authenticated and guest modes)
4. Confirm no errors in browser console

