export type UserRole = "student" | "counsellor" | "admin";
export type RiskLevel = "stable" | "attention" | "critical";
export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type SessionType = "online" | "offline";
export type AlertType = "score_spike" | "crisis_keyword" | "consecutive_bad_days" | "missed_session";

export interface College {
  id: string;
  name: string;
  plan_tier: "basic" | "growth" | "enterprise";
  active: boolean;
  onboarded_at: string;
  logo_url?: string;
  max_students: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  college_id: string;
  full_name: string;
  phone?: string;
  guardian_phone?: string;
  department?: string;
  year?: number;
  created_at: string;
  avatar_url?: string;
}

export interface Question {
  id: string;
  question: string;
  category: string;
  severity: "low" | "medium" | "high";
  maps_to: Record<string, number>;
  options: QuestionOption[];
  times_asked: number;
}

export interface QuestionOption {
  label: string;
  value: number;
  emoji?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  date: string;
  // Raw scores — NEVER sent to student UI. Counsellor-only via buildCounsellorView().
  scores: {
    depression: number;
    anxiety: number;
    stress: number;
    sleep: number;
    burnout: number;
    loneliness: number;
    substance: number;
  };
  risk_level: RiskLevel;
  questions_asked: string[];
  emotion: string;
  completed: boolean;
}

// Student-safe view — no scores, no clinical labels
export interface StudentAssessmentView {
  date: string;
  emotion: string;
  completed: boolean;
}

// Consent record for counsellor chat access
export interface ConsentRecord {
  id: string;
  student_id: string;
  counsellor_id: string;
  chat_access: boolean;
  granted_at?: string;
  revoked_at?: string;
  is_active: boolean;
}

export interface Session {
  id: string;
  student_id: string;
  counsellor_id: string;
  date: string;
  time: string;
  type: SessionType;
  status: SessionStatus;
  notes?: string;
  student?: User;
  counsellor?: User;
}

export interface Alert {
  id: string;
  student_id: string;
  counsellor_id?: string;
  type: AlertType;
  triggered_at: string;
  resolved: boolean;
  resolved_at?: string;
  notes?: string;
  student?: User;
}

export interface Resource {
  id: string;
  title: string;
  type: "video" | "article" | "exercise" | "meditation" | "breathing";
  category: string;
  url?: string;
  content?: string;
  college_id?: string;
  thumbnail?: string;
  duration?: string;
}

export interface CampusStats {
  total_students: number;
  active_today: number;
  stable_count: number;
  attention_count: number;
  critical_count: number;
  stable_pct: number;
  attention_pct: number;
  critical_pct: number;
  avg_checkin_rate: number;
  open_alerts: number;
}

export interface TrendDataPoint {
  date: string;
  stable: number;
  attention: number;
  critical: number;
  checkins: number;
}

export interface StudentTrendPoint {
  date: string;
  depression: number;
  anxiety: number;
  stress: number;
  sleep: number;
}
