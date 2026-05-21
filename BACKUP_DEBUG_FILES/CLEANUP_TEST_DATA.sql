-- ============================================================
-- CLEANUP TEST DATA - Reset Onboarding for Testing
-- ============================================================
-- This script removes all test colleges and users created during onboarding
-- Use this to reset the database for testing purposes
-- 
-- HOW TO USE:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Click "SQL Editor" → "New query"
-- 4. Copy and paste this entire script
-- 5. Click "Run" (or Ctrl+Enter / Cmd+Enter)
-- 
-- WARNING: This will delete ALL colleges and users!
-- Only use this in development/testing environment!
-- ============================================================

-- Step 1: Delete all users from auth.users (this will cascade to users table)
-- This removes all admin, student, and counsellor accounts
DO $$ 
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    PERFORM auth.admin.delete_user(user_record.id);
  END LOOP;
END $$;

-- Step 2: Delete all colleges
-- This removes all college records
DELETE FROM colleges;

-- Step 3: Reset sequences (if any)
-- This ensures IDs start from 1 again
-- (Not needed for UUID-based tables, but included for completeness)

-- Step 4: Verify cleanup
-- Check that tables are empty
DO $$ 
DECLARE
  college_count INTEGER;
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO college_count FROM colleges;
  SELECT COUNT(*) INTO user_count FROM users;
  
  RAISE NOTICE 'Cleanup complete!';
  RAISE NOTICE 'Colleges remaining: %', college_count;
  RAISE NOTICE 'Users remaining: %', user_count;
  
  IF college_count = 0 AND user_count = 0 THEN
    RAISE NOTICE '✅ All test data cleaned successfully!';
  ELSE
    RAISE WARNING '⚠️ Some data still remains. Check manually.';
  END IF;
END $$;

-- ============================================================
-- ALTERNATIVE: Delete specific email only
-- ============================================================
-- If you only want to delete a specific admin email, use this instead:
-- (Comment out the above and uncomment below)

/*
DO $$ 
DECLARE
  target_email TEXT := 'codex5622@gmail.com';  -- Change this to your email
  user_id UUID;
  college_id UUID;
BEGIN
  -- Get user ID
  SELECT id, college_id INTO user_id, college_id 
  FROM users 
  WHERE email = target_email;
  
  IF user_id IS NOT NULL THEN
    -- Delete from auth.users (cascades to users table)
    PERFORM auth.admin.delete_user(user_id);
    
    -- Delete college if it exists
    IF college_id IS NOT NULL THEN
      DELETE FROM colleges WHERE id = college_id;
    END IF;
    
    RAISE NOTICE '✅ Deleted user: %', target_email;
  ELSE
    RAISE NOTICE '⚠️ User not found: %', target_email;
  END IF;
END $$;
*/

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. This script uses auth.admin.delete_user() which requires service role
-- 2. Deleting from auth.users will cascade to users table (due to FK constraint)
-- 3. Colleges are deleted separately as they don't cascade from users
-- 4. All related data (assessments, sessions, alerts, etc.) will cascade automatically
-- 5. After cleanup, you can register with the same email again
-- ============================================================
