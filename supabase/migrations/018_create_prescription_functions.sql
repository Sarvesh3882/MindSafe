-- Migration: Create prescription helper functions
-- Description: Database functions for common prescription operations
-- Author: MindSafe India Development Team
-- Date: 2024

-- Function: Get unread prescription messages count for a user
CREATE OR REPLACE FUNCTION get_unread_prescription_messages_count(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM prescription_messages pm
  JOIN prescriptions p ON pm.prescription_id = p.id
  WHERE pm.is_read = false
    AND pm.sender_id != user_uuid
    AND (p.student_id = user_uuid OR p.counsellor_id = user_uuid);
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION get_unread_prescription_messages_count IS 'Returns count of unread prescription messages for a user (student or counsellor)';

-- Function: Mark prescription messages as read
CREATE OR REPLACE FUNCTION mark_prescription_messages_read(
  prescription_uuid UUID,
  reader_uuid UUID
)
RETURNS VOID AS $$
  UPDATE prescription_messages
  SET is_read = true
  WHERE prescription_id = prescription_uuid
    AND sender_id != reader_uuid
    AND is_read = false;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION mark_prescription_messages_read IS 'Marks all unread messages in a prescription thread as read for the specified user';

-- Function: Generate meeting link for session
CREATE OR REPLACE FUNCTION generate_meeting_link_for_session(session_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  room_id TEXT;
  session_date DATE;
  session_time TIME;
  session_datetime TIMESTAMPTZ;
  expires_at TIMESTAMPTZ;
BEGIN
  -- Get session details
  SELECT date, time INTO session_date, session_time
  FROM sessions
  WHERE id = session_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found: %', session_uuid;
  END IF;
  
  -- Generate unique room ID (remove hyphens from UUID)
  room_id := 'mindsafe-' || REPLACE(session_uuid::TEXT, '-', '');
  
  -- Calculate expiration (15 minutes from now)
  expires_at := NOW() + INTERVAL '15 minutes';
  
  -- Update session with meeting link metadata
  UPDATE sessions
  SET 
    meeting_room_id = room_id,
    meeting_link_provider = 'jitsi',
    meeting_link = 'https://meet.jit.si/' || room_id,
    meeting_link_generated_at = NOW(),
    meeting_link_expires_at = expires_at
  WHERE id = session_uuid;
  
  RETURN room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION generate_meeting_link_for_session IS 'Generates a Jitsi meeting link for a session with 15-minute expiry';

-- Function: Check if user can access meeting link
CREATE OR REPLACE FUNCTION can_access_meeting_link(
  session_uuid UUID,
  user_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  session_datetime TIMESTAMPTZ;
  expires_at TIMESTAMPTZ;
  is_participant BOOLEAN;
BEGIN
  -- Check if user is part of the session
  SELECT 
    (student_id = user_uuid OR counsellor_id = user_uuid),
    (date + time)::TIMESTAMPTZ,
    meeting_link_expires_at
  INTO is_participant, session_datetime, expires_at
  FROM sessions
  WHERE id = session_uuid;
  
  IF NOT FOUND OR NOT is_participant THEN
    RETURN false;
  END IF;
  
  -- Check if current time is within access window (15 min before to expiration)
  RETURN NOW() >= (session_datetime - INTERVAL '15 minutes') 
    AND NOW() <= expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION can_access_meeting_link IS 'Checks if a user can access the meeting link for a session based on time window and participation';
