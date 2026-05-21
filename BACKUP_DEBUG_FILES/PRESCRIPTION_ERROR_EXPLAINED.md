# Prescription Error Explained

## Error Message
```
Failed to prescribe resource: duplicate key value violates unique constraint "resource_prescriptions_student_id_resource_id_key"
```

## What This Means
You're trying to prescribe the **same resource** to the **same student** twice. The database has a UNIQUE constraint that prevents duplicate prescriptions.

### Database Constraint
```sql
UNIQUE(student_id, resource_id)
```

This means:
- ✅ You CAN prescribe Resource A to Student 1
- ✅ You CAN prescribe Resource B to Student 1
- ✅ You CAN prescribe Resource A to Student 2
- ❌ You CANNOT prescribe Resource A to Student 1 again (duplicate!)

---

## Solution

### Code Fix (Already Applied)
I've updated the code to:
1. Check if the resource is already prescribed before attempting to insert
2. Show a friendly error message: "This resource is already prescribed to this student"
3. Handle the duplicate error gracefully

### How It Works Now
```typescript
// Check if already prescribed
const { data: existing } = await supabase
  .from("resource_prescriptions")
  .select("id")
  .eq("student_id", studentId)
  .eq("resource_id", resourceId)
  .single();

if (existing) {
  alert("This resource is already prescribed to this student");
  return;
}
```

---

## Still Need RLS Migrations

Even though the current error is about duplicates, you still need to apply the RLS migrations for the features to work properly:

### Migration 030: Allow Counsellor Create Resources
**File**: `supabase/migrations/030_allow_counsellor_create_resources.sql`
- Allows counsellors to create resources
- Required for "Create Resource" button to work

### Migration 031: Fix Resource Prescription RLS
**File**: `supabase/migrations/031_fix_resource_prescription_rls.sql`
- Allows counsellors to prescribe resources
- Simplified version (removed `get_user_role()` dependency)
- Required for "Prescribe to Student" button to work

---

## How to Test

### Test 1: Prescribe New Resource
1. Login as counsellor
2. Create a resource (or use existing)
3. Click "Prescribe to Student"
4. Select a student
5. ✅ Should succeed: "Resource prescribed successfully!"

### Test 2: Try to Prescribe Same Resource Again
1. Click "Prescribe to Student" on the same resource
2. Select the same student
3. ✅ Should show: "This resource is already prescribed to this student"

### Test 3: Prescribe to Different Student
1. Click "Prescribe to Student" on the same resource
2. Select a DIFFERENT student
3. ✅ Should succeed: "Resource prescribed successfully!"

---

## Why the UNIQUE Constraint Exists

The UNIQUE constraint prevents:
- ❌ Duplicate prescriptions cluttering the student's resources page
- ❌ Counsellors accidentally prescribing the same resource multiple times
- ❌ Database bloat from duplicate records

It ensures:
- ✅ Each student sees each resource only once
- ✅ Clean, organized resources list
- ✅ Better user experience

---

## Summary

**Current Error**: Trying to prescribe same resource to same student twice
**Fix Applied**: Code now checks for duplicates before inserting
**Still Needed**: Apply RLS migrations 030 and 031
**Result**: Clean prescription system with duplicate prevention

---

**Status**: Code fix applied ✅
**Next Step**: Apply RLS migrations in Supabase
