# Counsellor Visibility Issue - Complete Analysis & Fix

## 🔍 Problem Summary

**Issue**: Students cannot see available counsellors in the booking system, even though:
- Counsellors are registered under the same college
- Both student and counsellor have matching `college_id`
- The booking page code looks correct

**Symptoms**:
- Student sees "No counsellors available at your college yet" message
- Counsellor dashboard shows students correctly
- Console shows counsellors query returning 0 results

## 🎯 Root Cause

**Missing RLS (Row Level Security) Policy**

The database has RLS enabled on the `users` table, but the original schema only included these policies:

1. ✅ Users can read their own profile
2. ✅ Counsellors can read students in their college
3. ✅ Admins can read users in their college
4. ❌ **MISSING**: Students can read counsellors (needed for booking!)

Without this policy, when a student tries to query counsellors, PostgreSQL blocks the query due to RLS, returning 0 results.

## 🔧 The Fix

### Migration 014: `fix_counsellor_booking_visibility.sql`

This migration:
1. **Drops all existing user read policies** (clean slate)
2. **Creates comprehensive new policies**:
   - Users can read own profile
   - **Students can read counsellors for booking** ⭐ (THE KEY FIX)
   - Counsellors can read students
   - Counsellors can read other counsellors
   - Admins can read users in their college

### Key Policy Logic

```sql
CREATE POLICY "Students can read counsellors for booking" 
  ON users FOR SELECT
  USING (
    get_user_role() = 'student'           -- Current user is a student
    AND role = 'counsellor'                -- Target row is a counsellor
    AND (
      college_id = get_user_college()      -- Same college_id
      OR (college_id IS NULL AND get_user_college() IS NULL)  -- Both NULL (dev mode)
    )
  );
```

## 📋 How to Apply the Fix

### Step 1: Apply Migration
1. Open Supabase SQL Editor
2. Copy contents of `supabase/migrations/014_fix_counsellor_booking_visibility.sql`
3. Paste and execute

### Step 2: Verify Policies
Run this query:
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

Expected output should include:
- `Students can read counsellors for booking`
- `Counsellors can read students`
- `Users can read own profile`
- etc.

### Step 3: Test Booking System
1. Log in as a student
2. Navigate to "Book Session"
3. Should now see available counsellors

## 🐛 Debugging Tools

### Debug Script 1: `DEBUG_COUNSELLOR_VISIBILITY.sql`
Comprehensive diagnostic script that checks:
- All users and their college assignments
- College matching between students and counsellors
- RLS policies
- Helper functions
- NULL college_id issues

### Debug Script 2: `DEBUG_BOOKING_ISSUE.sql`
Simpler script focusing on:
- User-college relationships
- College matching status
- Basic data integrity

## 🔍 Common Issues & Solutions

### Issue 1: Still No Counsellors After Migration

**Possible Causes**:
1. Migration not applied correctly
2. College IDs don't match
3. Helper functions not working

**Solution**:
```sql
-- Check if student and counsellor have matching college_id
SELECT 
  s.email as student,
  s.college_id as student_college,
  c.email as counsellor,
  c.college_id as counsellor_college,
  CASE 
    WHEN s.college_id = c.college_id THEN '✅ MATCH'
    ELSE '❌ NO MATCH'
  END as status
FROM users s, users c
WHERE s.role = 'student' AND c.role = 'counsellor';
```

If they don't match, update one:
```sql
-- Update student's college
UPDATE users 
SET college_id = 'COUNSELLOR_COLLEGE_ID_HERE'
WHERE role = 'student' AND email = 'student@example.com';
```

### Issue 2: Both Have NULL college_id

**This is actually OK for development!** The policy handles this case:
```sql
OR (college_id IS NULL AND get_user_college() IS NULL)
```

If both student and counsellor have NULL college_id, they should still see each other.

**If it's still not working**, check if the policy was applied:
```sql
SELECT * FROM pg_policies WHERE policyname = 'Students can read counsellors for booking';
```

### Issue 3: Console Errors

Check browser console for errors like:
- `Failed to fetch counsellors` - Network/API issue
- `Permission denied` - RLS policy issue
- `No rows returned` - Data matching issue

## 📊 Understanding the Booking Page Code

The booking page (`src/app/student/sessions/book/page.tsx`) does this:

```typescript
// 1. Get current user
const { data: { user } } = await supabase.auth.getUser();

// 2. Get student's profile (including college_id)
const { data: profile } = await supabase
  .from("users")
  .select("college_id, role")
  .eq("id", user.id)
  .single();

// 3. Query counsellors with same college_id
let counsellorQuery = supabase
  .from("users")
  .select("id, full_name, email, college_id")
  .eq("role", "counsellor");

// Only filter by college if student has one
if (profile?.college_id) {
  counsellorQuery = counsellorQuery.eq("college_id", profile.college_id);
}

const { data } = await counsellorQuery;
```

**This code is correct!** The issue was purely the missing RLS policy.

## 🎓 Understanding RLS (Row Level Security)

### What is RLS?
RLS is a PostgreSQL feature that restricts which rows users can see/modify based on policies. It's like having WHERE clauses automatically added to every query.

### How Supabase Uses RLS
When you query via Supabase client:
1. Supabase identifies the authenticated user
2. PostgreSQL checks RLS policies for that user
3. Only rows matching the policy are returned

### Why This Matters
Even if your application code is correct, if RLS policies don't allow the query, you get 0 results. This is a **security feature**, not a bug!

## ✅ Verification Checklist

After applying the fix:

- [ ] Migration 014 applied successfully
- [ ] RLS policies visible in `pg_policies` table
- [ ] Student can see counsellors in booking page
- [ ] Counsellor can see students in dashboard
- [ ] No console errors in browser
- [ ] Booking flow works end-to-end
- [ ] Sessions are created successfully

## 🚀 Next Steps

Once counsellor visibility is fixed, you can proceed with:
1. ✅ Testing the complete booking flow
2. ✅ Implementing video meeting links
3. ✅ Building the prescription/treatment plan system
4. ✅ Adding messaging between students and counsellors

## 📝 Technical Notes

### Helper Functions
The RLS policies use these helper functions:

```sql
-- Returns current user's role
CREATE FUNCTION get_user_role() RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Returns current user's college_id
CREATE FUNCTION get_user_college() RETURNS UUID AS $$
  SELECT college_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;
```

These are defined in `001_initial_schema.sql` and should already exist.

### Why SECURITY DEFINER?
The `SECURITY DEFINER` flag allows these functions to bypass RLS when querying the users table. Without it, we'd have a chicken-and-egg problem: the policy needs to check the user's role, but RLS would block reading the user's role!

## 🔗 Related Files

- **Migration**: `supabase/migrations/014_fix_counsellor_booking_visibility.sql`
- **Debug Scripts**: 
  - `DEBUG_COUNSELLOR_VISIBILITY.sql`
  - `DEBUG_BOOKING_ISSUE.sql`
- **Booking Page**: `src/app/student/sessions/book/page.tsx`
- **Counsellor Dashboard**: `src/app/counsellor/page.tsx`
- **Instructions**: `APPLY_MIGRATION_014.md`

---

**Last Updated**: May 15, 2026
**Status**: Ready to apply
**Priority**: High (blocks booking functionality)
