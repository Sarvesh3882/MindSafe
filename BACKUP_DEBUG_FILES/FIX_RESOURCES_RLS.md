# Fix Resources RLS Policies

## Problem
Counsellors cannot create resources because RLS policies only allow admins to insert into the resources table.

## Error
```
Failed to create resource
Error creating resource: {}
```

## Solution
Run the migration `030_allow_counsellor_create_resources.sql` to add RLS policies that allow counsellors to create resources for their college.

## Steps to Fix

### 1. Run Migration in Supabase SQL Editor
1. Go to Supabase Dashboard → SQL Editor
2. Copy the content of `supabase/migrations/030_allow_counsellor_create_resources.sql`
3. Paste and click "Run"

### 2. Verify Policies
After running the migration, you should see these policies on the `resources` table:

```sql
-- Check policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'resources';
```

Expected policies:
- ✅ `Authenticated users can read resources` (SELECT)
- ✅ `Admins can manage all resources` (ALL)
- ✅ `Counsellors can create resources for their college` (INSERT)
- ✅ `Counsellors can update their college resources` (UPDATE)
- ✅ `Counsellors can delete their college resources` (DELETE)

### 3. Test Resource Creation
1. Login as counsellor
2. Go to Resources page
3. Click "Create Resource"
4. Fill in the form
5. Click "Create Resource"
6. Should succeed! ✅

## What the Migration Does

### Before
- Only admins could create/update/delete resources
- Counsellors could only read resources
- Result: "Failed to create resource" error

### After
- Admins can manage all resources
- Counsellors can create resources for their college
- Counsellors can update/delete their college's resources
- Students can read all resources
- Result: Counsellors can create resources successfully ✅

## Technical Details

### RLS Policies Added
1. **Counsellors can create resources for their college**
   - Allows INSERT
   - Checks that counsellor's college_id matches the resource's college_id

2. **Counsellors can update their college resources**
   - Allows UPDATE
   - Only for resources belonging to counsellor's college

3. **Counsellors can delete their college resources**
   - Allows DELETE
   - Only for resources belonging to counsellor's college

### Security
- ✅ Counsellors can only manage resources for their own college
- ✅ Counsellors cannot modify global resources (college_id = NULL)
- ✅ Counsellors cannot access other colleges' resources
- ✅ Admins retain full access to all resources

---

**Status**: Migration ready to apply
**File**: `supabase/migrations/030_allow_counsellor_create_resources.sql`
