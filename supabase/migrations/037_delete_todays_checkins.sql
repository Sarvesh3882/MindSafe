-- Migration 037: Delete today's check-ins for testing
-- Run this in Supabase SQL Editor to bypass the 24-hour cooldown

-- Option 1: Delete ALL assessments from today (for all users)
DELETE FROM assessments 
WHERE date = CURRENT_DATE;

-- Option 2: Delete only YOUR assessments from today (replace with your email)
-- DELETE FROM assessments 
-- WHERE user_id IN (
--   SELECT id FROM users WHERE email = 'your-email@kkwagh.edu.in'
-- )
-- AND date = CURRENT_DATE;

-- Option 3: Delete assessments from the last 7 days (for thorough testing)
-- DELETE FROM assessments 
-- WHERE date >= CURRENT_DATE - INTERVAL '7 days';

-- Verify deletion
SELECT 
  u.email,
  a.date,
  a.risk_level,
  a.completed,
  a.created_at
FROM assessments a
JOIN users u ON a.user_id = u.id
WHERE a.date = CURRENT_DATE
ORDER BY a.created_at DESC;
