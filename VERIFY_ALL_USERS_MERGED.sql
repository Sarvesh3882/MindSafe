-- VERIFY: All users should now be in one database and visible

-- Check 1: Count users by role (should show all 19 users)
SELECT 
  role,
  COUNT(*) as total_count,
  STRING_AGG(full_name, ', ' ORDER BY full_name) as all_names
FROM users
GROUP BY role
ORDER BY role;

-- Check 2: Verify NO users have NULL college_id
SELECT 
  COUNT(*) as users_with_null_college_id
FROM users
WHERE college_id IS NULL;

-- Check 3: Verify all users are connected to K.K Wagh Institute
SELECT 
  c.name as college_name,
  u.role,
  COUNT(*) as count,
  STRING_AGG(u.full_name, ', ' ORDER BY u.full_name) as names
FROM users u
JOIN colleges c ON u.college_id = c.id
GROUP BY c.name, u.role
ORDER BY u.role;

-- Check 4: Verify Japesh and other new accounts are now visible
SELECT 
  full_name,
  email,
  role,
  college_id
FROM users
WHERE 
  full_name ILIKE '%japesh%' OR
  full_name ILIKE '%newuser%' OR
  email ILIKE '%japesh%' OR
  email ILIKE '%newuser%'
ORDER BY full_name;
