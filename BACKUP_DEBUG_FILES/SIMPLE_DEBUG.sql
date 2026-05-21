-- SIMPLE DEBUG - Run this single query to see everything

-- Show all assessments with student info
SELECT 
  u.email as student_email,
  u.college_id as student_college_id,
  a.date as assessment_date,
  a.risk_level,
  a.completed,
  (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1) as admin_college_id,
  CASE 
    WHEN u.college_id = (SELECT college_id FROM users WHERE role = 'admin' LIMIT 1) 
    THEN '✅ MATCH' 
    ELSE '❌ MISMATCH' 
  END as college_match
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE u.role = 'student'
ORDER BY a.date DESC;
