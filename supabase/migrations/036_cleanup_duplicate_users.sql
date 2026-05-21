-- Migration 036: Cleanup duplicate/orphaned user accounts
-- This fixes the "duplicate key value violates unique constraint" error
-- Run this in Supabase SQL Editor

-- Step 1: Check for orphaned auth users (in auth.users but not in public.users)
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN pu.id IS NULL THEN 'ORPHANED (auth only)'
    ELSE 'OK (has profile)'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email IN ('japesh@kkwagh.edu.in', 'newuser1@kkwagh.edu.in')
ORDER BY au.created_at DESC;

-- Step 2: Check for duplicate profiles in public.users
SELECT 
  id,
  email,
  role,
  full_name,
  created_at
FROM public.users
WHERE email IN ('japesh@kkwagh.edu.in', 'newuser1@kkwagh.edu.in')
ORDER BY created_at DESC;

-- Step 3: If you see orphaned auth users, delete them
-- UNCOMMENT THE LINES BELOW AFTER REVIEWING THE RESULTS ABOVE

-- DELETE FROM auth.users 
-- WHERE email = 'japesh@kkwagh.edu.in' 
-- AND id NOT IN (SELECT id FROM public.users WHERE email = 'japesh@kkwagh.edu.in');

-- DELETE FROM auth.users 
-- WHERE email = 'newuser1@kkwagh.edu.in' 
-- AND id NOT IN (SELECT id FROM public.users WHERE email = 'newuser1@kkwagh.edu.in');

-- Step 4: Verify cleanup
-- SELECT 
--   au.id,
--   au.email,
--   au.created_at,
--   CASE 
--     WHEN pu.id IS NULL THEN 'ORPHANED (auth only)'
--     ELSE 'OK (has profile)'
--   END as status
-- FROM auth.users au
-- LEFT JOIN public.users pu ON au.id = pu.id
-- WHERE au.email IN ('japesh@kkwagh.edu.in', 'newuser1@kkwagh.edu.in')
-- ORDER BY au.created_at DESC;
