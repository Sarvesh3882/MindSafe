# Apply Prescription RLS Fix Migration

## Problem
Counsellors cannot view student prescriptions due to RLS policy issues.

## Solution
Apply migration `024_fix_prescription_rls.sql` to fix the RLS policies.

## Steps to Apply

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Go to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration**
   - Open `supabase/migrations/024_fix_prescription_rls.sql`
   - Copy the entire content
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" button
   - Wait for success message

5. **Verify**
   - Refresh your browser
   - Go to `/counsellor/prescriptions`
   - Click on a student
   - Should now load without errors!

### Option 2: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd mindsafe-india

# Apply the migration
npx supabase db push

# Or if you have supabase CLI installed globally
supabase db push
```

### Option 3: Manual SQL Execution

If you have direct database access:

```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/024_fix_prescription_rls.sql
```

## What This Migration Does

1. **Drops the old RLS policy** that was failing
2. **Creates a helper function** `counsellor_can_access_student_prescriptions()`
   - Uses `SECURITY DEFINER` to bypass RLS
   - Checks if counsellor and student are in the same college
3. **Creates a new RLS policy** using the helper function
   - Simpler and more reliable
   - Works even with RLS on users table

## After Applying

1. **Hard refresh** your browser (Ctrl+Shift+R)
2. **Test counsellor prescriptions**:
   - Go to `/counsellor/prescriptions`
   - Click on a student
   - Should load without "Failed to fetch prescriptions" error
   - Should show "No prescriptions yet" or list of prescriptions

## Troubleshooting

### If migration fails:
- Check if you have the correct database permissions
- Make sure you're connected to the right database
- Check Supabase logs for detailed error messages

### If still getting errors after migration:
- Check browser console for specific error messages
- Check Supabase logs in dashboard
- Verify the migration was applied: Run `SELECT * FROM _supabase_migrations;`

## Verification Query

Run this in SQL Editor to verify the migration was applied:

```sql
-- Check if the helper function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'counsellor_can_access_student_prescriptions';

-- Check if the policy exists
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'prescriptions' 
  AND policyname = 'counsellors_read_college_prescriptions';
```

Both queries should return results if the migration was successful.
