# ARIA 2.0 - Quick Start Guide

## Step-by-Step Database Setup

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your MindSafe India project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

---

### Step 2: Run Migration 009 (Questions Table)

1. Open the file: `mindsafe-india/supabase/migrations/009_aria_questions_extensions.sql`
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

**What this does:** Adds columns to the `questions` table for instrument tracking, question ordering, reverse scoring, triage flags, and camouflage flags.

---

### Step 3: Run Migration 010 (Assessments Table)

1. Open the file: `mindsafe-india/supabase/migrations/010_aria_assessments_extensions.sql`
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click **Run**
5. You should see: "Success. No rows returned"

**What this does:** Adds columns to the `assessments` table for triage results, signals, counsellor reports, consistency flags, and session tracking.

---

### Step 4: Seed All Questions (Run Each File)

Run each seed script **one by one** in the Supabase SQL Editor. For each file:
1. Open the file
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click **Run**
5. You should see verification results at the end

**Run in this order:**

1. `seed_triage_questions.sql` (3 questions)
2. `seed_phq9_questions.sql` (9 questions - Depression)
3. `seed_gad7_questions.sql` (7 questions - Anxiety)
4. `seed_isi_questions.sql` (7 questions - Sleep/Insomnia)
5. `seed_pss10_questions.sql` (10 questions - Stress, 4 reverse-scored)
6. `seed_maslach_questions.sql` (9 questions - Burnout)
7. `seed_ucla_questions.sql` (3 questions - Loneliness)
8. `seed_camouflage_questions.sql` (8 questions)

**Total: 56 questions**

> **Note:** The `run_all_seeds.sql` file uses psql-specific commands (`\echo`, `\i`) that don't work in Supabase SQL Editor. Use the individual files instead.

---

### Step 5: Verify Everything Worked

Run this verification query in the SQL Editor:

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

**Expected output:**
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

**Total should be 56 questions.**

---

### Step 6: Test the Check-In Flow

1. Start your Next.js dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/student/checkin`
3. You should see the first triage question
4. Answer all 3 triage questions
5. If you answer with high stress/low mood, you'll see clinical assessment questions
6. Complete the flow and see the wellness summary

---

## Troubleshooting

### "Column already exists" error
This means the migration was already run. You can skip it or run the rollback first:

```sql
-- Rollback questions table
ALTER TABLE questions
  DROP COLUMN IF EXISTS instrument,
  DROP COLUMN IF EXISTS question_number,
  DROP COLUMN IF EXISTS reverse_scored,
  DROP COLUMN IF EXISTS is_triage,
  DROP COLUMN IF EXISTS is_camouflage;

-- Rollback assessments table
ALTER TABLE assessments
  DROP COLUMN IF EXISTS triage_result,
  DROP COLUMN IF EXISTS triage_signal,
  DROP COLUMN IF EXISTS instruments_used,
  DROP COLUMN IF EXISTS counsellor_report,
  DROP COLUMN IF EXISTS consistency_flags,
  DROP COLUMN IF EXISTS camouflage_responses,
  DROP COLUMN IF EXISTS context_frame_id,
  DROP COLUMN IF EXISTS session_duration_seconds;
```

Then re-run the migrations.

### "Questions already exist" error
If you've already seeded questions, delete them first:

```sql
DELETE FROM questions WHERE 
  is_triage = TRUE OR 
  is_camouflage = TRUE OR 
  instrument IS NOT NULL;
```

Then re-run the seed script.

### Zero questions after seeding
Check if the seed script ran successfully. Look for any error messages in the SQL Editor output.

---

## That's It!

Once you see 56 questions in the verification query, ARIA 2.0 is ready to use.

The UI is already implemented and will automatically:
- Fetch triage questions
- Compute triage signals
- Select appropriate clinical instruments
- Mix questions to prevent pattern recognition
- Detect crisis thresholds
- Show wellness tips
- Save assessments to the database

No additional code changes needed! 🎉
