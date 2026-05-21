-- Create a Test Prescription
-- This will create a prescription so you can see it in the student dashboard

-- Step 1: Find a student
SELECT id, full_name, email, role FROM users WHERE role = 'student' LIMIT 5;

-- Step 2: Find a counsellor
SELECT id, full_name, email, role FROM users WHERE role = 'counsellor' LIMIT 5;

-- Step 3: Find a resource
SELECT id, title, category FROM resources LIMIT 10;

-- Step 4: Create the prescription
-- REPLACE THE UUIDs BELOW WITH ACTUAL VALUES FROM STEPS 1-3

/*
INSERT INTO resource_prescriptions (student_id, counsellor_id, resource_id)
VALUES (
  'PASTE_STUDENT_ID_HERE',
  'PASTE_COUNSELLOR_ID_HERE',
  'PASTE_RESOURCE_ID_HERE'
);
*/

-- Step 5: Verify it was created
SELECT 
  rp.id,
  s.full_name as student_name,
  s.email as student_email,
  c.full_name as counsellor_name,
  r.title as resource_title,
  r.category,
  rp.prescribed_at
FROM resource_prescriptions rp
JOIN users s ON s.id = rp.student_id
JOIN users c ON c.id = rp.counsellor_id
JOIN resources r ON r.id = rp.resource_id
ORDER BY rp.prescribed_at DESC;

-- Now login as the student and go to Resources page
-- You should see "Prescribed by Your Counsellor" section!
