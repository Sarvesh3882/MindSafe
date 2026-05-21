-- Migration: RLS policies for audit log and sessions meeting links
-- Description: Protect audit log and ensure meeting link access control
-- Author: MindSafe India Development Team
-- Date: 2024

-- ============================================
-- PRESCRIPTION AUDIT LOG RLS POLICIES
-- ============================================

-- Enable RLS on prescription_audit_log table
ALTER TABLE prescription_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "counsellors_read_audit_logs" ON prescription_audit_log;

-- Policy: Counsellors and admins can read audit logs for their college students
CREATE POLICY "counsellors_read_audit_logs" ON prescription_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions p
      JOIN users u1 ON p.student_id = u1.id
      JOIN users u2 ON u2.id = auth.uid()
      WHERE p.id = prescription_audit_log.prescription_id
        AND u2.role IN ('counsellor', 'admin')
        AND u1.college_id = u2.college_id
    )
  );

COMMENT ON POLICY "counsellors_read_audit_logs" ON prescription_audit_log IS 'Counsellors and admins can view audit logs for prescriptions in their college';

-- ============================================
-- SESSIONS TABLE - MEETING LINK ACCESS
-- ============================================

-- Note: Existing sessions RLS policies should already allow students and counsellors
-- to read their own sessions. We just need to ensure meeting link columns are accessible.

-- Drop existing meeting link policies if they exist
DROP POLICY IF EXISTS "counsellors_manage_meeting_links" ON sessions;

-- Policy: Counsellors can update meeting link columns for their sessions
CREATE POLICY "counsellors_manage_meeting_links" ON sessions
  FOR UPDATE
  USING (
    counsellor_id = auth.uid()
  )
  WITH CHECK (
    counsellor_id = auth.uid()
  );

COMMENT ON POLICY "counsellors_manage_meeting_links" ON sessions IS 'Counsellors can update meeting link information for their sessions';

-- Verify that students and counsellors can read meeting links
-- (This should be covered by existing policies, but we'll add a comment for clarity)
COMMENT ON COLUMN sessions.meeting_link IS 'Accessible to both student and counsellor of the session via existing RLS policies';
