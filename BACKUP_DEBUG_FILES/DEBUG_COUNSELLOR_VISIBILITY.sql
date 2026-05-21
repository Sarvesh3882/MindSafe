-- Comprehensive debug script for counsellor visibility issue
-- Run this in Supabase SQL Editor

-- ============================================
-- SECTION 1: Check all users and their data
-- ============================================
SELECT 
  '=== ALL USERS ===' as section,
  id,
  email,
  role,
  full_name,
  college_id,
  created_at
FROM users
ORDER BY role, created_at DESC;

-- ============================================
-- SECTION 2: Check colleges
-- ============================================
SELECT 
  '=== ALL COLLEGES ===' as section,
  id,
  name,
  created_at
FROM colleges;

-- ============================================
-- SECTION 3: Check college matching
-- ============================================
SELECT 
  '=== COLLEGE MATCHING ===' as section,
  s.email as student_email,
  s.college_id as student_college_id,
  c.email as counsellor_email,
  c.college_id as counsellor_college_id,
  col.name as college_name,
  CASE 
    WHEN s.college_id = c.college_id THEN '✅ MATCH'
    WHEN s.college_id IS NULL THEN '⚠️ Student has no college'
    WHEN c.college_id IS NULL THEN '⚠️ Counsellor has no college'
    ELSE '❌ DIFFERENT COLLEGES'
  END as match_status
FROM users s
CROSS JOIN users c
LEFT JOIN colleges col ON s.college_id = col.id
WHERE s.role = 'student' 
  AND c.role = 'counsellor';

-- ============================================
-- SECTION 4: Check RLS policies on users table
-- ============================================
SELECT 
  '=== RLS POLICIES ===' as section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- SECTION 5: Test helper functions
-- ============================================
-- Check if helper functions exist
SELECT 
  '=== HELPER FUNCTIONS ===' as section,
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_name IN ('get_user_role', 'get_user_college')
ORDER BY routine_name;

-- ============================================
-- SECTION 6: Simulate student query
-- ============================================
-- This simulates what the booking page does
-- Replace 'YOUR_STUDENT_EMAIL' with actual student email
DO $$
DECLARE
  student_college UUID;
  counsellor_count INTEGER;
BEGIN
  -- Get student's college
  SELECT college_id INTO student_college
  FROM users
  WHERE role = 'student'
  LIMIT 1;
  
  RAISE NOTICE 'Student college_id: %', student_college;
  
  -- Count counsellors with same college
  SELECT COUNT(*) INTO counsellor_count
  FROM users
  WHERE role = 'counsellor'
    AND (college_id = student_college OR (college_id IS NULL AND student_college IS NULL));
  
  RAISE NOTICE 'Counsellors with matching college: %', counsellor_count;
END $$;

-- ============================================
-- SECTION 7: Check for NULL college_ids
-- ============================================
SELECT 
  '=== NULL COLLEGE IDs ===' as section,
  role,
  COUNT(*) as count_with_null_college
FROM users
WHERE college_id IS NULL
GROUP BY role;

-- ============================================
-- SECTION 8: Detailed counsellor info
-- ============================================
SELECT 
  '=== COUNSELLOR DETAILS ===' as section,
  id,
  email,
  full_name,
  college_id,
  CASE 
    WHEN college_id IS NULL THEN '⚠️ NO COLLEGE ASSIGNED'
    ELSE '✅ Has college'
  END as college_status,
  created_at
FROM users
WHERE role = 'counsellor';

-- ============================================
-- SECTION 9: Detailed student info
-- ============================================
SELECT 
  '=== STUDENT DETAILS ===' as section,
  id,
  email,
  full_name,
  college_id,
  CASE 
    WHEN college_id IS NULL THEN '⚠️ NO COLLEGE ASSIGNED'
    ELSE '✅ Has college'
  END as college_status,
  created_at
FROM users
WHERE role = 'student';
