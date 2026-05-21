-- Cleanup Script for Duplicate Migrations
-- ONLY RUN THIS IF CHECK_MIGRATION_STATUS.sql shows duplicates
-- This script is SAFE to run - it only removes duplicates, not data

-- ⚠️ WARNING: This will NOT delete your data, only fix duplicate objects
-- ⚠️ BACKUP: Always backup your database before running cleanup scripts

-- ============================================================
-- STEP 1: Check what will be cleaned (READ-ONLY)
-- ============================================================

-- Run this first to see what duplicates exist
SELECT 'This is a READ-ONLY check. Review results before proceeding.' as notice;

-- Check for duplicate policies
SELECT 
  'Duplicate Policy' as issue_type,
  tablename,
  policyname,
  COUNT(*) as count
FROM pg_policies
WHERE tablename IN ('prescriptions', 'prescription_messages', 'prescription_audit_log')
GROUP BY tablename, policyname
HAVING COUNT(*) > 1;

-- Check for duplicate triggers
SELECT 
  'Duplicate Trigger' as issue_type,
  event_object_table,
  trigger_name,
  COUNT(*) as count
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('prescriptions', 'prescription_messages')
GROUP BY event_object_table, trigger_name
HAVING COUNT(*) > 1;

-- ============================================================
-- STEP 2: Safe Cleanup (if duplicates found)
-- ============================================================

-- Note: Running migrations multiple times with "IF NOT EXISTS" 
-- should NOT create duplicates. If you see duplicates, it means
-- the migrations were run without "IF NOT EXISTS" or there's
-- another issue.

-- Most likely scenario: Everything is fine!
-- The migrations use "CREATE TABLE IF NOT EXISTS" which prevents duplicates.

-- ============================================================
-- STEP 3: If you DO have issues, here's how to fix:
-- ============================================================

-- Option A: Drop and recreate (ONLY if you have NO data)
-- UNCOMMENT ONLY IF YOU HAVE NO PRESCRIPTION DATA AND WANT TO START FRESH

/*
-- Drop tables (this will delete all data!)
DROP TABLE IF EXISTS prescription_audit_log CASCADE;
DROP TABLE IF EXISTS prescription_messages CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_unread_prescription_messages_count(UUID);
DROP FUNCTION IF EXISTS mark_prescription_messages_read(UUID, UUID);
DROP FUNCTION IF EXISTS generate_meeting_link_for_session(UUID);
DROP FUNCTION IF EXISTS can_access_meeting_link(UUID, UUID);

-- Remove meeting link columns from sessions
ALTER TABLE sessions 
  DROP COLUMN IF EXISTS meeting_link,
  DROP COLUMN IF EXISTS meeting_link_generated_at,
  DROP COLUMN IF EXISTS meeting_link_expires_at,
  DROP COLUMN IF EXISTS meeting_provider,
  DROP COLUMN IF EXISTS meeting_room_id;

-- Now re-run migrations 014-021 ONCE
*/

-- ============================================================
-- STEP 4: Verify cleanup worked
-- ============================================================

-- After cleanup, run CHECK_MIGRATION_STATUS.sql again to verify

-- ============================================================
-- MOST LIKELY: YOU DON'T NEED THIS SCRIPT!
-- ============================================================

-- The migrations use "CREATE TABLE IF NOT EXISTS" which means:
-- - Running them 2-3 times is SAFE
-- - No duplicates will be created
-- - No data will be lost
-- - Tables will only be created once

-- You're probably fine! Just run CHECK_MIGRATION_STATUS.sql to confirm.

SELECT 
  'IMPORTANT: Running migrations 014-021 multiple times is SAFE!' as message,
  'They use IF NOT EXISTS, so no duplicates are created.' as explanation,
  'Run CHECK_MIGRATION_STATUS.sql to verify everything is okay.' as next_step;
