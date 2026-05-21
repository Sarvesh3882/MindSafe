'use client';

// Recommendation Card Component
// Displays individual wellness recommendation details
// Author: MindSafe India Development Team

import { Prescription, PrescriptionWithCounsellor } from '@/types/prescription';
import { Calendar, Clock, Heart, User, Sparkles } from 'lucide-react';

interface PrescriptionCardProps {
  prescription: PrescriptionWithCounsellor | Prescription;
  onClick?: () => void;
  unreadCount?: number;
}

export function PrescriptionCard({
  prescription,
  onClick,
  unreadCount = 0,
}: PrescriptionCardProps) {
  const formattedDate = new Date(prescription.prescribed_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Check if prescription has counsellor info (PrescriptionWithCounsellor type)
  const counsellorName = 'counsellor' in prescription 
    ? prescription.counsellor?.full_name || 'Counselor'
    : 'Counselor';

  // Get category badge color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Academic Stress': return 'bg-blue-100 text-blue-800';
      case 'Anxiety Support': return 'bg-purple-100 text-purple-800';
      case 'Sleep Wellness': return 'bg-indigo-100 text-indigo-800';
      case 'Emotional Wellbeing': return 'bg-green-100 text-green-800';
      case 'Burnout Prevention': return 'bg-orange-100 text-orange-800';
      case 'Social Support': return 'bg-pink-100 text-pink-800';
      case 'Professional Referral': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-[#3DBE29]" />
            <h3 className="text-lg font-semibold text-gray-900">
              {prescription.medication_name}
            </h3>
            {prescription.is_suggestion && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                Suggestion
              </span>
            )}
          </div>
          {/* Category Badge */}
          {prescription.category && (
            <div className="mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${getCategoryColor(prescription.category)}`}>
                <Sparkles className="w-3 h-3" />
                {prescription.category}
              </span>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Recommended by {counsellorName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="flex items-center justify-center w-6 h-6 bg-[#3DBE29] text-white text-xs font-bold rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-gray-700 min-w-[100px]">Guidance:</span>
          <span className="text-sm text-gray-900">{prescription.dosage}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-gray-700 min-w-[100px]">Follow-up:</span>
          <span className="text-sm text-gray-900">{prescription.frequency}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-gray-700 min-w-[100px]">Support Period:</span>
          <span className="text-sm text-gray-900 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {prescription.duration}
          </span>
        </div>
        {prescription.notes && (
          <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700 min-w-[100px]">Notes:</span>
            <span className="text-sm text-gray-600 line-clamp-2">{prescription.notes}</span>
          </div>
        )}
      </div>

      {/* Click hint */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <span className="text-sm text-gray-500">Click to view details and messages</span>
      </div>
    </div>
  );
}
