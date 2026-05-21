-- FIX DUPLICATE COLLEGES - Consolidate all data under ONE college

-- STEP 1: Identify the situation
SELECT 
  '=== CURRENT SITUATION ===' as step,
  'Colleges in system' as info;

SELECT 
  id as college_id,
  name as college_name,
  created_at,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id) as total_users,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'student') as students,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'admin') as admins,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'counsellor') as counsellors
FROM colleges
ORDER BY created_at;

-- STEP 2: Show assessments by college
SELECT 
  '=== ASSESSMENTS BY COLLEGE ===' as step;

SELECT 
  c.name as college_name,
  c.id as college_id,
  COUNT(DISTINCT a.user_id) as students_with_assessments,
  COUNT(a.id) as total_assessments
FROM colleges c
LEFT JOIN users u ON u.college_id = c.id AND u.role = 'student'
LEFT JOIN assessments a ON a.user_id = u.id
GROUP BY c.name, c.id
ORDER BY total_assessments DESC;

-- STEP 3: Identify the REAL college (the one with most data)
-- This will be college_id: 9f1a657b-99b5-4ace-a6b8-fb01744e5509 based on previous queries

SELECT 
  '=== CONSOLIDATION PLAN ===' as step,
  'Moving all users to college: 9f1a657b-99b5-4ace-a6b8-fb01744e5509' as action;

-- STEP 4: Move ALL users to the real college
UPDATE users
SET college_id = '9f1a657b-99b5-4ace-a6b8-fb01744e5509'
WHERE college_id != '9f1a657b-99b5-4ace-a6b8-fb01744e5509';

-- STEP 5: Verify all users are now in one college
SELECT 
  '=== AFTER CONSOLIDATION ===' as step;

SELECT 
  college_id,
  role,
  COUNT(*) as user_count,
  STRING_AGG(email, ', ') as emails
FROM users
GROUP BY college_id, role
ORDER BY role;

-- STEP 6: Delete duplicate/empty colleges (keep only the real one)
DELETE FROM colleges
WHERE id != '9f1a657b-99b5-4ace-a6b8-fb01744e5509';

-- STEP 7: Verify final state
SELECT 
  '=== FINAL STATE ===' as step;

SELECT 
  'Colleges remaining' as info,
  COUNT(*) as count
FROM colleges;

SELECT 
  'Users by role' as info,
  role,
  COUNT(*) as count
FROM users
GROUP BY role;

SELECT 
  'Your admin account' as info,
  email,
  role,
  college_id,
  (SELECT name FROM colleges WHERE id = users.college_id) as college_name
FROM users
WHERE email = 'codex5622@gmail.com';

SELECT 
  'Students in your college' as info,
  COUNT(*) as student_count
FROM users
WHERE role = 'student' 
  AND college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com');

SELECT 
  'Total assessments' as info,
  COUNT(*) as assessment_count
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com');
