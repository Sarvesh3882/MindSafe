# How to Clean Up Test Data

## Problem
You're getting "Failed to create admin account" because `codex5622@gmail.com` is already registered.

## Solution
Delete the existing registration so you can use the email again.

## Steps

### Option 1: Delete Specific Email (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `usompgticzgsrsbyglap`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Cleanup Script**
   - Open the file: `CLEANUP_SPECIFIC_EMAIL.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - **IMPORTANT:** Change the email on line 18 if needed:
     ```sql
     target_email TEXT := 'codex5622@gmail.com';  -- ⬅️ CHANGE THIS
     ```
   - Click "Run" (or press Ctrl+Enter / Cmd+Enter)

4. **Verify Success**
   You should see messages like:
   ```
   🔍 Looking for user: codex5622@gmail.com
   ✅ Found user: codex5622@gmail.com (ID: xxx-xxx-xxx)
   ✅ Deleted user from auth.users and users table
   ✅ Deleted college (ID: xxx-xxx-xxx)
   🎉 Cleanup complete! You can now register with: codex5622@gmail.com
   ```

5. **Test Registration**
   - Go to: http://localhost:3000/demo
   - Use `codex5622@gmail.com` as admin email
   - Complete registration
   - ✅ Email will be sent successfully!

### Option 2: Delete ALL Test Data

If you want to start completely fresh:

1. Open Supabase Dashboard → SQL Editor
2. Open the file: `CLEANUP_TEST_DATA.sql`
3. Copy and paste the entire script
4. Click "Run"
5. This will delete ALL colleges and users

**⚠️ WARNING:** This deletes everything! Only use in development.

## Quick Visual Guide

```
Before Cleanup:
┌─────────────────────────────────────┐
│ codex5622@gmail.com → College A     │ ❌ Already exists
└─────────────────────────────────────┘

After Cleanup:
┌─────────────────────────────────────┐
│ (empty)                             │ ✅ Ready to register
└─────────────────────────────────────┘

After New Registration:
┌─────────────────────────────────────┐
│ codex5622@gmail.com → College B     │ ✅ New registration
└─────────────────────────────────────┘
```

## What Gets Deleted

When you delete a user:
- ✅ Auth account (from `auth.users`)
- ✅ User profile (from `users` table)
- ✅ Associated college (if no other users)
- ✅ All related data (assessments, sessions, alerts, etc.)

## Troubleshooting

### Error: "permission denied"
- Make sure you're logged into Supabase dashboard
- Make sure you're in the correct project
- Try refreshing the page and running again

### Error: "function auth.admin.delete_user does not exist"
- Use the simpler version in `CLEANUP_SPECIFIC_EMAIL.sql`
- It uses `DELETE FROM auth.users` instead

### Still getting "Failed to create admin account"
1. Verify the email was deleted:
   ```sql
   SELECT * FROM users WHERE email = 'codex5622@gmail.com';
   SELECT * FROM auth.users WHERE email = 'codex5622@gmail.com';
   ```
   Both should return 0 rows.

2. If still exists, manually delete:
   ```sql
   -- Get the user ID
   SELECT id FROM auth.users WHERE email = 'codex5622@gmail.com';
   
   -- Delete (replace xxx-xxx-xxx with actual ID)
   DELETE FROM auth.users WHERE id = 'xxx-xxx-xxx';
   ```

## After Cleanup

1. ✅ Email is free to use again
2. ✅ Can register new college
3. ✅ Will receive welcome email (to codex5622@gmail.com only)
4. ✅ Can login with new credentials

## Need to Clean Up Multiple Emails?

Edit `CLEANUP_SPECIFIC_EMAIL.sql` and run it multiple times with different emails:

```sql
-- Run 1
target_email TEXT := 'email1@example.com';

-- Run 2
target_email TEXT := 'email2@example.com';

-- etc.
```

## Production Note

In production, you should:
- ❌ NOT delete user accounts like this
- ✅ Implement proper user management
- ✅ Allow admins to deactivate accounts
- ✅ Keep audit logs of deletions
- ✅ Verify domain for Resend to send to any email
