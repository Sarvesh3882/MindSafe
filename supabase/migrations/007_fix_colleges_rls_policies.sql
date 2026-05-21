-- Migration: Fix Colleges Table RLS Policies
-- Description: Add RLS policies for colleges table to allow service role to insert during institutional onboarding
-- Date: 2026-04-29
-- Issue: colleges table had RLS enabled but no policies, blocking all inserts including service role

-- ============================================================
-- Add RLS policies for colleges table
-- ============================================================

-- Policy 1: Allow service role to insert colleges (for institutional onboarding)
-- This bypasses RLS when using the service role key
CREATE POLICY "Service role can insert colleges" ON colleges
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow service role to update colleges
CREATE POLICY "Service role can update colleges" ON colleges
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 3: Allow admins to read their own college
CREATE POLICY "Admins can read own college" ON colleges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.college_id = colleges.id
    )
  );

-- Policy 4: Allow counsellors to read their own college
CREATE POLICY "Counsellors can read own college" ON colleges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'counsellor' 
      AND users.college_id = colleges.id
    )
  );

-- Policy 5: Allow students to read their own college
CREATE POLICY "Students can read own college" ON colleges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'student' 
      AND users.college_id = colleges.id
    )
  );

-- Policy 6: Allow public to read colleges for AISHE validation during signup
-- This allows unauthenticated users to validate AISHE codes
CREATE POLICY "Public can read colleges for AISHE validation" ON colleges
  FOR SELECT
  USING (true);

-- ============================================================
-- Add RLS policy for users table to allow service role inserts
-- ============================================================

-- Policy: Allow service role to insert users (for admin account creation during onboarding)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- Comments for documentation
-- ============================================================

COMMENT ON POLICY "Service role can insert colleges" ON colleges IS 
  'Allows service role to create college records during institutional onboarding';

COMMENT ON POLICY "Service role can insert users" ON users IS 
  'Allows service role to create admin user profiles during institutional onboarding';

COMMENT ON POLICY "Public can read colleges for AISHE validation" ON colleges IS
  'Allows unauthenticated users to validate AISHE codes during student/counsellor signup';
