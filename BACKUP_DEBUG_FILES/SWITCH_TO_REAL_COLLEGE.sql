-- SWITCH TO THE COLLEGE WITH REAL DATA

-- Step 1: Check which college has the most assessments
SELECT 
  'ASSESSMENTS BY COLLEGE' as check_type,
  u.college_id,
  COUNT(DISTINCT u.id) as students,
  COUNT(a.id) as assessments
FROM users u
LEFT JOIN assessments a ON a.user_id = u.id
WHERE u.role = 'student'
GROUP BY u.college_id
ORDER BY assessments DESC;

-- Step 2: Show users in the college with MOST assessments
SELECT 
  'USERS IN REAL COLLEGE' as info,
  u.email,
  u.role,
  u.full_name,
  COUNT(a.id) as assessment_count
FROM users u
LEFT JOIN assessments a ON a.user_id = u.id
WHERE u.college_id = '9f1a657b-99b5-4ace-a6b8-fb01744e5509'
GROUP BY u.email, u.role, u.full_name
ORDER BY u.role, assessment_count DESC;

-- Step 3: Update YOUR admin to use the college with MOST data
UPDATE users
SET college_id = '9f1a657b-99b5-4ace-a6b8-fb01744e5509'
WHERE email = 'codex5622@gmail.com' AND role = 'admin';

-- Step 4: Verify
SELECT 
  'AFTER UPDATE' as status,
  email,
  college_id,
  role,
  (SELECT COUNT(*) FROM users WHERE role = 'student' AND college_id = '9f1a657b-99b5-4ace-a6b8-fb01744e5509') as students_in_college
FROM users
WHERE email = 'codex5622@gmail.com';
