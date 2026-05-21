-- ============================================================
-- Fix Prescription Frequency Values for Wellness Terminology
-- ============================================================
-- The form uses wellness-friendly terms like "Daily practice"
-- but the database constraint was using medical terms like "Once daily"
-- This migration updates the constraint to match the form values
-- ============================================================

-- STEP 1: Check what frequency values currently exist
DO $$
BEGIN
  RAISE NOTICE 'Current frequency values in prescriptions table:';
END $$;

SELECT DISTINCT frequency, COUNT(*) as count
FROM prescriptions
GROUP BY frequency;

-- STEP 2: Update any existing records with old values FIRST (before changing constraint)
UPDATE prescriptions
SET frequency = CASE
  WHEN frequency = 'Once daily' THEN 'Daily practice'
  WHEN frequency = 'Three times daily' THEN 'Twice daily'
  ELSE frequency
END
WHERE frequency IN ('Once daily', 'Three times daily');

-- STEP 3: Drop the old constraint
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS prescriptions_frequency_check;

-- STEP 4: Add new constraint with wellness-friendly values
ALTER TABLE prescriptions
ADD CONSTRAINT prescriptions_frequency_check 
CHECK (frequency IN (
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other'
));

-- Verify the fix
SELECT 
  'Frequency Values Updated' AS status,
  COUNT(*) AS total_prescriptions,
  COUNT(DISTINCT frequency) AS unique_frequencies
FROM prescriptions;

