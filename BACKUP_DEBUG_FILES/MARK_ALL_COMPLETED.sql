-- MARK ALL ASSESSMENTS AS COMPLETED
-- This will give us more data to display in the dashboard

-- First, check current status
SELECT 
  'Before Update' as status,
  completed,
  COUNT(*) as count
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
GROUP BY completed;

-- Update all assessments to completed = true
UPDATE assessments 
SET completed = true
WHERE user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
AND completed = false;

-- Check after update
SELECT 
  'After Update' as status,
  completed,
  COUNT(*) as count
FROM assessments a
WHERE a.user_id IN (
  SELECT id FROM users 
  WHERE role = 'student' 
    AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
)
GROUP BY completed;

-- Show all assessments with dates
SELECT 
  'All Completed Assessments' as section,
  u.email as student,
  a.date,
  a.risk_level,
  a.completed
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
  AND a.completed = true
ORDER BY a.date;
