-- Migration: Institutional Onboarding System
-- Description: Add columns to colleges table for AISHE code, payment tracking, and college code
-- Date: 2026-04-28

-- Add new columns to colleges table
ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS aishe_code TEXT,
ADD COLUMN IF NOT EXISTS student_count TEXT,
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS college_code TEXT;

-- Add UNIQUE constraints
ALTER TABLE colleges
ADD CONSTRAINT colleges_aishe_code_unique UNIQUE (aishe_code);

ALTER TABLE colleges
ADD CONSTRAINT colleges_college_code_unique UNIQUE (college_code);

-- Add AISHE code format validation constraint
-- Format: C-XXXXX where X is a digit (case-insensitive)
ALTER TABLE colleges
ADD CONSTRAINT aishe_code_format_check 
CHECK (aishe_code IS NULL OR aishe_code ~ '^[Cc]-[0-9]{5}$');

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_colleges_aishe_code ON colleges(aishe_code);
CREATE INDEX IF NOT EXISTS idx_colleges_college_code ON colleges(college_code);

-- Backfill college_code for existing colleges (if any)
UPDATE colleges
SET college_code = 'COL-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || 
                   UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4))
WHERE college_code IS NULL OR college_code = '';

-- Add comment for documentation
COMMENT ON COLUMN colleges.aishe_code IS 'All India Survey on Higher Education code (format: C-XXXXX)';
COMMENT ON COLUMN colleges.student_count IS 'Student count range selected during registration';
COMMENT ON COLUMN colleges.payment_id IS 'Razorpay payment ID for subscription payment';
COMMENT ON COLUMN colleges.college_code IS 'System-generated unique college identifier (format: COL-YYYYMMDD-XXXX)';
