-- Test prescription flow end-to-end
-- This script helps verify the entire prescription system

-- STEP 1: Get a counsellor and student from the same college
WITH test_users AS (
  SELECT 
    c.id as counsellor_id,
    c.full_name as counsellor_name,
    c.college_id,
    s.id as student_id,
    s.full_name as student_name
  FROM users c
  CROSS JOIN users s
  WHERE c.role = 'counsellor' 
    AND s.role = 'student'
    AND c.college_id = s.college_id
  LIMIT 1
)
SELECT * FROM test_users;

-- STEP 2: Get a resource to prescribe (preferably a Custom one)
SELECT 
  id as resource_id,
  title,
  category,
  type
FROM resources
WHERE category = 'Custom'
LIMIT 1;

-- If no Custom resources, get any resource:
-- SELECT id as resource_id, title, category FROM resources LIMIT 1;

-- STEP 3: Check existing prescriptions for this student
-- Replace STUDENT_ID with the student_id from STEP 1
-- SELECT * FROM resource_prescriptions WHERE student_id = 'STUDENT_ID';

-- STEP 4: Create a test prescription (if needed)
-- Replace the IDs with actual values from STEP 1 and STEP 2
-- INSERT INTO resource_prescriptions (student_id, counsellor_id, resource_id)
-- VALUES ('STUDENT_ID', 'COUNSELLOR_ID', 'RESOURCE_ID')
-- ON CONFLICT (student_id, resource_id) DO NOTHING
-- RETURNING *;

-- STEP 5: Verify the prescription was created
-- SELECT 
--   rp.id,
--   rp.student_id,
--   s.full_name as student_name,
--   rp.counsellor_id,
--   c.full_name as counsellor_name,
--   rp.resource_id,
--   r.title as resource_title,
--   rp.prescribed_at
-- FROM resource_prescriptions rp
-- JOIN users s ON s.id = rp.student_id
-- JOIN users c ON c.id = rp.counsellor_id
-- JOIN resources r ON r.id = rp.resource_id
-- WHERE rp.student_id = 'STUDENT_ID';

-- STEP 6: Test RLS - Check if student can see their prescription
-- (This needs to be run as the student user in the Supabase dashboard)
-- SELECT * FROM resource_prescriptions WHERE student_id = auth.uid();
