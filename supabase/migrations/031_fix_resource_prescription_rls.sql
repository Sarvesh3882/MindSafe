-- Fix resource_prescriptions RLS policies for counsellors
-- Migration: 031_fix_resource_prescription_rls

-- Drop existing policy
DROP POLICY IF EXISTS "Counsellors can manage prescriptions for their students" ON resource_prescriptions;

-- Create separate policies for better control
CREATE POLICY "Counsellors can insert prescriptions for their students" 
  ON resource_prescriptions 
  FOR INSERT 
  WITH CHECK (
    counsellor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = student_id 
      AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
      AND role = 'student'
    )
  );

CREATE POLICY "Counsellors can view prescriptions for their students" 
  ON resource_prescriptions 
  FOR SELECT 
  USING (
    counsellor_id = auth.uid()
    OR student_id = auth.uid()
  );

CREATE POLICY "Counsellors can delete prescriptions for their students" 
  ON resource_prescriptions 
  FOR DELETE 
  USING (
    counsellor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = student_id 
      AND college_id = (SELECT college_id FROM users WHERE id = auth.uid())
    )
  );

-- Verify policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'resource_prescriptions'
ORDER BY policyname;
