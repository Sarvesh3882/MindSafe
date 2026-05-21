-- ============================================================
-- Allow anonymous (unauthenticated) users to read questions
-- Needed for guest/anonymous mode check-in flow
-- ============================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;

-- Allow anyone (including anonymous) to read questions
-- Questions are not sensitive data — they're the assessment question bank
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);
