-- ============================================================
-- Fix: Simplify assessments RLS policies
-- The helper functions were causing issues, use direct queries instead
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Students can read own assessments" ON assessments;
DROP POLICY IF EXISTS "Students can insert own assessments" ON assessments;
DROP POLICY IF EXISTS "Students can update own assessments" ON assessments;
DROP POLICY IF EXISTS "Counsellors can read student assessments in their college" ON assessments;

-- Recreate with simpler, more reliable policies
-- Students can read their own assessments
CREATE POLICY "Students can read own assessments" 
  ON assessments FOR SELECT 
  USING (user_id = auth.uid());

-- Students can insert their own assessments
CREATE POLICY "Students can insert own assessments" 
  ON assessments FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Students can update their own assessments
CREATE POLICY "Students can update own assessments" 
  ON assessments FOR UPDATE 
  USING (user_id = auth.uid());

-- Students can delete their own assessments (for testing)
CREATE POLICY "Students can delete own assessments" 
  ON assessments FOR DELETE 
  USING (user_id = auth.uid());

-- Counsellors can read student assessments in their college
CREATE POLICY "Counsellors can read student assessments" 
  ON assessments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users u1, users u2
      WHERE u1.id = auth.uid()
        AND u1.role = 'counsellor'
        AND u2.id = assessments.user_id
        AND u2.college_id = u1.college_id
    )
  );

-- Verify policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'assessments'
ORDER BY policyname;
