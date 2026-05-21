-- VERIFY ADMIN DASHBOARD DATA FLOW
-- Run this to check if all data is correctly set up for the wellness graphs

-- 1. Check admin's college_id matches students
SELECT 
  'Admin College ID' as check_type,
  u.email as admin_email,
  u.college_id as admin_college_id,
  (SELECT COUNT(*) FROM users WHERE role = 'student' AND college_id = u.college_id) as students_in_same_college
FROM users u
WHERE u.role = 'admin'
LIMIT 1;

-- 2. Check total students in admin's college
SELECT 
  'Total Students' as check_type,
  COUNT(*) as count
FROM users
WHERE role = 'student' 
  AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1);

-- 3. Check assessments for students in admin's college
SELECT 
  'Total Assessments' as check_type,
  COUNT(*) as count
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
AND a.completed = true;

-- 4. Check recent assessments (last 30 days) for trend data
SELECT 
  'Recent Assessments (30d)' as check_type,
  COUNT(*) as count
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
AND a.completed = true
AND a.date >= CURRENT_DATE - INTERVAL '30 days';

-- 5. Check risk level distribution
SELECT 
  'Risk Level Distribution' as check_type,
  a.risk_level,
  COUNT(*) as count
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
AND a.completed = true
GROUP BY a.risk_level;

-- 6. Check trend data by date (last 30 days)
SELECT 
  a.date,
  COUNT(*) as total_checkins,
  SUM(CASE WHEN a.risk_level = 'stable' THEN 1 ELSE 0 END) as stable_count,
  SUM(CASE WHEN a.risk_level = 'attention' THEN 1 ELSE 0 END) as attention_count,
  SUM(CASE WHEN a.risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
AND a.completed = true
AND a.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY a.date
ORDER BY a.date DESC
LIMIT 10;

-- 7. Check if there are any students without assessments
SELECT 
  'Students Without Assessments' as check_type,
  COUNT(*) as count
FROM users u
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  AND NOT EXISTS (
    SELECT 1 FROM assessments a 
    WHERE a.user_id = u.id AND a.completed = true
  );
