-- Migration: Simplify prescription RLS policies
-- Description: Make RLS policies simpler and more permissive for counsellors
-- Author: MindSafe India Development Team
-- Date: 2024

-- Drop all existing policies
DROP POLICY IF EXISTS "students_read_own_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_read_college_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_insert_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_update_own_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_soft_delete_own_prescriptions" ON prescriptions;

-- Policy: Students can read their own prescriptions
CREATE POLICY "students_read_own_prescriptions" ON prescriptions
  FOR SELECT
  USING (
    student_id = auth.uid() AND
    is_deleted = false
  );

-- Policy: Counsellors can read prescriptions they created
CREATE POLICY "counsellors_read_own_prescriptions" ON prescriptions
  FOR SELECT
  USING (
    counsellor_id = auth.uid() AND
    is_deleted = false
  );

-- Policy: Counsellors can insert prescriptions
CREATE POLICY "counsellors_insert_prescriptions" ON prescriptions
  FOR INSERT
  WITH CHECK (
    counsellor_id = auth.uid()
  );

-- Policy: Counsellors can update their own prescriptions
CREATE POLICY "counsellors_update_own_prescriptions" ON prescriptions
  FOR UPDATE
  USING (
    counsellor_id = auth.uid() AND
    is_deleted = false
  )
  WITH CHECK (
    counsellor_id = auth.uid()
  );

-- Policy: Counsellors can soft-delete their own prescriptions
CREATE POLICY "counsellors_delete_own_prescriptions" ON prescriptions
  FOR UPDATE
  USING (
    counsellor_id = auth.uid()
  )
  WITH CHECK (
    counsellor_id = auth.uid() AND
    is_deleted = true
  );

-- Add comments
COMMENT ON POLICY "students_read_own_prescriptions" ON prescriptions IS 'Students can view their own prescriptions';
COMMENT ON POLICY "counsellors_read_own_prescriptions" ON prescriptions IS 'Counsellors can view prescriptions they created';
COMMENT ON POLICY "counsellors_insert_prescriptions" ON prescriptions IS 'Counsellors can create prescriptions';
COMMENT ON POLICY "counsellors_update_own_prescriptions" ON prescriptions IS 'Counsellors can update their own prescriptions';
COMMENT ON POLICY "counsellors_delete_own_prescriptions" ON prescriptions IS 'Counsellors can soft-delete their own prescriptions';
