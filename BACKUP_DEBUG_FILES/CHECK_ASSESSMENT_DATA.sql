-- Check if there are any assessments in the database
SELECT COUNT(*) as total_assessments FROM assessments;

-- Check assessments with details
SELECT 
  id,
  user_id,
  date,
  risk_level,
  completed,
  created_at
FROM assessments
ORDER BY created_at DESC
LIMIT 10;

-- Check if there are students
SELECT COUNT(*) as total_students FROM users WHERE role = 'student';

-- Check students with their college
SELECT 
  id,
  email,
  full_name,
  college_id,
  role
FROM users
WHERE role = 'student'
LIMIT 5;

-- Check if assessments are linked to students properly
SELECT 
  a.id as assessment_id,
  a.date,
  a.risk_level,
  a.completed,
  u.email as student_email,
  u.full_name as student_name,
  u.college_id
FROM assessments a
JOIN users u ON a.user_id = u.id
WHERE u.role = 'student'
ORDER BY a.created_at DESC
LIMIT 10;
