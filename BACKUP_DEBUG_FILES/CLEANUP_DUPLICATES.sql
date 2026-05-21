-- COMPREHENSIVE CLEANUP: Check and remove duplicate colleges/accounts

-- ============================================
-- STEP 1: AUDIT CURRENT STATE
-- ============================================

SELECT '=== STEP 1: CURRENT STATE AUDIT ===' as step;

-- 1.1: All colleges in system
SELECT 
  '1.1 ALL COLLEGES' as check_type,
  id as college_id,
  name as college_name,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id) as total_users,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'student') as students,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'admin') as admins,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'counsellor') as counsellors
FROM colleges
ORDER BY name;

-- 1.2: Check for duplicate college names
SELECT 
  '1.2 DUPLICATE COLLEGE NAMES' as check_type,
  name as college_name,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as college_ids
FROM colleges
GROUP BY name
HAVING COUNT(*) > 1;

-- 1.3: All users grouped by college
SELECT 
  '1.3 USERS BY COLLEGE' as check_type,
  c.name as college_name,
  u.college_id,
  u.role,
  COUNT(*) as user_count,
  STRING_AGG(u.email, ', ' ORDER BY u.email) as emails
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
GROUP BY c.name, u.college_id, u.role
ORDER BY c.name, u.role;

-- 1.4: Check for duplicate user emails
SELECT 
  '1.4 DUPLICATE USER EMAILS' as check_type,
  email,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as user_ids,
  STRING_AGG(role, ', ') as roles,
  STRING_AGG(college_id::text, ', ') as college_ids
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- 1.5: Assessments by college
SELECT 
  '1.5 ASSESSMENTS BY COLLEGE' as check_type,
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

-- 1.6: Orphaned data (users without college)
SELECT 
  '1.6 ORPHANED USERS (no college)' as check_type,
  id,
  email,
  role,
  college_id
FROM users
WHERE college_id IS NULL OR college_id NOT IN (SELECT id FROM colleges);

-- ============================================
-- STEP 2: IDENTIFY WHAT TO KEEP
-- ============================================

SELECT '=== STEP 2: IDENTIFY PRIMARY COLLEGE ===' as step;

-- The college with the most data should be kept
SELECT 
  '2.1 PRIMARY COLLEGE (most data)' as info,
  c.id as college_id,
  c.name as college_name,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.role = 'student' THEN u.id END) as students,
  COUNT(a.id) as total_assessments
FROM colleges c
LEFT JOIN users u ON u.college_id = c.id
LEFT JOIN assessments a ON a.user_id = u.id
GROUP BY c.id, c.name
ORDER BY total_assessments DESC, total_users DESC
LIMIT 1;

-- ============================================
-- STEP 3: CLEANUP PLAN (PREVIEW - NOT EXECUTED YET)
-- ============================================

SELECT '=== STEP 3: CLEANUP PLAN (PREVIEW) ===' as step;

-- Show what would be deleted
SELECT 
  '3.1 COLLEGES TO DELETE' as action,
  c.id as college_id,
  c.name as college_name,
  (SELECT COUNT(*) FROM users WHERE college_id = c.id) as users_to_move
FROM colleges c
WHERE c.id != (
  SELECT c2.id
  FROM colleges c2
  LEFT JOIN users u ON u.college_id = c2.id
  LEFT JOIN assessments a ON a.user_id = u.id
  GROUP BY c2.id
  ORDER BY COUNT(a.id) DESC, COUNT(DISTINCT u.id) DESC
  LIMIT 1
);

-- Show users that would be moved
SELECT 
  '3.2 USERS TO MOVE' as action,
  u.email,
  u.role,
  u.college_id as current_college,
  (SELECT name FROM colleges WHERE id = u.college_id) as current_college_name,
  (
    SELECT c2.id
    FROM colleges c2
    LEFT JOIN users u2 ON u2.college_id = c2.id
    LEFT JOIN assessments a ON a.user_id = u2.id
    GROUP BY c2.id
    ORDER BY COUNT(a.id) DESC, COUNT(DISTINCT u2.id) DESC
    LIMIT 1
  ) as target_college
FROM users u
WHERE u.college_id != (
  SELECT c2.id
  FROM colleges c2
  LEFT JOIN users u2 ON u2.college_id = c2.id
  LEFT JOIN assessments a ON a.user_id = u2.id
  GROUP BY c2.id
  ORDER BY COUNT(a.id) DESC, COUNT(DISTINCT u2.id) DESC
  LIMIT 1
);

-- ============================================
-- STEP 4: SUMMARY
-- ============================================

SELECT '=== STEP 4: SUMMARY ===' as step;

SELECT 
  'Total Colleges' as metric,
  COUNT(*) as count
FROM colleges
UNION ALL
SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Total Assessments' as metric,
  COUNT(*) as count
FROM assessments
UNION ALL
SELECT 
  'Duplicate Colleges' as metric,
  COUNT(*) - 1 as count
FROM colleges
WHERE (SELECT COUNT(*) FROM colleges) > 1
UNION ALL
SELECT 
  'Duplicate User Emails' as metric,
  COUNT(*) as count
FROM (
  SELECT email
  FROM users
  GROUP BY email
  HAVING COUNT(*) > 1
) duplicates;

-- ============================================
-- INSTRUCTIONS
-- ============================================

SELECT '=== NEXT STEPS ===' as instructions;

SELECT 
  'Review the results above' as step_1,
  'If duplicates found, run EXECUTE_CLEANUP.sql' as step_2,
  'If no duplicates, you are good to go!' as step_3;
