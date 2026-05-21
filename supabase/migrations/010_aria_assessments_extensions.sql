-- ============================================================
-- ARIA 2.0 Assessment Engine: Assessments Table Extensions
-- ============================================================
-- This migration extends the assessments table to support:
-- - Triage result tracking (stable vs escalate)
-- - Triage signal storage (per-domain signal strengths)
-- - Instruments administered tracking
-- - Counsellor report storage
-- - Consistency flags for response pattern analysis
-- - Camouflage question responses
-- - Context frame tracking
-- - Session duration tracking

-- Add new columns to assessments table
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS triage_result TEXT CHECK (triage_result IN ('stable', 'escalate') OR triage_result IS NULL),
  ADD COLUMN IF NOT EXISTS triage_signal JSONB,
  ADD COLUMN IF NOT EXISTS instruments_used TEXT[],
  ADD COLUMN IF NOT EXISTS counsellor_report JSONB,
  ADD COLUMN IF NOT EXISTS consistency_flags JSONB,
  ADD COLUMN IF NOT EXISTS camouflage_responses JSONB,
  ADD COLUMN IF NOT EXISTS context_frame_id TEXT,
  ADD COLUMN IF NOT EXISTS session_duration_seconds INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN assessments.triage_result IS 'Triage phase outcome: stable (no escalation) or escalate (proceed to clinical assessment)';
COMMENT ON COLUMN assessments.triage_signal IS 'Per-domain signal strengths from triage (0-3 scale): {depression, anxiety, stress, sleep, burnout, loneliness}';
COMMENT ON COLUMN assessments.instruments_used IS 'Array of clinical instruments administered: phq9, gad7, isi, pss10, maslach, ucla';
COMMENT ON COLUMN assessments.counsellor_report IS 'Full counsellor report with clinical scores, risk level, recommended action, and consistency flags';
COMMENT ON COLUMN assessments.consistency_flags IS 'Array of consistency check flags: cross_instrument, temporal, response_time';
COMMENT ON COLUMN assessments.camouflage_responses IS 'Array of camouflage question responses for counsellor context';
COMMENT ON COLUMN assessments.context_frame_id IS 'ID of context framing variant used for this session';
COMMENT ON COLUMN assessments.session_duration_seconds IS 'Total time in seconds to complete the assessment';

-- The existing (user_id, date) unique constraint is preserved for idempotent upserts
