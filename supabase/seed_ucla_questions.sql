-- ============================================================
-- ARIA 2.0: UCLA Loneliness Questions Seed Data
-- ============================================================
-- UCLA Loneliness Scale - 3-item short form
-- Source: loneliness.md - Hughes et al., 2004
-- Scoring: 0-9 (3 items × 0-3 each)
-- Crisis Threshold: None
-- Time Frame: "How often do you feel the following?"
-- Response Options: 0 = Hardly ever/never | 1 = Some of the time | 2 = Often
-- NOTE: Using 0-2 scale (not 1-3) to match other instruments' 0-based scoring

-- Clear any existing UCLA questions
DELETE FROM questions WHERE instrument = 'ucla';

-- UCLA Q1
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I lack companionship',
  'loneliness',
  'ucla',
  1,
  FALSE,
  'medium',
  '{"loneliness": 1.0}',
  '[{"text": "Hardly ever/never", "value": 0}, {"text": "Some of the time", "value": 1}, {"text": "Often", "value": 2}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- UCLA Q2
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel left out',
  'loneliness',
  'ucla',
  2,
  FALSE,
  'high',
  '{"loneliness": 1.0, "depression": 0.2}',
  '[{"text": "Hardly ever/never", "value": 0}, {"text": "Some of the time", "value": 1}, {"text": "Often", "value": 2}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- UCLA Q3
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel isolated from others',
  'loneliness',
  'ucla',
  3,
  FALSE,
  'high',
  '{"loneliness": 1.0, "depression": 0.2}',
  '[{"text": "Hardly ever/never", "value": 0}, {"text": "Some of the time", "value": 1}, {"text": "Often", "value": 2}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Verify UCLA questions were inserted
SELECT 
  question_number,
  question,
  reverse_scored
FROM questions 
WHERE instrument = 'ucla'
ORDER BY question_number;
