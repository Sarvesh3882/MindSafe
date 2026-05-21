# Apply Migration 013: Add Counsellor Review Tracking

## Problem
When a student gets a critical assessment and then takes another test with stable scores, the critical assessment gets hidden. The counsellor dashboard only shows the "latest" assessment, which could be stable, causing critical cases to be missed.

## Solution
Add a `counsellor_reviewed` flag to assessments. Critical assessments stay visible in the counsellor dashboard until a counsellor explicitly reviews them.

## Steps

1. **Open Supabase Dashboard** → Go to SQL Editor
2. **Copy and paste** the contents of `supabase/migrations/013_add_counsellor_review_flag.sql`
3. **Run the migration**
4. **Restart your Next.js dev server** (if running)

## What This Does

### Database Changes
- Adds `counsellor_reviewed` boolean flag (default: false)
- Adds `reviewed_by` UUID to track which counsellor reviewed
- Adds `reviewed_at` timestamp for audit trail
- Creates index for fast queries on unreviewed critical assessments
- Adds helper function `get_student_display_risk()` for smart risk display

### Application Logic Changes
- Counsellor dashboard now checks for unreviewed critical assessments
- If a student has ANY unreviewed critical assessment in last 7 days, they show as "critical"
- Once counsellor reviews, student's risk level updates to their latest assessment
- Critical students can't "disappear" by taking a stable assessment

## Example Scenario

### Before Migration
1. Day 1: Student gets **critical** score
2. Day 2: Student gets **stable** score
3. Counsellor dashboard shows: **Stable** ❌ (critical case hidden!)

### After Migration
1. Day 1: Student gets **critical** score (counsellor_reviewed = false)
2. Day 2: Student gets **stable** score
3. Counsellor dashboard shows: **Critical** ✅ (unreviewed critical takes priority)
4. Counsellor reviews student profile, marks as reviewed
5. Counsellor dashboard now shows: **Stable** ✅ (latest assessment)

## UI Changes Needed (Future Work)

To complete this feature, you'll need to add:

1. **"Mark as Reviewed" button** in student profile page
2. **Visual indicator** showing "Unreviewed Critical" vs "Latest: Stable"
3. **Review history** showing when counsellor reviewed

Example UI:
```
┌─────────────────────────────────────────┐
│ Arjun Sharma                            │
│ ⚠️ Unreviewed Critical Assessment       │
│ Latest: Stable (May 16, 2026)           │
│                                         │
│ [Mark as Reviewed] button               │
└─────────────────────────────────────────┘
```

## Verification

After running the migration:

1. **Check database**:
```sql
-- Verify new columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'assessments' 
  AND column_name IN ('counsellor_reviewed', 'reviewed_by', 'reviewed_at');

-- Check function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'get_student_display_risk';
```

2. **Test the flow**:
   - Student takes critical assessment
   - Student takes stable assessment next day
   - Check counsellor dashboard → Should still show as critical
   - (Future) Mark as reviewed → Should now show as stable

## Rollback (if needed)

If you need to undo this migration:

```sql
-- Remove columns
ALTER TABLE assessments 
DROP COLUMN IF EXISTS counsellor_reviewed,
DROP COLUMN IF EXISTS reviewed_by,
DROP COLUMN IF EXISTS reviewed_at;

-- Remove function
DROP FUNCTION IF EXISTS get_student_display_risk(UUID);

-- Remove index
DROP INDEX IF EXISTS idx_assessments_unreviewed_critical;
```

## Related Files

- Migration: `supabase/migrations/013_add_counsellor_review_flag.sql`
- Dashboard logic: `src/app/counsellor/page.tsx` (updated)
- Documentation: `CRITICAL_ASSESSMENT_FIXES.md`

## Next Steps

1. Run this migration
2. Test critical assessment flow
3. Implement "Mark as Reviewed" UI in student profile page
4. Add visual indicators for unreviewed critical assessments
5. Consider adding email notifications when critical assessment occurs
