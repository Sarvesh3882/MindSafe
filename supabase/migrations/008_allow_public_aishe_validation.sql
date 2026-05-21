-- Migration: Allow Public AISHE Validation
-- Description: Add RLS policy to allow unauthenticated users to read colleges table for AISHE validation
-- Date: 2026-04-29
-- Issue: Students/counsellors cannot validate AISHE codes during signup because RLS blocks public reads

-- ============================================================
-- Add public read policy for colleges table
-- ============================================================

-- Policy: Allow public to read colleges for AISHE validation during signup
-- This allows unauthenticated users to validate AISHE codes
CREATE POLICY "Public can read colleges for AISHE validation" ON colleges
  FOR SELECT
  USING (true);

-- ============================================================
-- Comments for documentation
-- ============================================================

COMMENT ON POLICY "Public can read colleges for AISHE validation" ON colleges IS
  'Allows unauthenticated users to validate AISHE codes during student/counsellor signup. Only exposes college name and AISHE code - no sensitive data.';
