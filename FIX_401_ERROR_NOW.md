# 🚨 FIX 401 ERROR - User Profile Missing

## The Problem
You're seeing this error:
```
Failed to load resource: the server responded with a status of 401 ()
new row violates row-level security policy for table "assessments"
```

**Root Cause:** You're logged in (authentication works), but your user profile doesn't exist in the `users` table. The RLS policies require a profile to exist.

---

## ⚡ QUICK FIX (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/usompgticzgsrsbyglap
2. Click **SQL Editor** in left sidebar
3. Click **New Query**

### Step 2: Run This Migration
1. Open this file: `supabase/migrations/032_fix_missing_user_profiles.sql`
2. Copy ALL the contents (Ctrl+A, Ctrl+C)
3. Paste in Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

**What this does:**
- ✅ Creates a trigger to auto-create user profiles on signup
- ✅ Backfills profiles for ALL existing auth users (including you!)
- ✅ Shows verification results

### Step 3: Verify It Worked
You should see output like:
```
auth_users | public_users | missing_profiles
-----------+--------------+-----------------
         1 |            1 |                0
```

If `missing_profiles` is 0, you're good! ✅

### Step 4: Test Your App
1. **Refresh your browser** (F5)
2. Go to the check-in page
3. It should work now! 🎉

---

## 🔍 Manual Check (Optional)

If you want to verify your profile exists:

```sql
-- Check your profile
SELECT * FROM users WHERE email = 'sohampate0306@gmail.com';
```

You should see your profile with:
- ✅ id (UUID)
- ✅ email
- ✅ role (student)
- ✅ full_name

---

## 🎯 Why This Happened

When you signed up, the app created your account in `auth.users` (Supabase authentication), but didn't create a matching profile in `public.users` (your app's user table).

The RLS policies check if a user profile exists before allowing database access. No profile = 401 error.

**The migration fixes this by:**
1. Creating profiles for all existing users
2. Adding a trigger to auto-create profiles for future signups

---

## ✅ After This Fix

Once you run the migration:
- ✅ Check-in page will load
- ✅ Questions will appear
- ✅ You can complete assessments
- ✅ All features will work
- ✅ Future signups will auto-create profiles

---

## 🆘 Still Getting Errors?

If you still see 401 errors after running the migration:

1. **Check if migration ran successfully:**
   ```sql
   SELECT * FROM users WHERE email = 'sohampate0306@gmail.com';
   ```
   Should return 1 row.

2. **Check auth user exists:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'sohampate0306@gmail.com';
   ```
   Should return 1 row.

3. **If both exist but still getting errors**, share:
   - Screenshot of the console error
   - Output of both queries above
   - I'll help you debug further!

---

## 🚀 Next Steps

After fixing this:
1. ✅ Test check-in page
2. ✅ Complete a check-in
3. ✅ Test other features (chat, resources, etc.)
4. ✅ Your app should be fully working!

This was the ONLY missing piece! 🎊
