-- SHOW ALL DATA - Run this to see everything

-- 1. Show admin info
SELECT 'ADMIN INFO' as section, email, college_id, role FROM users WHERE role = 'admin';

-- 2. Show all students
SELECT 'STUDENTS' as section, email, college_id, department, role FROM users WHERE role = 'student';

-- 3. Show all assessments with student info
SELECT 
  'ASSESSMENTS' as section,
  u.email as student_email,
  u.college_id as student_college,
  a.date,
  a.risk_level,
  a.completed
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
ORDER BY a.date DESC;

-- 4. Show what admin dashboard SHOULD query
SELECT 
  'DASHBOARD QUERY' as section,
  a.date,
  a.risk_level,
  COUNT(*) as count
FROM assessments a
WHERE a.completed = true
  AND a.user_id IN (
    SELECT id FROM users 
    WHERE role = 'student' 
      AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  )
GROUP BY a.date, a.risk_level
ORDER BY a.date DESC;
