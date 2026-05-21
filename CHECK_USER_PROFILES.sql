-- Check if all auth users have corresponding profiles in public.users

-- Count auth users
SELECT COUNT(*) as auth_users_count
FROM auth.users;

-- Count public users
SELECT COUNT(*) as public_users_count
FROM public.users;

-- Find auth users WITHOUT public profiles
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

-- Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
