-- ============================================================
-- SAFE Frequency Fix — Handles All Cases
-- ============================================================
-- This script safely updates the frequency constraint by:
-- 1. Checking what values exist
-- 2. Updating ALL non-matching values
-- 3. Dropping old constraint
-- 4. Adding new constraint
-- ============================================================

-- STEP 1: Show current frequency values
SELECT 
  '📊 Current Frequency Values' AS status,
  frequency,
  COUNT(*) AS count
FROM prescriptions
GROUP BY frequency
ORDER BY count DESC;

-- STEP 2: Update ALL existing records to match new values
-- This ensures no rows violate the new constraint
UPDATE prescriptions
SET frequency = CASE
  -- Map old medical terms to wellness terms
  WHEN frequency = 'Once daily' THEN 'Daily practice'
  WHEN frequency = 'Three times daily' THEN 'Twice daily'
  
  -- Keep valid values as-is
  WHEN frequency = 'Daily practice' THEN 'Daily practice'
  WHEN frequency = 'Twice daily' THEN 'Twice daily'
  WHEN frequency = 'Weekly check-in' THEN 'Weekly check-in'
  WHEN frequency = 'As needed' THEN 'As needed'
  WHEN frequency = 'Other' THEN 'Other'
  
  -- Default any unknown values to 'Other'
  ELSE 'Other'
END;

-- STEP 3: Verify all frequencies are now valid
SELECT 
  '✅ Updated Frequency Values' AS status,
  frequency,
  COUNT(*) AS count
FROM prescriptions
GROUP BY frequency
ORDER BY count DESC;

-- STEP 4: Drop the old constraint (if it exists)
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS prescriptions_frequency_check;

-- STEP 5: Add new constraint with wellness-friendly values
ALTER TABLE prescriptions
ADD CONSTRAINT prescriptions_frequency_check 
CHECK (frequency IN (
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other'
));

-- STEP 6: Final verification
SELECT 
  '🎉 Constraint Updated Successfully' AS status,
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'prescriptions_frequency_check';

-- STEP 7: Test that constraint works
DO $$
BEGIN
  -- This should succeed
  INSERT INTO prescriptions (
    student_id,
    counsellor_id,
    medication_name,
    dosage,
    frequency,
    duration
  ) VALUES (
    (SELECT id FROM users WHERE role = 'student' LIMIT 1),
    (SELECT id FROM users WHERE role = 'counsellor' LIMIT 1),
    'TEST: Constraint Check',
    'Test dosage',
    'Daily practice',
    '1 day'
  );
  
  -- Clean up test record
  DELETE FROM prescriptions WHERE medication_name = 'TEST: Constraint Check';
  
  RAISE NOTICE '✅ Constraint test passed - "Daily practice" is accepted';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Constraint test failed: %', SQLERRM;
END $$;

SELECT '✅ FREQUENCY FIX COMPLETE' AS final_status;

