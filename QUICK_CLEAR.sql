-- QUICK CLEAR - Just copy and paste this one line into Supabase SQL Editor

DELETE FROM assessments WHERE user_id IN (SELECT id FROM users WHERE email IN ('sohampate45@kkwagh.edu.in', 'japesh@kkwagh.edu.in')) AND date = CURRENT_DATE;
