-- Migration 038: Verify and Fix maps_to Field for All Instruments
-- This ensures all questions have correct domain mapping for score accumulation

-- ============================================================
-- VERIFY CURRENT STATE
-- ============================================================

-- Check current maps_to values for each instrument
-- Run this first to see what needs fixing
SELECT 
  instrument,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN maps_to IS NULL THEN 1 END) as null_maps_to,
  COUNT(CASE WHEN maps_to ? 'depression' THEN 1 END) as has_depression,
  COUNT(CASE WHEN maps_to ? 'anxiety' THEN 1 END) as has_anxiety,
  COUNT(CASE WHEN maps_to ? 'stress' THEN 1 END) as has_stress,
  COUNT(CASE WHEN maps_to ? 'sleep' THEN 1 END) as has_sleep,
  COUNT(CASE WHEN maps_to ? 'burnout' THEN 1 END) as has_burnout,
  COUNT(CASE WHEN maps_to ? 'loneliness' THEN 1 END) as has_loneliness,
  COUNT(CASE WHEN maps_to ? 'substance' THEN 1 END) as has_substance
FROM questions
WHERE instrument IN ('phq9', 'gad7', 'pss10', 'isi', 'maslach', 'ucla', 'audit')
GROUP BY instrument
ORDER BY instrument;

-- ============================================================
-- FIX INCORRECT MAPPINGS
-- ============================================================

-- Fix PHQ-9 questions (Depression)
-- Should map to "depression" domain, not "phq9"
UPDATE questions
SET maps_to = '{"depression": 1}'::jsonb
WHERE instrument = 'phq9'
  AND (maps_to IS NULL OR NOT maps_to ? 'depression');

-- Fix GAD-7 questions (Anxiety)
-- Should map to "anxiety" domain, not "gad7"
UPDATE questions
SET maps_to = '{"anxiety": 1}'::jsonb
WHERE instrument = 'gad7'
  AND (maps_to IS NULL OR NOT maps_to ? 'anxiety');

-- Fix PSS-10 questions (Stress)
-- Should map to "stress" domain, not "pss10"
UPDATE questions
SET maps_to = '{"stress": 1}'::jsonb
WHERE instrument = 'pss10'
  AND (maps_to IS NULL OR NOT maps_to ? 'stress');

-- Fix ISI questions (Sleep/Insomnia)
-- Should map to "sleep" domain, not "isi"
UPDATE questions
SET maps_to = '{"sleep": 1}'::jsonb
WHERE instrument = 'isi'
  AND (maps_to IS NULL OR NOT maps_to ? 'sleep');

-- Fix Maslach questions (Burnout)
-- Should map to "burnout" domain, not "maslach"
UPDATE questions
SET maps_to = '{"burnout": 1}'::jsonb
WHERE instrument = 'maslach'
  AND (maps_to IS NULL OR NOT maps_to ? 'burnout');

-- Fix UCLA questions (Loneliness)
-- Should map to "loneliness" domain, not "ucla"
UPDATE questions
SET maps_to = '{"loneliness": 1}'::jsonb
WHERE instrument = 'ucla'
  AND (maps_to IS NULL OR NOT maps_to ? 'loneliness');

-- Fix AUDIT questions (Substance Use)
-- Should map to "substance" domain, not "audit"
UPDATE questions
SET maps_to = '{"substance": 1}'::jsonb
WHERE instrument = 'audit'
  AND (maps_to IS NULL OR NOT maps_to ? 'substance');

-- ============================================================
-- VERIFY FIXES
-- ============================================================

-- Check that all questions now have correct mappings
SELECT 
  instrument,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN maps_to ? 'depression' THEN 1 END) as depression_mapped,
  COUNT(CASE WHEN maps_to ? 'anxiety' THEN 1 END) as anxiety_mapped,
  COUNT(CASE WHEN maps_to ? 'stress' THEN 1 END) as stress_mapped,
  COUNT(CASE WHEN maps_to ? 'sleep' THEN 1 END) as sleep_mapped,
  COUNT(CASE WHEN maps_to ? 'burnout' THEN 1 END) as burnout_mapped,
  COUNT(CASE WHEN maps_to ? 'loneliness' THEN 1 END) as loneliness_mapped,
  COUNT(CASE WHEN maps_to ? 'substance' THEN 1 END) as substance_mapped
FROM questions
WHERE instrument IN ('phq9', 'gad7', 'pss10', 'isi', 'maslach', 'ucla', 'audit')
GROUP BY instrument
ORDER BY instrument;

-- ============================================================
-- EXPECTED RESULTS
-- ============================================================

-- PHQ-9: 9 questions, all should have depression_mapped = 9
-- GAD-7: 7 questions, all should have anxiety_mapped = 7
-- PSS-10: 10 questions, all should have stress_mapped = 10
-- ISI: 7 questions, all should have sleep_mapped = 7
-- Maslach: 22 questions, all should have burnout_mapped = 22
-- UCLA: 20 questions, all should have loneliness_mapped = 20
-- AUDIT: 10 questions, all should have substance_mapped = 10

-- ============================================================
-- SAMPLE VERIFICATION QUERIES
-- ============================================================

-- Check a few sample questions to verify format
SELECT 
  id,
  instrument,
  question_number,
  question,
  maps_to
FROM questions
WHERE instrument = 'phq9'
ORDER BY question_number
LIMIT 3;

-- Check that triage questions are NOT affected
SELECT 
  COUNT(*) as triage_questions,
  COUNT(CASE WHEN maps_to IS NOT NULL THEN 1 END) as has_maps_to
FROM questions
WHERE category = 'triage';

-- Triage questions should have complex maps_to with multiple domains
-- Example: {"depression": 0.5, "anxiety": 0.3, "stress": 0.2}
