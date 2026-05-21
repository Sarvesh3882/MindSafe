-- Quick check for maps_to field in clinical instruments
-- Run this in Supabase SQL Editor

-- Check current state of maps_to for each instrument
SELECT 
  instrument,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN maps_to IS NULL THEN 1 END) as null_maps_to,
  COUNT(CASE WHEN maps_to ? 'depression' THEN 1 END) as has_depression,
  COUNT(CASE WHEN maps_to ? 'anxiety' THEN 1 END) as has_anxiety,
  COUNT(CASE WHEN maps_to ? 'stress' THEN 1 END) as has_stress,
  COUNT(CASE WHEN maps_to ? 'sleep' THEN 1 END) as has_sleep
FROM questions
WHERE instrument IN ('phq9', 'gad7', 'pss10', 'isi')
GROUP BY instrument
ORDER BY instrument;

-- Also check a sample PHQ-9 question to see the actual format
SELECT 
  id,
  instrument,
  question_number,
  LEFT(question, 50) as question_preview,
  maps_to
FROM questions
WHERE instrument = 'phq9'
ORDER BY question_number
LIMIT 3;
