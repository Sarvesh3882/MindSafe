-- ============================================================
-- ARIA CLINICAL QUESTIONS SEED
-- ============================================================

-- Clear existing dummy questions
DELETE FROM questions;

-- ============================================================
-- 1. DEPRESSION (PHQ-9)
-- Options: 0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day
-- ============================================================
INSERT INTO questions (question, category, severity, options, maps_to) VALUES
('Over the last 2 weeks, how often have you had little interest or pleasure in doing things?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1}'
),
('Over the last 2 weeks, how often have you been feeling down, depressed, or hopeless?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1}'
),
('Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1, "sleep": 1}'
),
('Over the last 2 weeks, how often have you been feeling tired or having little energy?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1, "burnout": 0.5}'
),
('Over the last 2 weeks, how often have you had poor appetite or been overeating?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1}'
),
('Over the last 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?', 'depression', 'high', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1.5}'
),
('Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or watching television?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1}'
),
('Over the last 2 weeks, how often have you moved or spoken so slowly that other people could have noticed, or been extremely restless/fidgety?', 'depression', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 1}'
),
('Over the last 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself in some way?', 'depression', 'high', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"depression": 3}'
);

-- ============================================================
-- 2. ANXIETY (GAD-7)
-- Options: 0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day
-- ============================================================
INSERT INTO questions (question, category, severity, options, maps_to) VALUES
('Over the last 2 weeks, how often have you been feeling nervous, anxious, or on edge?', 'anxiety', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1}'
),
('Over the last 2 weeks, how often have you not been able to stop or control worrying?', 'anxiety', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1}'
),
('Over the last 2 weeks, how often have you been worrying too much about different things?', 'anxiety', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1}'
),
('Over the last 2 weeks, how often have you had trouble relaxing?', 'anxiety', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1, "stress": 0.5}'
),
('Over the last 2 weeks, how often have you been so restless that it is hard to sit still?', 'anxiety', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1}'
),
('Over the last 2 weeks, how often have you become easily annoyed or irritable?', 'anxiety', 'medium', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1, "stress": 0.5}'
),
('Over the last 2 weeks, how often have you felt afraid as if something awful might happen?', 'anxiety', 'high', 
  '[{"label":"Not at all","value":0},{"label":"Several days","value":1},{"label":"More than half the days","value":2},{"label":"Nearly every day","value":3}]', 
  '{"anxiety": 1.5}'
);

-- ============================================================
-- 3. STRESS (PSS-10)
-- Options: 0 = Never, 1 = Almost never, 2 = Sometimes, 3 = Fairly often, 4 = Very often
-- Reverse scored items have values 4,3,2,1,0
-- ============================================================
INSERT INTO questions (question, category, severity, options, maps_to) VALUES
('In the last month, how often have you been upset because of something that happened unexpectedly?', 'stress', 'low', 
  '[{"label":"Never","value":0},{"label":"Almost never","value":1},{"label":"Sometimes","value":2},{"label":"Fairly often","value":3},{"label":"Very often","value":4}]', 
  '{"stress": 1}'
),
('In the last month, how often have you felt that you were unable to control the important things in your life?', 'stress', 'medium', 
  '[{"label":"Never","value":0},{"label":"Almost never","value":1},{"label":"Sometimes","value":2},{"label":"Fairly often","value":3},{"label":"Very often","value":4}]', 
  '{"stress": 1}'
),
('In the last month, how often have you felt nervous and stressed?', 'stress', 'medium', 
  '[{"label":"Never","value":0},{"label":"Almost never","value":1},{"label":"Sometimes","value":2},{"label":"Fairly often","value":3},{"label":"Very often","value":4}]', 
  '{"stress": 1, "anxiety": 0.5}'
),
('In the last month, how often have you felt confident about your ability to handle your personal problems?', 'stress', 'low', 
  '[{"label":"Never","value":4},{"label":"Almost never","value":3},{"label":"Sometimes","value":2},{"label":"Fairly often","value":1},{"label":"Very often","value":0}]', 
  '{"stress": 1}'
),
('In the last month, how often have you felt that things were going your way?', 'stress', 'low', 
  '[{"label":"Never","value":4},{"label":"Almost never","value":3},{"label":"Sometimes","value":2},{"label":"Fairly often","value":1},{"label":"Very often","value":0}]', 
  '{"stress": 1}'
),
('In the last month, how often have you found that you could not cope with all the things that you had to do?', 'stress', 'medium', 
  '[{"label":"Never","value":0},{"label":"Almost never","value":1},{"label":"Sometimes","value":2},{"label":"Fairly often","value":3},{"label":"Very often","value":4}]', 
  '{"stress": 1, "burnout": 0.5}'
),
('In the last month, how often have you been able to control irritations in your life?', 'stress', 'low', 
  '[{"label":"Never","value":4},{"label":"Almost never","value":3},{"label":"Sometimes","value":2},{"label":"Fairly often","value":1},{"label":"Very often","value":0}]', 
  '{"stress": 1}'
),
('In the last month, how often have you felt that you were on top of things?', 'stress', 'low', 
  '[{"label":"Never","value":4},{"label":"Almost never","value":3},{"label":"Sometimes","value":2},{"label":"Fairly often","value":1},{"label":"Very often","value":0}]', 
  '{"stress": 1}'
),
('In the last month, how often have you been angered because of things that were outside of your control?', 'stress', 'medium', 
  '[{"label":"Never","value":0},{"label":"Almost never","value":1},{"label":"Sometimes","value":2},{"label":"Fairly often","value":3},{"label":"Very often","value":4}]', 
  '{"stress": 1}'
),
('In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?', 'stress', 'high', 
  '[{"label":"Never","value":0},{"label":"Almost never","value":1},{"label":"Sometimes","value":2},{"label":"Fairly often","value":3},{"label":"Very often","value":4}]', 
  '{"stress": 1.5}'
);

-- ============================================================
-- 4. BURNOUT & SLEEP (General proxies)
-- ============================================================
INSERT INTO questions (question, category, severity, options, maps_to) VALUES
('Lately, how often do you feel emotionally drained from your studies or work?', 'burnout', 'medium', 
  '[{"label":"Never","value":0},{"label":"Sometimes","value":1},{"label":"Often","value":2},{"label":"Always","value":3}]', 
  '{"burnout": 1, "stress": 0.5}'
),
('How often do you wake up feeling unrefreshed, even after a full night of sleep?', 'sleep', 'medium', 
  '[{"label":"Never","value":0},{"label":"Sometimes","value":1},{"label":"Often","value":2},{"label":"Always","value":3}]', 
  '{"sleep": 1, "burnout": 0.5}'
);
