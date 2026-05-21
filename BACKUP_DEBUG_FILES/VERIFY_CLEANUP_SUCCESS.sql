-- VERIFY CLEANUP WAS SUCCESSFUL

SELECT '=== VERIFICATION AFTER CLEANUP ===' as status;

-- 1. Check how many colleges remain
SELECT 
  '1. COLLEGES REMAINING' as check_type,
  COUNT(*) as college_count,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ Perfect! Only one college'
    WHEN COUNT(*) > 1 THEN '⚠️ Still multiple colleges'
    ELSE '❌ No colleges found'
  END as status
FROM colleges;

-- 2. Show the remaining college details
SELECT 
  '2. YOUR COLLEGE DETAILS' as check_type,
  c.id as college_id,
  c.name as college_name,
  (SELECT COUNT(*) FROM users WHERE college_id = c.id) as total_users,
  (SELECT COUNT(*) FROM users WHERE college_id = c.id AND role = 'student') as students,
  (SELECT COUNT(*) FROM users WHERE college_id = c.id AND role = 'admin') as admins,
  (SELECT COUNT(*) FROM users WHERE college_id = c.id AND role = 'counsellor') as counsellors,
  (SELECT COUNT(*) FROM assessments a JOIN users u ON u.id = a.user_id WHERE u.college_id = c.id) as total_assessments
FROM colleges c;

-- 3. Verify your admin account
SELECT 
  '3. YOUR ADMIN ACCOUNT' as check_type,
  u.email,
  u.role,
  u.college_id,
  c.name as college_name,
  u.full_name,
  CASE 
    WHEN u.college_id IS NOT NULL THEN '✅ Linked to college'
    ELSE '❌ Not linked to college'
  END as status
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
WHERE u.email = 'codex5622@gmail.com';

-- 4. All users in the system
SELECT 
  '4. ALL USERS BY ROLE' as check_type,
  role,
  COUNT(*) as count,
  STRING_AGG(email, ', ' ORDER BY email) as emails
FROM users
GROUP BY role
ORDER BY role;

-- 5. Check for orphaned users (users without valid college)
SELECT 
  '5. ORPHANED USERS CHECK' as check_type,
  COUNT(*) as orphaned_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No orphaned users'
    ELSE '⚠️ Found users without valid college'
  END as status
FROM users
WHERE college_id IS NULL 
   OR college_id NOT IN (SELECT id FROM colleges);

-- 6. Assessment data verification
SELECT 
  '6. ASSESSMENT DATA' as check_type,
  COUNT(*) as total_assessments,
  COUNT(DISTINCT user_id) as students_with_assessments,
  COUNT(CASE WHEN completed = true THEN 1 END) as completed_assessments,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Assessments found'
    ELSE '⚠️ No assessments'
  END as status
FROM assessments;

-- 7. Students in your college
SELECT 
  '7. STUDENTS IN YOUR COLLEGE' as check_type,
  u.email,
  u.full_name,
  u.department,
  COUNT(a.id) as assessment_count
FROM users u
LEFT JOIN assessments a ON a.user_id = u.id
WHERE u.college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com')
  AND u.role = 'student'
GROUP BY u.email, u.full_name, u.department
ORDER BY assessment_count DESC;

-- 8. Recent assessments
SELECT 
  '8. RECENT ASSESSMENTS' as check_type,
  u.email as student_email,
  a.date,
  a.risk_level,
  a.completed
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.college_id = (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com')
ORDER BY a.date DESC
LIMIT 10;

-- 9. Final summary
SELECT 
  '9. FINAL SUMMARY' as check_type,
  'Colleges' as metric,
  COUNT(*)::text as value
FROM colleges
UNION ALL
SELECT 
  '9. FINAL SUMMARY',
  'Total Users',
  COUNT(*)::text
FROM users
UNION ALL
SELECT 
  '9. FINAL SUMMARY',
  'Students',
  COUNT(*)::text
FROM users WHERE role = 'student'
UNION ALL
SELECT 
  '9. FINAL SUMMARY',
  'Admins',
  COUNT(*)::text
FROM users WHERE role = 'admin'
UNION ALL
SELECT 
  '9. FINAL SUMMARY',
  'Counsellors',
  COUNT(*)::text
FROM users WHERE role = 'counsellor'
UNION ALL
SELECT 
  '9. FINAL SUMMARY',
  'Total Assessments',
  COUNT(*)::text
FROM assessments;

-- 10. Overall health check
SELECT 
  '10. OVERALL HEALTH CHECK' as check_type,
  CASE 
    WHEN (SELECT COUNT(*) FROM colleges) = 1 
     AND (SELECT COUNT(*) FROM users WHERE college_id IS NULL OR college_id NOT IN (SELECT id FROM colleges)) = 0
     AND (SELECT COUNT(*) FROM assessments) > 0
     AND (SELECT college_id FROM users WHERE email = 'codex5622@gmail.com') IS NOT NULL
    THEN '✅ DATABASE IS CLEAN AND HEALTHY!'
    ELSE '⚠️ Some issues may remain - review results above'
  END as overall_status;
