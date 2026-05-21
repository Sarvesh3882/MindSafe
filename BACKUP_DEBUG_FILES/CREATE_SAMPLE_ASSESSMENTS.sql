-- CREATE SAMPLE ASSESSMENT DATA FOR TESTING
-- This will create realistic assessment data to populate the dashboard

-- Step 1: Get the student user ID
SELECT 
  'Current Student' as info,
  id as student_id,
  email,
  college_id
FROM users 
WHERE role = 'student'
LIMIT 1;

-- Step 2: Insert sample assessments for the past 30 days
-- Replace 'STUDENT_ID_HERE' with the actual student ID from Step 1

-- Example: If student ID is 'abc123', use that in the INSERT statements below

-- Day 1 (30 days ago) - Stable
INSERT INTO assessments (user_id, date, risk_level, completed, created_at)
VALUES (
  (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  CURRENT_DATE - INTERVAL '30 days',
  'stable',
  true,
  NOW() - INTERVAL '30 days'
);

-- Day 7 (23 days ago) - Stable
INSERT INTO assessments (user_id, date, risk_level, completed, created_at)
VALUES (
  (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  CURRENT_DATE - INTERVAL '23 days',
  'stable',
  true,
  NOW() - INTERVAL '23 days'
);

-- Day 14 (16 days ago) - Attention
INSERT INTO assessments (user_id, date, risk_level, completed, created_at)
VALUES (
  (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  CURRENT_DATE - INTERVAL '16 days',
  'attention',
  true,
  NOW() - INTERVAL '16 days'
);

-- Day 21 (9 days ago) - Stable
INSERT INTO assessments (user_id, date, risk_level, completed, created_at)
VALUES (
  (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  CURRENT_DATE - INTERVAL '9 days',
  'stable',
  true,
  NOW() - INTERVAL '9 days'
);

-- Day 28 (2 days ago) - Stable
INSERT INTO assessments (user_id, date, risk_level, completed, created_at)
VALUES (
  (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  CURRENT_DATE - INTERVAL '2 days',
  'stable',
  true,
  NOW() - INTERVAL '2 days'
);

-- Today - Stable
INSERT INTO assessments (user_id, date, risk_level, completed, created_at)
VALUES (
  (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  CURRENT_DATE,
  'stable',
  true,
  NOW()
);

-- Step 3: Verify the new assessments
SELECT 
  'New Assessments' as info,
  date,
  risk_level,
  completed,
  CURRENT_DATE - date as days_ago
FROM assessments
WHERE user_id = (SELECT id FROM users WHERE role = 'student' LIMIT 1)
ORDER BY date DESC;
