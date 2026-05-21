# Fix Resource Prescription RLS Policies

## Problem
Counsellors cannot prescribe resources to students due to RLS policy issues on the `resource_prescriptions` table.

## Error
```
Error prescribing resource: {}
Failed to prescribe resource
```

## Root Cause
The existing RLS policy uses `FOR ALL` with only a `USING` clause, but INSERT operations require a `WITH CHECK` clause to validate the data being inserted.

### Current Policy (Broken)
```sql
CREATE POLICY "Counsellors can manage prescriptions for their students" 
  ON resource_prescriptions FOR ALL 
  USING (
    get_user_role() = 'counsellor' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = resource_prescriptions.student_id AND college_id = get_user_college()
    )
  );
```

**Problem**: `FOR ALL` includes INSERT, but INSERT needs `WITH CHECK` not just `USING`.

## Solution
Run migration `031_fix_resource_prescription_rls.sql` to create separate policies for INSERT, SELECT, and DELETE with proper `WITH CHECK` clauses.

---

## Steps to Fix

### Step 1: Run Migration in Supabase SQL Editor
1. Go to Supabase Dashboard → SQL Editor
2. Copy the content of `supabase/migrations/031_fix_resource_prescription_rls.sql`
3. Paste and click "Run"

### Step 2: Verify Policies
After running the migration, verify the policies:

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'resource_prescriptions';
```

Expected policies:
- ✅ `Students can see their prescriptions` (SELECT)
- ✅ `Counsellors can insert prescriptions for their students` (INSERT)
- ✅ `Counsellors can view prescriptions for their students` (SELECT)
- ✅ `Counsellors can delete prescriptions for their students` (DELETE)

### Step 3: Test Prescription
1. Login as counsellor
2. Go to Resources page
3. Click "Prescribe to Student" on any resource
4. Select a student
5. Should succeed! ✅

---

## What the Migration Does

### Before
- Single policy with `FOR ALL` and only `USING` clause
- INSERT operations fail because `WITH CHECK` is missing
- Result: "Failed to prescribe resource" error

### After
- Separate policies for INSERT, SELECT, DELETE
- INSERT policy has proper `WITH CHECK` clause
- All operations work correctly
- Result: Prescriptions work! ✅

---

## New Policies Explained

### 1. INSERT Policy (Prescribe Resource)
```sql
CREATE POLICY "Counsellors can insert prescriptions for their students" 
  ON resource_prescriptions 
  FOR INSERT 
  WITH CHECK (
    get_user_role() = 'counsellor' 
    AND counsellor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = resource_prescriptions.student_id 
      AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
    )
  );
```

**Checks**:
- User is a counsellor
- Counsellor ID matches authenticated user
- Student belongs to counsellor's college

### 2. SELECT Policy (View Prescriptions)
```sql
CREATE POLICY "Counsellors can view prescriptions for their students" 
  ON resource_prescriptions 
  FOR SELECT 
  USING (
    get_user_role() = 'counsellor' 
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = resource_prescriptions.student_id 
      AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
    )
  );
```

**Checks**:
- User is a counsellor
- Student belongs to counsellor's college

### 3. DELETE Policy (Remove Prescription)
```sql
CREATE POLICY "Counsellors can delete prescriptions for their students" 
  ON resource_prescriptions 
  FOR DELETE 
  USING (
    get_user_role() = 'counsellor' 
    AND counsellor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = resource_prescriptions.student_id 
      AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
    )
  );
```

**Checks**:
- User is a counsellor
- Counsellor ID matches authenticated user (can only delete own prescriptions)
- Student belongs to counsellor's college

---

## Security

### What's Protected
✅ Counsellors can only prescribe to students in their college
✅ Counsellors can only delete their own prescriptions
✅ Students can only see their own prescriptions
✅ Cross-college access is blocked

### What's Allowed
✅ Counsellors can prescribe resources to their students
✅ Counsellors can view prescriptions for their students
✅ Counsellors can delete prescriptions they created
✅ Students can view resources prescribed to them

---

## Testing Checklist

### Counsellor Tests
- [ ] Create a resource
- [ ] Prescribe resource to a student in same college
- [ ] Verify success message appears
- [ ] Try to prescribe to student in different college (should fail)
- [ ] View list of prescriptions
- [ ] Delete a prescription

### Student Tests
- [ ] Login as student
- [ ] Go to Resources page
- [ ] See prescribed resource with green border
- [ ] See counsellor name on prescribed resource
- [ ] See all 35 global resources
- [ ] Filter by category

---

## Related Migrations

You need to run BOTH migrations for full functionality:

1. **030_allow_counsellor_create_resources.sql**
   - Allows counsellors to create resources
   - Fixes: "Failed to create resource" error

2. **031_fix_resource_prescription_rls.sql** (this one)
   - Allows counsellors to prescribe resources
   - Fixes: "Failed to prescribe resource" error

---

**Status**: Migration ready to apply
**File**: `supabase/migrations/031_fix_resource_prescription_rls.sql`
**Priority**: HIGH (blocks prescription feature)
