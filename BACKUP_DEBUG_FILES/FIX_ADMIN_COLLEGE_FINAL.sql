-- FIX ADMIN COLLEGE_ID TO MATCH REAL STUDENTS
-- This will update your admin account to see your real students

-- Step 1: Show ALL users with their college_ids
SELECT 
  'ALL USERS' as section,
  email,
  role,
  college_id,
  full_name
FROM users
ORDER BY role, email;

-- Step 2: Find the college_id that has the MOST students (your real college)
SELECT 
  'REAL COLLEGE' as section,
  college_id,
  COUNT(*) as student_count
FROM users
WHERE role = 'student'
GROUP BY college_id
ORDER BY COUNT(*) DESC
LIMIT 1;

-- Step 3: Update YOUR admin account (codex5622@gmail.com) to use the REAL college_id
-- This will make your admin see all your real students
UPDATE users
SET college_id = (
  SELECT college_id
  FROM users
  WHERE role = 'student'
  GROUP BY college_id
  ORDER BY COUNT(*) DESC
  LIMIT 1
)
WHERE email = 'codex5622@gmail.com' AND role = 'admin';

-- Step 4: Verify the fix
SELECT 
  'AFTER FIX' as section,
  u.email,
  u.role,
  u.college_id,
  (SELECT COUNT(*) FROM users WHERE role = 'student' AND college_id = u.college_id) as students_in_same_college
FROM users u
WHERE u.email = 'codex5622@gmail.com';
