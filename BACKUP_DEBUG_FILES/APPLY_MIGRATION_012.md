# Apply Migration 012: Fix Counsellor Visibility for Booking

## Problem
Students cannot see counsellors when trying to book sessions because RLS policies are blocking the query.

## Solution
Add RLS policy to allow students to read counsellor profiles (name, email) from their college for booking purposes.

## Steps

1. **Open Supabase Dashboard** → Go to SQL Editor
2. **Copy and paste** the contents of `supabase/migrations/012_fix_counsellor_visibility.sql`
3. **Run the migration**
4. **Refresh the booking page** in the student dashboard

## What This Does
- Allows students to see counsellors from their college (for booking)
- Allows counsellors to see students from their college (for session management)
- Allows counsellors to see other counsellors from their college

## Verification
After running the migration:
1. Log in as a student
2. Go to Sessions → Book a Session
3. You should now see the counsellor(s) from your college listed

## Console Logs to Check
After refresh, you should see:
```
Student profile: { college_id: "...", role: "student" }
Counsellors found: Array(1) [{ id: "...", full_name: "...", email: "..." }]
Counsellors count: 1
```
