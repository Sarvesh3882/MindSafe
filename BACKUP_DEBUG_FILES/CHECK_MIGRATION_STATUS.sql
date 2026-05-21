-- Check Migration Status for Prescriptions System
-- Run this in Supabase SQL Editor to see what's currently in your database

-- ============================================================
-- 1. Check if tables exist
-- ============================================================

SELECT 
  'prescriptions' as table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'prescriptions'
  ) as exists;

SELECT 
  'prescription_messages' as table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'prescription_messages'
  ) as exists;

SELECT 
  'prescription_audit_log' as table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'prescription_audit_log'
  ) as exists;

-- ============================================================
-- 2. Check if sessions table has meeting link columns
-- ============================================================

SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'sessions'
  AND column_name IN ('meeting_link', 'meeting_link_generated_at', 'meeting_link_expires_at', 'meeting_provider', 'meeting_room_id')
ORDER BY column_name;

-- ============================================================
-- 3. Check if functions exist
-- ============================================================

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_unread_prescription_messages_count',
    'mark_prescription_messages_read',
    'generate_meeting_link_for_session',
    'can_access_meeting_link'
  )
ORDER BY routine_name;

-- ============================================================
-- 4. Check RLS policies
-- ============================================================

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('prescriptions', 'prescription_messages', 'prescription_audit_log')
ORDER BY tablename, policyname;

-- ============================================================
-- 5. Check for duplicate indexes (potential issue from multiple runs)
-- ============================================================

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('prescriptions', 'prescription_messages', 'prescription_audit_log')
ORDER BY tablename, indexname;

-- ============================================================
-- 6. Check for duplicate triggers (potential issue from multiple runs)
-- ============================================================

SELECT 
  trigger_name,
  event_object_table,
  action_statement,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('prescriptions', 'prescription_messages')
ORDER BY event_object_table, trigger_name;

-- ============================================================
-- 7. Check table row counts (to see if you have data)
-- ============================================================

SELECT 
  'prescriptions' as table_name,
  COUNT(*) as row_count
FROM prescriptions;

SELECT 
  'prescription_messages' as table_name,
  COUNT(*) as row_count
FROM prescription_messages;

SELECT 
  'prescription_audit_log' as table_name,
  COUNT(*) as row_count
FROM prescription_audit_log;

-- ============================================================
-- INTERPRETATION:
-- ============================================================
-- 
-- If you see:
-- - Tables exist = true → Migrations ran successfully
-- - Multiple indexes with same name → Potential issue (shouldn't happen with IF NOT EXISTS)
-- - Multiple triggers with same name → Potential issue
-- - RLS policies exist → Security is configured
-- - Functions exist → Helper functions are available
-- 
-- If everything shows up once, you're good!
-- If you see duplicates, run the CLEANUP script.
-- ============================================================
