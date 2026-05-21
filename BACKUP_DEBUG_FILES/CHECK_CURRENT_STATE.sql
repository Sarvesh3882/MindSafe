-- Quick check of current state

-- 1. Your admin account
SELECT 
  'YOUR ACCOUNT' as info,
  email,
  role,
  college_id,
  full_name
FROM users
WHERE email = 'codex5622@gmail.com';

-- 2. College details
SELECT 
  'YOUR COLLEGE' as info,
  c.id as college_id,
  c.name as college_name,
  c.created_at
FROM colleges c
WHERE c.id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com');

-- 3. Students in your college
SELECT 
  'STUDENTS IN YOUR COLLEGE' as info,
  COUNT(*) as student_count,
  STRING_AGG(email, ', ') as student_emails
FROM users
WHERE role = 'student' 
  AND college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com');

-- 4. Assessments for students in your college
SELECT 
  'ASSESSMENTS' as info,
  COUNT(*) as total_assessments,
  COUNT(DISTINCT user_id) as students_with_assessments,
  COUNT(CASE WHEN completed = true THEN 1 END) as completed_assessments
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com')
);

-- 5. All colleges in system
SELECT 
  'ALL COLLEGES' as info,
  id,
  name,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id) as total_users
FROM colleges
ORDER BY created_at;
