-- EXECUTE CLEANUP: Remove duplicate colleges and consolidate data
-- WARNING: This will modify your database. Review CLEANUP_DUPLICATES.sql first!

-- ============================================
-- STEP 1: IDENTIFY PRIMARY COLLEGE
-- ============================================

-- Store the primary college ID (the one with most data)
DO $$
DECLARE
  primary_college_id UUID;
  primary_college_name TEXT;
BEGIN
  -- Find the college with most assessments/users
  SELECT c.id, c.name INTO primary_college_id, primary_college_name
  FROM colleges c
  LEFT JOIN users u ON u.college_id = c.id
  LEFT JOIN assessments a ON a.user_id = u.id
  GROUP BY c.id, c.name
  ORDER BY COUNT(a.id) DESC, COUNT(DISTINCT u.id) DESC
  LIMIT 1;

  RAISE NOTICE 'Primary college: % (%)', primary_college_name, primary_college_id;

  -- ============================================
  -- STEP 2: MOVE ALL USERS TO PRIMARY COLLEGE
  -- ============================================
  
  RAISE NOTICE 'Moving all users to primary college...';
  
  UPDATE users
  SET college_id = primary_college_id
  WHERE college_id != primary_college_id OR college_id IS NULL;
  
  RAISE NOTICE 'Users moved: %', (SELECT COUNT(*) FROM users WHERE college_id = primary_college_id);

  -- ============================================
  -- STEP 3: DELETE DUPLICATE COLLEGES
  -- ============================================
  
  RAISE NOTICE 'Deleting duplicate colleges...';
  
  DELETE FROM colleges
  WHERE id != primary_college_id;
  
  RAISE NOTICE 'Colleges remaining: %', (SELECT COUNT(*) FROM colleges);

  -- ============================================
  -- STEP 4: VERIFY FINAL STATE
  -- ============================================
  
  RAISE NOTICE 'Cleanup complete!';
  
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT '=== CLEANUP COMPLETE ===' as status;

-- Final college state
SELECT 
  'Final College' as info,
  id as college_id,
  name as college_name,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id) as total_users,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'student') as students,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'admin') as admins,
  (SELECT COUNT(*) FROM users WHERE college_id = colleges.id AND role = 'counsellor') as counsellors
FROM colleges;

-- Users by role
SELECT 
  'Users by Role' as info,
  role,
  COUNT(*) as count,
  STRING_AGG(email, ', ' ORDER BY email) as emails
FROM users
GROUP BY role
ORDER BY role;

-- Assessments count
SELECT 
  'Total Assessments' as info,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_students
FROM assessments;

-- Your admin account
SELECT 
  'Your Admin Account' as info,
  u.email,
  u.role,
  u.college_id,
  c.name as college_name,
  (SELECT COUNT(*) FROM users WHERE college_id = u.college_id AND role = 'student') as students_in_college
FROM users u
LEFT JOIN colleges c ON c.id = u.college_id
WHERE u.email = 'codex5622@gmail.com';

-- Check for any remaining issues
SELECT 
  'Remaining Issues' as check_type,
  CASE 
    WHEN (SELECT COUNT(*) FROM colleges) > 1 THEN 'WARNING: Multiple colleges still exist'
    WHEN (SELECT COUNT(*) FROM users WHERE college_id IS NULL) > 0 THEN 'WARNING: Users without college'
    WHEN EXISTS (SELECT 1 FROM users GROUP BY email HAVING COUNT(*) > 1) THEN 'WARNING: Duplicate user emails'
    ELSE 'All clear!'
  END as status;
