-- Clear Today's Check-ins for Testing
-- Run this in Supabase SQL Editor to delete today's assessments

-- Option 1: Delete for a specific user (replace with actual email)
DELETE FROM assessments
WHERE user_id = (
  SELECT id FROM users WHERE email = 'your-email@example.com'
)
AND date = CURRENT_DATE;

-- Option 2: Delete for ALL users (use with caution!)
-- DELETE FROM assessments WHERE date = CURRENT_DATE;

-- Option 3: Check what will be deleted first (safe to run)
SELECT 
  u.email,
  u.role,
  a.emotion,
  a.risk_level,
  a.created_at
FROM assessments a
JOIN users u ON a.user_id = u.id
WHERE a.date = CURRENT_DATE
ORDER BY a.created_at DESC;

-- Option 4: Delete for specific user by ID
-- DELETE FROM assessments 
-- WHERE user_id = 'user-uuid-here' 
-- AND date = CURRENT_DATE;
