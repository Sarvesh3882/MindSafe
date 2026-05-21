-- Migration: Create NAAC Evidence Management System
-- Purpose: Store uploaded documents for NAAC compliance reporting
-- Date: 2026-05-17

-- Create naac_evidence table
CREATE TABLE IF NOT EXISTS naac_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Document metadata
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'criterion_v', 'criterion_vii', 'ugc_compliance', 'activity', 'infrastructure', 'training'
  naac_metric VARCHAR(50), -- e.g., '5.1.2', '7.2.1', etc.
  
  -- File information
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'image/jpeg', 'image/png', 'application/pdf'
  file_size INTEGER NOT NULL, -- in bytes
  
  -- Activity details (optional)
  activity_date DATE,
  activity_type VARCHAR(100), -- 'workshop', 'awareness_program', 'yoga_session', 'counselling', etc.
  participants_count INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_naac_evidence_college ON naac_evidence(college_id);
CREATE INDEX idx_naac_evidence_category ON naac_evidence(category);
CREATE INDEX idx_naac_evidence_metric ON naac_evidence(naac_metric);
CREATE INDEX idx_naac_evidence_created ON naac_evidence(created_at DESC);

-- Enable Row Level Security
ALTER TABLE naac_evidence ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can view their college evidence
CREATE POLICY "Admins can view their college evidence"
ON naac_evidence FOR SELECT
TO authenticated
USING (
  college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policy: Admins can insert evidence for their college
CREATE POLICY "Admins can insert evidence for their college"
ON naac_evidence FOR INSERT
TO authenticated
WITH CHECK (
  college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  AND uploaded_by = auth.uid()
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policy: Admins can update their college evidence
CREATE POLICY "Admins can update their college evidence"
ON naac_evidence FOR UPDATE
TO authenticated
USING (
  college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policy: Admins can delete their college evidence
CREATE POLICY "Admins can delete their college evidence"
ON naac_evidence FOR DELETE
TO authenticated
USING (
  college_id = (SELECT college_id FROM users WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_naac_evidence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER naac_evidence_updated_at
BEFORE UPDATE ON naac_evidence
FOR EACH ROW
EXECUTE FUNCTION update_naac_evidence_updated_at();

-- Add comment
COMMENT ON TABLE naac_evidence IS 'Stores uploaded documents and evidence for NAAC compliance reporting';
