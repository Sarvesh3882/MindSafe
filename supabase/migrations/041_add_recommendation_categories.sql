-- ============================================================
-- Add Recommendation Categories for Wellness Guidance
-- Transforms prescription module into counselor recommendations
-- ============================================================

-- Add category column for wellness recommendations
ALTER TABLE prescriptions 
ADD COLUMN IF NOT EXISTS category TEXT 
CHECK (category IN (
  'Academic Stress',
  'Anxiety Support',
  'Sleep Wellness',
  'Emotional Wellbeing',
  'Burnout Prevention',
  'Social Support',
  'Professional Referral'
));

-- Add comment explaining the wellness focus
COMMENT ON COLUMN prescriptions.category IS 
'Wellness recommendation category. This system provides counselor guidance and wellness support, not medical prescriptions.';

-- Add index for category filtering
CREATE INDEX IF NOT EXISTS idx_prescriptions_category 
ON prescriptions(category) 
WHERE category IS NOT NULL;

-- Update existing records to have a default category
-- This ensures backward compatibility with existing data
UPDATE prescriptions 
SET category = 'Emotional Wellbeing' 
WHERE category IS NULL;

-- Add comment to table explaining wellness purpose
COMMENT ON TABLE prescriptions IS 
'Counselor recommendations and wellness guidance. Despite the table name (for backward compatibility), this stores non-medical wellness support, coping strategies, and campus resource recommendations provided by counselors to students.';

-- Verify the changes
SELECT 
  category,
  COUNT(*) as count
FROM prescriptions
GROUP BY category
ORDER BY count DESC;

