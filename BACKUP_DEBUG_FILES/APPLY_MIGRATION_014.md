# Apply Migration 014: Fix Counsellor Booking Visibility

## Issue
Students cannot see available counsellors when trying to book sessions, even though counsellors are registered under the same college.

## Root Cause
Missing RLS (Row Level Security) policy that allows students to read counsellor profiles. The original schema only had policies for:
- Users reading their own profile
- Counsellors reading students
- Admins reading users

But **NO policy** for students to read counsellors (needed for the booking system).

## Solution
Migration `014_fix_counsellor_booking_visibility.sql` adds comprehensive RLS policies including:
1. Students can read counsellors in their college (for booking)
2. Counsellors can read students in their college
3. Counsellors can read other counsellors
4. Admins can read all users in their college
5. Everyone can read their own profile

## Steps to Apply

### 1. Open Supabase SQL Editor
Go to your Supabase project → SQL Editor

### 2. Run the Migration
Copy and paste the contents of:
```
supabase/migrations/014_fix_counsellor_booking_visibility.sql
```

### 3. Verify the Policies
Run this query to see all RLS policies on the users table:
```sql
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

You should see these policies:
- ✅ `Users can read own profile`
- ✅ `Students can read counsellors for booking`
- ✅ `Counsellors can read students`
- ✅ `Counsellors can read other counsellors`
- ✅ `Admins can read users in their college`

### 4. Test the Booking System
1. Log in as a student
2. Go to "Book Session" page
3. You should now see available counsellors from your college

### 5. Debug if Still Not Working
If counsellors still don't show up, run the debug script:
```
DEBUG_COUNSELLOR_VISIBILITY.sql
```

This will show:
- All users and their college assignments
- Whether student and counsellor have matching college_ids
- All RLS policies
- Helper function status

## Common Issues

### Issue: Counsellors still not visible
**Possible causes:**
1. Student and counsellor have different `college_id` values
2. One or both have `NULL` college_id
3. Migration not applied correctly

**Solution:**
Run the debug script to identify which case applies, then either:
- Update college_id values to match
- Or ensure both are NULL (for testing)

### Issue: "No counsellors available" message
This means the query is working but returning 0 results. Check:
```sql
-- Check student's college
SELECT id, email, college_id FROM users WHERE role = 'student';

-- Check counsellor's college
SELECT id, email, college_id FROM users WHERE role = 'counsellor';

-- They should match!
```

## Technical Details

### RLS Policy Logic
The policy uses these helper functions:
- `get_user_role()` - Returns the current user's role
- `get_user_college()` - Returns the current user's college_id

The policy allows students to see counsellors when:
```sql
get_user_role() = 'student'           -- User is a student
AND role = 'counsellor'                -- Target is a counsellor
AND (
  college_id = get_user_college()      -- Same college
  OR (college_id IS NULL AND get_user_college() IS NULL)  -- Both NULL (dev mode)
)
```

### Why NULL Handling?
During development/testing, users might not have college_id assigned yet. The policy allows matching when both are NULL so the system still works during testing.

## Verification Checklist
- [ ] Migration applied successfully
- [ ] RLS policies visible in pg_policies
- [ ] Student can see counsellors in booking page
- [ ] Counsellor can see students in dashboard
- [ ] No console errors in browser
- [ ] Booking flow works end-to-end
