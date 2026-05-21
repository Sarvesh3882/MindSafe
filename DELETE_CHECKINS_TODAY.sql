-- Delete today's check-ins for sohampate45 and japesh
-- Copy and paste this into Supabase SQL Editor

DELETE FROM assessments 
WHERE user_id IN (
  SELECT id FROM users 
  WHERE email = 'sohampate45@kkwagh.edu.in' 
     OR email = 'japesh@kkwagh.edu.in'
) 
AND date = '2026-05-21';
