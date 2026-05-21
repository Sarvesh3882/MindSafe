-- ============================================================
-- Fix: Update question options from "text" to "label"
-- The frontend expects "label" but seed files used "text"
-- ============================================================

-- Update all questions to rename "text" field to "label" in options JSONB
UPDATE questions
SET options = (
  SELECT jsonb_agg(
    jsonb_set(
      elem - 'text',
      '{label}',
      elem->'text'
    )
  )
  FROM jsonb_array_elements(options) elem
)
WHERE options::text LIKE '%"text":%';

-- Verify the fix
SELECT 
  id,
  question,
  options
FROM questions
LIMIT 5;
