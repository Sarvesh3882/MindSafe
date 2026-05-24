-- Check if questions have options populated
SELECT 
  id,
  question,
  instrument,
  is_triage,
  options,
  CASE 
    WHEN options IS NULL THEN 'NULL'
    WHEN jsonb_array_length(options) = 0 THEN 'EMPTY ARRAY'
    ELSE 'HAS OPTIONS (' || jsonb_array_length(options)::text || ')'
  END as options_status
FROM questions
WHERE is_triage = true
ORDER BY instrument, question_number
LIMIT 10;
