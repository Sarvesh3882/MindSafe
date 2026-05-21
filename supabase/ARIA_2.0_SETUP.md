# ARIA 2.0 Assessment Engine - Database Setup

This document explains how to apply the ARIA 2.0 database migrations and seed the question bank.

## Prerequisites

- Access to your Supabase project dashboard OR Supabase CLI installed
- Database connection credentials

## Step 1: Apply Migrations

Apply the following migrations in order:

### Migration 009: Questions Table Extensions
File: `migrations/009_aria_questions_extensions.sql`

This adds columns to support:
- Clinical instrument tracking (PHQ-9, GAD-7, ISI, PSS-10, Maslach, UCLA)
- Question ordering within instruments
- Reverse scoring flags
- Triage and camouflage question identification

### Migration 010: Assessments Table Extensions
File: `migrations/010_aria_assessments_extensions.sql`

This adds columns to support:
- Triage result tracking
- Triage signal storage
- Instruments administered tracking
- Counsellor report storage
- Consistency flags
- Camouflage responses
- Context frame tracking
- Session duration tracking

### How to Apply Migrations

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `009_aria_questions_extensions.sql`
4. Click "Run"
5. Repeat for `010_aria_assessments_extensions.sql`

**Option B: Using Supabase CLI** (if installed)
```bash
cd mindsafe-india
supabase db push
```

**Option C: Using psql** (if you have direct database access)
```bash
psql -h <your-db-host> -U postgres -d postgres -f supabase/migrations/009_aria_questions_extensions.sql
psql -h <your-db-host> -U postgres -d postgres -f supabase/migrations/010_aria_assessments_extensions.sql
```

## Step 2: Seed Question Bank

After migrations are applied, seed the question bank with validated clinical instrument questions.

### Using Supabase Dashboard
1. Go to SQL Editor
2. Copy and paste the contents of `run_all_seeds.sql`
3. Click "Run"

This will seed:
- 3 triage questions
- 9 PHQ-9 questions (Depression)
- 7 GAD-7 questions (Anxiety)
- 7 ISI questions (Insomnia/Sleep)
- 10 PSS-10 questions (Stress, with 4 reverse-scored items)
- 9 Maslach questions (Burnout - Emotional Exhaustion subscale)
- 3 UCLA questions (Loneliness - 3-item short form)
- 8 camouflage questions

**Total: 56 questions**

### Using psql
```bash
cd mindsafe-india/supabase
psql -h <your-db-host> -U postgres -d postgres -f run_all_seeds.sql
```

## Verification

After seeding, verify the question counts:

```sql
SELECT 
  CASE 
    WHEN is_triage THEN 'Triage'
    WHEN is_camouflage THEN 'Camouflage'
    WHEN instrument IS NOT NULL THEN UPPER(instrument)
    ELSE 'Other'
  END as question_type,
  COUNT(*) as count
FROM questions
GROUP BY 
  CASE 
    WHEN is_triage THEN 'Triage'
    WHEN is_camouflage THEN 'Camouflage'
    WHEN instrument IS NOT NULL THEN UPPER(instrument)
    ELSE 'Other'
  END
ORDER BY question_type;
```

Expected output:
```
question_type | count
--------------+-------
Camouflage    |     8
GAD7          |     7
ISI           |     7
MASLACH       |     9
PHQ9          |     9
PSS10         |    10
Triage        |     3
UCLA          |     3
```

## Rollback (if needed)

To rollback the migrations:

```sql
-- Rollback assessments extensions
ALTER TABLE assessments
  DROP COLUMN IF EXISTS triage_result,
  DROP COLUMN IF EXISTS triage_signal,
  DROP COLUMN IF EXISTS instruments_used,
  DROP COLUMN IF EXISTS counsellor_report,
  DROP COLUMN IF EXISTS consistency_flags,
  DROP COLUMN IF EXISTS camouflage_responses,
  DROP COLUMN IF EXISTS context_frame_id,
  DROP COLUMN IF EXISTS session_duration_seconds;

-- Rollback questions extensions
DROP INDEX IF EXISTS idx_questions_instrument;
DROP INDEX IF EXISTS idx_questions_is_triage;
DROP INDEX IF EXISTS idx_questions_is_camouflage;

ALTER TABLE questions
  DROP COLUMN IF EXISTS instrument,
  DROP COLUMN IF EXISTS question_number,
  DROP COLUMN IF EXISTS reverse_scored,
  DROP COLUMN IF EXISTS is_triage,
  DROP COLUMN IF EXISTS is_camouflage;

-- Delete seeded questions
DELETE FROM questions WHERE is_triage = TRUE OR is_camouflage = TRUE OR instrument IS NOT NULL;
```

## Next Steps

After completing database setup:
1. Implement the ARIA engine layer (`src/lib/aria/engine.ts`)
2. Extend the insights layer (`src/lib/aria/insights.ts`)
3. Rewrite the check-in UI (`src/app/student/checkin/page.tsx`)

See the main tasks.md file for the complete implementation plan.
