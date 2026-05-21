-- COMPREHENSIVE DIAGNOSIS: Check for duplicate colleges and data integrity

-- 1. Show ALL colleges in the system
SELECT 
  'ALL COLLEGES' as info,
  id as college_id,
  name as college_name
FROM colleges
ORDER BY name;

-- 2. Show ALL users grouped by college
SELECT 
  'USERS BY COLLEGE' as info,
  c.name as college_name,
  u.college_id,
  u.role,
  COUNT(*) as user_count,
  STRING_AGG(u.email, ', ') as emails
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
GROUP BY c.name, u.college_id, u.role
ORDER BY c.name, u.role;

-- 3. Show assessments by college
SELECT 
  'ASSESSMENTS BY COLLEGE' as info,
  c.name as college_name,
  u.college_id,
  COUNT(DISTINCT u.id) as students_with_assessments,
  COUNT(a.id) as total_assessments,
  COUNT(CASE WHEN a.completed = true THEN 1 END) as completed_assessments
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
LEFT JOIN assessments a ON a.user_id = u.id
WHERE u.role = 'student'
GROUP BY c.name, u.college_id
ORDER BY total_assessments DESC;

-- 4. Show YOUR current admin account details
SELECT 
  'YOUR ADMIN ACCOUNT' as info,
  u.email,
  u.role,
  u.college_id,
  c.name as college_name,
  u.full_name
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
WHERE u.email = 'codex5622@gmail.com';

-- 5. Show students in YOUR college
SELECT 
  'STUDENTS IN YOUR COLLEGE' as info,
  u.email,
  u.full_name,
  u.department,
  u.year_of_study,
  COUNT(a.id) as assessment_count
FROM users u
LEFT JOIN assessments a ON a.user_id = u.id
WHERE u.college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com')
  AND u.role = 'student'
GROUP BY u.email, u.full_name, u.department, u.year_of_study
ORDER BY assessment_count DESC;

-- 6. Check if there are multiple colleges with same name (duplicates)
SELECT 
  'DUPLICATE COLLEGE NAMES' as info,
  name as college_name,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as college_ids
FROM colleges
GROUP BY name
HAVING COUNT(*) > 1;

-- 7. Show recent assessments for students in YOUR college
SELECT 
  'RECENT ASSESSMENTS IN YOUR COLLEGE' as info,
  u.email as student_email,
  a.date,
  a.risk_level,
  a.completed
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com')
  AND u.role = 'student'
ORDER BY a.date DESC
LIMIT 20;
