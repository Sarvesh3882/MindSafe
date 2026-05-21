-- ============================================================
-- ARIA 2.0: Triage Questions Seed Data (v2 — 5 questions)
-- ============================================================
-- Five conversational triage questions covering all 6 domains:
-- depression, anxiety, stress, sleep, burnout, loneliness
-- Each option's maps_to encodes per-domain signal weights (0–3).
-- Escalation threshold = 2 per domain.
-- ============================================================

-- Clear any existing triage questions
DELETE FROM questions WHERE is_triage = TRUE;

-- T1: Energy / Mood  →  depression, burnout
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How has your energy and mood been today?',
  'depression',
  'low',
  '{}',
  '[
    {"text": "Great — feeling motivated and positive",  "value": 0, "maps_to": {"depression": 0, "burnout": 0}},
    {"text": "Okay — nothing special but fine",         "value": 1, "maps_to": {"depression": 0, "burnout": 0}},
    {"text": "Low — tired and a bit flat",              "value": 2, "maps_to": {"depression": 1, "burnout": 1}},
    {"text": "Very low — drained or feeling hopeless",  "value": 3, "maps_to": {"depression": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '0 seconds'
);

-- T2: Sleep  →  sleep, depression, anxiety
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How well did you sleep last night?',
  'sleep',
  'low',
  '{}',
  '[
    {"text": "Really well — felt rested",              "value": 0, "maps_to": {"sleep": 0, "depression": 0, "anxiety": 0}},
    {"text": "Okay — could have been better",          "value": 1, "maps_to": {"sleep": 0, "depression": 0, "anxiety": 0}},
    {"text": "Poorly — woke up a lot or too early",    "value": 2, "maps_to": {"sleep": 2, "depression": 1, "anxiety": 1}},
    {"text": "Barely slept — very restless or anxious","value": 3, "maps_to": {"sleep": 3, "depression": 1, "anxiety": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '1 seconds'
);

-- T3: Stress / Overwhelm  →  stress, anxiety, burnout
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How stressed or overwhelmed have you been feeling lately?',
  'stress',
  'low',
  '{}',
  '[
    {"text": "Not at all — things feel manageable",    "value": 0, "maps_to": {"stress": 0, "anxiety": 0, "burnout": 0}},
    {"text": "A little — but I am coping fine",        "value": 1, "maps_to": {"stress": 0, "anxiety": 0, "burnout": 0}},
    {"text": "Quite stressed — hard to keep up",       "value": 2, "maps_to": {"stress": 2, "anxiety": 1, "burnout": 1}},
    {"text": "Overwhelmed — feel like I cannot cope",  "value": 3, "maps_to": {"stress": 3, "anxiety": 2, "burnout": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '2 seconds'
);

-- T4: Social connection / Loneliness  →  loneliness, depression
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How connected do you feel to the people around you right now?',
  'loneliness',
  'low',
  '{}',
  '[
    {"text": "Very connected — I feel supported",      "value": 0, "maps_to": {"loneliness": 0, "depression": 0}},
    {"text": "Somewhat connected — mostly okay",       "value": 1, "maps_to": {"loneliness": 0, "depression": 0}},
    {"text": "A bit isolated — not reaching out much", "value": 2, "maps_to": {"loneliness": 2, "depression": 1}},
    {"text": "Very alone — nobody to talk to",         "value": 3, "maps_to": {"loneliness": 3, "depression": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '3 seconds'
);

-- T5: Anxiety / Worry  →  anxiety, stress
INSERT INTO questions (
  question, category, severity, maps_to, options, is_triage, created_at
) VALUES (
  'How much have you been worrying or feeling anxious lately?',
  'anxiety',
  'low',
  '{}',
  '[
    {"text": "Not at all — feeling calm",              "value": 0, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "A little — normal day-to-day worries",   "value": 1, "maps_to": {"anxiety": 0, "stress": 0}},
    {"text": "Quite a bit — hard to switch off",       "value": 2, "maps_to": {"anxiety": 2, "stress": 1}},
    {"text": "Constantly — feels uncontrollable",      "value": 3, "maps_to": {"anxiety": 3, "stress": 2}}
  ]'::jsonb,
  TRUE,
  NOW() + interval '4 seconds'
);

-- Verify
SELECT
  question,
  category,
  jsonb_array_length(options) AS option_count
FROM questions
WHERE is_triage = TRUE
ORDER BY created_at;
