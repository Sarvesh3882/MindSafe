# Apply All RLS Fixes - Quick Guide

## Overview
Two RLS migrations need to be applied to fix the resources and prescription features.

---

## 🔧 Required Migrations

### 1. Fix Resource Creation (030)
**File**: `supabase/migrations/030_allow_counsellor_create_resources.sql`
**Fixes**: "Failed to create resource" error
**What it does**: Allows counsellors to create resources for their college

### 2. Fix Resource Prescription (031)
**File**: `supabase/migrations/031_fix_resource_prescription_rls.sql`
**Fixes**: "Failed to prescribe resource" error
**What it does**: Allows counsellors to prescribe resources to students

---

## 📋 Quick Apply Steps

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar

### Step 2: Run Migration 030
1. Open file: `supabase/migrations/030_allow_counsellor_create_resources.sql`
2. Copy ALL the content
3. Paste into SQL Editor
4. Click "Run"
5. Should see policy verification results

### Step 3: Run Migration 031
1. Open file: `supabase/migrations/031_fix_resource_prescription_rls.sql`
2. Copy ALL the content
3. Paste into SQL Editor
4. Click "Run"
5. Should see policy verification results

### Step 4: Verify
Run this query to verify both migrations:
```sql
-- Check resources policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('resources', 'resource_prescriptions')
ORDER BY tablename, policyname;
```

Expected output:
```
resources | Admins can manage all resources | ALL
resources | Authenticated users can read resources | SELECT
resources | Counsellors can create resources for their college | INSERT
resources | Counsellors can delete their college resources | DELETE
resources | Counsellors can update their college resources | UPDATE

resource_prescriptions | Counsellors can delete prescriptions for their students | DELETE
resource_prescriptions | Counsellors can insert prescriptions for their students | INSERT
resource_prescriptions | Counsellors can view prescriptions for their students | SELECT
resource_prescriptions | Students can see their prescriptions | SELECT
```

---

## ✅ What Gets Fixed

### After Migration 030
✅ Counsellors can create custom resources
✅ Counsellors can edit their college's resources
✅ Counsellors can delete their college's resources
✅ "Create Resource" button works

### After Migration 031
✅ Counsellors can prescribe resources to students
✅ "Prescribe to Student" button works
✅ Students see prescribed resources
✅ Prescription tracking works

---

## 🧪 Testing After Migrations

### Test as Counsellor
1. **Create Resource**
   - Go to Resources page
   - Click "Create Resource"
   - Fill in form (name, tips, link)
   - Click "Create Resource"
   - ✅ Should succeed

2. **Prescribe Resource**
   - Find a resource in your list
   - Click "Prescribe to Student"
   - Select a student
   - ✅ Should see "Resource prescribed successfully!"

### Test as Student
1. **View Resources**
   - Go to Resources page
   - ✅ Should see all 35 global resources
   - ✅ Should see prescribed resources with green border
   - ✅ Should see counsellor name on prescribed resources

---

## 🚨 Troubleshooting

### If Create Resource Still Fails
- Check that migration 030 ran successfully
- Verify counsellor has a valid college_id
- Check browser console for detailed error message

### If Prescribe Still Fails
- Check that migration 031 ran successfully
- Verify student and counsellor are in same college
- Check browser console for detailed error message

### If Policies Don't Show Up
- Refresh your Supabase dashboard
- Re-run the verification query
- Check for SQL syntax errors in migration output

---

## 📝 Summary

**Before Migrations**:
- ❌ Counsellors cannot create resources
- ❌ Counsellors cannot prescribe resources
- ❌ Students see empty resources page

**After Migrations**:
- ✅ Counsellors can create resources
- ✅ Counsellors can prescribe resources
- ✅ Students see all resources + prescribed ones
- ✅ Full resources feature working

---

## 🎯 Order Matters

Run migrations in this order:
1. **First**: 030 (create resources)
2. **Second**: 031 (prescribe resources)

You need to be able to create resources before you can prescribe them!

---

**Status**: Ready to apply
**Time**: ~2 minutes total
**Difficulty**: Easy (just copy-paste and run)
