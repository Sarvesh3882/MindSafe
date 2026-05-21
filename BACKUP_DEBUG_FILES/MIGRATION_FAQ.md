# Migration FAQ - Prescriptions System

## ❓ I ran migrations 014-021 multiple times. Is that a problem?

### Short Answer: **Probably NOT! You're likely fine.** ✅

### Why It's Probably Fine:

The prescription migrations (014-021) use **safe SQL patterns**:

```sql
CREATE TABLE IF NOT EXISTS prescriptions (...)
CREATE OR REPLACE FUNCTION get_unread_count(...)
DROP POLICY IF EXISTS policy_name ON table_name;
CREATE POLICY policy_name ON table_name ...
```

These patterns mean:
- ✅ **Tables** - Only created once (IF NOT EXISTS)
- ✅ **Functions** - Replaced safely (CREATE OR REPLACE)
- ✅ **Policies** - Dropped then recreated (safe)
- ✅ **Indexes** - Only created once (IF NOT EXISTS)
- ✅ **Triggers** - Replaced safely (CREATE OR REPLACE)

### What Could Go Wrong (Rare):

Only if migrations were written WITHOUT safe patterns:
- ❌ `CREATE TABLE` (without IF NOT EXISTS) → Error on 2nd run
- ❌ Duplicate policies → Multiple policies with same name
- ❌ Duplicate triggers → Multiple triggers firing

---

## 🔍 How to Check Your Database

### Step 1: Run Diagnostic Script

In Supabase SQL Editor, run:
```sql
-- Copy and paste from CHECK_MIGRATION_STATUS.sql
```

### Step 2: Look for These Results

**✅ GOOD (Everything is fine):**
```
prescriptions table: exists = true
prescription_messages table: exists = true
prescription_audit_log table: exists = true
Functions: 4 functions found
RLS Policies: 11 policies found
Triggers: 2 triggers found
Indexes: Multiple indexes found
```

**⚠️ POTENTIAL ISSUE (Needs attention):**
```
Duplicate policies: count > 1
Duplicate triggers: count > 1
Duplicate indexes: count > 1
```

---

## ✅ Most Likely Scenario: Everything is Fine

### What Happened When You Ran Migrations 2-3 Times:

**First Run:**
- ✅ Created tables
- ✅ Created functions
- ✅ Created policies
- ✅ Created indexes
- ✅ Created triggers

**Second Run:**
- ✅ Skipped table creation (already exists)
- ✅ Replaced functions (CREATE OR REPLACE)
- ✅ Dropped and recreated policies (safe)
- ✅ Skipped index creation (already exists)
- ✅ Replaced triggers (CREATE OR REPLACE)

**Third Run:**
- ✅ Same as second run - all safe operations

**Result:** Everything works perfectly! ✅

---

## 🛠️ What to Do Now

### Option 1: Verify Everything is OK (Recommended)

1. Run `CHECK_MIGRATION_STATUS.sql` in Supabase
2. Check that tables exist
3. Check that functions exist (4 total)
4. Check that policies exist (11 total)
5. If everything looks good → **You're done!** ✅

### Option 2: Start Fresh (Only if you have NO data)

If you want to be 100% sure and you have **NO prescription data yet**:

1. Run `CLEANUP_DUPLICATE_MIGRATIONS.sql` (uncomment the DROP section)
2. Re-run migrations 014-021 **ONCE**
3. Verify with `CHECK_MIGRATION_STATUS.sql`

### Option 3: Do Nothing (If everything works)

If your app works and you can:
- ✅ Create prescriptions
- ✅ View prescriptions
- ✅ Send messages
- ✅ No errors in console

Then **you're fine!** No action needed.

---

## 🎯 Quick Test

To verify everything works, try this:

### Test 1: Check Tables Exist
```sql
SELECT COUNT(*) FROM prescriptions;
SELECT COUNT(*) FROM prescription_messages;
SELECT COUNT(*) FROM prescription_audit_log;
```

**Expected:** Returns 0 (or your data count) - No errors

### Test 2: Check Functions Work
```sql
SELECT get_unread_prescription_messages_count('00000000-0000-0000-0000-000000000000'::uuid);
```

**Expected:** Returns a number (probably 0) - No errors

### Test 3: Check RLS Policies
```sql
SELECT COUNT(*) FROM pg_policies 
WHERE tablename = 'prescriptions';
```

**Expected:** Returns 5 (5 policies for prescriptions table)

### Test 4: Try Creating a Prescription (via app)

1. Go to `/counsellor/prescriptions/[studentId]`
2. Click "New Prescription"
3. Fill form and submit

**Expected:** Prescription created successfully ✅

---

## 📊 What Each Migration Does

### Migration 014: Create Prescriptions Table
- Creates `prescriptions` table
- Adds indexes
- Adds triggers
- **Safe to run multiple times** ✅

### Migration 015: Create Prescription Messages Table
- Creates `prescription_messages` table
- Adds indexes
- **Safe to run multiple times** ✅

### Migration 016: Create Audit Log Table
- Creates `prescription_audit_log` table
- Adds indexes
- Adds trigger for auto-logging
- **Safe to run multiple times** ✅

### Migration 017: Extend Sessions Table
- Adds 5 columns to `sessions` table
- Adds index
- **Safe to run multiple times** ✅

### Migration 018: Create Functions
- Creates 4 helper functions
- Uses `CREATE OR REPLACE`
- **Safe to run multiple times** ✅

### Migration 019: Prescriptions RLS Policies
- Creates 5 RLS policies
- Drops existing first
- **Safe to run multiple times** ✅

### Migration 020: Messages RLS Policies
- Creates 5 RLS policies
- Drops existing first
- **Safe to run multiple times** ✅

### Migration 021: Audit Log & Sessions RLS
- Creates 1 RLS policy
- Drops existing first
- **Safe to run multiple times** ✅

---

## 🚨 When to Worry

You should ONLY worry if:

❌ You see errors when trying to create prescriptions
❌ You see errors when trying to send messages
❌ You see duplicate data appearing
❌ RLS policies are not working (can see other colleges' data)
❌ Functions return errors

If you see any of these, run the cleanup script.

---

## ✅ When NOT to Worry

You're fine if:

✅ App works normally
✅ Can create prescriptions
✅ Can send messages
✅ No console errors
✅ No database errors
✅ RLS policies work (can only see your college's data)

---

## 🎯 Bottom Line

### Running migrations 014-021 multiple times is **SAFE** because:

1. ✅ Tables use `IF NOT EXISTS`
2. ✅ Functions use `CREATE OR REPLACE`
3. ✅ Policies are dropped before recreating
4. ✅ Indexes use `IF NOT EXISTS`
5. ✅ Triggers use `CREATE OR REPLACE`

### What to do:

1. **Run** `CHECK_MIGRATION_STATUS.sql` to verify
2. **Test** the app to make sure it works
3. **If everything works** → You're done! ✅
4. **If you see issues** → Run cleanup script

---

## 📞 Need Help?

### Check These:

1. **Run diagnostic:** `CHECK_MIGRATION_STATUS.sql`
2. **Check app:** Try creating a prescription
3. **Check console:** Look for errors
4. **Check database:** Look for duplicate objects

### Most Likely Result:

**Everything is fine!** The migrations are designed to be idempotent (safe to run multiple times).

---

**TL;DR:** Running migrations 014-021 multiple times is **SAFE**. They use protective SQL patterns. You're probably fine! Just run `CHECK_MIGRATION_STATUS.sql` to verify. ✅

