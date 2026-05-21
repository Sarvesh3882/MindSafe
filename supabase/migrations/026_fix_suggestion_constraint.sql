-- Migration: Fix prescription suggestion constraint
-- Description: Allow suggestions to be created without parent prescription
-- Author: MindSafe India Development Team
-- Date: 2024

-- Drop the old constraint that required parent_prescription_id for suggestions
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS valid_suggestion;

-- Add new constraint that allows suggestions with or without parent
-- Suggestions can be standalone (parent_prescription_id = NULL) or linked to existing prescription
ALTER TABLE prescriptions
ADD CONSTRAINT valid_suggestion CHECK (
  -- Regular prescriptions must not have parent
  (is_suggestion = false AND parent_prescription_id IS NULL) OR
  -- Suggestions can have parent or be standalone
  (is_suggestion = true)
);

-- Add comment explaining the change
COMMENT ON CONSTRAINT valid_suggestion ON prescriptions IS 
  'Ensures regular prescriptions have no parent, while suggestions can optionally link to a parent prescription';
