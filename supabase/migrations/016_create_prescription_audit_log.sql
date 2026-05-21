-- Migration: Create prescription_audit_log table
-- Description: Tracks all changes to prescriptions for compliance and auditing
-- Author: MindSafe India Development Team
-- Date: 2024

-- Create prescription_audit_log table
CREATE TABLE IF NOT EXISTS prescription_audit_log (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Audit Details
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'suggestion_sent')),
  old_values JSONB,
  new_values JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescription_audit_log_prescription_id 
  ON prescription_audit_log(prescription_id);

CREATE INDEX IF NOT EXISTS idx_prescription_audit_log_created_at 
  ON prescription_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prescription_audit_log_user_id 
  ON prescription_audit_log(user_id);

-- Create trigger function to automatically log prescription changes
CREATE OR REPLACE FUNCTION log_prescription_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO prescription_audit_log (prescription_id, user_id, action, new_values)
    VALUES (
      NEW.id, 
      NEW.counsellor_id, 
      CASE WHEN NEW.is_suggestion THEN 'suggestion_sent' ELSE 'created' END,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO prescription_audit_log (prescription_id, user_id, action, old_values, new_values)
    VALUES (
      NEW.id, 
      NEW.counsellor_id, 
      CASE WHEN NEW.is_deleted AND NOT OLD.is_deleted THEN 'deleted' ELSE 'updated' END,
      row_to_json(OLD)::jsonb, 
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO prescription_audit_log (prescription_id, user_id, action, old_values)
    VALUES (
      OLD.id, 
      OLD.counsellor_id, 
      'deleted', 
      row_to_json(OLD)::jsonb
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on prescriptions table
DROP TRIGGER IF EXISTS prescription_audit_trigger ON prescriptions;
CREATE TRIGGER prescription_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION log_prescription_changes();

-- Add comments
COMMENT ON TABLE prescription_audit_log IS 'Audit trail for all prescription changes for compliance and security';
COMMENT ON COLUMN prescription_audit_log.action IS 'Type of action: created, updated, deleted, or suggestion_sent';
COMMENT ON COLUMN prescription_audit_log.old_values IS 'JSON snapshot of prescription before change';
COMMENT ON COLUMN prescription_audit_log.new_values IS 'JSON snapshot of prescription after change';
