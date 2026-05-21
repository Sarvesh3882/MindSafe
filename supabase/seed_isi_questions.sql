-- ============================================================
-- ARIA 2.0: ISI Questions Seed Data
-- ============================================================
-- Insomnia Severity Index - 7 items
-- Source: isi.md - Bastien et al., 2001
-- Scoring: 0-28 (7 items with varying scales)
-- Crisis Threshold: None
-- Time Frame: "Current (past 2 weeks)"
-- Response Options: Vary by question (see below)

-- Clear any existing ISI questions
DELETE FROM questions WHERE instrument = 'isi';

-- ISI Q1a: Difficulty falling asleep
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Difficulty falling asleep',
  'sleep',
  'isi',
  1,
  FALSE,
  'medium',
  '{"sleep": 1.0}',
  '[{"text": "None", "value": 0}, {"text": "Mild", "value": 1}, {"text": "Moderate", "value": 2}, {"text": "Severe", "value": 3}, {"text": "Very Severe", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- ISI Q1b: Difficulty staying asleep
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Difficulty staying asleep',
  'sleep',
  'isi',
  2,
  FALSE,
  'medium',
  '{"sleep": 1.0}',
  '[{"text": "None", "value": 0}, {"text": "Mild", "value": 1}, {"text": "Moderate", "value": 2}, {"text": "Severe", "value": 3}, {"text": "Very Severe", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- ISI Q1c: Problem waking up too early
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Problem waking up too early',
  'sleep',
  'isi',
  3,
  FALSE,
  'medium',
  '{"sleep": 1.0}',
  '[{"text": "None", "value": 0}, {"text": "Mild", "value": 1}, {"text": "Moderate", "value": 2}, {"text": "Severe", "value": 3}, {"text": "Very Severe", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- ISI Q2: Sleep satisfaction
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How satisfied/dissatisfied are you with your current sleep pattern?',
  'sleep',
  'isi',
  4,
  FALSE,
  'medium',
  '{"sleep": 1.0}',
  '[{"text": "Very satisfied", "value": 0}, {"text": "Satisfied", "value": 1}, {"text": "Neutral", "value": 2}, {"text": "Dissatisfied", "value": 3}, {"text": "Very dissatisfied", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- ISI Q3: Sleep interference with daily functioning
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'To what extent do you consider your sleep problem to interfere with your daily functioning (e.g., daytime fatigue, mood, ability to function at work/daily chores, concentration, memory)?',
  'sleep',
  'isi',
  5,
  FALSE,
  'high',
  '{"sleep": 1.0, "stress": 0.2}',
  '[{"text": "Not at all", "value": 0}, {"text": "A little", "value": 1}, {"text": "Somewhat", "value": 2}, {"text": "Much", "value": 3}, {"text": "Very much", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- ISI Q4: Noticeability to others
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How noticeable to others do you think your sleeping problem is in terms of impairing the quality of your life?',
  'sleep',
  'isi',
  6,
  FALSE,
  'medium',
  '{"sleep": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "A little", "value": 1}, {"text": "Somewhat", "value": 2}, {"text": "Much", "value": 3}, {"text": "Very much", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- ISI Q5: Worry/distress about sleep
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'How worried/distressed are you about your current sleep problem?',
  'sleep',
  'isi',
  7,
  FALSE,
  'high',
  '{"sleep": 1.0, "anxiety": 0.2}',
  '[{"text": "Not at all", "value": 0}, {"text": "A little", "value": 1}, {"text": "Somewhat", "value": 2}, {"text": "Much", "value": 3}, {"text": "Very much", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Verify ISI questions were inserted
SELECT 
  question_number,
  LEFT(question, 50) || '...' as question_preview,
  reverse_scored
FROM questions 
WHERE instrument = 'isi'
ORDER BY question_number;
