-- Simple check to see the actual maps_to values
-- Run this in Supabase SQL Editor

-- Check one PHQ-9 question
SELECT 
  instrument,
  question_number,
  maps_to
FROM questions
WHERE instrument = 'phq9'
ORDER BY question_number
LIMIT 1;
