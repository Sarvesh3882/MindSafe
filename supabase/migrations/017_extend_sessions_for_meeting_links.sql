-- Migration: Extend sessions table for meeting links
-- Description: Add meeting link columns to existing sessions table
-- Author: MindSafe India Development Team
-- Date: 2024

-- Add new columns to sessions table
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS meeting_link TEXT,
  ADD COLUMN IF NOT EXISTS meeting_link_provider TEXT CHECK (meeting_link_provider IN ('jitsi', 'daily', 'custom')),
  ADD COLUMN IF NOT EXISTS meeting_link_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_link_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_room_id TEXT;

-- Add index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_sessions_meeting_link_expires_at 
  ON sessions(meeting_link_expires_at) 
  WHERE meeting_link_expires_at IS NOT NULL;

-- Add constraint to ensure meeting link metadata is consistent
ALTER TABLE sessions
  DROP CONSTRAINT IF EXISTS valid_meeting_link;

ALTER TABLE sessions
  ADD CONSTRAINT valid_meeting_link CHECK (
    (meeting_link IS NULL AND meeting_link_provider IS NULL AND meeting_link_generated_at IS NULL) OR
    (meeting_link IS NOT NULL AND meeting_link_provider IS NOT NULL AND meeting_link_generated_at IS NOT NULL)
  );

-- Add comments
COMMENT ON COLUMN sessions.meeting_link IS 'Complete URL for video meeting (Jitsi, Daily.co, etc.)';
COMMENT ON COLUMN sessions.meeting_link_provider IS 'Video service provider: jitsi, daily, or custom';
COMMENT ON COLUMN sessions.meeting_link_generated_at IS 'Timestamp when meeting link was created';
COMMENT ON COLUMN sessions.meeting_link_expires_at IS 'Timestamp when meeting link becomes invalid (typically 2 hours after session)';
COMMENT ON COLUMN sessions.meeting_room_id IS 'Unique room identifier for the video service';
