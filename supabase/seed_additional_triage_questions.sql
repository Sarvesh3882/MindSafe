-- ============================================================
-- ARIA 2.0: Additional Triage Questions
-- ============================================================
-- Three additional triage questions to expand the pool from 3 to 6.
-- System will randomly select 3 from the pool of 6 each session.
-- All questions are clinically grounded in validated screening items.

-- T4: Mood/Anhedonia Question (based on PHQ-2 core depression items)
INSERT INTO questions (
  question,
  category,
  severity,
  maps_to,
  options,
  is_triage,
  created_at
) VALUES (
  'How has your mood been over the past few days?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "Good, feeling positive", "value": 0, "maps_to": {"depression": 0, "anxiety": 0}},
    {"text": "Okay, nothing special", "value": 1, "maps_to": {"depression": 0, "anxiety": 0}},
    {"text": "A bit down or flat", "value": 2, "maps_to": {"depression": 1, "anxiety": 1}},
    {"text": "Really low or hopeless", "value": 3, "maps_to": {"depression": 2, "anxiety": 1, "loneliness": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T5: Social Connection Question (based on UCLA Loneliness Scale core item)
INSERT INTO questions (
  question,
  category,
  severity,
  maps_to,
  options,
  is_triage,
  created_at
) VALUES (
  'How connected have you felt to others lately?',
  'loneliness',
  'low',
  '{}',
  '[
    {"text": "Very connected", "value": 0, "maps_to": {"loneliness": 0, "depression": 0}},
    {"text": "Somewhat connected", "value": 1, "maps_to": {"loneliness": 0, "depression": 0}},
    {"text": "A bit isolated", "value": 2, "maps_to": {"loneliness": 2, "depression": 1, "anxiety": 1}},
    {"text": "Very alone or disconnected", "value": 3, "maps_to": {"loneliness": 3, "depression": 2, "anxiety": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T6: Worry/Rumination Question (based on GAD-2 core anxiety item)
INSERT INTO questions (
  question,
  category,
  severity,
  maps_to,
  options,
  is_triage,
  created_at
) VALUES (
  'How much have you been worrying about things?',
  'anxiety',
  'low',
  '{}',
  '[
    {"text": "Not worrying much", "value": 0, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "A little, but manageable", "value": 1, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "Worrying quite a bit", "value": 2, "maps_to": {"anxiety": 2, "stress": 2, "depression": 1}},
    {"text": "Can''t stop worrying", "value": 3, "maps_to": {"anxiety": 3, "stress": 3, "depression": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- Verify all triage questions (should now show 6)
SELECT 
  question,
  jsonb_array_length(options) as option_count
FROM questions 
WHERE is_triage = TRUE
ORDER BY created_at;

