-- ============================================================
-- ARIA 2.0: Expanded Triage Question Pool (16 questions)
-- ============================================================
-- Clinically valid triage questions based on validated brief screeners.
-- System will randomly select 5-6 from this pool each session.
--
-- Clinical Sources:
-- - PHQ-2: Depression screening (Kroenke et al., 2003)
-- - GAD-2: Anxiety screening (Kroenke et al., 2007)
-- - PSS-4: Perceived Stress Scale short form (Cohen et al., 1983)
-- - ISI-2: Insomnia Severity Index brief (Bastien et al., 2001)
-- - UCLA-3: Loneliness Scale short form (Hughes et al., 2004)
-- - Single-item burnout (Dolan et al., 2015)
-- - WHO-5: Well-Being Index (WHO, 1998)
-- ============================================================

-- Clear existing triage questions
DELETE FROM questions WHERE is_triage = TRUE;

-- ============================================================
-- DEPRESSION DOMAIN (4 questions)
-- ============================================================

-- T1: Anhedonia (PHQ-2 item 1)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'Over the past few days, how much interest or pleasure have you had in doing things?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "A lot of interest and pleasure", "value": 0, "maps_to": {"depression": 0}},
    {"text": "Some interest", "value": 1, "maps_to": {"depression": 0}},
    {"text": "Not much interest", "value": 2, "maps_to": {"depression": 1, "burnout": 1}},
    {"text": "No interest at all", "value": 3, "maps_to": {"depression": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T2: Depressed Mood (PHQ-2 item 2)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How has your mood been over the past few days?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "Good, feeling positive", "value": 0, "maps_to": {"depression": 0}},
    {"text": "Okay, nothing special", "value": 1, "maps_to": {"depression": 0}},
    {"text": "A bit down or flat", "value": 2, "maps_to": {"depression": 1, "anxiety": 1}},
    {"text": "Really low or hopeless", "value": 3, "maps_to": {"depression": 2, "anxiety": 1, "loneliness": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T3: Energy Level (PHQ-9 item 4 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How has your energy been lately?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "Full of energy", "value": 0, "maps_to": {"depression": 0, "burnout": 0}},
    {"text": "Pretty good energy", "value": 1, "maps_to": {"depression": 0, "burnout": 0}},
    {"text": "A bit low on energy", "value": 2, "maps_to": {"depression": 1, "burnout": 1, "sleep": 1}},
    {"text": "Exhausted or drained", "value": 3, "maps_to": {"depression": 2, "burnout": 2, "sleep": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T4: Motivation (Behavioral activation indicator)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How motivated have you felt to do things?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "Very motivated", "value": 0, "maps_to": {"depression": 0}},
    {"text": "Somewhat motivated", "value": 1, "maps_to": {"depression": 0}},
    {"text": "Not very motivated", "value": 2, "maps_to": {"depression": 1, "burnout": 1}},
    {"text": "No motivation at all", "value": 3, "maps_to": {"depression": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- ANXIETY DOMAIN (4 questions)
-- ============================================================

-- T5: Worry (GAD-2 item 1)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How much have you been worrying about things?',
  'anxiety',
  'low',
  '{}',
  '[
    {"text": "Not worrying much", "value": 0, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "A little, but manageable", "value": 1, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "Worrying quite a bit", "value": 2, "maps_to": {"anxiety": 2, "stress": 2}},
    {"text": "Can''t stop worrying", "value": 3, "maps_to": {"anxiety": 3, "stress": 3}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T6: Nervousness (GAD-2 item 2)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How nervous or on edge have you been feeling?',
  'anxiety',
  'low',
  '{}',
  '[
    {"text": "Calm and relaxed", "value": 0, "maps_to": {"anxiety": 0}},
    {"text": "A little tense", "value": 1, "maps_to": {"anxiety": 0, "stress": 1}},
    {"text": "Quite nervous or on edge", "value": 2, "maps_to": {"anxiety": 2, "stress": 2}},
    {"text": "Extremely anxious", "value": 3, "maps_to": {"anxiety": 3, "stress": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T7: Restlessness (GAD-7 item 5 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How restless or unable to sit still have you been?',
  'anxiety',
  'low',
  '{}',
  '[
    {"text": "Not restless at all", "value": 0, "maps_to": {"anxiety": 0}},
    {"text": "A little restless", "value": 1, "maps_to": {"anxiety": 0}},
    {"text": "Quite restless", "value": 2, "maps_to": {"anxiety": 2, "stress": 1}},
    {"text": "Can''t sit still", "value": 3, "maps_to": {"anxiety": 3, "stress": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T8: Relaxation Difficulty (GAD-7 item 4 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How easy has it been for you to relax?',
  'anxiety',
  'low',
  '{}',
  '[
    {"text": "Very easy to relax", "value": 0, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "Somewhat easy", "value": 1, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "Hard to relax", "value": 2, "maps_to": {"anxiety": 2, "stress": 2}},
    {"text": "Can''t relax at all", "value": 3, "maps_to": {"anxiety": 3, "stress": 3}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- STRESS DOMAIN (2 questions)
-- ============================================================

-- T9: Perceived Stress (PSS-4 item adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How stressed have you been feeling lately?',
  'stress',
  'low',
  '{}',
  '[
    {"text": "Not stressed at all", "value": 0, "maps_to": {"stress": 0}},
    {"text": "A little stressed", "value": 1, "maps_to": {"stress": 0}},
    {"text": "Quite stressed", "value": 2, "maps_to": {"stress": 2, "anxiety": 1, "burnout": 1}},
    {"text": "Overwhelmed by stress", "value": 3, "maps_to": {"stress": 3, "anxiety": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T10: Coping Ability (PSS-4 reverse item adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How well have you been coping with daily demands?',
  'stress',
  'low',
  '{}',
  '[
    {"text": "Coping very well", "value": 0, "maps_to": {"stress": 0}},
    {"text": "Coping okay", "value": 1, "maps_to": {"stress": 0}},
    {"text": "Struggling to cope", "value": 2, "maps_to": {"stress": 2, "burnout": 1}},
    {"text": "Can''t cope at all", "value": 3, "maps_to": {"stress": 3, "burnout": 2, "depression": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- SLEEP DOMAIN (2 questions)
-- ============================================================

-- T11: Sleep Quality (ISI item 1 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How well have you been sleeping?',
  'sleep',
  'low',
  '{}',
  '[
    {"text": "Sleeping really well", "value": 0, "maps_to": {"sleep": 0}},
    {"text": "Sleeping okay", "value": 1, "maps_to": {"sleep": 0}},
    {"text": "Not sleeping great", "value": 2, "maps_to": {"sleep": 1, "depression": 1, "anxiety": 1}},
    {"text": "Barely sleeping", "value": 3, "maps_to": {"sleep": 2, "depression": 1, "anxiety": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T12: Sleep Impact (ISI item 3 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How much has sleep affected your daily functioning?',
  'sleep',
  'low',
  '{}',
  '[
    {"text": "Not affecting me", "value": 0, "maps_to": {"sleep": 0}},
    {"text": "A little impact", "value": 1, "maps_to": {"sleep": 0}},
    {"text": "Noticeable impact", "value": 2, "maps_to": {"sleep": 1, "burnout": 1}},
    {"text": "Major impact", "value": 3, "maps_to": {"sleep": 2, "burnout": 2, "depression": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- BURNOUT DOMAIN (2 questions)
-- ============================================================

-- T13: Emotional Exhaustion (Maslach single-item adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How emotionally drained have you felt from your work or studies?',
  'burnout',
  'low',
  '{}',
  '[
    {"text": "Not drained at all", "value": 0, "maps_to": {"burnout": 0}},
    {"text": "A little drained", "value": 1, "maps_to": {"burnout": 0}},
    {"text": "Quite drained", "value": 2, "maps_to": {"burnout": 2, "stress": 1}},
    {"text": "Completely burned out", "value": 3, "maps_to": {"burnout": 3, "stress": 2, "depression": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T14: Academic Strain (Student-specific burnout indicator)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How much of a strain has studying or working been for you?',
  'burnout',
  'low',
  '{}',
  '[
    {"text": "Not a strain", "value": 0, "maps_to": {"burnout": 0}},
    {"text": "A little strain", "value": 1, "maps_to": {"burnout": 0}},
    {"text": "Quite a strain", "value": 2, "maps_to": {"burnout": 2, "stress": 2}},
    {"text": "Unbearable strain", "value": 3, "maps_to": {"burnout": 3, "stress": 3}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- LONELINESS DOMAIN (2 questions)
-- ============================================================

-- T15: Social Connection (UCLA-3 item 1 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How connected have you felt to others lately?',
  'loneliness',
  'low',
  '{}',
  '[
    {"text": "Very connected", "value": 0, "maps_to": {"loneliness": 0}},
    {"text": "Somewhat connected", "value": 1, "maps_to": {"loneliness": 0}},
    {"text": "A bit isolated", "value": 2, "maps_to": {"loneliness": 2, "depression": 1}},
    {"text": "Very alone", "value": 3, "maps_to": {"loneliness": 3, "depression": 2}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- T16: Social Support (UCLA-3 item 2 adapted)
INSERT INTO questions (question, category, severity, maps_to, options, is_triage, created_at) VALUES (
  'How much support have you felt from people around you?',
  'loneliness',
  'low',
  '{}',
  '[
    {"text": "A lot of support", "value": 0, "maps_to": {"loneliness": 0}},
    {"text": "Some support", "value": 1, "maps_to": {"loneliness": 0}},
    {"text": "Not much support", "value": 2, "maps_to": {"loneliness": 2, "depression": 1}},
    {"text": "No support at all", "value": 3, "maps_to": {"loneliness": 3, "depression": 2, "anxiety": 1}}
  ]'::jsonb,
  TRUE,
  NOW()
);

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Verify all 16 triage questions were inserted
SELECT 
  COUNT(*) as total_triage_questions,
  COUNT(CASE WHEN category = 'depression' THEN 1 END) as depression_qs,
  COUNT(CASE WHEN category = 'anxiety' THEN 1 END) as anxiety_qs,
  COUNT(CASE WHEN category = 'stress' THEN 1 END) as stress_qs,
  COUNT(CASE WHEN category = 'sleep' THEN 1 END) as sleep_qs,
  COUNT(CASE WHEN category = 'burnout' THEN 1 END) as burnout_qs,
  COUNT(CASE WHEN category = 'loneliness' THEN 1 END) as loneliness_qs
FROM questions 
WHERE is_triage = TRUE;

-- Show all triage questions
SELECT 
  category,
  LEFT(question, 60) || '...' as question_preview,
  jsonb_array_length(options) as option_count
FROM questions 
WHERE is_triage = TRUE
ORDER BY category, created_at;

