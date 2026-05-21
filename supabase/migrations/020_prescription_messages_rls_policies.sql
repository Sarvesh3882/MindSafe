-- Migration: Row Level Security policies for prescription_messages table
-- Description: Protect message data with role-based access control
-- Author: MindSafe India Development Team
-- Date: 2024

-- Enable RLS on prescription_messages table
ALTER TABLE prescription_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_read_prescription_messages" ON prescription_messages;
DROP POLICY IF EXISTS "students_insert_messages" ON prescription_messages;
DROP POLICY IF EXISTS "counsellors_insert_messages" ON prescription_messages;
DROP POLICY IF EXISTS "users_update_own_messages" ON prescription_messages;
DROP POLICY IF EXISTS "users_mark_messages_read" ON prescription_messages;

-- Policy: Users can read messages for prescriptions they're associated with
CREATE POLICY "users_read_prescription_messages" ON prescription_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_messages.prescription_id
        AND (p.student_id = auth.uid() OR p.counsellor_id = auth.uid())
    )
  );

-- Policy: Students can insert messages for their own prescriptions
CREATE POLICY "students_insert_messages" ON prescription_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_id
        AND p.student_id = auth.uid()
    )
  );

-- Policy: Counsellors can insert messages for their students' prescriptions
CREATE POLICY "counsellors_insert_messages" ON prescription_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM prescriptions p
      JOIN users u1 ON p.student_id = u1.id
      JOIN users u2 ON u2.id = auth.uid()
      WHERE p.id = prescription_id
        AND u2.role = 'counsellor'
        AND u1.college_id = u2.college_id
    )
  );

-- Policy: Users can update their own messages within 5 minutes
CREATE POLICY "users_update_own_messages" ON prescription_messages
  FOR UPDATE
  USING (
    sender_id = auth.uid() AND
    sent_at > NOW() - INTERVAL '5 minutes'
  )
  WITH CHECK (
    sender_id = auth.uid() AND
    is_edited = true AND
    edited_at IS NOT NULL
  );

-- Policy: Users can mark messages as read (for messages they received)
CREATE POLICY "users_mark_messages_read" ON prescription_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_messages.prescription_id
        AND (p.student_id = auth.uid() OR p.counsellor_id = auth.uid())
        AND sender_id != auth.uid()
    )
  )
  WITH CHECK (
    is_read = true
  );

-- Add helpful comments
COMMENT ON POLICY "users_read_prescription_messages" ON prescription_messages IS 'Users can read messages for prescriptions they are part of (student or counsellor)';
COMMENT ON POLICY "students_insert_messages" ON prescription_messages IS 'Students can send messages about their own prescriptions';
COMMENT ON POLICY "counsellors_insert_messages" ON prescription_messages IS 'Counsellors can send messages about prescriptions for students in their college';
COMMENT ON POLICY "users_update_own_messages" ON prescription_messages IS 'Users can edit their own messages within 5 minutes of sending';
COMMENT ON POLICY "users_mark_messages_read" ON prescription_messages IS 'Users can mark received messages as read';
