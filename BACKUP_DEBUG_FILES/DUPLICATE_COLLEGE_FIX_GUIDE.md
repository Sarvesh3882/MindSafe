# Duplicate College Fix Guide

## Problem Diagnosis

Based on the context, you have **duplicate college IDs** in your database. This happened because:
1. Test/demo data was created during development
2. Real student data was added later
3. Both test and real data exist under different college IDs
4. Your admin account was switching between these colleges

## Current Situation

You likely have:
- **College 1** (`9f1a657b-99b5-4ace-a6b8-fb01744e5509`): Real college with 3 students and actual assessment data
- **College 2** (`0ff1755f-ac93-4d95-b91d-20f42f372451`): Demo/test college with 1 demo student

Your admin account was recently switched to College 1, but there may still be confusion because:
- Multiple colleges exist in the system
- Data is split across colleges
- The dashboard might be showing wrong/incomplete data

## Solution: Consolidate All Data

We need to:
1. **Move ALL users** to the real college (the one with most data)
2. **Delete duplicate colleges**
3. **Verify** your admin sees all students and assessments

## Step-by-Step Fix

### Step 1: Check Current State
Run this SQL to see what you currently have:

```bash
# In Supabase SQL Editor, run:
CHECK_CURRENT_STATE.sql
```

This will show:
- Your admin account details
- Your current college
- Students in your college
- Total assessments
- All colleges in the system

### Step 2: Diagnose Duplicates
Run this SQL to see the full picture:

```bash
# In Supabase SQL Editor, run:
DIAGNOSE_DUPLICATE_COLLEGES.sql
```

This will show:
- All colleges in the system
- Users grouped by college
- Assessments by college
- Duplicate college names
- Recent assessments

### Step 3: Fix Duplicates
Run this SQL to consolidate everything:

```bash
# In Supabase SQL Editor, run:
FIX_DUPLICATE_COLLEGES.sql
```

This will:
1. Move ALL users to the real college (`9f1a657b-99b5-4ace-a6b8-fb01744e5509`)
2. Delete duplicate/empty colleges
3. Verify final state

### Step 4: Verify Dashboard
After running the fix:
1. **Refresh your browser** (hard refresh: Ctrl+Shift+R)
2. **Clear browser cache** if needed
3. **Check the admin dashboard** - you should now see:
   - All 3+ students
   - All their assessments
   - Correct wellness graphs
   - No "no data available" errors

## What This Fix Does

### Before Fix:
```
College A (demo):
  - Admin: codex5622@gmail.com
  - Students: 1 demo student
  - Assessments: 0 or minimal

College B (real):
  - Students: 3 real students
  - Assessments: Multiple real assessments
  - No admin access
```

### After Fix:
```
College (consolidated):
  - Admin: codex5622@gmail.com
  - Students: All students (3+)
  - Assessments: All assessments
  - Full dashboard access
```

## Expected Results

After the fix, your admin dashboard should show:
- **Total Students**: 3 or more
- **Checked In**: Number of students with assessments
- **Stable/Attention/Critical**: Correct distribution based on latest assessments
- **Campus Wellness Trend**: Graph showing assessment data over time
- **Department Breakdown**: Students grouped by department

## If You Still See Errors

If you still see errors after running the fix:
1. **Share the error message** - screenshot or copy the exact error
2. **Check browser console** - press F12 and look for errors
3. **Verify SQL ran successfully** - check Supabase SQL Editor for any errors
4. **Check server logs** - if running locally, check terminal output

## Files Created

1. `CHECK_CURRENT_STATE.sql` - Quick diagnostic
2. `DIAGNOSE_DUPLICATE_COLLEGES.sql` - Detailed analysis
3. `FIX_DUPLICATE_COLLEGES.sql` - Consolidation fix
4. `DUPLICATE_COLLEGE_FIX_GUIDE.md` - This guide

## Next Steps

1. Run `CHECK_CURRENT_STATE.sql` first
2. Share the results with me
3. Then we'll run the fix if duplicates are confirmed
