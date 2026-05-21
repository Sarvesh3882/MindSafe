# Fix Frequency Constraint Error — Quick Guide

## ❌ Error You're Seeing
```
ERROR: 23514: check constraint "prescriptions_frequency_check" 
of relation "prescriptions" is violated by some row
```

## 🔍 What This Means
There are existing prescriptions in your database with frequency values that don't match the constraint. The migration tried to add a new constraint before updating the data.

---

## ✅ Solution (2 Options)

### Option 1: Safe Fix Script (Recommended)
Run this in Supabase SQL Editor:
```
FIX_FREQUENCY_SAFE.sql
```

This script:
1. ✅ Shows current frequency values
2. ✅ Updates ALL rows to match new values
3. ✅ Drops old constraint
4. ✅ Adds new constraint
5. ✅ Tests the constraint
6. ✅ Shows success message

### Option 2: Manual Steps
If you want to do it step by step:

#### Step 1: Check Current Values
```sql
SELECT DISTINCT frequency, COUNT(*) 
FROM prescriptions 
GROUP BY frequency;
```

#### Step 2: Update All Rows
```sql
UPDATE prescriptions
SET frequency = CASE
  WHEN frequency = 'Once daily' THEN 'Daily practice'
  WHEN frequency = 'Three times daily' THEN 'Twice daily'
  WHEN frequency = 'Daily practice' THEN 'Daily practice'
  WHEN frequency = 'Twice daily' THEN 'Twice daily'
  WHEN frequency = 'Weekly check-in' THEN 'Weekly check-in'
  WHEN frequency = 'As needed' THEN 'As needed'
  WHEN frequency = 'Other' THEN 'Other'
  ELSE 'Other'
END;
```

#### Step 3: Drop Old Constraint
```sql
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS prescriptions_frequency_check;
```

#### Step 4: Add New Constraint
```sql
ALTER TABLE prescriptions
ADD CONSTRAINT prescriptions_frequency_check 
CHECK (frequency IN (
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other'
));
```

---

## 🧪 Verify It Worked

```sql
-- Should show only valid values
SELECT DISTINCT frequency 
FROM prescriptions;

-- Should show the new constraint
SELECT pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'prescriptions_frequency_check';
```

---

## 🎯 After Fix

1. ✅ Constraint updated
2. ✅ All existing data migrated
3. ✅ Form will work
4. ✅ Restart dev server: `npm run dev`
5. ✅ Test wellness suggestion form

---

## 📋 Valid Frequency Values (After Fix)

- ✅ "Daily practice"
- ✅ "Twice daily"
- ✅ "Weekly check-in"
- ✅ "As needed"
- ✅ "Other"

---

## 🐛 If Still Having Issues

### Check for NULL values
```sql
SELECT COUNT(*) FROM prescriptions WHERE frequency IS NULL;
```

If you have NULLs, update them:
```sql
UPDATE prescriptions SET frequency = 'Other' WHERE frequency IS NULL;
```

### Check for unexpected values
```sql
SELECT DISTINCT frequency FROM prescriptions 
WHERE frequency NOT IN (
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other'
);
```

If you find any, update them to 'Other':
```sql
UPDATE prescriptions SET frequency = 'Other' 
WHERE frequency NOT IN (
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other'
);
```

---

## ✅ Status

Run `FIX_FREQUENCY_SAFE.sql` and you're done!

