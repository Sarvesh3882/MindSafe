-- SHOW COMPLETE DATABASE - Find your real college

-- 1. Show ALL colleges (grouped by college_id)
SELECT 
  'ALL COLLEGES' as section,
  college_id,
  COUNT(*) as user_count,
  STRING_AGG(DISTINCT role, ', ') as roles
FROM users
WHERE college_id IS NOT NULL
GROUP BY college_id
ORDER BY user_count DESC;

-- 2. Show ALL users grouped by college
SELECT 
  'USERS BY COLLEGE' as section,
  college_id,
  role,
  email,
  full_name
FROM users
WHERE college_id IS NOT NULL
ORDER BY college_id, role, email;

-- 3. Show which college has the most REAL data (assessments)
SELECT 
  'COLLEGE WITH MOST ASSESSMENTS' as section,
  u.college_id,
  COUNT(DISTINCT u.id) as student_count,
  COUNT(a.id) as assessment_count
FROM users u
LEFT JOIN assessments a ON a.user_id = u.id
WHERE u.role = 'student'
GROUP BY u.college_id
ORDER BY assessment_count DESC;

-- 4. Show YOUR current admin account details
SELECT 
  'YOUR ADMIN ACCOUNT' as section,
  email,
  college_id,
  full_name,
  role
FROM users
WHERE email = 'codex5622@gmail.com';
