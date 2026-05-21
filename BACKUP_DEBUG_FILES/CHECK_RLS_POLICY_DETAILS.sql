-- CHECK EXACT RLS POLICY DETAILS

-- Show the exact SQL definition of the admin policy
SELECT 
  policyname,
  cmd,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE tablename = 'assessments' 
  AND policyname = 'Admins can view college assessments';

-- Test if the policy logic works for current user
SELECT 
  'Policy Logic Test' as test,
  auth.uid() as current_user_id,
  (SELECT role FROM users WHERE id = auth.uid()) as current_user_role,
  (SELECT college_id FROM users WHERE id = auth.uid()) as current_user_college,
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.id = auth.uid()
      AND admin_user.role = 'admin'
  ) as passes_admin_check,
  (
    SELECT COUNT(*) FROM users student_user
    WHERE student_user.college_id = (SELECT college_id FROM users WHERE id = auth.uid())
      AND student_user.role = 'student'
  ) as students_in_same_college;

-- Try to actually query assessments
SELECT 
  'Direct Assessment Query' as test,
  COUNT(*) as assessments_visible
FROM assessments;
