-- ============================================================
-- ARIA Questions Verification & Fix Script
-- Run this to diagnose and fix question loading issues
-- ============================================================

-- Step 1: Check if triage questions exist
SELECT 
  'Triage Questions Count' AS check_name,
  COUNT(*) AS count
FROM questions
WHERE is_triage = TRUE;

-- Step 2: View all triage questions with their options
SELECT 
  id,
  question,
  category,
  is_triage,
  jsonb_array_length(options) AS option_count,
  options
FROM questions
WHERE is_triage = TRUE
ORDER BY created_at;

-- Step 3: Check RLS policies on questions table
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
WHERE tablename = 'questions';

-- Step 4: Test anonymous access (simulates unauthenticated user)
-- This should return results if RLS is properly configured
SET ROLE anon;
SELECT COUNT(*) AS anon_can_see_count
FROM questions
WHERE is_triage = TRUE;
RESET ROLE;

-- Step 5: Check if options have correct format (should have "label" not "text")
SELECT 
  id,
  question,
  CASE 
    WHEN options::text LIKE '%"label":%' THEN 'Has label ✓'
    WHEN options::text LIKE '%"text":%' THEN 'Has text (needs fix) ✗'
    ELSE 'Unknown format ✗'
  END AS format_status,
  options->0 AS first_option_sample
FROM questions
WHERE is_triage = TRUE;

-- Step 6: Check if maps_to is properly structured in options
SELECT 
  id,
  question,
  jsonb_array_length(options) AS option_count,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(options) AS opt
    WHERE opt ? 'maps_to'
  ) AS options_with_maps_to
FROM questions
WHERE is_triage = TRUE;

-- ============================================================
-- FIXES (uncomment if needed)
-- ============================================================

-- Fix 1: Ensure RLS allows anonymous access
-- DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;
-- CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);

-- Fix 2: Reseed triage questions if missing
-- DELETE FROM questions WHERE is_triage = TRUE;
-- Then run seed_triage_questions.sql

-- Fix 3: Fix options format (text -> label) if needed
-- UPDATE questions
-- SET options = (
--   SELECT jsonb_agg(
--     jsonb_set(
--       elem - 'text',
--       '{label}',
--       elem->'text'
--     )
--   )
--   FROM jsonb_array_elements(options) elem
-- )
-- WHERE is_triage = TRUE AND options::text LIKE '%"text":%';

