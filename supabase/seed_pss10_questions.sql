-- ============================================================
-- ARIA 2.0: PSS-10 Questions Seed Data
-- ============================================================
-- Perceived Stress Scale - 10 items
-- Source: pss10.md - Cohen et al., 1983
-- Scoring: 0-40 (10 items × 0-4 each)
-- Crisis Threshold: ≥27
-- Time Frame: "In the last month"
-- Response Options: 0 = Never | 1 = Almost never | 2 = Sometimes | 3 = Fairly often | 4 = Very often
-- CRITICAL: Items 4, 5, 7, 8 are REVERSE SCORED

-- Clear any existing PSS-10 questions
DELETE FROM questions WHERE instrument = 'pss10';

-- PSS-10 Q1
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you been upset because of something that happened unexpectedly?',
  'stress',
  'pss10',
  1,
  FALSE,
  'medium',
  '{"stress": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q2
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you felt that you were unable to control the important things in your life?',
  'stress',
  'pss10',
  2,
  FALSE,
  'high',
  '{"stress": 1.0, "anxiety": 0.2}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q3
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you felt nervous and stressed?',
  'stress',
  'pss10',
  3,
  FALSE,
  'high',
  '{"stress": 1.0, "anxiety": 0.3}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q4 (REVERSE SCORED)
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you felt confident about your ability to handle your personal problems?',
  'stress',
  'pss10',
  4,
  TRUE,
  'medium',
  '{"stress": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q5 (REVERSE SCORED)
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you felt that things were going your way?',
  'stress',
  'pss10',
  5,
  TRUE,
  'medium',
  '{"stress": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q6
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you found that you could not cope with all the things that you had to do?',
  'stress',
  'pss10',
  6,
  FALSE,
  'high',
  '{"stress": 1.0, "burnout": 0.3}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q7 (REVERSE SCORED)
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you been able to control irritations in your life?',
  'stress',
  'pss10',
  7,
  TRUE,
  'medium',
  '{"stress": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q8 (REVERSE SCORED)
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you felt that you were on top of things?',
  'stress',
  'pss10',
  8,
  TRUE,
  'medium',
  '{"stress": 1.0}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q9
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you been angered because of things that were outside of your control?',
  'stress',
  'pss10',
  9,
  FALSE,
  'medium',
  '{"stress": 1.0, "anxiety": 0.2}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- PSS-10 Q10
INSERT INTO questions (question, category, instrument, question_number, reverse_scored, severity, maps_to, options, is_triage, is_camouflage, created_at) VALUES (
  'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
  'stress',
  'pss10',
  10,
  FALSE,
  'high',
  '{"stress": 1.0, "depression": 0.3}',
  '[{"text": "Never", "value": 0}, {"text": "Almost never", "value": 1}, {"text": "Sometimes", "value": 2}, {"text": "Fairly often", "value": 3}, {"text": "Very often", "value": 4}]'::jsonb,
  FALSE,
  FALSE,
  NOW()
);

-- Verify PSS-10 questions were inserted
SELECT 
  question_number,
  LEFT(question, 50) || '...' as question_preview,
  reverse_scored
FROM questions 
WHERE instrument = 'pss10'
ORDER BY question_number;
