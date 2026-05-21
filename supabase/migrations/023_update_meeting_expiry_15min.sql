-- Migration: Update meeting link expiry to 15 minutes
-- Description: Change meeting link expiry from 2 hours to 15 minutes
-- Author: MindSafe India Development Team
-- Date: 2024

-- Update the function to use 15-minute expiry
CREATE OR REPLACE FUNCTION generate_meeting_link_for_session(session_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  room_id TEXT;
  session_date DATE;
  session_time TIME;
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

-- Add comment
DO $$
BEGIN
  RAISE NOTICE 'Meeting link expiry updated to 15 minutes';
END $$;
