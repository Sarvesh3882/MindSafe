-- TEST IF ADMIN CAN ACCESS ASSESSMENTS
-- This tests if the RLS policy is working for the logged-in admin

-- First, check who you are logged in as
SELECT 
  'Current User' as test,
  auth.uid() as your_user_id,
  u.email,
  u.role,
  u.college_id
FROM users u
WHERE u.id = auth.uid();

-- Second, try to select assessments (this will use RLS)
SELECT 
  'Assessments You Can See' as test,
  COUNT(*) as count
FROM assessments;

-- Third, check if the admin policy condition is true
SELECT 
  'Admin Policy Check' as test,
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
  ) as is_admin,
  (SELECT college_id FROM users WHERE id = auth.uid()) as your_college_id,
  (SELECT COUNT(*) FROM users WHERE role = 'student' AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())) as students_in_your_college;

-- Fourth, check assessments with explicit join (bypassing RLS for testing)
-- This uses service role, so it should show all data
SELECT 
  'All Assessments (Service Role)' as test,
  COUNT(*) as total_assessments,
  COUNT(DISTINCT a.user_id) as unique_students
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  AND a.completed = true;
