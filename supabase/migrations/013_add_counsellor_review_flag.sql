-- Add counsellor review tracking to prevent critical assessments from being hidden

-- Add counsellor_reviewed flag to assessments
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS counsellor_reviewed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Add comment
COMMENT ON COLUMN assessments.counsellor_reviewed IS 'Whether a counsellor has reviewed this assessment (important for critical cases)';
COMMENT ON COLUMN assessments.reviewed_by IS 'Counsellor who reviewed this assessment';
COMMENT ON COLUMN assessments.reviewed_at IS 'When the assessment was reviewed';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_unreviewed_critical 
ON assessments(user_id, counsellor_reviewed, risk_level) 
WHERE counsellor_reviewed = false AND risk_level = 'critical';

-- Function to get student's display risk level (highest unreviewed or latest)
CREATE OR REPLACE FUNCTION get_student_display_risk(student_id UUID)
RETURNS TEXT AS $$
DECLARE
  unreviewed_critical_count INTEGER;
  latest_risk TEXT;
BEGIN
  -- Check if there are any unreviewed critical assessments
  SELECT COUNT(*) INTO unreviewed_critical_count
  FROM assessments
  WHERE user_id = student_id
    AND risk_level = 'critical'
    AND counsellor_reviewed = false
    AND date >= CURRENT_DATE - INTERVAL '7 days';
  
  -- If there are unreviewed critical assessments, return 'critical'
  IF unreviewed_critical_count > 0 THEN
    RETURN 'critical';
  END IF;
  
  -- Otherwise, return the latest assessment's risk level
  SELECT risk_level INTO latest_risk
  FROM assessments
  WHERE user_id = student_id
    AND date >= CURRENT_DATE - INTERVAL '7 days'
  ORDER BY date DESC, created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(latest_risk, 'stable');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_student_display_risk IS 'Returns the risk level to display for a student: critical if any unreviewed critical assessments exist in last 7 days, otherwise latest assessment';
