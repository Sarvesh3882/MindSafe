-- FIX: Merge the two separate student databases
-- Problem: Old accounts have a college_id, new accounts have NULL
-- Solution: Update all NULL college_id to match the old accounts' college_id

-- Step 1: Find the college_id that the old working accounts are using
-- (This will show us the UUID we need to use)
SELECT DISTINCT college_id 
FROM users 
WHERE college_id IS NOT NULL 
LIMIT 1;

-- Step 2: After you see the UUID from Step 1, copy it and use it below
-- Replace 'PASTE_UUID_HERE' with the actual UUID from Step 1

-- Update all users with NULL college_id to use the correct college_id
UPDATE users
SET college_id = 'PASTE_UUID_HERE'
WHERE college_id IS NULL;

-- Step 3: Verify the fix - should now show only ONE group with all users
SELECT 
  CASE 
    WHEN college_id IS NULL THEN 'NULL (invisible)'
    ELSE 'HAS COLLEGE (visible)'
  END as status,
  role,
  COUNT(*) as count,
  STRING_AGG(full_name, ', ') as names
FROM users
GROUP BY 
  CASE WHEN college_id IS NULL THEN 'NULL (invisible)' ELSE 'HAS COLLEGE (visible)' END,
  role
ORDER BY status, role;

-- Step 4: Verify all users are now visible in the same college
SELECT 
  role,
  COUNT(*) as count,
  STRING_AGG(full_name, ', ') as names
FROM users
WHERE college_id IS NOT NULL
GROUP BY role
ORDER BY role;
