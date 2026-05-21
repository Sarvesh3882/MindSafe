-- ============================================================
-- ARIA 2.0: Maslach Burnout Questions Seed Data
-- ============================================================
-- Maslach Burnout Inventory - Emotional Exhaustion subscale only (9 items)
-- Source: burnout.md - Maslach & Jackson, 1981
-- Scoring: 0-54 (9 items × 0-6 each)
-- Crisis Threshold: None
-- Time Frame: "How often do you experience the following?"
-- Response Options: 0 = Never | 1 = A few times/year | 2 = Once a month or less | 3 = A few times/month | 4 = Once a week | 5 = A few times/week | 6 = Every day
-- NOTE: "work" is adapted to "work or studies" for student context

-- Clear any existing Maslach questions
DELETE FROM questions WHERE instrument = 'maslach';

-- Maslach EE Q1
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel emotionally drained from my work or studies',
  'burnout',
  'maslach',
  1,
  FALSE,
  'high',
  '{"burnout": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q2
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel used up at the end of the day',
  'burnout',
  'maslach',
  2,
  FALSE,
  'high',
  '{"burnout": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q3
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel fatigued when I get up in the morning and have to face another day of work or studies',
  'burnout',
  'maslach',
  3,
  FALSE,
  'high',
  '{"burnout": 1.0, "depression": 0.2}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q4
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Working or studying all day is really a strain for me',
  'burnout',
  'maslach',
  4,
  FALSE,
  'medium',
  '{"burnout": 1.0, "stress": 0.2}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q5
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel burned out from my work or studies',
  'burnout',
  'maslach',
  5,
  FALSE,
  'high',
  '{"burnout": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q6
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel frustrated by my work or studies',
  'burnout',
  'maslach',
  6,
  FALSE,
  'medium',
  '{"burnout": 1.0, "stress": 0.3}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q7
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel I''m working or studying too hard',
  'burnout',
  'maslach',
  7,
  FALSE,
  'medium',
  '{"burnout": 1.0, "stress": 0.3}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q8
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Working or studying with people directly puts too much stress on me',
  'burnout',
  'maslach',
  8,
  FALSE,
  'medium',
  '{"burnout": 1.0, "stress": 0.2}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Maslach EE Q9
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'I feel like I''m at the end of my rope',
  'burnout',
  'maslach',
  9,
  FALSE,
  'high',
  '{"burnout": 1.0, "depression": 0.3}',
  '[{"text": "Never", "value": 0}, {"text": "A few times a year", "value": 1}, {"text": "Once a month or less", "value": 2}, {"text": "A few times a month", "value": 3}, {"text": "Once a week", "value": 4}, {"text": "A few times a week", "value": 5}, {"text": "Every day", "value": 6}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Verify Maslach questions were inserted
SELECT 
  question_number,
  LEFT(question, 50) || '...' as question_preview,
  reverse_scored
FROM questions 
WHERE instrument = 'maslach'
ORDER BY question_number;
