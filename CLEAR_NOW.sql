-- SUPER SIMPLE - Clear check-ins for test accounts
-- Just copy this ONE line and paste in Supabase SQL Editor:

DELETE FROM assessments WHERE user_id IN (SELECT id FROM users WHERE email IN ('sohampate45@kkwagh.edu.in', 'japesh@kkwagh.edu.in')) AND date = (SELECT CURRENT_DATE);
