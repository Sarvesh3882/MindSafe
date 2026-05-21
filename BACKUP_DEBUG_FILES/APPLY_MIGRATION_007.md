# How to Apply Migration 007: Fix Colleges RLS Policies

## Problem
The `colleges` table has Row Level Security (RLS) enabled but no policies defined. This blocks ALL inserts, including those using the service role key, causing the "Failed to create college workspace" error during institutional onboarding.

## Solution
Apply migration `007_fix_colleges_rls_policies.sql` to add the necessary RLS policies.

## Steps to Apply Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `usompgticzgsrsbyglap`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Migration**
   - Open the file: `supabase/migrations/007_fix_colleges_rls_policies.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" button (or press Ctrl+Enter / Cmd+Enter)
   - Wait for success message: "Success. No rows returned"

5. **Verify the Policies**
   - Go to "Database" → "Policies" in the left sidebar
   - Select the `colleges` table
   - You should see 5 new policies:
     - ✅ Service role can insert colleges
     - ✅ Service role can update colleges
     - ✅ Admins can read own college
     - ✅ Counsellors can read own college
     - ✅ Students can read own college
   - Select the `users` table
   - You should see the new policy:
     - ✅ Service role can insert users

### Option 2: Via Supabase CLI (If Installed)

```bash
cd mindsafe-india
supabase db push
```

## What This Migration Does

### For `colleges` table:
1. **Allows service role to INSERT** - Enables institutional onboarding to create college records
2. **Allows service role to UPDATE** - Enables updates to college information
3. **Allows admins to READ** - Admins can view their own college details
4. **Allows counsellors to READ** - Counsellors can view their college details
5. **Allows students to READ** - Students can view their college details

### For `users` table:
1. **Allows service role to INSERT** - Enables institutional onboarding to create admin user profiles

## After Applying Migration

1. **Test Institutional Onboarding**
   - Go to: http://localhost:3000/demo
   - Fill in the registration form
   - Complete payment
   - Click "Complete Registration"
   - You should see: "Registration Complete! 🎉"

2. **Check for Errors**
   - Open browser console (F12)
   - Look for any error messages
   - If you still see errors, check the server logs

## Troubleshooting

### If migration fails with "policy already exists"
This means the policies were already created. You can safely ignore this error.

### If you still get "Failed to create college workspace"
1. Check server logs in your terminal where `npm run dev` is running
2. Look for specific error messages from Supabase
3. Verify the service role key is correct in `.env.local`
4. Check if the database connection is working

### If you see "permission denied for table colleges"
This means RLS is still blocking the insert. Double-check that:
1. The migration was applied successfully
2. The policies are visible in the Supabase dashboard
3. You're using the correct service role key

## Need Help?
If you encounter any issues, please share:
1. The exact error message from the browser console
2. The server logs from your terminal
3. A screenshot of the Supabase Policies page for the `colleges` table
