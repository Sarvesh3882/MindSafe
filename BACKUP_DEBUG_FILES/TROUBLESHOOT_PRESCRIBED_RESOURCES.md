# Troubleshoot: Prescribed Resources Not Showing

## Problem
Student resources page shows "Recommended for You" and "Browse Resources" but NOT "Prescribed by Your Counsellor" section.

## Possible Causes

### 1. No Prescriptions Exist Yet
The most common reason - no resources have been prescribed to this student yet.

### 2. RLS Policy Blocking
The RLS policy might be preventing the student from seeing their prescriptions.

### 3. Query Error
The prescription query might be failing silently.

---

## Diagnostic Steps

### Step 1: Check if Prescriptions Exist
Run this in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM resource_prescriptions;
```

**If result is 0**: No prescriptions exist yet. You need to prescribe a resource first.
**If result > 0**: Prescriptions exist, continue to Step 2.

### Step 2: Check Prescription Details
```sql
SELECT 
  rp.id,
  s.full_name as student_name,
  c.full_name as counsellor_name,
  r.title as resource_title,
  rp.prescribed_at
FROM resource_prescriptions rp
JOIN users s ON s.id = rp.student_id
JOIN users c ON c.id = rp.counsellor_id
JOIN resources r ON r.id = rp.resource_id;
```

This shows all prescriptions with names. Check if your test student has any prescriptions.

### Step 3: Check RLS Policies
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'resource_prescriptions';
```

Expected policies:
- `Students can see their prescriptions` (SELECT)
- `Counsellors can insert prescriptions for their students` (INSERT)
- `Counsellors can view prescriptions for their students` (SELECT)
- `Counsellors can delete prescriptions for their students` (DELETE)

### Step 4: Test as Student
Login as a student and check browser console (F12) for any errors related to prescriptions.

---

## Solutions

### Solution 1: Create a Test Prescription

If no prescriptions exist, create one manually:

```sql
-- 1. Get student ID
SELECT id, full_name, email FROM users WHERE role = 'student' LIMIT 1;

-- 2. Get counsellor ID
SELECT id, full_name, email FROM users WHERE role = 'counsellor' LIMIT 1;

-- 3. Get resource ID
SELECT id, title FROM resources LIMIT 1;

-- 4. Create prescription (replace UUIDs with actual values)
INSERT INTO resource_prescriptions (student_id, counsellor_id, resource_id)
VALUES (
  'STUDENT_UUID',
  'COUNSELLOR_UUID',
  'RESOURCE_UUID'
);
```

### Solution 2: Apply RLS Migration

If RLS policies are missing or incorrect, apply migration 031:

1. Go to Supabase SQL Editor
2. Copy content of `supabase/migrations/031_fix_resource_prescription_rls.sql`
3. Paste and run
4. Verify policies were created

### Solution 3: Use Counsellor UI to Prescribe

The proper way to prescribe:

1. Login as counsellor
2. Go to Resources page
3. Create a resource (if none exist)
4. Click "Prescribe to Student"
5. Select a student
6. Should see "Resource prescribed successfully!"
7. Login as that student
8. Go to Resources page
9. Should see "Prescribed by Your Counsellor" section

---

## Expected Behavior

### When NO Prescriptions
- ✅ "Recommended for You" section (if ARIA completed)
- ✅ Category filter buttons
- ✅ "Browse Resources" section with all 35 resources
- ❌ NO "Prescribed by Your Counsellor" section (hidden when empty)

### When Prescriptions Exist
- ✅ "Recommended for You" section (if ARIA completed)
- ✅ "Prescribed by Your Counsellor" section (with green border cards)
- ✅ Category filter buttons
- ✅ "Browse Resources" section with remaining resources

---

## Visual Indicators

### Prescribed Resources Should Show:
- 🟢 Green border (`border-2 border-[#3DBE29]`)
- 👤 Counsellor name ("Prescribed by Dr. Sharma")
- 📅 Prescription date
- 📝 Resource title, description, link

### Section Header:
```
👤 Prescribed by Your Counsellor
```

---

## Quick Test Checklist

- [ ] Run `SELECT COUNT(*) FROM resource_prescriptions;`
- [ ] If 0, create a test prescription
- [ ] If > 0, check if your test student has prescriptions
- [ ] Verify RLS policies exist
- [ ] Login as student and refresh page
- [ ] Check browser console for errors
- [ ] Verify "Prescribed by Your Counsellor" section appears

---

## Common Issues

### Issue: "Already prescribed" error
**Cause**: Trying to prescribe same resource to same student twice
**Solution**: Prescribe a different resource or to a different student

### Issue: "Failed to prescribe" error
**Cause**: RLS policy blocking insert
**Solution**: Apply migration 031

### Issue: Prescribed section not showing
**Cause**: No prescriptions for this student
**Solution**: Prescribe a resource to this student

### Issue: Can't create resources
**Cause**: RLS policy blocking insert on resources table
**Solution**: Apply migration 030

---

## Files to Check

1. **Student Resources Page**: `src/app/student/resources/page.tsx`
   - Query: `resource_prescriptions` with JOIN to `users`
   - Should fetch prescriptions for current student

2. **Student Resources Client**: `src/components/student/student-resources-client.tsx`
   - Should show "Prescribed by Your Counsellor" section when `prescribedResources.length > 0`

3. **RLS Migration**: `supabase/migrations/031_fix_resource_prescription_rls.sql`
   - Creates policies for students to see their prescriptions

---

**Most Likely Cause**: No prescriptions exist yet for this student.
**Quick Fix**: Prescribe a resource using the counsellor UI.
