# Apply Migration 026 - Fix Suggestion Constraint

## Issue
The prescription suggestion form fails with "Internal Server Error" because the database constraint requires `parent_prescription_id` to be NOT NULL when `is_suggestion = true`.

This prevents creating standalone suggestions (suggestions without a parent prescription).

## Error
```
Failed to create suggestion
500 (Internal Server Error)
```

## Root Cause
In migration `014_create_prescriptions_table.sql`, there's a constraint:
```sql
CONSTRAINT valid_suggestion CHECK (
    (is_suggestion = false AND parent_prescription_id IS NULL) OR
    (is_suggestion = true AND parent_prescription_id IS NOT NULL)  -- ❌ Requires parent
)
```

This forces all suggestions to have a parent prescription, but the UI allows creating standalone suggestions.

## Solution
Migration `026_fix_suggestion_constraint.sql` updates the constraint to:
```sql
CONSTRAINT valid_suggestion CHECK (
  (is_suggestion = false AND parent_prescription_id IS NULL) OR
  (is_suggestion = true)  -- ✅ Parent is optional
)
```

## How to Apply

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/026_fix_suggestion_constraint.sql`
4. Click **Run**
5. Verify success message

### Option 2: Via Supabase CLI
```bash
cd mindsafe-india
supabase db push
```

### Option 3: Manual SQL (if CLI not available)
Run this SQL in your Supabase SQL Editor:

```sql
-- Drop the old constraint
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS valid_suggestion;

-- Add new constraint
ALTER TABLE prescriptions
ADD CONSTRAINT valid_suggestion CHECK (
  (is_suggestion = false AND parent_prescription_id IS NULL) OR
  (is_suggestion = true)
);
```

## Verification
After applying the migration, test the suggestion form:
1. Hard refresh browser (Ctrl+Shift+R)
2. Go to counsellor dashboard
3. Navigate to a student's prescriptions
4. Click "Send Suggestion"
5. Fill out the form and submit
6. Should succeed without errors ✅

## Files
- Migration: `supabase/migrations/026_fix_suggestion_constraint.sql`
- This guide: `APPLY_MIGRATION_026.md`
