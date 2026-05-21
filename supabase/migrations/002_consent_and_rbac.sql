-- MindSafe India — Migration 002: Consent & RBAC Hardening
-- Run this after 001_initial_schema.sql

-- ============================================================
-- CONSENT TABLE
-- Tracks explicit student consent for counsellor chat access
-- ============================================================
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- What the student has consented to
  chat_access BOOLEAN NOT NULL DEFAULT false,
  -- When consent was given / revoked
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, counsellor_id)
);

ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Students can manage their own consent
CREATE POLICY "Students can read own consent" ON consent_records
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert own consent" ON consent_records
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own consent" ON consent_records
  FOR UPDATE USING (student_id = auth.uid());

-- Counsellors can read consent records for their students
CREATE POLICY "Counsellors can read consent for their students" ON consent_records
  FOR SELECT USING (counsellor_id = auth.uid());

-- ============================================================
-- CHAT MESSAGES — add consent_given flag
-- ============================================================
ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS counsellor_visible BOOLEAN NOT NULL DEFAULT false;

-- Counsellors can only read chat messages where student has given consent
DROP POLICY IF EXISTS "Counsellors can read consented chat" ON chat_messages;
CREATE POLICY "Counsellors can read consented chat" ON chat_messages
  FOR SELECT USING (
    get_user_role() = 'counsellor'
    AND counsellor_visible = true
    AND EXISTS (
      SELECT 1 FROM consent_records cr
      WHERE cr.student_id = chat_messages.user_id
        AND cr.counsellor_id = auth.uid()
        AND cr.chat_access = true
        AND cr.is_active = true
    )
  );

-- ============================================================
-- ASSESSMENTS — tighten admin access
-- Admins must NEVER access individual assessment rows directly.
-- They use service-role API routes that return only aggregates.
-- ============================================================
DROP POLICY IF EXISTS "Admins can read assessments" ON assessments;
-- (No admin SELECT policy — intentionally absent)
-- Admin data is served exclusively via /api/admin/* routes using service role

-- ============================================================
-- FUNCTION: check_counsellor_consent
-- Returns true if a counsellor has active chat consent from a student
-- ============================================================
CREATE OR REPLACE FUNCTION check_counsellor_consent(p_student_id UUID, p_counsellor_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM consent_records
    WHERE student_id = p_student_id
      AND counsellor_id = p_counsellor_id
      AND chat_access = true
      AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;
