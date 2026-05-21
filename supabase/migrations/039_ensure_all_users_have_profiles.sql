-- Migration 039: Ensure all auth users have profiles in public.users
-- This fixes the "Guest" display issue by creating missing profiles

-- Create missing profiles for all auth users
INSERT INTO public.users (id, email, full_name, role, college_id, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name', 
    SPLIT_PART(au.email, '@', 1),
    'User'
  ) as full_name,
  COALESCE(
    au.raw_user_meta_data->>'role', 
    'student'
  ) as role,
  CASE 
    WHEN au.raw_user_meta_data->>'college_id' IS NOT NULL 
      AND au.raw_user_meta_data->>'college_id' != ''
    THEN (au.raw_user_meta_data->>'college_id')::uuid 
    ELSE NULL 
  END as college_id,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
DO $$
DECLARE
  auth_count INTEGER;
  public_count INTEGER;
  missing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO public_count FROM public.users;
  missing_count := auth_count - public_count;
  
  RAISE NOTICE 'Migration 039 Complete:';
  RAISE NOTICE '  Auth users: %', auth_count;
  RAISE NOTICE '  Public profiles: %', public_count;
  RAISE NOTICE '  Missing profiles: %', missing_count;
  
  IF missing_count > 0 THEN
    RAISE WARNING 'Still have % missing profiles - check for data issues', missing_count;
  ELSE
    RAISE NOTICE '  ✓ All users have profiles';
  END IF;
END $$;
