# Prescription Management System - Database Migrations

## Overview

This document provides instructions for applying the database migrations for the Treatment Plans and Prescription Management System.

## Migration Files Created

The following migration files have been created in `supabase/migrations/`:

1. **014_create_prescriptions_table.sql** - Creates the prescriptions table
2. **015_create_prescription_messages_table.sql** - Creates the prescription_messages table
3. **016_create_prescription_audit_log.sql** - Creates audit log and triggers
4. **017_extend_sessions_for_meeting_links.sql** - Extends sessions table
5. **018_create_prescription_functions.sql** - Creates helper functions
6. **019_prescriptions_rls_policies.sql** - RLS policies for prescriptions
7. **020_prescription_messages_rls_policies.sql** - RLS policies for messages
8. **021_audit_log_and_sessions_rls.sql** - RLS for audit log and sessions

## Prerequisites

- Supabase CLI installed
- Database connection configured
- Backup of current database (recommended)

## Application Steps

### Option 1: Using Supabase CLI (Recommended)

```bash
# Navigate to project directory
cd mindsafe-india

# Apply all migrations
supabase db push

# Verify migrations
supabase db diff
```

### Option 2: Manual Application via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Apply each migration file in order (014 through 021)
4. Verify each migration completes successfully before proceeding

### Option 3: Using psql

```bash
# Connect to your database
psql -h <your-db-host> -U postgres -d postgres

# Apply migrations in order
\i supabase/migrations/014_create_prescriptions_table.sql
\i supabase/migrations/015_create_prescription_messages_table.sql
\i supabase/migrations/016_create_prescription_audit_log.sql
\i supabase/migrations/017_extend_sessions_for_meeting_links.sql
\i supabase/migrations/018_create_prescription_functions.sql
\i supabase/migrations/019_prescriptions_rls_policies.sql
\i supabase/migrations/020_prescription_messages_rls_policies.sql
\i supabase/migrations/021_audit_log_and_sessions_rls.sql
```

## Verification

After applying migrations, verify the following:

### 1. Tables Created

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('prescriptions', 'prescription_messages', 'prescription_audit_log');
```

Expected result: 3 rows

### 2. Indexes Created

```sql
-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('prescriptions', 'prescription_messages', 'prescription_audit_log', 'sessions')
  AND indexname LIKE '%prescription%' OR indexname LIKE '%meeting%';
```

Expected result: Multiple indexes

### 3. Functions Created

```sql
-- Check functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%prescription%' OR routine_name LIKE '%meeting%';
```

Expected result: 4 functions

### 4. RLS Policies Active

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('prescriptions', 'prescription_messages', 'prescription_audit_log');
```

Expected result: All should have rowsecurity = true

### 5. Triggers Active

```sql
-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name IN ('prescription_audit_trigger', 'prescriptions_updated_at');
```

Expected result: 2 triggers

## Testing

### Test Prescription Creation

```sql
-- Insert test prescription (as counsellor)
INSERT INTO prescriptions (
  student_id, 
  counsellor_id, 
  medication_name, 
  dosage, 
  frequency, 
  duration, 
  notes
) VALUES (
  '<student-uuid>',
  '<counsellor-uuid>',
  'Test Medication',
  '50mg',
  'Once daily',
  '30 days',
  'Test notes'
);

-- Verify audit log entry created
SELECT * FROM prescription_audit_log ORDER BY created_at DESC LIMIT 1;
```

### Test Message Creation

```sql
-- Insert test message
INSERT INTO prescription_messages (
  prescription_id,
  sender_id,
  message_text
) VALUES (
  '<prescription-uuid>',
  '<user-uuid>',
  'This is a test message about the prescription'
);
```

### Test Meeting Link Generation

```sql
-- Generate meeting link for a session
SELECT generate_meeting_link_for_session('<session-uuid>');

-- Verify meeting link created
SELECT meeting_link, meeting_link_provider, meeting_room_id 
FROM sessions 
WHERE id = '<session-uuid>';
```

## Rollback Plan

If you need to rollback these migrations:

```sql
-- Drop in reverse order
DROP POLICY IF EXISTS "counsellors_manage_meeting_links" ON sessions;
DROP POLICY IF EXISTS "counsellors_read_audit_logs" ON prescription_audit_log;

DROP POLICY IF EXISTS "users_mark_messages_read" ON prescription_messages;
DROP POLICY IF EXISTS "users_update_own_messages" ON prescription_messages;
DROP POLICY IF EXISTS "counsellors_insert_messages" ON prescription_messages;
DROP POLICY IF EXISTS "students_insert_messages" ON prescription_messages;
DROP POLICY IF EXISTS "users_read_prescription_messages" ON prescription_messages;

DROP POLICY IF EXISTS "counsellors_soft_delete_own_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_update_own_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_insert_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "counsellors_read_college_prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "students_read_own_prescriptions" ON prescriptions;

DROP FUNCTION IF EXISTS can_access_meeting_link(UUID, UUID);
DROP FUNCTION IF EXISTS generate_meeting_link_for_session(UUID);
DROP FUNCTION IF EXISTS mark_prescription_messages_read(UUID, UUID);
DROP FUNCTION IF EXISTS get_unread_prescription_messages_count(UUID);

ALTER TABLE sessions DROP COLUMN IF EXISTS meeting_room_id;
ALTER TABLE sessions DROP COLUMN IF EXISTS meeting_link_expires_at;
ALTER TABLE sessions DROP COLUMN IF EXISTS meeting_link_generated_at;
ALTER TABLE sessions DROP COLUMN IF EXISTS meeting_link_provider;
ALTER TABLE sessions DROP COLUMN IF EXISTS meeting_link;

DROP TRIGGER IF EXISTS prescription_audit_trigger ON prescriptions;
DROP FUNCTION IF EXISTS log_prescription_changes();
DROP TABLE IF EXISTS prescription_audit_log;

DROP TABLE IF EXISTS prescription_messages;

DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;
DROP FUNCTION IF EXISTS update_prescriptions_updated_at();
DROP TABLE IF EXISTS prescriptions;
```

## Next Steps

After successfully applying migrations:

1. ✅ **Phase 1 Complete**: Database Setup
2. ⏭️ **Phase 2**: Backend API Development
3. ⏭️ **Phase 3**: Frontend Components
4. ⏭️ **Phase 4**: Integration and Testing
5. ⏭️ **Phase 5**: Deployment

## Support

If you encounter issues:

1. Check Supabase logs for error messages
2. Verify all prerequisite tables exist (users, sessions)
3. Ensure proper permissions for database user
4. Review RLS policies if access issues occur

## Notes

- All migrations are idempotent (safe to run multiple times)
- RLS policies enforce college-based isolation
- Audit log automatically tracks all prescription changes
- Meeting links expire 2 hours after session end
- Messages can be edited within 5 minutes of sending
- Prescriptions can be edited/deleted within 24 hours (if no messages)
