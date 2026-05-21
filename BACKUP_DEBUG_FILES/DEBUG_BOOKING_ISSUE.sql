-- Debug script to check booking system data
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check all users and their college assignments
SELECT 
  id,
  email,
  role,
  full_name,
  college_id,
  created_at
FROM users
ORDER BY role, created_at DESC;

-- 2. Check if there are any colleges
SELECT * FROM colleges;

-- 3. Check specifically for counsellors
SELECT 
  id,
  email,
  full_name,
  college_id,
  role
FROM users
WHERE role = 'counsellor';

-- 4. Check specifically for students
SELECT 
  id,
  email,
  full_name,
  college_id,
  role
FROM users
WHERE role = 'student';

-- 5. Check if student and counsellor have matching college_id
SELECT 
  s.email as student_email,
  s.college_id as student_college,
  c.email as counsellor_email,
  c.college_id as counsellor_college,
  CASE 
    WHEN s.college_id = c.college_id THEN '✅ MATCH'
    ELSE '❌ NO MATCH'
  END as match_status
FROM users s
CROSS JOIN users c
WHERE s.role = 'student' 
  AND c.role = 'counsellor';
