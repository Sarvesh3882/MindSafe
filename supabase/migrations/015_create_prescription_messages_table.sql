-- Migration: Create prescription_messages table
-- Description: Stores questions and replies about prescriptions between students and counsellors
-- Author: MindSafe India Development Team
-- Date: 2024

-- Create prescription_messages table
CREATE TABLE IF NOT EXISTS prescription_messages (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_message_id UUID REFERENCES prescription_messages(id) ON DELETE CASCADE,
  
  -- Message Content
  message_text TEXT NOT NULL CHECK (char_length(message_text) BETWEEN 10 AND 1000),
  
  -- Metadata
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  edited_at TIMESTAMPTZ,
  
  -- Timestamps
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_edit CHECK (
    (is_edited = false AND edited_at IS NULL) OR
    (is_edited = true AND edited_at IS NOT NULL)
  ),
  CONSTRAINT edit_time_limit CHECK (
    edited_at IS NULL OR edited_at <= sent_at + INTERVAL '5 minutes'
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescription_messages_prescription_id 
  ON prescription_messages(prescription_id);

CREATE INDEX IF NOT EXISTS idx_prescription_messages_sender_id 
  ON prescription_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_prescription_messages_sent_at 
  ON prescription_messages(sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_prescription_messages_parent_id 
  ON prescription_messages(parent_message_id) 
  WHERE parent_message_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_prescription_messages_unread 
  ON prescription_messages(prescription_id, is_read) 
  WHERE is_read = false;

-- Add comments to table
COMMENT ON TABLE prescription_messages IS 'Stores questions and replies about prescriptions between students and counsellors';
COMMENT ON COLUMN prescription_messages.parent_message_id IS 'References the original message if this is a reply';
COMMENT ON COLUMN prescription_messages.is_read IS 'True if the recipient has viewed this message';
COMMENT ON COLUMN prescription_messages.is_edited IS 'True if the message was edited within 5 minutes of sending';
