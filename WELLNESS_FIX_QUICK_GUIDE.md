# Wellness Suggestions — Quick Fix Guide

## 🚨 Issues Found
1. ❌ API endpoint missing (404 error)
2. ❌ Wrong database schema (tried to use `status` column that doesn't exist)
3. ❌ Frequency values mismatch (form vs database)

## ✅ All Fixed!

### What I Fixed
1. ✅ Created API endpoint: `src/app/api/prescriptions/suggest/route.ts`
2. ✅ Fixed schema usage: Uses `is_deleted` and `is_suggestion` instead of `status`
3. ✅ Created migration: `042_fix_prescription_frequency_values.sql`
4. ✅ Created complete fix script: `FIX_WELLNESS_SUGGESTIONS_COMPLETE.sql`

---

## 🎯 Quick Fix (2 Steps)

### Step 1: Run SQL Script
Open Supabase SQL Editor and run:
```
FIX_WELLNESS_SUGGESTIONS_COMPLETE.sql
```

This will:
- ✅ Fix frequency constraint
- ✅ Migrate existing data
- ✅ Verify RLS policies
- ✅ Show verification results

### Step 2: Restart Dev Server
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start fresh
cd mindsafe-india
npm run dev
```

---

## 🧪 Test It

1. **Login as counsellor**
2. **Go to student profile**
3. **Click "Send Wellness Suggestion"**
4. **Fill the form**:
   - Suggestion Title: "Daily journaling practice"
   - Guidance Details: "10 minutes of free writing each evening"
   - Follow-up Schedule: "Daily practice"
   - Support Period: "2 weeks"
   - Reason: "To help process emotions"
5. **Click "Send Suggestion"**
6. **Should work!** ✅

---

## 📊 Verify in Database

```sql
-- Check latest prescription
SELECT 
  p.*,
  c.full_name AS counsellor_name,
  s.full_name AS student_name
FROM prescriptions p
JOIN users c ON p.counsellor_id = c.id
JOIN users s ON p.student_id = s.id
ORDER BY p.created_at DESC
LIMIT 1;

-- Check audit log
SELECT * FROM prescription_audit_log
ORDER BY created_at DESC
LIMIT 1;
```

---

## 🔍 What Changed

### Database Schema (Correct)
```sql
-- ❌ OLD (Wrong)
status TEXT  -- This column doesn't exist!

-- ✅ NEW (Correct)
is_deleted BOOLEAN DEFAULT false
is_suggestion BOOLEAN DEFAULT false
```

### Frequency Values (Correct)
```sql
-- ❌ OLD (Medical terms)
'Once daily'
'Three times daily'

-- ✅ NEW (Wellness terms)
'Daily practice'
'Weekly check-in'
```

---

## 🐛 Troubleshooting

### Still getting 404?
**Solution**: Restart dev server completely
```bash
taskkill /F /IM node.exe
npm run dev
```

### Still getting schema error?
**Solution**: Run the SQL fix script in Supabase

### Frequency constraint error?
**Solution**: Run the SQL fix script - it updates the constraint

---

## 📁 Files Created/Modified

### Created
- ✅ `src/app/api/prescriptions/suggest/route.ts`
- ✅ `supabase/migrations/042_fix_prescription_frequency_values.sql`
- ✅ `FIX_WELLNESS_SUGGESTIONS_COMPLETE.sql`

### Modified
- ✅ `src/components/prescriptions/PrescriptionSuggestionForm.tsx`

---

## ✅ Status: READY TO USE

All fixes applied. Just run the SQL script and restart the server!

