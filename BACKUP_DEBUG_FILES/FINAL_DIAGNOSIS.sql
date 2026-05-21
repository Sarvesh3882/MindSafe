-- FINAL COMPREHENSIVE DIAGNOSIS

-- 1. Show admin details
SELECT 
  'ADMIN' as type,
  id,
  email,
  college_id,
  role
FROM users 
WHERE role = 'admin';

-- 2. Show ALL students with their college_id
SELECT 
  'STUDENTS' as type,
  id,
  email,
  college_id,
  role
FROM users 
WHERE role = 'student';

-- 3. Show ALL assessments with dates (no filters)
SELECT 
  'ALL ASSESSMENTS' as type,
  a.id,
  u.email as student_email,
  u.college_id as student_college,
  a.date,
  a.risk_level,
  a.completed,
  CURRENT_DATE - a.date as days_old
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
ORDER BY a.date DESC;

-- 4. Show assessments from last 30 days
SELECT 
  'LAST 30 DAYS' as type,
  COUNT(*) as count,
  u.college_id
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND a.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.college_id;

-- 5. Check if admin college_id matches any students
SELECT 
  'COLLEGE MATCH CHECK' as type,
  (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1) as admin_college,
  (SELECT college_id FROM users WHERE role = 'student' LIMIT 1) as student_college,
  CASE 
    WHEN (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1) = 
         (SELECT college_id FROM users WHERE role = 'student' LIMIT 1)
    THEN '✅ MATCH'
    ELSE '❌ MISMATCH - THIS IS THE PROBLEM!'
  END as status;

-- 6. Show what query admin dashboard is running
SELECT 
  'WHAT ADMIN SHOULD SEE' as type,
  COUNT(*) as assessment_count,
  MIN(a.date) as oldest_date,
  MAX(a.date) as newest_date
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  AND a.date >= CURRENT_DATE - INTERVAL '30 days';
