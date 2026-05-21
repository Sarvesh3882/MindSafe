-- ============================================================
-- ARIA 2.0: PHQ-9 Questions Seed Data
-- ============================================================
-- Patient Health Questionnaire (Depression) - 9 items
-- Source: phq9.md - Kroenke et al., 2001
-- Scoring: 0-27 (9 items × 0-3 each)
-- Crisis Threshold: ≥15
-- Time Frame: "Over the last 2 weeks"
-- Response Options: 0 = Not at all | 1 = Several days | 2 = More than half the days | 3 = Nearly every day

-- Clear any existing PHQ-9 questions
DELETE FROM questions WHERE instrument = 'phq9';

-- PHQ-9 Q1
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Little interest or pleasure in doing things',
  'depression',
  'phq9',
  1,
  FALSE,
  'medium',
  '{"depression": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q2
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Feeling down, depressed, or hopeless',
  'depression',
  'phq9',
  2,
  FALSE,
  'high',
  '{"depression": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q3
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Trouble falling or staying asleep, or sleeping too much',
  'depression',
  'phq9',
  3,
  FALSE,
  'medium',
  '{"depression": 1.0, "sleep": 0.3}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q4
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Feeling tired or having little energy',
  'depression',
  'phq9',
  4,
  FALSE,
  'medium',
  '{"depression": 1.0, "burnout": 0.3}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q5
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Poor appetite or overeating',
  'depression',
  'phq9',
  5,
  FALSE,
  'medium',
  '{"depression": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q6
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'depression',
  'phq9',
  6,
  FALSE,
  'high',
  '{"depression": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q7
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'depression',
  'phq9',
  7,
  FALSE,
  'medium',
  '{"depression": 1.0, "stress": 0.2}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q8
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'depression',
  'phq9',
  8,
  FALSE,
  'medium',
  '{"depression": 1.0, "anxiety": 0.3}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PHQ-9 Q9 (CRISIS INDICATOR - suicidal ideation)
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
  'depression',
  'phq9',
  9,
  FALSE,
  'high',
  '{"depression": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Verify PHQ-9 questions were inserted
SELECT 
  question_number,
  LEFT(question, 50) || '...' as question_preview,
  reverse_scored
FROM questions 
WHERE instrument = 'phq9'
ORDER BY question_number;
