-- ============================================================
-- Fix: Prevent trigger from creating profiles without college_id
-- Problem: The trigger creates user profiles immediately after auth
--          signup, but without college_id, causing NULL values
-- Solution: Disable the trigger - let the API handle profile creation
--           with proper college_id assignment
-- ============================================================

-- Drop the trigger that creates profiles without college_id
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Note: The signup API (/api/auth/signup/route.ts) now handles
-- complete profile creation including college_id assignment.
-- This ensures all new users get proper college_id from the start.

-- Verify: Check for any remaining users with NULL college_id
SELECT 
  COUNT(*) as users_with_null_college_id,
  STRING_AGG(email, ', ') as affected_emails
FROM users
WHERE college_id IS NULL;

