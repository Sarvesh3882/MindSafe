'use client';

// Counsellor Recommendation Detail Page
// View recommendation details and message thread (counsellor view)
// Author: MindSafe India Development Team

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Calendar, Clock, User, AlertCircle, Edit2, Trash2, Sparkles } from 'lucide-react';
import { Prescription } from '@/types/prescription';
import { MessageThread } from '@/components/prescriptions/MessageThread';
import { MessageInput } from '@/components/prescriptions/MessageInput';
import { PrescriptionEditForm } from '@/components/prescriptions/PrescriptionEditForm';
import { showToast } from '@/components/ui/Toast';

export default function CounsellorPrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.id as string;

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('Student');
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    loadPrescription();
    loadCurrentUser();
  }, [prescriptionId]);

  const loadCurrentUser = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  const loadPrescription = async () => {
    try {
      setIsLoading(true);
      
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Get prescription with student info
      const { data, error: fetchError } = await supabase
        .from('prescriptions')
        .select(`
          *,
          student:users!student_id(full_name)
        `)
        .eq('id', prescriptionId)
        .single();

      if (fetchError) {
        console.error('Prescription fetch error:', fetchError);
        setError('Failed to load recommendation');
      } else if (data) {
        setPrescription(data);
        setStudentName(data.student?.full_name || 'Student');
      } else {
        setError('Recommendation not found');
      }
    } catch (err) {
      console.error('Prescription load error:', err);
      setError('An error occurred while loading the recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageSent = () => {
    loadPrescription();
  };

  const handlePrescriptionUpdated = (updatedPrescription: Prescription) => {
    setPrescription(updatedPrescription);
    setShowEditForm(false);
  };

  const canEdit = () => {
    if (!prescription) return false;
    
    const prescribedAt = new Date(prescription.prescribed_at);
    const now = new Date();
    const diffMs = now.getTime() - prescribedAt.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    
    return diffHours < 24; // 24-hour edit window
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recommendation? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showToast('Recommendation deleted successfully', 'success');
        setTimeout(() => router.back(), 1000);
      } else {
        showToast(data.error || 'Failed to delete recommendation', 'error');
      }
    } catch (err) {
      showToast('An error occurred while deleting the recommendation', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DBE29]"></div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Recommendation not found'}
          </h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#3DBE29] text-white rounded-lg hover:bg-[#32A822] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get category badge color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Academic Stress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Anxiety Support': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sleep Wellness': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Emotional Wellbeing': return 'bg-green-100 text-green-800 border-green-200';
      case 'Burnout Prevention': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Social Support': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Professional Referral': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-[#3DBE29]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recommendation Details</h1>
                <p className="text-sm text-gray-600 mt-1">for {studentName}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit() && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Edit Window Notice */}
        {!canEdit() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              This recommendation can no longer be edited (24-hour window has passed)
            </p>
          </div>
        )}

        {/* Recommendation Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Recommendation Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {prescription.medication_name}
              </h2>
              {prescription.category && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border ${getCategoryColor(prescription.category)}`}>
                  <Sparkles className="w-4 h-4" />
                  {prescription.category}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#3DBE29]" />
                <span className="font-medium">Guidance:</span>
                <span>{prescription.dosage}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Follow-up:</span>
                <span>{prescription.frequency}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Support Period:</span>
                <span>{prescription.duration}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#3DBE29]" />
                Counselor Notes
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{prescription.notes}</p>
            </div>
          )}

          {/* Wellness Tips */}
          {prescription.wellness_tips && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Wellness Tips
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{prescription.wellness_tips}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Recommended by you</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Recommended on {formatDate(prescription.prescribed_at)}</span>
            </div>
            {prescription.updated_at !== prescription.prescribed_at && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last updated {formatDate(prescription.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <p className="text-sm text-gray-600 mt-1">
              Communicate with the student about this recommendation
            </p>
          </div>

          <div className="px-6 py-4 max-h-[500px] overflow-y-auto">
            {currentUserId && (
              <MessageThread
                prescriptionId={prescriptionId}
                currentUserId={currentUserId}
                currentUserRole="counsellor"
              />
            )}
          </div>

          {currentUserId && (
            <MessageInput
              prescriptionId={prescriptionId}
              onMessageSent={handleMessageSent}
            />
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && prescription && (
        <PrescriptionEditForm
          prescription={prescription}
          onSuccess={handlePrescriptionUpdated}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
}
