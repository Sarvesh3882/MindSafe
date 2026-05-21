-- CHECK WHICH ASSESSMENTS ARE COMPLETED

-- Show all assessments with completion status
SELECT 
  u.email as student_email,
  a.date,
  a.risk_level,
  a.completed,
  CASE 
    WHEN a.completed = true THEN '✅ Completed'
    ELSE '❌ Not Completed'
  END as status
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
ORDER BY a.date DESC;

-- Count by completion status
SELECT 
  'Completion Status' as section,
  a.completed,
  COUNT(*) as count
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
GROUP BY a.completed;

-- If there are incomplete assessments, mark them as completed
-- UPDATE assessments 
-- SET completed = true
-- WHERE user_id IN (
--   SELECT id FROM users 
--   WHERE role = 'student' 
--     AND college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1)
-- )
-- AND completed = false;
