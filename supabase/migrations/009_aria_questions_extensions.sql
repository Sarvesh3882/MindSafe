-- ============================================================
-- ARIA 2.0 Assessment Engine: Questions Table Extensions
-- ============================================================
-- This migration extends the questions table to support:
-- - Clinical instrument tracking (PHQ-9, GAD-7, ISI, PSS-10, Maslach, UCLA)
-- - Question ordering within instruments
-- - Reverse scoring flags (for PSS-10 items 4, 5, 7, 8)
-- - Triage question identification
-- - Camouflage question identification

-- Add new columns to questions table
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS instrument TEXT CHECK (instrument IN ('phq9', 'gad7', 'isi', 'pss10', 'maslach', 'ucla') OR instrument IS NULL),
  ADD COLUMN IF NOT EXISTS question_number INTEGER,
  ADD COLUMN IF NOT EXISTS reverse_scored BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_triage BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_camouflage BOOLEAN DEFAULT FALSE;

-- Create indexes for fast instrument-based fetching
CREATE INDEX IF NOT EXISTS idx_questions_instrument ON questions(instrument) WHERE instrument IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_questions_is_triage ON questions(is_triage) WHERE is_triage = TRUE;
CREATE INDEX IF NOT EXISTS idx_questions_is_camouflage ON questions(is_camouflage) WHERE is_camouflage = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN questions.instrument IS 'Clinical instrument identifier: phq9, gad7, isi, pss10, maslach, ucla';
COMMENT ON COLUMN questions.question_number IS 'Question ordering within instrument (1-indexed)';
COMMENT ON COLUMN questions.reverse_scored IS 'TRUE for PSS-10 items 4, 5, 7, 8 which use reverse scoring formula';
COMMENT ON COLUMN questions.is_triage IS 'TRUE for the 3 triage questions used in initial screening';
COMMENT ON COLUMN questions.is_camouflage IS 'TRUE for camouflage questions (not scored, used for pattern breaking)';
