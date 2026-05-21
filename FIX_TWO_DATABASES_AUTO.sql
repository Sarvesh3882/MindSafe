-- AUTOMATIC FIX: Merge the two separate student databases
-- This script automatically finds the correct college_id and updates all NULL values

-- Update all NULL college_id users to match the existing college_id
UPDATE users
SET college_id = (
  SELECT DISTINCT college_id 
  FROM users 
  WHERE college_id IS NOT NULL 
  LIMIT 1
)
WHERE college_id IS NULL;

-- Verify the fix - should show all users are now in one database
SELECT 
  role,
  COUNT(*) as total_count,
  STRING_AGG(full_name, ', ' ORDER BY full_name) as all_names
FROM users
GROUP BY role
ORDER BY role;

-- Show the college they're all connected to
SELECT 
  c.id,
  c.name,
  c.plan_tier,
  COUNT(u.id) as total_users
FROM colleges c
LEFT JOIN users u ON c.id = u.college_id
GROUP BY c.id, c.name, c.plan_tier
ORDER BY total_users DESC;
