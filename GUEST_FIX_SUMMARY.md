# Guest User Fix - Quick Summary

## 🐛 The Problem
Production showing "Guest" intermittently for logged-in users.

## 🔍 Root Causes
1. **Missing profiles** - Some auth users don't have entries in `public.users`
2. **Next.js caching** - Layouts cached stale data
3. **Query errors** - `.single()` throws errors when profile missing

## ✅ The Fix (3 Parts)

### Part 1: Code Changes (Layouts)
**Files:** `src/app/student/layout.tsx`, `counsellor/layout.tsx`, `admin/layout.tsx`

```typescript
// Added at top of each layout
export const dynamic = 'force-dynamic'; // Disable caching

// Changed query method
.maybeSingle()  // Instead of .single()

// Added proper error handling
if (error) {
  // Use auth metadata as fallback
  profile = {
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
    email: user.email || "",
    role: "student"
  };
}
```

### Part 2: Database Migration
**File:** `supabase/migrations/039_ensure_all_users_have_profiles.sql`

Creates missing profiles for all auth users using their metadata.

### Part 3: Standalone Fix Script
**File:** `FIX_GUEST_USERS.sql` (corrected)

Can be run manually if needed (migration 039 covers this).

## 📊 Before vs After

### Before:
```
User logs in → Layout queries database → Profile missing → Error → Shows "Guest"
User refreshes → Cached layout → Shows "Guest" again
```

### After:
```
User logs in → Layout queries database (no cache) → Profile found → Shows name
OR
User logs in → Layout queries database → Profile missing → Uses auth metadata → Shows name
```

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add src/app/student/layout.tsx src/app/counsellor/layout.tsx src/app/admin/layout.tsx
git add supabase/migrations/039_ensure_all_users_have_profiles.sql
git commit -m "fix: resolve Guest user display issue"
git push origin main
```

### 2. Run Migration in Supabase
- Open Supabase SQL Editor
- Run `039_ensure_all_users_have_profiles.sql`
- Verify: "✓ All users have profiles"

### 3. Test Production
- Clear browser cache
- Log in
- Verify name shows correctly
- Refresh multiple times

## 📁 Files Changed

### Modified (3):
- ✅ `src/app/student/layout.tsx`
- ✅ `src/app/counsellor/layout.tsx`
- ✅ `src/app/admin/layout.tsx`

### Created (4):
- ✅ `supabase/migrations/039_ensure_all_users_have_profiles.sql`
- ✅ `GUEST_USER_FIX_COMPLETE.md` (detailed guide)
- ✅ `PUSH_GUEST_FIX_TO_GITHUB.md` (push instructions)
- ✅ `GUEST_FIX_SUMMARY.md` (this file)

### Updated (1):
- ✅ `FIX_GUEST_USERS.sql` (corrected NULL handling)

## ✅ Status

- [x] Code fixes applied
- [ ] **TODO:** Push to GitHub
- [ ] **TODO:** Run migration 039 in Supabase
- [ ] **TODO:** Test on production

---

**Next Action:** Run the push commands from `PUSH_GUEST_FIX_TO_GITHUB.md`
