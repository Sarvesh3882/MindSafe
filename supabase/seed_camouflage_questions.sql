-- ============================================================
-- ARIA 2.0: Camouflage Questions Seed Data
-- ============================================================
-- Camouflage questions are neutral "buffer" questions that:
-- - Break up patterns so students can't detect which questions "count"
-- - Provide supplementary context for counsellors
-- - Are NOT scored toward any clinical instrument
-- - Are presented 2-3 times per assessment session

-- Clear any existing camouflage questions
DELETE FROM questions WHERE is_camouflage = TRUE;

-- C1: Sleep Quality
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How would you rate the quality of your sleep over the past week?',
  'sleep',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "Excellent", "value": 0}, {"text": "Good", "value": 1}, {"text": "Fair", "value": 2}, {"text": "Poor", "value": 3}, {"text": "Very poor", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C2: Energy Level
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How would you describe your energy level today?',
  'burnout',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "High energy", "value": 0}, {"text": "Moderate energy", "value": 1}, {"text": "Low energy", "value": 2}, {"text": "Very low energy", "value": 3}, {"text": "Exhausted", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C3: Social Connection
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How connected do you feel to the people around you right now?',
  'loneliness',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "Very connected", "value": 0}, {"text": "Somewhat connected", "value": 1}, {"text": "Neutral", "value": 2}, {"text": "Somewhat disconnected", "value": 3}, {"text": "Very disconnected", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C4: Physical Activity
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How much physical activity have you gotten in the past few days?',
  'depression',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "A lot", "value": 0}, {"text": "A moderate amount", "value": 1}, {"text": "A little", "value": 2}, {"text": "Very little", "value": 3}, {"text": "None", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C5: Appetite
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How has your appetite been lately?',
  'depression',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "Normal", "value": 0}, {"text": "Increased", "value": 1}, {"text": "Decreased", "value": 2}, {"text": "Very decreased", "value": 3}, {"text": "No appetite", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C6: Concentration
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How easy has it been to focus on tasks today?',
  'stress',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "Very easy", "value": 0}, {"text": "Somewhat easy", "value": 1}, {"text": "Neutral", "value": 2}, {"text": "Somewhat difficult", "value": 3}, {"text": "Very difficult", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C7: Mood Stability
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How stable has your mood felt over the past few days?',
  'anxiety',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "Very stable", "value": 0}, {"text": "Mostly stable", "value": 1}, {"text": "Somewhat unstable", "value": 2}, {"text": "Quite unstable", "value": 3}, {"text": "Very unstable", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- C8: Coping
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How well do you feel you''re coping with daily demands right now?',
  'stress',
  NULL,
  NULL,
  FALSE,
  'low',
  '{}',
  '[{"text": "Very well", "value": 0}, {"text": "Well", "value": 1}, {"text": "Okay", "value": 2}, {"text": "Not well", "value": 3}, {"text": "Not well at all", "value": 4}]'::jsonb,
  FALSE,
  TRUE,
  NOW()
);

-- Verify camouflage questions were inserted
SELECT 
  LEFT(question, 50) || '...' as question_preview,
  category,
  jsonb_array_length(options) as option_count
FROM questions 
WHERE is_camouflage = TRUE
ORDER BY created_at;
