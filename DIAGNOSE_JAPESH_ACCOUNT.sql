-- Diagnose why Japesh account is not visible
-- Run this in Supabase SQL Editor

-- Step 1: Check if Japesh exists in auth.users
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'full_name' as metadata_name,
  raw_user_meta_data->>'role' as metadata_role,
  raw_user_meta_data->>'college_id' as metadata_college_id
FROM auth.users
WHERE email ILIKE '%japesh%' OR raw_user_meta_data->>'full_name' ILIKE '%japesh%'
ORDER BY created_at DESC;

-- Step 2: Check if Japesh exists in public.users
SELECT 
  id,
  email,
  full_name,
  role,
  college_id,
  department,
  created_at
FROM users
WHERE email ILIKE '%japesh%' OR full_name ILIKE '%japesh%'
ORDER BY created_at DESC;

-- Step 3: Check counsellor's college_id
SELECT 
  id,
  email,
  full_name,
  role,
  college_id
FROM users
WHERE role = 'counsellor'
ORDER BY email;

-- Step 4: Check admin's college_id
SELECT 
  id,
  email,
  full_name,
  role,
  college_id
FROM users
WHERE role = 'admin'
ORDER BY email;

-- Step 5: Check all colleges
SELECT 
  id,
  name,
  plan_tier,
  active,
  onboarded_at
FROM colleges
ORDER BY onboarded_at DESC;

-- Step 6: Count users by college_id
SELECT 
  college_id,
  role,
  COUNT(*) as count
FROM users
GROUP BY college_id, role
ORDER BY college_id, role;

-- Step 7: Find users with NULL college_id
SELECT 
  id,
  email,
  full_name,
  role,
  college_id
FROM users
WHERE college_id IS NULL
ORDER BY role, email;
