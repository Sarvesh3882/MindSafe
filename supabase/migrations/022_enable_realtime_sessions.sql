-- Migration: Enable Realtime for sessions table
-- Description: Enable Supabase Realtime subscriptions for meeting link sync
-- Author: MindSafe India Development Team
-- Date: 2024

-- Enable Realtime for sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

-- Grant necessary permissions for realtime
GRANT SELECT ON sessions TO anon, authenticated;

-- Add comment
COMMENT ON TABLE sessions IS 'Sessions table with Realtime enabled for meeting link synchronization';

-- Verify realtime is enabled
DO $$
BEGIN
  RAISE NOTICE 'Realtime enabled for sessions table';
END $$;
