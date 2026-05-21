// Prescription types and interfaces
// Author: MindSafe India Development Team
// 
// NOTE: This module is used for "Counselor Recommendations" - wellness guidance
// provided by counselors to students. Despite the "prescription" naming in the
// database layer (for backward compatibility), this represents non-medical
// wellness support, coping strategies, and campus resource recommendations.

// Wellness recommendation categories
export type RecommendationCategory =
  | 'Academic Stress'
  | 'Anxiety Support'
  | 'Sleep Wellness'
  | 'Emotional Wellbeing'
  | 'Burnout Prevention'
  | 'Social Support'
  | 'Professional Referral';

// Follow-up schedule options (formerly "frequency")
export type FrequencyOption = 
  | 'Daily practice'
  | 'Twice daily'
  | 'Weekly check-in'
  | 'As needed'
  | 'Other';

export interface Prescription {
  id: string;
  student_id: string;
  counsellor_id: string;
  parent_prescription_id: string | null;
  medication_name: string; // Used as "Recommendation Title"
  dosage: string; // Used as "Guidance Details"
  frequency: FrequencyOption; // Used as "Follow-up Schedule"
  duration: string; // Used as "Support Period"
  notes: string | null;
  wellness_tips: string | null;
  category?: RecommendationCategory; // Wellness category
  is_suggestion: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  prescribed_at: string; // Used as "Recommended At"
  created_at: string;
  updated_at: string;
}

export interface PrescriptionWithCounsellor extends Prescription {
  counsellor: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface PrescriptionWithStudent extends Prescription {
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface PrescriptionMessage {
  id: string;
  prescription_id: string;
  sender_id: string;
  sender_role: 'student' | 'counsellor';
  parent_message_id: string | null;
  message_text: string;
  is_read: boolean;
  read_at: string | null;
  read_by: string | null;
  is_edited: boolean;
  edited_at: string | null;
  sent_at: string;
  created_at: string;
}

export interface PrescriptionMessageWithSender extends PrescriptionMessage {
  sender: {
    id: string;
    full_name: string;
    role: 'student' | 'counsellor';
    avatar_url?: string;
  };
}

export interface PrescriptionAuditLog {
  id: string;
  prescription_id: string;
  user_id: string;
  action: 'created' | 'updated' | 'deleted' | 'suggestion_sent';
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  created_at: string;
}

// API Request Types
export interface CreatePrescriptionRequest {
  studentId: string;
  medicationName: string; // Recommendation Title
  dosage: string; // Guidance Details
  frequency: FrequencyOption; // Follow-up Schedule
  duration: string; // Support Period
  notes?: string;
  wellnessTips?: string;
  category?: RecommendationCategory;
}

export interface CreateSuggestionRequest {
  parentPrescriptionId: string;
  medicationName: string;
  dosage: string;
  frequency: FrequencyOption;
  duration: string;
  notes?: string;
}

export interface UpdatePrescriptionRequest {
  medicationName?: string;
  dosage?: string;
  frequency?: FrequencyOption;
  duration?: string;
  notes?: string;
  wellnessTips?: string;
}

export interface SendMessageRequest {
  prescriptionId: string;
  messageText: string;
  parentMessageId?: string;
}

export interface EditMessageRequest {
  messageText: string;
}

// API Response Types
export interface PrescriptionResponse {
  success: boolean;
  prescription?: PrescriptionWithCounsellor;
  error?: string;
}

export interface PrescriptionsListResponse {
  success: boolean;
  prescriptions?: PrescriptionWithCounsellor[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface MessageResponse {
  success: boolean;
  message?: PrescriptionMessageWithSender;
  error?: string;
}

export interface MessagesListResponse {
  success: boolean;
  messages?: PrescriptionMessageWithSender[];
  error?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  count?: number;
  error?: string;
}

// Query Parameters
export interface PrescriptionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  dateRange?: '7d' | '30d' | '90d' | 'all';
}
