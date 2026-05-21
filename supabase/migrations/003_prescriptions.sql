-- ============================================================
-- RESOURCE PRESCRIPTIONS
-- ============================================================

CREATE TABLE resource_prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  prescribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, resource_id)
);

ALTER TABLE resource_prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can see their prescriptions" 
  ON resource_prescriptions FOR SELECT 
  USING (student_id = auth.uid());

CREATE POLICY "Counsellors can manage prescriptions for their students" 
  ON resource_prescriptions FOR ALL 
  USING (
    get_user_role() = 'counsellor' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = resource_prescriptions.student_id AND college_id = get_user_college()
    )
  );
