-- DEBUG TREND DATA ISSUE
-- Run this to see exactly what data exists and why trend might be empty

-- 1. Check admin and student college_id match
SELECT 
  'College ID Check' as test,
  (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1) as admin_college_id,
  (SELECT college_id FROM users WHERE role = 'student' LIMIT 1) as student_college_id,
  CASE 
    WHEN (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1) = 
         (SELECT college_id FROM users WHERE role = 'student' LIMIT 1) 
    THEN '✅ MATCH' 
    ELSE '❌ MISMATCH' 
  END as status;

-- 2. Check total students in admin's college
SELECT 
  'Total Students' as test,
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ NO STUDENTS' END as status
FROM users
WHERE role = 'student' 
  AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1);

-- 3. Check total assessments for those students
SELECT 
  'Total Assessments' as test,
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ NO ASSESSMENTS' END as status
FROM assessments a
WHERE a.completed = true
  AND a.user_id IN (
    SELECT id FROM users 
    WHERE role = 'student' 
      AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  );

-- 4. Show actual assessment dates (to see if they're too old)
SELECT 
  a.date,
  a.risk_level,
  u.email as student_email,
  CURRENT_DATE - a.date as days_ago,
  CASE 
    WHEN CURRENT_DATE - a.date <= 7 THEN '✅ Within 7 days'
    WHEN CURRENT_DATE - a.date <= 30 THEN '⚠️ Within 30 days'
    WHEN CURRENT_DATE - a.date <= 90 THEN '⚠️ Within 90 days'
    ELSE '❌ Older than 90 days'
  END as age_status
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE a.completed = true
  AND a.user_id IN (
    SELECT id FROM users 
    WHERE role = 'student' 
      AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  )
ORDER BY a.date DESC
LIMIT 20;

-- 5. Check if assessments have valid risk_level
SELECT 
  'Risk Level Check' as test,
  a.risk_level,
  COUNT(*) as count
FROM assessments a
WHERE a.completed = true
  AND a.user_id IN (
    SELECT id FROM users 
    WHERE role = 'student' 
      AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  )
GROUP BY a.risk_level;

-- 6. Show what the trend data should look like
SELECT 
  a.date,
  COUNT(*) as total_checkins,
  SUM(CASE WHEN a.risk_level = 'stable' THEN 1 ELSE 0 END) as stable,
  SUM(CASE WHEN a.risk_level = 'attention' THEN 1 ELSE 0 END) as attention,
  SUM(CASE WHEN a.risk_level = 'critical' THEN 1 ELSE 0 END) as critical
FROM assessments a
WHERE a.completed = true
  AND a.user_id IN (
    SELECT id FROM users 
    WHERE role = 'student' 
      AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  )
GROUP BY a.date
ORDER BY a.date DESC
LIMIT 10;

-- 7. Check if there are any NULL values causing issues
SELECT 
  'NULL Value Check' as test,
  COUNT(*) as total_assessments,
  SUM(CASE WHEN date IS NULL THEN 1 ELSE 0 END) as null_dates,
  SUM(CASE WHEN risk_level IS NULL THEN 1 ELSE 0 END) as null_risk_levels,
  SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as null_user_ids,
  SUM(CASE WHEN completed IS NULL THEN 1 ELSE 0 END) as null_completed
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
);
