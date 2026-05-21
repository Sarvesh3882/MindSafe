-- ============================================================
-- WELLNESS SUGGESTIONS — COMPLETE FIX
-- ============================================================
-- This script fixes all issues with the wellness suggestion feature:
-- 1. Updates frequency constraint to match form values
-- 2. Migrates any existing data
-- 3. Verifies RLS policies
-- 4. Tests the setup
-- ============================================================

-- ============================================================
-- STEP 1: Fix Frequency Constraint
-- ============================================================
-- Drop the old constraint that uses medical terminology
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS prescriptions_frequency_check;

-- Add new constraint with wellness-friendly values
ALTER TABLE prescriptions
ADD CONSTRAINT prescriptions_frequency_check 
CHECK (frequency IN (
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other'
));

-- ============================================================
-- STEP 2: Migrate Existing Data (if any)
-- ============================================================
-- Update any existing records with old frequency values
UPDATE prescriptions
SET frequency = CASE
  WHEN frequency = 'Once daily' THEN 'Daily practice'
  WHEN frequency = 'Three times daily' THEN 'Twice daily'
  ELSE frequency
END
WHERE frequency IN ('Once daily', 'Three times daily');

-- ============================================================
-- STEP 3: Verify RLS Policies
-- ============================================================
-- Check that counsellors can insert prescriptions
DO $$
BEGIN
  -- Check if policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prescriptions' 
    AND policyname = 'Counsellors can create prescriptions'
  ) THEN
    -- Create policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Counsellors can create prescriptions" 
      ON prescriptions FOR INSERT 
      WITH CHECK (
        counsellor_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role = ''counsellor''
        )
      )';
  END IF;
END $$;

-- Check that counsellors can read their own prescriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prescriptions' 
    AND policyname = 'Counsellors can read their prescriptions'
  ) THEN
    EXECUTE 'CREATE POLICY "Counsellors can read their prescriptions" 
      ON prescriptions FOR SELECT 
      USING (
        counsellor_id = auth.uid() OR
        student_id = auth.uid()
      )';
  END IF;
END $$;

-- Check that students can read their own prescriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prescriptions' 
    AND policyname = 'Students can read their prescriptions'
  ) THEN
    EXECUTE 'CREATE POLICY "Students can read their prescriptions" 
      ON prescriptions FOR SELECT 
      USING (student_id = auth.uid())';
  END IF;
END $$;

-- ============================================================
-- STEP 4: Verify Prescription Audit Log RLS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prescription_audit_log' 
    AND policyname = 'Counsellors can insert audit logs'
  ) THEN
    EXECUTE 'CREATE POLICY "Counsellors can insert audit logs" 
      ON prescription_audit_log FOR INSERT 
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() AND role = ''counsellor''
        )
      )';
  END IF;
END $$;

-- ============================================================
-- STEP 5: Verification Queries
-- ============================================================

-- Check frequency constraint
SELECT 
  'Frequency Constraint' AS check_name,
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'prescriptions_frequency_check';

-- Check RLS policies
SELECT 
  'RLS Policies' AS check_name,
  schemaname,
  tablename,
  policyname,
  cmd AS command
FROM pg_policies
WHERE tablename IN ('prescriptions', 'prescription_audit_log')
ORDER BY tablename, policyname;

-- Check existing prescriptions
SELECT 
  'Existing Prescriptions' AS check_name,
  COUNT(*) AS total_count,
  COUNT(DISTINCT frequency) AS unique_frequencies,
  array_agg(DISTINCT frequency) AS frequency_values
FROM prescriptions;

-- ============================================================
-- STEP 6: Test Data (Optional - Uncomment to test)
-- ============================================================
-- This creates a test prescription to verify everything works
-- Uncomment and replace UUIDs with actual values from your database

/*
-- Get a test counsellor and student from same college
WITH test_users AS (
  SELECT 
    c.id AS counsellor_id,
    s.id AS student_id
  FROM users c
  JOIN users s ON c.college_id = s.college_id
  WHERE c.role = 'counsellor' 
    AND s.role = 'student'
  LIMIT 1
)
INSERT INTO prescriptions (
  student_id,
  counsellor_id,
  medication_name,
  dosage,
  frequency,
  duration,
  notes,
  is_suggestion,
  is_deleted
)
SELECT
  student_id,
  counsellor_id,
  'Test: Daily journaling practice',
  '10 minutes of free writing each evening',
  'Daily practice',
  '2 weeks',
  'Test wellness suggestion to verify system is working',
  false,
  false
FROM test_users;

-- Verify test prescription created
SELECT 
  'Test Prescription' AS check_name,
  p.*,
  c.full_name AS counsellor_name,
  s.full_name AS student_name
FROM prescriptions p
JOIN users c ON p.counsellor_id = c.id
JOIN users s ON p.student_id = s.id
WHERE p.medication_name LIKE 'Test:%'
ORDER BY p.created_at DESC
LIMIT 1;
*/

-- ============================================================
-- FINAL STATUS
-- ============================================================
SELECT 
  '✅ WELLNESS SUGGESTIONS FIX COMPLETE' AS status,
  NOW() AS completed_at;

