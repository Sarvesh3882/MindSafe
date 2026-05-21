-- Step 1: Check admin's college_id
SELECT 
  id,
  email,
  role,
  college_id,
  full_name
FROM users 
WHERE role = 'admin';

-- Step 2: Check what college_id the students have
SELECT DISTINCT college_id, COUNT(*) as student_count
FROM users 
WHERE role = 'student'
GROUP BY college_id;

-- Step 3: If admin's college_id is NULL or doesn't match students, fix it
-- Find the college_id that has students
SELECT college_id 
FROM users 
WHERE role = 'student' 
LIMIT 1;

-- Step 4: Update admin's college_id to match students
-- Replace 'codex5622@gmail.com' with your admin email if different
-- Replace the college_id in the subquery result
UPDATE users 
SET college_id = (
  SELECT college_id 
  FROM users 
  WHERE role = 'student' 
  LIMIT 1
)
WHERE role = 'admin' AND email = 'codex5622@gmail.com';

-- Step 5: Verify the fix
SELECT 
  u.email,
  u.role,
  u.college_id,
  (SELECT COUNT(*) FROM users WHERE role = 'student' AND college_id = u.college_id) as students_in_same_college
FROM users u
WHERE u.role = 'admin';
