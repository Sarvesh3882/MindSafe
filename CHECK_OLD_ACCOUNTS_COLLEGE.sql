-- Check what college_id the old working accounts are using
-- Run this in Supabase SQL Editor

-- Step 1: Find the old working accounts and their college_id
SELECT 
  email,
  full_name,
  role,
  college_id
FROM users
WHERE 
  email ILIKE '%sarvesh%' OR
  email ILIKE '%soham%' OR
  email ILIKE '%patel%' OR
  email ILIKE '%gitesh%' OR
  full_name ILIKE '%sarvesh%' OR
  full_name ILIKE '%soham%' OR
  full_name ILIKE '%patel%' OR
  full_name ILIKE '%gitesh%' OR
  full_name ILIKE '%demo%'
ORDER BY role, email;

-- Step 2: Get the college details for that college_id
-- (We'll see what college_id appears in Step 1, then check it here)
SELECT 
  c.id,
  c.name,
  c.plan_tier,
  c.active,
  COUNT(u.id) as user_count
FROM colleges c
LEFT JOIN users u ON c.id = u.college_id
GROUP BY c.id, c.name, c.plan_tier, c.active
ORDER BY user_count DESC;

-- Step 3: Show ALL users grouped by college_id
SELECT 
  college_id,
  role,
  COUNT(*) as count,
  STRING_AGG(full_name, ', ') as names
FROM users
GROUP BY college_id, role
ORDER BY college_id, role;

-- Step 4: Show users with NULL vs non-NULL college_id
SELECT 
  CASE 
    WHEN college_id IS NULL THEN 'NULL (invisible)'
    ELSE 'HAS COLLEGE (visible)'
  END as status,
  role,
  COUNT(*) as count,
  STRING_AGG(full_name, ', ') as names
FROM users
GROUP BY 
  CASE WHEN college_id IS NULL THEN 'NULL (invisible)' ELSE 'HAS COLLEGE (visible)' END,
  role
ORDER BY status, role;
