-- Migration: Row Level Security policies for prescriptions table
-- Description: Protect prescription data with role-based access control
-- Author: MindSafe India Development Team
-- Date: 2024

-- Enable RLS on prescriptions table
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "students_read_own_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_read_college_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_insert_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_update_own_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_soft_delete_own_prescriptions" ON prescriptions;

-- Policy: Students can read their own prescriptions (excluding deleted)
CREATE POLICY "students_read_own_prescriptions" ON prescriptions
  FOR SELECT
  USING (
    student_id = auth.uid() AND
    is_deleted = false
  );

-- Policy: Counsellors can read prescriptions for students in their college (excluding deleted)
CREATE POLICY "counsellors_read_college_prescriptions" ON prescriptions
  FOR SELECT
  USING (
    is_deleted = false AND
    EXISTS (
      SELECT 1 FROM users u1, users u2
      WHERE u1.id = auth.uid()
        AND u1.role = 'counsellor'
        AND u2.id = prescriptions.student_id
        AND u1.college_id = u2.college_id
    )
  );

-- Policy: Counsellors can insert prescriptions for students in their college
CREATE POLICY "counsellors_insert_prescriptions" ON prescriptions
  FOR INSERT
  WITH CHECK (
    counsellor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users u1, users u2
      WHERE u1.id = auth.uid()
        AND u1.role = 'counsellor'
        AND u2.id = student_id
        AND u1.college_id = u2.college_id
    )
  );

-- Policy: Counsellors can update their own prescriptions within 24 hours
CREATE POLICY "counsellors_update_own_prescriptions" ON prescriptions
  FOR UPDATE
  USING (
    counsellor_id = auth.uid() AND
    created_at > NOW() - INTERVAL '24 hours' AND
    is_deleted = false
  )
  WITH CHECK (
    counsellor_id = auth.uid() AND
    is_deleted = false
  );

-- Policy: Counsellors can soft-delete their own prescriptions (within 24 hours, no messages)
CREATE POLICY "counsellors_soft_delete_own_prescriptions" ON prescriptions
  FOR UPDATE
  USING (
    counsellor_id = auth.uid() AND
    created_at > NOW() - INTERVAL '24 hours' AND
    NOT EXISTS (
      SELECT 1 FROM prescription_messages
      WHERE prescription_id = prescriptions.id
    )
  )
  WITH CHECK (
    counsellor_id = auth.uid() AND
    is_deleted = true AND
    deleted_at IS NOT NULL
  );

-- Add helpful comments
COMMENT ON POLICY "students_read_own_prescriptions" ON prescriptions IS 'Students can only view their own non-deleted prescriptions';
COMMENT ON POLICY "counsellors_read_college_prescriptions" ON prescriptions IS 'Counsellors can view prescriptions for students in their college';
COMMENT ON POLICY "counsellors_insert_prescriptions" ON prescriptions IS 'Counsellors can create prescriptions for students in their college';
COMMENT ON POLICY "counsellors_update_own_prescriptions" ON prescriptions IS 'Counsellors can edit their own prescriptions within 24 hours';
COMMENT ON POLICY "counsellors_soft_delete_own_prescriptions" ON prescriptions IS 'Counsellors can soft-delete prescriptions within 24 hours if no messages exist';
