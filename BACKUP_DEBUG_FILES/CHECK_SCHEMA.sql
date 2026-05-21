-- Check the actual schema of tables

-- Colleges table structure
SELECT 
  'COLLEGES TABLE COLUMNS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'colleges'
ORDER BY ordinal_position;

-- Users table structure
SELECT 
  'USERS TABLE COLUMNS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Assessments table structure
SELECT 
  'ASSESSMENTS TABLE COLUMNS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'assessments'
ORDER BY ordinal_position;
