-- Clear Today's Check-ins for Test Accounts
-- Run this in Supabase SQL Editor

-- Target accounts:
-- 1. sohampate45@kkwagh.edu.in
-- 2. japesh@kkwagh.edu.in

-- Step 1: Check what will be deleted (SAFE - run this first)
SELECT 
  u.email,
  u.role,
  a.emotion,
  a.risk_level,
  a.date,
  a.created_at
FROM assessments a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('sohampate45@kkwagh.edu.in', 'japesh@kkwagh.edu.in')
AND a.date = CURRENT_DATE
ORDER BY u.email, a.created_at DESC;

-- Step 2: Delete today's check-ins for both accounts
DELETE FROM assessments
WHERE user_id IN (
  SELECT id FROM users 
  WHERE email IN ('sohampate45@kkwagh.edu.in', 'japesh@kkwagh.edu.in')
)
AND date = CURRENT_DATE;

-- Step 3: Verify deletion (should return 0 rows)
SELECT 
  u.email,
  COUNT(*) as checkins_today
FROM assessments a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('sohampate45@kkwagh.edu.in', 'japesh@kkwagh.edu.in')
AND a.date = CURRENT_DATE
GROUP BY u.email;
