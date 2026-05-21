-- SIMPLE CLEANUP CHECK - No created_at columns

-- ============================================
-- STEP 1: CHECK COLLEGES
-- ============================================

SELECT '=== ALL COLLEGES ===' as step;

SELECT 
  id as college_id,
  name as college_name,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id) as total_users,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'student') as students,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'admin') as admins,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'counsellor') as counsellors,
  (SELECT COUNT(*) FROM assessments a JOIN users u ON u.id = a.user_id WHERE u.college_id = colleges.id) as total_assessments
FROM colleges
ORDER BY name;

-- ============================================
-- STEP 2: CHECK FOR DUPLICATES
-- ============================================

SELECT '=== DUPLICATE COLLEGE NAMES ===' as step;

SELECT 
  name as college_name,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as college_ids
FROM colleges
GROUP BY name
HAVING COUNT(*) > 1;

-- ============================================
-- STEP 3: YOUR ADMIN ACCOUNT
-- ============================================

SELECT '=== YOUR ADMIN ACCOUNT ===' as step;

SELECT 
  u.email,
  u.role,
  u.college_id,
  c.name as college_name,
  u.full_name,
  (SELECT COUNT(*) FROM users WHERE college_id = u.college_id AND role = 'student') as students_in_college,
  (SELECT COUNT(*) FROM assessments a JOIN users u2 ON u2.id = a.user_id WHERE u2.college_id = u.college_id) as assessments_in_college
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
WHERE u.email = 'codex5622@gmail.com';

-- ============================================
-- STEP 4: USERS BY COLLEGE
-- ============================================

SELECT '=== USERS BY COLLEGE ===' as step;

SELECT 
  c.name as college_name,
  u.role,
  COUNT(*) as user_count,
  STRING_AGG(u.email, ', ' ORDER BY u.email) as emails
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
GROUP BY c.name, u.role
ORDER BY c.name, u.role;

-- ============================================
-- STEP 5: DUPLICATE USER EMAILS
-- ============================================

SELECT '=== DUPLICATE USER EMAILS ===' as step;

SELECT 
  email,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as user_ids,
  STRING_AGG(role, ', ') as roles
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- ============================================
-- STEP 6: ASSESSMENTS BY COLLEGE
-- ============================================

SELECT '=== ASSESSMENTS BY COLLEGE ===' as step;

SELECT 
  c.name as college_name,
  c.id as college_id,
  COUNT(DISTINCT u.id) as students_with_assessments,
  COUNT(a.id) as total_assessments,
  COUNT(CASE WHEN a.completed = true THEN 1 END) as completed_assessments
FROM colleges c
LEFT JOIN users u ON u.college_id = c.id AND u.role = 'student'
LEFT JOIN assessments a ON a.user_id = u.id
GROUP BY c.name, c.id
ORDER BY total_assessments DESC;

-- ============================================
-- STEP 7: SUMMARY
-- ============================================

SELECT '=== SUMMARY ===' as step;

SELECT 
  'Total Colleges' as metric,
  COUNT(*)::text as value
FROM colleges
UNION ALL
SELECT 
  'Total Users',
  COUNT(*)::text
FROM users
UNION ALL
SELECT 
  'Total Students',
  COUNT(*)::text
FROM users WHERE role = 'student'
UNION ALL
SELECT 
  'Total Admins',
  COUNT(*)::text
FROM users WHERE role = 'admin'
UNION ALL
SELECT 
  'Total Counsellors',
  COUNT(*)::text
FROM users WHERE role = 'counsellor'
UNION ALL
SELECT 
  'Total Assessments',
  COUNT(*)::text
FROM assessments
UNION ALL
SELECT 
  'Colleges with Data',
  COUNT(DISTINCT u.college_id)::text
FROM users u
JOIN assessments a ON a.user_id = u.id;

-- ============================================
-- STEP 8: RECOMMENDATION
-- ============================================

SELECT '=== RECOMMENDATION ===' as step;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM colleges) > 1 THEN 
      'Multiple colleges found. Review results and run EXECUTE_CLEANUP.sql if needed.'
    WHEN EXISTS (SELECT 1 FROM users GROUP BY email HAVING COUNT(*) > 1) THEN
      'Duplicate user emails found. Manual cleanup may be needed.'
    ELSE 
      'Database looks clean! No duplicates found.'
  END as recommendation;
