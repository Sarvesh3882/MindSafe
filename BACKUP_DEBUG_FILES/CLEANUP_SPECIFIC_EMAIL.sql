-- ============================================================
-- CLEANUP SPECIFIC EMAIL - Delete a specific admin account
-- ============================================================
-- This script removes a specific email and its associated college
-- Use this to free up an email for re-registration
-- 
-- HOW TO USE:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Click "SQL Editor" → "New query"
-- 4. Copy and paste this entire script
-- 5. Change the email address below to the one you want to delete
-- 6. Click "Run" (or Ctrl+Enter / Cmd+Enter)
-- ============================================================

-- CHANGE THIS EMAIL TO THE ONE YOU WANT TO DELETE
DO $$ 
DECLARE
  target_email TEXT := 'codex5622@gmail.com';  -- ⬅️ CHANGE THIS
  user_id UUID;
  user_college_id UUID;
  auth_user_id UUID;
BEGIN
  RAISE NOTICE '🔍 Looking for user: %', target_email;
  
  -- Step 1: Find user in users table
  SELECT id, college_id INTO user_id, user_college_id 
  FROM users 
  WHERE email = target_email;
  
  IF user_id IS NULL THEN
    RAISE NOTICE '⚠️ User not found in users table: %', target_email;
    
    -- Check if user exists in auth.users only
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = target_email;
    
    IF auth_user_id IS NOT NULL THEN
      RAISE NOTICE '🔍 Found user in auth.users, deleting...';
      DELETE FROM auth.users WHERE id = auth_user_id;
      RAISE NOTICE '✅ Deleted auth user: %', target_email;
    ELSE
      RAISE NOTICE '✅ Email is already free to use: %', target_email;
    END IF;
    
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Found user: % (ID: %)', target_email, user_id;
  
  -- Step 2: Delete from auth.users (this will cascade to users table)
  DELETE FROM auth.users WHERE id = user_id;
  RAISE NOTICE '✅ Deleted user from auth.users and users table';
  
  -- Step 3: Delete college if it exists and has no other users
  IF user_college_id IS NOT NULL THEN
    -- Check if college has other users
    IF NOT EXISTS (SELECT 1 FROM users WHERE college_id = user_college_id) THEN
      DELETE FROM colleges WHERE id = user_college_id;
      RAISE NOTICE '✅ Deleted college (ID: %)', user_college_id;
    ELSE
      RAISE NOTICE '⚠️ College has other users, not deleting';
    END IF;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Cleanup complete! You can now register with: %', target_email;
END $$;
