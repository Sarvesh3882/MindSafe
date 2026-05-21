-- Migration: Fix prescription RLS policies for counsellor access
-- Description: Simplify RLS policies to work with existing users table RLS
-- Author: MindSafe India Development Team
-- Date: 2024

-- Drop existing counsellor read policy
DROP POLICY IF EXISTS "counsellors_read_college_prescriptions" ON prescriptions;

-- Create helper function to check if counsellor can access student's prescriptions
CREATE OR REPLACE FUNCTION counsellor_can_access_student_prescriptions(
  counsellor_uuid UUID,
  student_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  counsellor_college UUID;
  student_college UUID;
BEGIN
  -- Get counsellor's college
  SELECT college_id INTO counsellor_college
  FROM users
  WHERE id = counsellor_uuid AND role = 'counsellor';
  
  -- Get student's college
  SELECT college_id INTO student_college
  FROM users
  WHERE id = student_uuid AND role = 'student';
  
  -- Return true if both are in the same college
  RETURN counsellor_college IS NOT NULL 
    AND student_college IS NOT NULL 
    AND counsellor_college = student_college;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION counsellor_can_access_student_prescriptions IS 'Check if counsellor can access student prescriptions (same college)';

-- Create new simplified policy using the helper function
CREATE POLICY "counsellors_read_college_prescriptions" ON prescriptions
  FOR SELECT
  USING (
    is_deleted = false AND
    counsellor_can_access_student_prescriptions(auth.uid(), student_id)
  );

COMMENT ON POLICY "counsellors_read_college_prescriptions" ON prescriptions IS 'Counsellors can view prescriptions for students in their college (using helper function)';
