-- Fix for KK Wagh College
-- Run this in Supabase SQL Editor

-- Step 1: Check if KK Wagh college exists
SELECT * FROM colleges WHERE name ILIKE '%wagh%' OR name ILIKE '%kk%';

-- Step 2: If college exists, get its UUID
SELECT id, name FROM colleges WHERE name ILIKE '%wagh%' OR name ILIKE '%kk%' LIMIT 1;

-- Step 3: If college doesn't exist, create it
INSERT INTO colleges (name, plan_tier, active, onboarded_at)
VALUES ('KK Wagh Institute', 'basic', true, NOW())
ON CONFLICT DO NOTHING
RETURNING id, name;

-- Step 4: Get the college UUID (this will work whether it existed or was just created)
SELECT id, name FROM colleges WHERE name ILIKE '%wagh%' OR name ILIKE '%kk%' LIMIT 1;

-- Step 5: Update ALL users with NULL college_id to KK Wagh
-- First, let's see what the UUID is from Step 4, then run this:
-- REPLACE 'PASTE_UUID_HERE' with the actual UUID from Step 4

-- UPDATE users
-- SET college_id = 'PASTE_UUID_HERE'
-- WHERE college_id IS NULL;

-- Step 6: Verify all users now have college_id
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
