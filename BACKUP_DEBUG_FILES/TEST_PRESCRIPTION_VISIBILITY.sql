-- Test Prescription Visibility for Students

-- Step 1: Check if any prescriptions exist
SELECT 
  COUNT(*) as total_prescriptions,
  COUNT(DISTINCT student_id) as students_with_prescriptions,
  COUNT(DISTINCT counsellor_id) as counsellors_who_prescribed
FROM resource_prescriptions;

-- Step 2: See all prescriptions with details
SELECT 
  rp.id as prescription_id,
  s.full_name as student_name,
  s.email as student_email,
  c.full_name as counsellor_name,
  r.title as resource_title,
  r.category as resource_category,
  rp.prescribed_at
FROM resource_prescriptions rp
JOIN users s ON s.id = rp.student_id
JOIN users c ON c.id = rp.counsellor_id
JOIN resources r ON r.id = rp.resource_id
ORDER BY rp.prescribed_at DESC;

-- Step 3: Check RLS policies
SELECT 
  policyname,
  cmd as command,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'resource_prescriptions'
ORDER BY cmd, policyname;

-- Step 4: If no prescriptions exist, here's how to create a test one
-- (Replace the UUIDs with actual IDs from your database)

/*
-- Get a student ID
SELECT id, full_name, email FROM users WHERE role = 'student' LIMIT 1;

-- Get a counsellor ID  
SELECT id, full_name, email FROM users WHERE role = 'counsellor' LIMIT 1;

-- Get a resource ID
SELECT id, title FROM resources LIMIT 1;

-- Create test prescription (replace UUIDs)
INSERT INTO resource_prescriptions (student_id, counsellor_id, resource_id)
VALUES (
  'STUDENT_UUID_HERE',
  'COUNSELLOR_UUID_HERE',
  'RESOURCE_UUID_HERE'
);
*/

-- Step 5: Verify the prescription was created
SELECT 
  rp.*,
  s.full_name as student_name,
  c.full_name as counsellor_name,
  r.title as resource_title
FROM resource_prescriptions rp
JOIN users s ON s.id = rp.student_id
JOIN users c ON c.id = rp.counsellor_id
JOIN resources r ON r.id = rp.resource_id
ORDER BY rp.prescribed_at DESC
LIMIT 5;
