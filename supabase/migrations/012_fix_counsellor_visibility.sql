-- Fix RLS policies to allow students to see counsellors for booking

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Counsellors can read students in their college" ON users;

-- Add new policy: Students can read counsellors in their college (for booking)
CREATE POLICY "Students can read counsellors in their college" ON users FOR SELECT
  USING (
    get_user_role() = 'student' 
    AND role = 'counsellor' 
    AND college_id = get_user_college()
  );

-- Add new policy: Counsellors can read students in their college
CREATE POLICY "Counsellors can read students in their college v2" ON users FOR SELECT
  USING (
    get_user_role() = 'counsellor' 
    AND role = 'student' 
    AND college_id = get_user_college()
  );

-- Add policy: Counsellors can read other counsellors in their college
CREATE POLICY "Counsellors can read other counsellors" ON users FOR SELECT
  USING (
    get_user_role() = 'counsellor' 
    AND role = 'counsellor' 
    AND college_id = get_user_college()
  );
