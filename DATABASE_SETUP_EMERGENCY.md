# 🚨 EMERGENCY DATABASE SETUP - Fix Your Deployed App NOW

## Problem
Your app is deployed but the database is **completely empty**. No tables, no migrations, no data.

## Solution
Run ALL migrations and seeds in Supabase SQL Editor. Follow these steps **exactly**.

---

## FASTEST METHOD: Use Supabase CLI (5 minutes)

### Step 1: Install Supabase CLI

```bash
# Install using npm (if you have Node.js)
npm install -g supabase

# OR download from: https://github.com/supabase/cli/releases
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser. Login with your Supabase account.

### Step 3: Link Your Project

```bash
cd c:\Users\codex\OneDrive\Documents\MindSafe_India\mindsafe-india
supabase link --project-ref usompgticzgsrsbyglap
```

When prompted for the database password, check your Supabase dashboard:
- Go to: https://supabase.com/dashboard/project/usompgticzgsrsbyglap/settings/database
- Copy the password you set when creating the project

### Step 4: Push ALL Migrations

```bash
supabase db push
```

This will run ALL 34 migration files automatically in the correct order.

### Step 5: Run ALL Seed Files

```bash
supabase db seed
```

Wait, this won't work because seed files aren't in the right location. Instead, run each seed file manually:

```bash
# Navigate to supabase folder
cd supabase

# Run each seed file (copy/paste this entire block)
psql $DATABASE_URL -f seed_triage_questions.sql
psql $DATABASE_URL -f seed_phq9_questions.sql
psql $DATABASE_URL -f seed_gad7_questions.sql
psql $DATABASE_URL -f seed_isi_questions.sql
psql $DATABASE_URL -f seed_pss10_questions.sql
psql $DATABASE_URL -f seed_maslach_questions.sql
psql $DATABASE_URL -f seed_ucla_questions.sql
psql $DATABASE_URL -f seed_camouflage_questions.sql
```

Actually, let me give you the MANUAL method since CLI might be complex.

---

## MANUAL METHOD: Copy/Paste in Supabase SQL Editor (30 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/usompgticzgsrsbyglap
2. Click **SQL Editor** in left sidebar
3. Click **New Query**

### Step 2: Run ALL Migrations (in order)

Copy and paste each file's contents into SQL Editor and click **Run**. Do them **one by one** in this exact order:


#### Migration Files (Run in this order):

1. ✅ `001_initial_schema.sql` - Creates all base tables (users, profiles, colleges, etc.)
2. ✅ `002_consent_and_rbac.sql` - Adds consent tracking and role-based access
3. ✅ `003_prescriptions.sql` - Creates prescription system
4. ✅ `004_escalation_alert_type.sql` - Adds alert types
5. ✅ `005_aria_clinical_seed.sql` - Seeds clinical data
6. ✅ `006_institutional_onboarding.sql` - Institutional features
7. ✅ `006_role_based_authentication.sql` - Role authentication
8. ✅ `007_fix_colleges_rls_policies.sql` - Fixes college access policies
9. ✅ `008_allow_public_aishe_validation.sql` - Public AISHE validation
10. ✅ `009_aria_questions_extensions.sql` - Extends questions table for ARIA
11. ✅ `010_aria_assessments_extensions.sql` - Extends assessments table
12. ✅ `011_chat_sessions.sql` - Chat session tracking
13. ✅ `012_allow_anon_read_questions.sql` - Anonymous question reading
14. ✅ `012_fix_counsellor_visibility.sql` - Counsellor visibility fixes
15. ✅ `013_add_counsellor_review_flag.sql` - Review flags
16. ✅ `014_create_prescriptions_table.sql` - Prescription table
17. ✅ `014_fix_counsellor_booking_visibility.sql` - Booking visibility
18. ✅ `015_create_prescription_messages_table.sql` - Prescription messages
19. ✅ `016_create_prescription_audit_log.sql` - Audit logging
20. ✅ `017_extend_sessions_for_meeting_links.sql` - Meeting links
21. ✅ `018_create_prescription_functions.sql` - Prescription functions
22. ✅ `019_prescriptions_rls_policies.sql` - Prescription RLS
23. ✅ `020_prescription_messages_rls_policies.sql` - Message RLS
24. ✅ `021_audit_log_and_sessions_rls.sql` - Audit & session RLS
25. ✅ `022_enable_realtime_sessions.sql` - Realtime for sessions
26. ✅ `023_update_meeting_expiry_15min.sql` - Meeting expiry time
27. ✅ `024_fix_prescription_rls.sql` - Prescription RLS fixes
28. ✅ `025_simplify_prescription_rls.sql` - Simplified RLS
29. ✅ `026_fix_suggestion_constraint.sql` - Constraint fixes
30. ✅ `027_create_naac_evidence_table.sql` - NAAC evidence table
31. ✅ `028_create_naac_evidence_storage_bucket.sql` - Storage bucket
32. ✅ `029_populate_resources.sql` - Populate resources
33. ✅ `030_allow_counsellor_create_resources.sql` - Counsellor resource creation
34. ✅ `031_fix_resource_prescription_rls.sql` - Resource RLS fixes

**How to run each migration:**
- Open the file in VS Code
- Select ALL content (Ctrl+A)
- Copy (Ctrl+C)
- Paste in Supabase SQL Editor
- Click **Run** or press Ctrl+Enter
- Wait for "Success" message
- Move to next file

### Step 3: Run ALL Seed Files (in order)

After ALL migrations are done, run these seed files:

1. ✅ `seed_triage_questions.sql` - 3 triage questions
2. ✅ `seed_phq9_questions.sql` - 9 depression questions
3. ✅ `seed_gad7_questions.sql` - 7 anxiety questions
4. ✅ `seed_isi_questions.sql` - 7 insomnia questions
5. ✅ `seed_pss10_questions.sql` - 10 stress questions
6. ✅ `seed_maslach_questions.sql` - 9 burnout questions
7. ✅ `seed_ucla_questions.sql` - 3 loneliness questions
8. ✅ `seed_camouflage_questions.sql` - 8 camouflage questions

**Total: 56 questions**

### Step 4: Verify Everything Worked

Run this query in SQL Editor:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see tables like: `profiles`, `colleges`, `questions`, `assessments`, `sessions`, `prescriptions`, etc.

Then verify questions:

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

**Total: 56 questions**

---

## Step 5: Test Your App

### Test Localhost:
```bash
npm run dev
```

Go to: http://localhost:3000/student/checkin

You should see the check-in page with questions loading properly.

### Test Production:

Go to your Vercel URL and test the check-in page. It should work now!

---

## Troubleshooting

### "Column already exists" error
Skip that migration, it was already run.

### "Table already exists" error
Skip that migration, it was already run.

### "Questions already exist" error
Delete existing questions first:
```sql
DELETE FROM questions;
```
Then re-run the seed files.

### Still getting 401 errors?
Check your environment variables in Vercel:
- Go to: https://vercel.com/your-project/settings/environment-variables
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- They should match your `.env.local` file

---

## Quick Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Ran all 34 migration files in order
- [ ] Ran all 8 seed files in order
- [ ] Verified 56 questions exist
- [ ] Tested localhost check-in page
- [ ] Tested production check-in page
- [ ] App is working! 🎉

---

## Need Help?

If you get stuck, share:
1. Which migration/seed file you're on
2. The exact error message
3. Screenshot of the SQL Editor output

I'll help you fix it immediately!
