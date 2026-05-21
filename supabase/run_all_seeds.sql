-- ============================================================
-- ARIA 2.0: Master Seed Script
-- ============================================================
-- This script runs all question bank seed scripts in the correct order.
-- Execute this after applying migrations 009 and 010.

\echo 'Starting ARIA 2.0 question bank seeding...'
\echo ''

\echo '1/8: Seeding triage questions...'
\i seed_triage_questions.sql
\echo ''

\echo '2/8: Seeding PHQ-9 questions (Depression)...'
\i seed_phq9_questions.sql
\echo ''

\echo '3/8: Seeding GAD-7 questions (Anxiety)...'
\i seed_gad7_questions.sql
\echo ''

\echo '4/8: Seeding ISI questions (Insomnia/Sleep)...'
\i seed_isi_questions.sql
\echo ''

\echo '5/8: Seeding PSS-10 questions (Stress)...'
\i seed_pss10_questions.sql
\echo ''

\echo '6/8: Seeding Maslach questions (Burnout)...'
\i seed_maslach_questions.sql
\echo ''

\echo '7/8: Seeding UCLA questions (Loneliness)...'
\i seed_ucla_questions.sql
\echo ''

\echo '8/8: Seeding camouflage questions...'
\i seed_camouflage_questions.sql
\echo ''

\echo 'Seeding complete! Verifying question counts...'
\echo ''

-- Final verification
SELECT 
  'Triage' as question_type,
  COUNT(*) as count
FROM questions WHERE is_triage = TRUE
UNION ALL
SELECT 
  'PHQ-9' as question_type,
  COUNT(*) as count
FROM questions WHERE instrument = 'phq9'
UNION ALL
SELECT 
  'GAD-7' as question_type,
  COUNT(*) as count
FROM questions WHERE instrument = 'gad7'
UNION ALL
SELECT 
  'ISI' as question_type,
  COUNT(*) as count
FROM questions WHERE instrument = 'isi'
UNION ALL
SELECT 
  'PSS-10' as question_type,
  COUNT(*) as count
FROM questions WHERE instrument = 'pss10'
UNION ALL
SELECT 
  'Maslach' as question_type,
  COUNT(*) as count
FROM questions WHERE instrument = 'maslach'
UNION ALL
SELECT 
  'UCLA' as question_type,
  COUNT(*) as count
FROM questions WHERE instrument = 'ucla'
UNION ALL
SELECT 
  'Camouflage' as question_type,
  COUNT(*) as count
FROM questions WHERE is_camouflage = TRUE;

\echo ''
\echo 'Expected counts: Triage=3, PHQ-9=9, GAD-7=7, ISI=7, PSS-10=10, Maslach=9, UCLA=3, Camouflage=8'
\echo 'Total expected: 56 questions'
