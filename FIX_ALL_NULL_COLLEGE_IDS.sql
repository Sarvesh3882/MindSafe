-- Fix ALL NULL college_ids - Complete Solution
-- Run this in Supabase SQL Editor

-- Step 1: Check if any college exists
SELECT * FROM colleges;

-- Step 2: Create a college if none exists
INSERT INTO colleges (name, plan_tier, active, onboarded_at)
VALUES ('Demo College', 'basic', true, NOW())
ON CONFLICT DO NOTHING
RETURNING id, name;

-- Step 3: Get the college ID (copy this UUID)
SELECT id, name FROM colleges LIMIT 1;

-- Step 4: Update ALL users with this college_id
-- REPLACE 'YOUR_COLLEGE_UUID_HERE' with the UUID from Step 3
UPDATE users
SET college_id = 'YOUR_COLLEGE_UUID_HERE'
WHERE college_id IS NULL;

-- Step 5: Verify the fix
SELECT 
  email,
  full_name,
  role,
  college_id,
  CASE 
    WHEN college_id IS NULL THEN '❌ NULL'
    ELSE '✅ HAS COLLEGE'
  END as status
FROM users
ORDER BY role, email;

-- Step 6: Test counsellor visibility (run as counsellor)
-- This should now return all students
SELECT 
  u.email,
  u.full_name,
  u.role
FROM users u
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE id = auth.uid())
ORDER BY u.full_name;
