# Fix: "Failed to create college workspace" Error

## Root Cause Analysis

The institutional onboarding was failing with "Failed to create college workspace" error due to **missing RLS (Row Level Security) policies** on the `colleges` table.

### What Was Wrong:
1. ✅ The `colleges` table had RLS **enabled**
2. ❌ But **NO policies** were defined for it
3. ❌ This blocked ALL inserts, even with service role key
4. ❌ Result: College provisioning failed during onboarding

### Why This Happened:
- The initial schema (`001_initial_schema.sql`) enabled RLS on `colleges` table
- But it didn't define any policies for who can insert/read/update
- Without policies, RLS blocks everything by default (secure by default)
- The service role key alone is not enough - policies must explicitly allow operations

## The Fix

### 1. Created Migration 007
**File:** `supabase/migrations/007_fix_colleges_rls_policies.sql`

This migration adds:
- ✅ Policy to allow service role to INSERT colleges (for onboarding)
- ✅ Policy to allow service role to UPDATE colleges
- ✅ Policy to allow service role to INSERT users (for admin creation)
- ✅ Policies for admins/counsellors/students to READ their own college

### 2. Updated College Provisioner
**File:** `src/lib/college-provisioner.ts`

Improved the Supabase client configuration:
```typescript
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);
```

## How to Apply the Fix

### Step 1: Apply Migration 007

**Via Supabase Dashboard (Easiest):**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" → "New query"
4. Copy contents of `supabase/migrations/007_fix_colleges_rls_policies.sql`
5. Paste and click "Run"
6. Wait for "Success. No rows returned"

**Via Supabase CLI (If installed):**
```bash
cd mindsafe-india
supabase db push
```

### Step 2: Restart Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 3: Test Institutional Onboarding

1. Go to http://localhost:3000/demo
2. Fill in the registration form:
   - Admin Name: Test Admin
   - Admin Email: test@college.edu.in
   - Admin Role: Principal
   - College Name: Test College
   - AISHE Code: C-12345
   - Student Count: 500
3. Select a plan (Basic or Growth)
4. Click "Proceed to Payment"
5. Complete test payment
6. Click "Complete Registration"
7. ✅ You should see: "Registration Complete! 🎉"

## Verification Checklist

After applying the fix, verify:

- [ ] Migration 007 applied successfully in Supabase dashboard
- [ ] 5 new policies visible on `colleges` table
- [ ] 1 new policy visible on `users` table (Service role can insert users)
- [ ] Development server restarted
- [ ] Test registration completes without errors
- [ ] Welcome email received with college code and temporary password
- [ ] Admin can login with email + temporary password

## What Each Policy Does

### Colleges Table Policies:

1. **"Service role can insert colleges"**
   - Allows institutional onboarding API to create college records
   - Uses service role key to bypass normal RLS restrictions

2. **"Service role can update colleges"**
   - Allows updates to college information (e.g., plan changes)

3. **"Admins can read own college"**
   - Admins can view their college details in dashboard

4. **"Counsellors can read own college"**
   - Counsellors can view their college details

5. **"Students can read own college"**
   - Students can view their college details

### Users Table Policy:

1. **"Service role can insert users"**
   - Allows institutional onboarding to create admin user profiles
   - Works alongside existing "Allow public sign-up" policy for students/counsellors

## Troubleshooting

### Still getting "Failed to create college workspace"?

**Check 1: Migration Applied?**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'colleges';
```
You should see 5 policies.

**Check 2: Service Role Key Correct?**
```bash
# Check .env.local
cat .env.local | grep SUPABASE_SERVICE_ROLE_KEY
```
Should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Check 3: Server Logs**
Look for detailed error in terminal where `npm run dev` is running:
- "permission denied for table colleges" → Migration not applied
- "duplicate key value violates unique constraint" → AISHE code already exists
- "null value in column violates not-null constraint" → Missing required field

**Check 4: Browser Console**
Open DevTools (F12) → Console tab:
- Look for red error messages
- Check Network tab for failed API calls
- Look at the response body for detailed error

### Common Errors After Fix:

**Error: "AISHE code already exists"**
- Solution: Use a different AISHE code (e.g., C-12346, C-12347)

**Error: "Email already registered"**
- Solution: Use a different email address

**Error: "Payment verification failed"**
- Solution: Check Razorpay test credentials in `.env.local`

## Database Schema Reference

### Colleges Table Structure:
```sql
CREATE TABLE colleges (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  plan_tier TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  aishe_code TEXT UNIQUE,           -- Added in migration 006
  student_count TEXT,                -- Added in migration 006
  payment_id TEXT,                   -- Added in migration 006
  college_code TEXT UNIQUE,          -- Added in migration 006
  onboarded_at TIMESTAMPTZ,
  logo_url TEXT,
  max_students INTEGER,
  contact_email TEXT,
  city TEXT,
  state TEXT
);
```

### Users Table Structure:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'counsellor', 'admin')),
  college_id UUID REFERENCES colleges(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  guardian_phone TEXT,
  department TEXT,                   -- Used by students/counsellors
  roll_number TEXT,                  -- Added in migration 006 (students only)
  year INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMPTZ
);
```

## Related Files

- `supabase/migrations/007_fix_colleges_rls_policies.sql` - The fix migration
- `src/lib/college-provisioner.ts` - College provisioning logic
- `src/app/api/auth/register-institution/route.ts` - Onboarding API endpoint
- `src/app/demo/page.tsx` - Institutional onboarding UI
- `.env.local` - Environment variables (service role key)

## Next Steps

After fixing the onboarding error:

1. ✅ Complete institutional onboarding works
2. ✅ Admin receives welcome email with credentials
3. ✅ Admin can login at `/login/admin`
4. ⏭️ Continue with role-based authentication implementation
5. ⏭️ Test student/counsellor signup flows
6. ⏭️ Implement middleware for route protection

## Need More Help?

If you're still experiencing issues:
1. Share the exact error message from browser console
2. Share server logs from terminal
3. Share screenshot of Supabase Policies page
4. Verify all environment variables are set correctly
