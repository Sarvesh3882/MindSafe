-- ============================================================
-- ARIA 2.0: Combined Question Bank Seed Script
-- ============================================================
-- This script combines all 8 seed files into one Supabase-compatible file.
-- Run this directly in Supabase SQL Editor.
--
-- Contents:
-- 1. Triage Questions (3 questions)
-- 2. PHQ-9 Questions (9 questions - Depression)
-- 3. GAD-7 Questions (7 questions - Anxiety)
-- 4. ISI Questions (7 questions - Sleep/Insomnia)
-- 5. PSS-10 Questions (10 questions - Stress, 4 reverse-scored)
-- 6. Maslach Questions (9 questions - Burnout)
-- 7. UCLA Questions (3 questions - Loneliness)
-- 8. Camouflage Questions (8 questions)
--
-- Total: 56 questions
-- ============================================================

-- ============================================================
-- SECTION 1: TRIAGE QUESTIONS (3 questions)
-- ============================================================

-- Clear any existing triage questions
DELETE FROM questions WHERE is_triage = TRUE;

-- T1: Energy/Mood Question
INSERT INTO questions (
  question,
  category,
  severity,
  maps_to,
  options,
  is_triage,
  created_at
) VALUES (
  'How has your energy been today?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "Full of energy, feeling great", "value": 0, "maps_to": {"depression": 0, "anxiety": 0, "burnout": 0}},
    {"text": "Pretty good, mostly okay", "value": 1, "maps_to": {"depression": 0, "anxiety": 0, "burnout": 0}},
    {"text": "A bit low, not my best", "value": 2, "maps_to": {"depression": 1, "anxiety": 0, "burnout": 1}},
    {"text": "Really drained or down", "value": 3, "maps_to": {"depression": 2, "anxiety": 1, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T2: Sleep Quality Question
INSERT INTO questions (
  question,
  category,
  severity,
  maps_to,
  options,
  is_triage,
  created_at
) VALUES (
  'How well did you sleep last night?',
  'sleep',
  'low',
  '{}',
  '[
    {"text": "Slept really well", "value": 0, "maps_to": {"sleep": 0, "depression": 0, "anxiety": 0}},
    {"text": "Okay, could be better", "value": 1, "maps_to": {"sleep": 0, "depression": 0, "anxiety": 0}},
    {"text": "Didn''t sleep great", "value": 2, "maps_to": {"sleep": 1, "depression": 0, "anxiety": 1}},
    {"text": "Barely slept / very restless", "value": 3, "maps_to": {"sleep": 2, "depression": 1, "anxiety": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T3: Stress Level Question
INSERT INTO questions (
  question,
  category,
  severity,
  maps_to,
  options,
  is_triage,
  created_at
) VALUES (
  'How stressed have you been feeling lately?',
  'stress',
  'low',
  '{}',
  '[
    {"text": "Not stressed at all", "value": 0, "maps_to": {"stress": 0, "anxiety": 0, "burnout": 0, "loneliness": 0}},
    {"text": "A little, but managing", "value": 1, "maps_to": {"stress": 0, "anxiety": 0, "burnout": 0, "loneliness": 0}},
    {"text": "Quite stressed", "value": 2, "maps_to": {"stress": 2, "anxiety": 1, "burnout": 1, "loneliness": 0}},
    {"text": "Overwhelmed / can''t cope", "value": 3, "maps_to": {"stress": 3, "anxiety": 2, "burnout": 2, "loneliness": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- SECTION 2: PHQ-9 QUESTIONS (9 questions - Depression)
-- ============================================================

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

-- ============================================================
-- SECTION 3: GAD-7 QUESTIONS (7 questions - Anxiety)
-- ============================================================

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

-- ============================================================
-- SECTION 4: ISI QUESTIONS (7 questions - Sleep/Insomnia)
-- ============================================================

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

-- ============================================================
-- SECTION 5: PSS-10 QUESTIONS (10 questions - Stress)
-- ============================================================
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
