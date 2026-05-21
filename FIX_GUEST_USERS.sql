-- Fix "Guest" issue by creating missing user profiles
-- Run this in Supabase SQL Editor

-- Step 1: Check which auth users are missing profiles
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data->>'full_name' as metadata_name,
  au.raw_user_meta_data->>'role' as metadata_role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- Step 2: Create missing profiles (corrected - no updated_at column)
INSERT INTO public.users (id, email, full_name, role, college_id, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', SPLIT_PART(au.email, '@', 1)) as full_name,
  COALESCE(au.raw_user_meta_data->>'role', 'student') as role,
  CASE 
    WHEN au.raw_user_meta_data->>'college_id' IS NOT NULL 
    THEN (au.raw_user_meta_data->>'college_id')::uuid 
    ELSE NULL 
  END as college_id,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify all users now have profiles
SELECT 
  COUNT(*) as auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users,
  COUNT(*) - (SELECT COUNT(*) FROM public.users) as missing_profiles
FROM auth.users;
