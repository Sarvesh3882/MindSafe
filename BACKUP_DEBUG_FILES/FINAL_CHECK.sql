-- FINAL CHECK - No auth.uid() dependency

-- 1. Show admin user details
SELECT 
  'Admin User' as section,
  id,
  email,
  role,
  college_id
FROM users 
WHERE role = 'admin'
LIMIT 1;

-- 2. Show all students
SELECT 
  'Students' as section,
  COUNT(*) as total_students,
  college_id
FROM users 
WHERE role = 'student'
GROUP BY college_id;

-- 3. Show all assessments (no RLS, using service role)
SELECT 
  'All Assessments' as section,
  COUNT(*) as total_assessments,
  COUNT(DISTINCT user_id) as unique_students,
  COUNT(CASE WHEN completed = true THEN 1 END) as completed_assessments
FROM assessments;

-- 4. Show assessments joined with students
SELECT 
  'Assessments by College' as section,
  u.college_id,
  COUNT(*) as assessment_count,
  COUNT(DISTINCT a.user_id) as unique_students
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND a.completed = true
GROUP BY u.college_id;

-- 5. Show what admin SHOULD see (matching college_id)
SELECT 
  'What Admin Should See' as section,
  COUNT(*) as assessments_admin_should_see
FROM assessments a
JOIN users student ON student.id = a.user_id
JOIN users admin ON admin.college_id = student.college_id
WHERE admin.role = 'admin'
  AND student.role = 'student'
  AND a.completed = true
LIMIT 1;
