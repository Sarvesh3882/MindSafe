-- MindSafe India — Initial Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- COLLEGES
-- ============================================================
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'basic' CHECK (plan_tier IN ('basic', 'growth', 'enterprise')),
  active BOOLEAN NOT NULL DEFAULT true,
  onboarded_at TIMESTAMPTZ DEFAULT NOW(),
  logo_url TEXT,
  max_students INTEGER DEFAULT 500,
  contact_email TEXT,
  city TEXT,
  state TEXT
);

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'counsellor', 'admin')),
  college_id UUID REFERENCES colleges(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  guardian_phone TEXT,
  department TEXT,
  year INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTIONS (ARIA question bank)
-- ============================================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('depression','anxiety','stress','sleep','burnout','loneliness','substance')),
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high')),
  maps_to JSONB NOT NULL DEFAULT '{}',
  options JSONB NOT NULL DEFAULT '[]',
  times_asked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ASSESSMENTS (daily check-in results)
-- ============================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  scores JSONB NOT NULL DEFAULT '{"depression":0,"anxiety":0,"stress":0,"sleep":0,"burnout":0,"loneliness":0,"substance":0}',
  risk_level TEXT NOT NULL DEFAULT 'stable' CHECK (risk_level IN ('stable','attention','critical')),
  questions_asked UUID[] DEFAULT '{}',
  emotion TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- SESSIONS (counsellor bookings)
-- ============================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id),
  counsellor_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL DEFAULT 'online' CHECK (type IN ('online','offline')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ALERTS (crisis escalation log)
-- ============================================================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id),
  counsellor_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('score_spike','crisis_keyword','consecutive_bad_days','missed_session')),
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  notes TEXT
);

-- ============================================================
-- RESOURCES (wellness content library)
-- ============================================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video','article','exercise','meditation','breathing')),
  category TEXT NOT NULL,
  url TEXT,
  content TEXT,
  college_id UUID REFERENCES colleges(id),
  thumbnail TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHAT MESSAGES (AI chatbot history)
-- ============================================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to get current user college
CREATE OR REPLACE FUNCTION get_user_college()
RETURNS UUID AS $$
  SELECT college_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- USERS policies
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Counsellors can read students in their college" ON users FOR SELECT
  USING (get_user_role() = 'counsellor' AND college_id = get_user_college());
CREATE POLICY "Admins can read users in their college" ON users FOR SELECT
  USING (get_user_role() = 'admin' AND college_id = get_user_college());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());

-- ASSESSMENTS policies
CREATE POLICY "Students can read own assessments" ON assessments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Students can insert own assessments" ON assessments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Students can update own assessments" ON assessments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Counsellors can read student assessments in their college" ON assessments FOR SELECT
  USING (get_user_role() = 'counsellor' AND EXISTS (
    SELECT 1 FROM users WHERE id = assessments.user_id AND college_id = get_user_college()
  ));
-- Admins see ONLY aggregated data — no individual assessment access via RLS
-- Admin analytics are served via service role in API routes

-- SESSIONS policies
CREATE POLICY "Students can read own sessions" ON sessions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Counsellors can read/write their sessions" ON sessions FOR ALL
  USING (counsellor_id = auth.uid() OR student_id = auth.uid());

-- ALERTS policies
CREATE POLICY "Counsellors can read alerts in their college" ON alerts FOR SELECT
  USING (get_user_role() IN ('counsellor', 'admin'));
CREATE POLICY "System can insert alerts" ON alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Counsellors can update alerts" ON alerts FOR UPDATE
  USING (get_user_role() = 'counsellor');

-- QUESTIONS policies
CREATE POLICY "Authenticated users can read questions" ON questions FOR SELECT USING (auth.uid() IS NOT NULL);

-- RESOURCES policies
CREATE POLICY "Authenticated users can read resources" ON resources FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage resources" ON resources FOR ALL USING (get_user_role() = 'admin');

