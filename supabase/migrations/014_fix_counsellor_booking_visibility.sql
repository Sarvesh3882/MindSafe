-- ============================================================
-- Fix counsellor visibility for student booking system
-- Issue: Students cannot see counsellors when trying to book sessions
-- Root cause: Missing RLS policy for students to read counsellors
-- ============================================================

-- First, let's see what policies exist
-- (This is just for documentation, the actual DROP commands below will handle cleanup)

-- Drop ALL existing user read policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Counsellors can read students in their college" ON users;
DROP POLICY IF EXISTS "Students can read counsellors in their college" ON users;
DROP POLICY IF EXISTS "Counsellors can read students in their college v2" ON users;
DROP POLICY IF EXISTS "Counsellors can read other counsellors" ON users;
DROP POLICY IF EXISTS "Admins can read users in their college" ON users;

-- ============================================================
-- Create comprehensive RLS policies for users table
-- ============================================================

-- 1. Everyone can read their own profile
CREATE POLICY "Users can read own profile" 
  ON users FOR SELECT
  USING (id = auth.uid());

-- 2. Students can read counsellors in their college (FOR BOOKING)
CREATE POLICY "Students can read counsellors for booking" 
  ON users FOR SELECT
  USING (
    get_user_role() = 'student' 
    AND role = 'counsellor' 
    AND (
      -- Match by college_id
      college_id = get_user_college()
      -- OR both have NULL college_id (for testing/development)
      OR (college_id IS NULL AND get_user_college() IS NULL)
    )
  );

-- 3. Counsellors can read students in their college
CREATE POLICY "Counsellors can read students" 
  ON users FOR SELECT
  USING (
    get_user_role() = 'counsellor' 
    AND role = 'student' 
    AND (
      college_id = get_user_college()
      OR (college_id IS NULL AND get_user_college() IS NULL)
    )
  );

-- 4. Counsellors can read other counsellors in their college
CREATE POLICY "Counsellors can read other counsellors" 
  ON users FOR SELECT
  USING (
    get_user_role() = 'counsellor' 
    AND role = 'counsellor' 
    AND (
      college_id = get_user_college()
      OR (college_id IS NULL AND get_user_college() IS NULL)
    )
  );

-- 5. Admins can read all users in their college
CREATE POLICY "Admins can read users in their college" 
  ON users FOR SELECT
  USING (
    get_user_role() = 'admin' 
    AND (
      college_id = get_user_college()
      OR (college_id IS NULL AND get_user_college() IS NULL)
    )
  );

-- ============================================================
-- Add helpful comments
-- ============================================================
COMMENT ON POLICY "Students can read counsellors for booking" ON users IS 
  'Allows students to see available counsellors in their college for booking sessions';

COMMENT ON POLICY "Counsellors can read students" ON users IS 
  'Allows counsellors to see students in their college for dashboard and session management';

-- ============================================================
-- Verification query (run this after migration to verify)
-- ============================================================
-- SELECT 
--   policyname,
--   cmd,
--   qual
-- FROM pg_policies
-- WHERE tablename = 'users'
-- ORDER BY policyname;
