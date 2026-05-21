# 🚀 Quick Fix: Counsellor Visibility Issue

## Problem
Students can't see counsellors when trying to book sessions.

## Solution (2 minutes)

### 1️⃣ Open Supabase SQL Editor
Go to your Supabase project → SQL Editor

### 2️⃣ Run This Migration
Copy and paste the entire contents of:
```
supabase/migrations/014_fix_counsellor_booking_visibility.sql
```

Click "Run" ▶️

### 3️⃣ Verify It Worked
Run this quick check:
```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'users' 
  AND policyname = 'Students can read counsellors for booking';
```

Should return 1 row. ✅

### 4️⃣ Test
1. Log in as a student
2. Go to "Book Session"
3. You should now see available counsellors! 🎉

---

## Still Not Working?

### Check College IDs Match
```sql
SELECT 
  s.email as student,
  s.college_id as student_college,
  c.email as counsellor,
  c.college_id as counsellor_college
FROM users s, users c
WHERE s.role = 'student' AND c.role = 'counsellor';
```

**They should match!** If not:
```sql
-- Fix student's college
UPDATE users 
SET college_id = (SELECT college_id FROM users WHERE role = 'counsellor' LIMIT 1)
WHERE role = 'student';
```

### Run Full Debug
For detailed diagnostics, run:
```
DEBUG_COUNSELLOR_VISIBILITY.sql
```

---

## What This Fix Does

Adds a missing database security policy that allows students to query counsellor profiles for booking purposes.

**Before**: Students blocked from seeing counsellors (security policy missing)  
**After**: Students can see counsellors in their college ✅

---

## Need More Details?

See `COUNSELLOR_VISIBILITY_FIX_SUMMARY.md` for complete technical explanation.
