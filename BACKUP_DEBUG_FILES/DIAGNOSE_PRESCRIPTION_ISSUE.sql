-- Comprehensive diagnosis for prescription visibility issue
-- Run this to understand why prescribed resources aren't showing

-- 1. Check total prescriptions in database
SELECT 
  COUNT(*) as total_prescriptions,
  COUNT(DISTINCT student_id) as students_with_prescriptions,
  COUNT(DISTINCT counsellor_id) as counsellors_who_prescribed,
  COUNT(DISTINCT resource_id) as unique_resources_prescribed
FROM resource_prescriptions;

-- 2. Check all prescriptions with full details
SELECT 
  rp.id as prescription_id,
  rp.student_id,
  s.full_name as student_name,
  s.email as student_email,
  rp.counsellor_id,
  c.full_name as counsellor_name,
  rp.resource_id,
  r.title as resource_title,
  r.category as resource_category,
  rp.prescribed_at
FROM resource_prescriptions rp
LEFT JOIN users s ON s.id = rp.student_id
LEFT JOIN users c ON c.id = rp.counsellor_id
LEFT JOIN resources r ON r.id = rp.resource_id
ORDER BY rp.prescribed_at DESC;

-- 3. Check if resource IDs in prescriptions match actual resources
SELECT 
  rp.resource_id,
  CASE 
    WHEN r.id IS NULL THEN 'MISSING - Resource does not exist!'
    ELSE 'OK - Resource exists'
  END as status,
  r.title as resource_title
FROM resource_prescriptions rp
LEFT JOIN resources r ON r.id = rp.resource_id;

-- 4. Check RLS policies on resource_prescriptions
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'resource_prescriptions'
ORDER BY policyname;

-- 5. Get a specific student's prescriptions (replace with actual student ID)
-- To get student ID, first run: SELECT id, email, full_name FROM users WHERE role = 'student';
-- Then replace 'YOUR_STUDENT_ID_HERE' below:

-- SELECT 
--   rp.id,
--   rp.resource_id,
--   r.title,
--   r.category,
--   rp.prescribed_at,
--   c.full_name as counsellor_name
-- FROM resource_prescriptions rp
-- JOIN resources r ON r.id = rp.resource_id
-- JOIN users c ON c.id = rp.counsellor_id
-- WHERE rp.student_id = 'YOUR_STUDENT_ID_HERE'
-- ORDER BY rp.prescribed_at DESC;

-- 6. Check if there are any resources at all
SELECT 
  COUNT(*) as total_resources,
  COUNT(CASE WHEN category = 'Custom' THEN 1 END) as custom_resources,
  COUNT(CASE WHEN college_id IS NOT NULL THEN 1 END) as college_specific_resources
FROM resources;

-- 7. List all students for reference
SELECT 
  id,
  email,
  full_name,
  role,
  college_id
FROM users 
WHERE role = 'student'
ORDER BY full_name;
