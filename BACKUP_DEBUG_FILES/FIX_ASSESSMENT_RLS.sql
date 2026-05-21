-- FIX ASSESSMENT RLS POLICIES FOR ADMIN ACCESS
-- The admin can't see assessments due to RLS policies

-- Step 1: Check current RLS policies on assessments table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'assessments';

-- Step 2: Drop existing restrictive policies (if any)
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;

-- Step 3: Create new policies that allow admin access

-- Policy 1: Users can view their own assessments
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Admins can view all assessments in their college
CREATE POLICY "Admins can view college assessments" ON assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid()
        AND admin_user.role = 'admin'
        AND EXISTS (
          SELECT 1 FROM users student_user
          WHERE student_user.id = assessments.user_id
            AND student_user.college_id = admin_user.college_id
        )
    )
  );

-- Policy 3: Counsellors can view assessments of their students
CREATE POLICY "Counsellors can view student assessments" ON assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users counsellor_user
      WHERE counsellor_user.id = auth.uid()
        AND counsellor_user.role = 'counsellor'
        AND EXISTS (
          SELECT 1 FROM users student_user
          WHERE student_user.id = assessments.user_id
            AND student_user.college_id = counsellor_user.college_id
        )
    )
  );

-- Policy 4: Users can insert their own assessments
CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 5: Users can update their own assessments
CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 4: Verify the new policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%admin%' THEN '✅ Admin policy'
    WHEN policyname LIKE '%counsellor%' THEN '✅ Counsellor policy'
    WHEN policyname LIKE '%own%' THEN '✅ User policy'
    ELSE '⚠️ Other policy'
  END as policy_type
FROM pg_policies 
WHERE tablename = 'assessments'
ORDER BY policyname;
