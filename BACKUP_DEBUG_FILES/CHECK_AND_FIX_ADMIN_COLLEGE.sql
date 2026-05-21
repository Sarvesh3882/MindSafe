-- Step 1: Check if admin has college_id
SELECT 
  id,
  email,
  role,
  college_id,
  full_name
FROM users 
WHERE role = 'admin';

-- If college_id is NULL, first find your college_id:
SELECT id, name FROM colleges;

-- Step 2: Set college_id for admin (replace 'your-college-id' with actual ID from above)
-- Uncomment and run this if college_id is NULL:
-- UPDATE users 
-- SET college_id = 'your-college-id-here' 
-- WHERE role = 'admin' AND email = 'codex5622@gmail.com';

-- Step 3: Verify it was set
SELECT 
  id,
  email,
  role,
  college_id,
  full_name
FROM users 
WHERE role = 'admin';
