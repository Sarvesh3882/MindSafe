-- Check if there are any prescriptions in the database

-- 1. Check total prescriptions
SELECT COUNT(*) as total_prescriptions FROM resource_prescriptions;

-- 2. Check prescriptions by student
SELECT 
  rp.id,
  rp.student_id,
  s.full_name as student_name,
  s.email as student_email,
  rp.counsellor_id,
  c.full_name as counsellor_name,
  rp.resource_id,
  r.title as resource_title,
  rp.prescribed_at
FROM resource_prescriptions rp
LEFT JOIN users s ON s.id = rp.student_id
LEFT JOIN users c ON c.id = rp.counsellor_id
LEFT JOIN resources r ON r.id = rp.resource_id
ORDER BY rp.prescribed_at DESC;

-- 3. Check RLS policies on resource_prescriptions
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'resource_prescriptions'
ORDER BY policyname;

-- 4. Check if student can see their prescriptions (run as student)
-- Replace 'STUDENT_USER_ID' with actual student user ID
-- SELECT * FROM resource_prescriptions WHERE student_id = 'STUDENT_USER_ID';
