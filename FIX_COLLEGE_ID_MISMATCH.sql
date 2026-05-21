-- Fix college_id mismatch for old students
-- Run this in Supabase SQL Editor

-- Step 1: Check current state
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.college_id,
  c.name as college_name
FROM users u
LEFT JOIN colleges c ON u.college_id = c.id
ORDER BY u.email;

-- Step 2: Find your counsellor/admin college_id
SELECT id, name, plan_tier, onboarded_at
FROM colleges 
ORDER BY onboarded_at DESC 
LIMIT 5;

-- Step 3: Update old students to correct college_id
-- REPLACE 'YOUR_COLLEGE_ID_HERE' with actual UUID from Step 2
UPDATE users
SET college_id = 'YOUR_COLLEGE_ID_HERE'
WHERE role = 'student' 
  AND (college_id IS NULL OR college_id != 'YOUR_COLLEGE_ID_HERE');

-- Step 4: Verify fix
SELECT 
  role,
  college_id,
  COUNT(*) as count
FROM users
GROUP BY role, college_id
ORDER BY role;

-- Step 5: Check if counsellor can now see all students
-- Run this as counsellor to test
SELECT 
  u.id,
  u.full_name,
  u.email,
  u.department
FROM users u
WHERE u.role = 'student'
  AND u.college_id = (SELECT college_id FROM users WHERE id = auth.uid())
ORDER BY u.full_name;
