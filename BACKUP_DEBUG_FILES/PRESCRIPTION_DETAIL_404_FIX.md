# Prescription Detail Page - 404 Error Fix

## Issue
When clicking on a prescription from the counsellor's prescription list, the page shows "404 - This page could not be found."

**URL:** `/counsellor/prescriptions/detail/[prescriptionId]`

## Root Cause
The prescription detail page was trying to fetch data from Supabase with an incorrect table join:

```typescript
// ❌ WRONG - trying to join with 'profiles' table
student:profiles!prescriptions_student_id_fkey(full_name)
```

The correct table name is `users`, not `profiles`.

## Solution Applied
Updated the Supabase query in the counsellor prescription detail page:

```typescript
// ✅ CORRECT - join with 'users' table
student:users!student_id(full_name)
```

## File Changed
- ✅ `src/app/counsellor/prescriptions/detail/[id]/page.tsx`

## Testing Instructions
1. **Hard refresh browser** (Ctrl+Shift+R)
2. Go to counsellor dashboard
3. Navigate to a student's prescriptions page
4. Click on any prescription card
5. Should now load the prescription detail page ✅

## Expected Result
- ✅ Prescription detail page loads
- ✅ Shows medication name, dosage, frequency, duration
- ✅ Shows student name
- ✅ Shows message thread
- ✅ Can send messages

## Status
- **Issue**: 404 error on prescription detail page
- **Cause**: Incorrect table join in Supabase query
- **Fix**: Updated query to use correct table name
- **Status**: ✅ Fixed
