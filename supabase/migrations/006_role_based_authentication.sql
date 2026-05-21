-- Role-Based Authentication System Migration
-- Adds support for student roll numbers and ensures AISHE code validation

-- ============================================================
-- Add new columns to users table
-- ============================================================

-- Add roll_number column (nullable, only for students)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS roll_number TEXT;

-- department column already exists from initial schema
-- Verify it exists and is nullable
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'department'
  ) THEN
    ALTER TABLE users ADD COLUMN department TEXT;
  END IF;
END $$;

-- ============================================================
-- Add indexes for performance
-- ============================================================

-- Index on role for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Composite index on college_id and role for faster college-specific role queries
CREATE INDEX IF NOT EXISTS idx_users_college_role ON users(college_id, role);

-- ============================================================
-- Ensure AISHE code column exists in colleges table
-- ============================================================

-- Add aishe_code column if it doesn't exist (from institutional onboarding)
ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS aishe_code TEXT UNIQUE;

-- Add student_count column if it doesn't exist (from institutional onboarding)
ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS student_count TEXT;

-- Add payment_id column if it doesn't exist (from institutional onboarding)
ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Add college_code column if it doesn't exist (from institutional onboarding)
ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS college_code TEXT UNIQUE;

-- ============================================================
-- Add AISHE code format constraint
-- ============================================================

-- Drop existing constraint if it exists
ALTER TABLE colleges
DROP CONSTRAINT IF EXISTS aishe_code_format;

-- Add AISHE code format constraint (C-XXXXX where X is a digit)
ALTER TABLE colleges
ADD CONSTRAINT aishe_code_format 
CHECK (aishe_code IS NULL OR aishe_code ~ '^[Cc]-[0-9]{5}$');

-- ============================================================
-- Create index for AISHE lookups
-- ============================================================

-- Index for faster AISHE code lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_colleges_aishe_code ON colleges(LOWER(aishe_code));

-- ============================================================
-- Update RLS policies for new authentication flows
-- ============================================================

-- Allow public sign-up (students and counsellors can self-register)
-- This policy allows INSERT during sign-up process
DROP POLICY IF EXISTS "Allow public sign-up" ON users;
CREATE POLICY "Allow public sign-up" ON users
  FOR INSERT
  WITH CHECK (role IN ('student', 'counsellor'));

-- ============================================================
-- Comments for documentation
-- ============================================================

COMMENT ON COLUMN users.roll_number IS 'Student roll number (only for students, NULL for counsellors and admins)';
COMMENT ON COLUMN users.department IS 'Department name (for students and counsellors, NULL for admins)';
COMMENT ON COLUMN colleges.aishe_code IS 'All India Survey on Higher Education code (format: C-XXXXX)';
COMMENT ON CONSTRAINT aishe_code_format ON colleges IS 'Ensures AISHE code follows format C-XXXXX where X is a digit (case-insensitive)';
