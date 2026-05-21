-- Migration: Create prescriptions table
-- Description: Stores treatment prescriptions created by counsellors for students
-- Author: MindSafe India Development Team
-- Date: 2024

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_prescription_id UUID REFERENCES prescriptions(id) ON DELETE SET NULL,
  
  -- Prescription Details
  medication_name TEXT NOT NULL CHECK (char_length(medication_name) BETWEEN 2 AND 200),
  dosage TEXT NOT NULL CHECK (char_length(dosage) BETWEEN 1 AND 100),
  frequency TEXT NOT NULL CHECK (frequency IN ('Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Other')),
  duration TEXT NOT NULL CHECK (char_length(duration) BETWEEN 1 AND 50),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 2000),
  wellness_tips TEXT CHECK (wellness_tips IS NULL OR char_length(wellness_tips) <= 2000),
  
  -- Metadata
  is_suggestion BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  prescribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_suggestion CHECK (
    (is_suggestion = false AND parent_prescription_id IS NULL) OR
    (is_suggestion = true AND parent_prescription_id IS NOT NULL)
  ),
  CONSTRAINT valid_deletion CHECK (
    (is_deleted = false AND deleted_at IS NULL) OR
    (is_deleted = true AND deleted_at IS NOT NULL)
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_student_id 
  ON prescriptions(student_id) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_prescriptions_counsellor_id 
  ON prescriptions(counsellor_id) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_prescriptions_prescribed_at 
  ON prescriptions(prescribed_at DESC) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_prescriptions_parent_id 
  ON prescriptions(parent_prescription_id) 
  WHERE parent_prescription_id IS NOT NULL;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_prescriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;
CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_prescriptions_updated_at();

-- Add comment to table
COMMENT ON TABLE prescriptions IS 'Stores treatment prescriptions and wellness recommendations from counsellors to students';
COMMENT ON COLUMN prescriptions.is_suggestion IS 'True if this is a modification suggestion to an existing prescription';
COMMENT ON COLUMN prescriptions.parent_prescription_id IS 'References the original prescription if this is a suggestion';
COMMENT ON COLUMN prescriptions.is_deleted IS 'Soft delete flag for audit trail preservation';