-- CHAT MESSAGES policies
CREATE POLICY "Users can read own chat messages" ON chat_messages FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- SEED: Sample questions from validated instruments
-- ============================================================
INSERT INTO questions (question, category, severity, options, maps_to) VALUES
-- PHQ-9 Depression
('Over the past week, how often have you felt little interest or pleasure in doing things?', 'depression', 'low',
  '[{"label":"Not at all","value":0,"emoji":"😊"},{"label":"A few days","value":1,"emoji":"🙂"},{"label":"More than half the days","value":2,"emoji":"😐"},{"label":"Nearly every day","value":3,"emoji":"😔"}]',
  '{"depression": 1}'),
('How often have you been feeling down, low, or hopeless?', 'depression', 'medium',
  '[{"label":"Not at all","value":0,"emoji":"😊"},{"label":"A few days","value":1,"emoji":"🙂"},{"label":"More than half the days","value":2,"emoji":"😐"},{"label":"Nearly every day","value":3,"emoji":"😔"}]',
  '{"depression": 1}'),
('How often have you had trouble falling or staying asleep, or sleeping too much?', 'sleep', 'low',
  '[{"label":"Not at all","value":0,"emoji":"😴"},{"label":"A few days","value":1,"emoji":"🙂"},{"label":"More than half the days","value":2,"emoji":"😐"},{"label":"Nearly every day","value":3,"emoji":"😟"}]',
  '{"sleep": 1}'),
-- GAD-7 Anxiety
('How often have you been feeling nervous, anxious, or on edge?', 'anxiety', 'low',
  '[{"label":"Not at all","value":0,"emoji":"😊"},{"label":"A few days","value":1,"emoji":"🙂"},{"label":"More than half the days","value":2,"emoji":"😐"},{"label":"Nearly every day","value":3,"emoji":"😟"}]',
  '{"anxiety": 1}'),
('How often have you been unable to stop or control worrying?', 'anxiety', 'medium',
  '[{"label":"Not at all","value":0,"emoji":"😊"},{"label":"A few days","value":1,"emoji":"🙂"},{"label":"More than half the days","value":2,"emoji":"😐"},{"label":"Nearly every day","value":3,"emoji":"😟"}]',
  '{"anxiety": 1}'),
-- PSS Stress
('In the past week, how often have you felt that you were unable to control the important things in your life?', 'stress', 'medium',
  '[{"label":"Never","value":0,"emoji":"😊"},{"label":"Almost never","value":1,"emoji":"🙂"},{"label":"Sometimes","value":2,"emoji":"😐"},{"label":"Fairly often","value":3,"emoji":"😟"},{"label":"Very often","value":4,"emoji":"😰"}]',
  '{"stress": 1}'),
('How often have you felt difficulties were piling up so high that you could not overcome them?', 'stress', 'high',
  '[{"label":"Never","value":0,"emoji":"😊"},{"label":"Almost never","value":1,"emoji":"🙂"},{"label":"Sometimes","value":2,"emoji":"😐"},{"label":"Fairly often","value":3,"emoji":"😟"},{"label":"Very often","value":4,"emoji":"😰"}]',
  '{"stress": 1}'),
-- Burnout
('How often do you feel emotionally drained by your studies?', 'burnout', 'medium',
  '[{"label":"Never","value":0,"emoji":"😊"},{"label":"Rarely","value":1,"emoji":"🙂"},{"label":"Sometimes","value":2,"emoji":"😐"},{"label":"Often","value":3,"emoji":"😟"},{"label":"Always","value":4,"emoji":"😰"}]',
  '{"burnout": 1}'),
-- Loneliness
('How often do you feel left out?', 'loneliness', 'low',
  '[{"label":"Never","value":1,"emoji":"😊"},{"label":"Rarely","value":2,"emoji":"🙂"},{"label":"Sometimes","value":3,"emoji":"😐"},{"label":"Often","value":4,"emoji":"😔"}]',
  '{"loneliness": 1}');
