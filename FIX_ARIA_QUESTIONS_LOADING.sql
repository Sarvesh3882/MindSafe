-- ============================================================
-- ARIA Questions Loading Fix — Complete Solution
-- ============================================================
-- This script fixes the issue where triage questions don't load
-- in the ARIA assessment flow.
--
-- Root Causes:
-- 1. RLS policy blocks anonymous users from reading questions
-- 2. Triage questions may not be seeded
-- 3. Options format may use "text" instead of "label"
-- ============================================================

-- ============================================================
-- FIX 1: Allow Anonymous Access to Questions
-- ============================================================
-- Drop the restrictive policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;

-- Create a permissive policy that allows anyone (including anonymous users)
-- to read questions. This is safe because questions are public assessment items.
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

-- ============================================================
-- FIX 2: Ensure Triage Questions Are Seeded
-- ============================================================
-- Clear any existing triage questions
DELETE FROM questions WHERE is_triage = TRUE;

-- Seed 5 triage questions covering all 6 domains
-- T1: Energy / Mood → depression, burnout
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How has your energy and mood been today?',
  'depression',
  'low',
  '{}',
  '[
    {"label": "Great — feeling motivated and positive",  "value": 0, "maps_to": {"depression": 0, "burnout": 0}},
    {"label": "Okay — nothing special but fine",         "value": 1, "maps_to": {"depression": 0, "burnout": 0}},
    {"label": "Low — tired and a bit flat",              "value": 2, "maps_to": {"depression": 1, "burnout": 1}},
    {"label": "Very low — drained or feeling hopeless",  "value": 3, "maps_to": {"depression": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '0 seconds'
);

-- T2: Sleep → sleep, depression, anxiety
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How well did you sleep last night?',
  'sleep',
  'low',
  '{}',
  '[
    {"label": "Really well — felt rested",              "value": 0, "maps_to": {"sleep": 0, "depression": 0, "anxiety": 0}},
    {"label": "Okay — could have been better",          "value": 1, "maps_to": {"sleep": 0, "depression": 0, "anxiety": 0}},
    {"label": "Poorly — woke up a lot or too early",    "value": 2, "maps_to": {"sleep": 2, "depression": 1, "anxiety": 1}},
    {"label": "Barely slept — very restless or anxious","value": 3, "maps_to": {"sleep": 3, "depression": 1, "anxiety": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '1 seconds'
);

-- T3: Stress / Overwhelm → stress, anxiety, burnout
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How stressed or overwhelmed have you been feeling lately?',
  'stress',
  'low',
  '{}',
  '[
    {"label": "Not at all — things feel manageable",    "value": 0, "maps_to": {"stress": 0, "anxiety": 0, "burnout": 0}},
    {"label": "A little — but I am coping fine",        "value": 1, "maps_to": {"stress": 0, "anxiety": 0, "burnout": 0}},
    {"label": "Quite stressed — hard to keep up",       "value": 2, "maps_to": {"stress": 2, "anxiety": 1, "burnout": 1}},
    {"label": "Overwhelmed — feel like I cannot cope",  "value": 3, "maps_to": {"stress": 3, "anxiety": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '2 seconds'
);

-- T4: Social connection / Loneliness → loneliness, depression
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How connected do you feel to the people around you right now?',
  'loneliness',
  'low',
  '{}',
  '[
    {"label": "Very connected — I feel supported",      "value": 0, "maps_to": {"loneliness": 0, "depression": 0}},
    {"label": "Somewhat connected — mostly okay",       "value": 1, "maps_to": {"loneliness": 0, "depression": 0}},
    {"label": "A bit isolated — not reaching out much", "value": 2, "maps_to": {"loneliness": 2, "depression": 1}},
    {"label": "Very alone — nobody to talk to",         "value": 3, "maps_to": {"loneliness": 3, "depression": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '3 seconds'
);

-- T5: Anxiety / Worry → anxiety, stress
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How much have you been worrying or feeling anxious lately?',
  'anxiety',
  'low',
  '{}',
  '[
    {"label": "Not at all — feeling calm",              "value": 0, "maps_to": {"anxiety": 0, "stress": 0}},
    {"label": "A little — normal day-to-day worries",   "value": 1, "maps_to": {"anxiety": 0, "stress": 0}},
    {"label": "Quite a bit — hard to switch off",       "value": 2, "maps_to": {"anxiety": 2, "stress": 1}},
    {"label": "Constantly — feels uncontrollable",      "value": 3, "maps_to": {"anxiety": 3, "stress": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '4 seconds'
);

-- ============================================================
-- FIX 3: Fix Options Format (if needed)
-- ============================================================
-- Update any questions that still use "text" instead of "label"
UPDATE questions
SET options = (
  SELECT jsonb_agg(
    jsonb_set(
      elem - 'text',
      '{label}',
      elem->'text'
    )
  )
  FROM jsonb_array_elements(options) elem
)
WHERE options::text LIKE '%"text":%';

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Check that triage questions are now accessible
SELECT 
  'Triage Questions Loaded' AS status,
  COUNT(*) AS count
FROM questions
WHERE is_triage = TRUE;

-- Verify options format
SELECT 
  question,
  jsonb_array_length(options) AS option_count,
  options->0->>'label' AS first_option_label
FROM questions
WHERE is_triage = TRUE
ORDER BY created_at;

-- Test anonymous access
SET ROLE anon;
SELECT 
  'Anonymous Access Test' AS test,
  COUNT(*) AS accessible_questions
FROM questions
WHERE is_triage = TRUE;
RESET ROLE;

