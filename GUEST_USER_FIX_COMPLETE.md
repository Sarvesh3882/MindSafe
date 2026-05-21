# Guest User Display Issue - COMPLETE FIX

## 🐛 Problem
Production server intermittently showing "Guest" for authenticated users instead of their actual names.

## 🔍 Root Causes Identified

### 1. **Missing Database Profiles**
- Users exist in `auth.users` but not in `public.users` table
- Trigger that creates profiles may have failed for some users

### 2. **Next.js Server Component Caching**
- Layouts are cached by default in Next.js 14+
- Stale cached data showing old profile information

### 3. **Query Method Issues**
- Using `.single()` throws errors when profile doesn't exist
- Error handling wasn't properly falling back to auth metadata

## ✅ Fixes Applied

### Fix 1: Disable Layout Caching
**Files Modified:**
- `src/app/student/layout.tsx`
- `src/app/counsellor/layout.tsx`
- `src/app/admin/layout.tsx`

**Change:**
```typescript
export const dynamic = 'force-dynamic'; // Disable caching for this layout
```

This ensures fresh data on every request, preventing stale cached profiles.

### Fix 2: Use `.maybeSingle()` Instead of `.single()`
**All 3 layouts updated:**

**Before:**
```typescript
const { data } = await supabase
  .from("users").select("full_name, email, role").eq("id", user.id).single();
```

**After:**
```typescript
const { data, error } = await supabase
  .from("users")
  .select("full_name, email, role")
  .eq("id", user.id)
  .maybeSingle();
```

`.maybeSingle()` returns `null` instead of throwing an error when no profile exists.

### Fix 3: Improved Fallback Logic (Student Layout Only)
```typescript
if (error) {
  console.error("Error fetching user profile:", error);
  // Use auth metadata as fallback
  profile = {
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
    email: user.email || "",
    role: "student"
  };
} else if (data) {
  // Profile found
  profile = data;
} else {
  // No profile in database, use auth metadata
  profile = {
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
    email: user.email || "",
    role: "student"
  };
}
```

### Fix 4: Database Migration
**Created:** `supabase/migrations/039_ensure_all_users_have_profiles.sql`

This migration:
- Creates missing profiles for all auth users
- Uses auth metadata (`raw_user_meta_data`) as source
- Handles NULL `college_id` properly
- Provides verification output

## 📋 Deployment Steps

### Step 1: Deploy Code Changes
```bash
# Commit and push the layout fixes
git add src/app/student/layout.tsx
git add src/app/counsellor/layout.tsx
git add src/app/admin/layout.tsx
git commit -m "fix: resolve Guest user display issue with caching and query fixes"
git push origin main
```

Vercel will auto-deploy the changes.

### Step 2: Run Database Migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/039_ensure_all_users_have_profiles.sql`
3. Paste and run
4. Check the output messages:
   - Should show: "✓ All users have profiles"
   - If warnings appear, investigate specific users

### Step 3: Verify Fix
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. Log in to production site
3. Check sidebar - should show correct name
4. Refresh page multiple times - name should stay consistent
5. Test with different user accounts

## 🧪 Testing Checklist

- [ ] Student login shows correct name
- [ ] Counsellor login shows correct name
- [ ] Admin login shows correct name
- [ ] Name persists after page refresh
- [ ] Name persists after navigation
- [ ] No "Guest" appears for authenticated users
- [ ] Anonymous/unauthenticated users still show "Guest" (expected)

## 📊 Database Verification Queries

### Check if all users have profiles:
```sql
SELECT 
  COUNT(*) as auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users,
  COUNT(*) - (SELECT COUNT(*) FROM public.users) as missing_profiles
FROM auth.users;
```

Expected: `missing_profiles = 0`

### Find users without profiles:
```sql
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as metadata_name
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
```

Expected: No rows returned

## 🔄 Why This Fixes the Intermittent Issue

1. **No more caching** - `force-dynamic` ensures fresh data every time
2. **No more query errors** - `.maybeSingle()` handles missing profiles gracefully
3. **Proper fallbacks** - Auth metadata used when database profile missing
4. **Database consistency** - Migration ensures all users have profiles

## 📝 Files Changed Summary

### Code Files (3):
1. `src/app/student/layout.tsx` - Added caching disable, maybeSingle, improved fallback
2. `src/app/counsellor/layout.tsx` - Added caching disable, maybeSingle
3. `src/app/admin/layout.tsx` - Added caching disable, maybeSingle

### Database Files (2):
1. `supabase/migrations/039_ensure_all_users_have_profiles.sql` - New migration
2. `FIX_GUEST_USERS.sql` - Standalone fix script (optional, migration covers it)

### Documentation (1):
1. `GUEST_USER_FIX_COMPLETE.md` - This file

## 🚀 Next Steps

1. ✅ Code changes applied
2. ⏳ **YOU NEED TO:** Run migration 039 in Supabase
3. ⏳ **YOU NEED TO:** Push code to GitHub
4. ⏳ **YOU NEED TO:** Verify on production after Vercel deploys

## 💡 Prevention

The trigger in migration 035 should prevent this in the future:
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, college_id, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    (NEW.raw_user_meta_data->>'college_id')::uuid,
    NEW.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This trigger automatically creates profiles for new signups.

---

**Status:** ✅ Code fixes complete, ⏳ Database migration pending
