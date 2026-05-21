-- Check if admin user has college_id set
SELECT 
  id,
  email,
  role,
  college_id,
  full_name,
  created_at
FROM users 
WHERE role = 'admin';

-- If college_id is NULL, you need to set it
-- Replace 'your-admin-email@example.com' and 'actual-college-id' with real values
-- UPDATE users 
-- SET college_id = 'actual-college-id' 
-- WHERE role = 'admin' AND email = 'your-admin-email@example.com';
