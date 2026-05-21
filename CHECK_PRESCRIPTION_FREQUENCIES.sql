-- ============================================================
-- Check Prescription Frequency Values
-- ============================================================
-- This script checks what frequency values currently exist
-- in the prescriptions table to diagnose the constraint issue
-- ============================================================

-- Check all unique frequency values
SELECT 
  'Current Frequency Values' AS check_name,
  frequency,
  COUNT(*) AS count
FROM prescriptions
GROUP BY frequency
ORDER BY count DESC;

-- Check if there are any NULL frequencies
SELECT 
  'NULL Frequency Check' AS check_name,
  COUNT(*) AS null_count
FROM prescriptions
WHERE frequency IS NULL;

-- Check the current constraint definition
SELECT 
  'Current Constraint' AS check_name,
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'prescriptions_frequency_check';

-- Show sample prescriptions with their frequencies
SELECT 
  'Sample Prescriptions' AS check_name,
  id,
  medication_name,
  frequency,
  created_at
FROM prescriptions
ORDER BY created_at DESC
LIMIT 10;

