-- Allow counsellors to create and manage their college's resources
-- Migration: 030_allow_counsellor_create_resources

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage resources" ON resources;

-- Create new policies for counsellors and admins
CREATE POLICY "Admins can manage all resources" 
  ON resources 
  FOR ALL 
  USING (get_user_role() = 'admin');

CREATE POLICY "Counsellors can create resources for their college" 
  ON resources 
  FOR INSERT 
  WITH CHECK (
    get_user_role() = 'counsellor' 
    AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Counsellors can update their college resources" 
  ON resources 
  FOR UPDATE 
  USING (
    get_user_role() = 'counsellor' 
    AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Counsellors can delete their college resources" 
  ON resources 
  FOR DELETE 
  USING (
    get_user_role() = 'counsellor' 
    AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  );

-- Verify policies
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
WHERE tablename = 'resources'
ORDER BY policyname;
