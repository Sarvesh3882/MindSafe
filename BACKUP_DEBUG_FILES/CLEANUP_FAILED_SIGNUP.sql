-- ============================================================
-- CLEANUP FAILED SIGNUP - Delete auth account without profile
-- ============================================================
-- Use this when signup fails after creating auth account but before creating profile
-- This leaves the email "taken" in auth but no user profile exists
-- 
-- HOW TO USE:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Click "SQL Editor" → "New query"
-- 4. Change the email address below to the one that failed
-- 5. Click "Run"
-- ============================================================

-- CHANGE THIS EMAIL TO THE ONE THAT FAILED TO REGISTER
DO $$ 
DECLARE
  target_email TEXT := 'snpatil370825@kkwagh.edu.in';  -- ⬅️ CHANGE THIS
  auth_user_id UUID;
  user_profile_id UUID;
BEGIN
  RAISE NOTICE '🔍 Looking for failed signup: %', target_email;
  
  -- Step 1: Check if user profile exists
  SELECT id INTO user_profile_id 
  FROM users 
  WHERE email = target_email;
  
  IF user_profile_id IS NOT NULL THEN
    RAISE NOTICE '✅ User profile exists. This is not a failed signup.';
    RAISE NOTICE '   Use CLEANUP_SPECIFIC_EMAIL.sql instead to delete this user.';
    RETURN;
  END IF;
  
  RAISE NOTICE '⚠️ No user profile found. Checking auth.users...';
  
  -- Step 2: Check if auth user exists
  SELECT id INTO auth_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF auth_user_id IS NULL THEN
    RAISE NOTICE '✅ No auth user found either. Email is free to use!';
    RETURN;
  END IF;
  
  RAISE NOTICE '🔍 Found orphaned auth user (no profile): %', auth_user_id;
  
  -- Step 3: Delete the orphaned auth user
  DELETE FROM auth.users WHERE id = auth_user_id;
  
  RAISE NOTICE '✅ Deleted orphaned auth user';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Cleanup complete! You can now sign up with: %', target_email;
END $$;
