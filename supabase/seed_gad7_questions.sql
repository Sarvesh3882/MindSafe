-- ============================================================
-- ARIA 2.0: GAD-7 Questions Seed Data
-- ============================================================
-- Generalized Anxiety Disorder Scale - 7 items
-- Source: gad7.md - Spitzer et al., 2006
-- Scoring: 0-21 (7 items × 0-3 each)
-- Crisis Threshold: ≥15
-- Time Frame: "Over the last 2 weeks"
-- Response Options: 0 = Not at all | 1 = Several days | 2 = More than half the days | 3 = Nearly every day

-- Clear any existing GAD-7 questions
DELETE FROM questions WHERE instrument = 'gad7';

-- GAD-7 Q1
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Feeling nervous, anxious, or on edge',
  'anxiety',
  'gad7',
  1,
  FALSE,
  'medium',
  '{"anxiety": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- GAD-7 Q2
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Not being able to stop or control worrying',
  'anxiety',
  'gad7',
  2,
  FALSE,
  'high',
  '{"anxiety": 1.0, "stress": 0.3}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- GAD-7 Q3
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Worrying too much about different things',
  'anxiety',
  'gad7',
  3,
  FALSE,
  'medium',
  '{"anxiety": 1.0, "stress": 0.2}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- GAD-7 Q4
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Trouble relaxing',
  'anxiety',
  'gad7',
  4,
  FALSE,
  'medium',
  '{"anxiety": 1.0, "stress": 0.3}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- GAD-7 Q5
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Being so restless that it is hard to sit still',
  'anxiety',
  'gad7',
  5,
  FALSE,
  'medium',
  '{"anxiety": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- GAD-7 Q6
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Becoming easily annoyed or irritable',
  'anxiety',
  'gad7',
  6,
  FALSE,
  'medium',
  '{"anxiety": 1.0, "stress": 0.3}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- GAD-7 Q7
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'Feeling afraid as if something awful might happen',
  'anxiety',
  'gad7',
  7,
  FALSE,
  'high',
  '{"anxiety": 1.0}',
  '[{"text": "Not at all", "value": 0}, {"text": "Several days", "value": 1}, {"text": "More than half the days", "value": 2}, {"text": "Nearly every day", "value": 3}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Verify GAD-7 questions were inserted
SELECT 
  question_number,
  LEFT(question, 50) || '...' as question_preview,
  reverse_scored
FROM questions 
WHERE instrument = 'gad7'
ORDER BY question_number;
