'use client';

// Counsellor Recommendation Management Page
// View and create wellness recommendations for a specific student
// Author: MindSafe India Development Team

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Heart, AlertCircle, Lightbulb } from 'lucide-react';
import { Prescription } from '@/types/prescription';
import { PrescriptionCard } from '@/components/prescriptions/PrescriptionCard';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';
import { PrescriptionSuggestionForm } from '@/components/prescriptions/PrescriptionSuggestionForm';

export default function CounsellorStudentPrescriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [studentName, setStudentName] = useState<string>('Student');

  useEffect(() => {
    loadPrescriptions();
    loadStudentInfo();
  }, [studentId]);

  const loadStudentInfo = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', studentId)
        .single();
      if (data && !error) {
        setStudentName(data.full_name || 'Student');
      }
    } catch (err) {
      console.error('Failed to load student info:', err);
    }
  };

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/prescriptions/student/${studentId}`);
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.prescriptions);
      } else {
        setError(data.error || 'Failed to load recommendations');
      }
    } catch (err) {
      setError('An error occurred while loading recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrescriptionCreated = (prescription: Prescription) => {
    setPrescriptions([prescription, ...prescriptions]);
    setShowForm(false);
  };

  const handleSuggestionSent = () => {
    setShowSuggestionForm(false);
    loadPrescriptions();
  };

  const handlePrescriptionClick = (prescriptionId: string) => {
    router.push(`/counsellor/prescriptions/detail/${prescriptionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DBE29]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
                <h1 className="text-2xl font-bold text-gray-900">Wellness Recommendations</h1>
                <p className="text-sm text-gray-600 mt-1">for {studentName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSuggestionForm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Send Suggestion</span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[#3DBE29] text-white rounded-lg hover:bg-[#32A822] transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={loadPrescriptions}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Recommendation Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <PrescriptionForm
              studentId={studentId}
              onSuccess={handlePrescriptionCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Recommendations List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No recommendations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add the first wellness recommendation for this student
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3DBE29] text-white rounded-lg hover:bg-[#32A822] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Recommendation</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              {prescriptions.length} recommendation{prescriptions.length !== 1 ? 's' : ''} total
            </p>
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onClick={() => handlePrescriptionClick(prescription.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggestion Form Modal */}
      {showSuggestionForm && (
        <PrescriptionSuggestionForm
          studentId={studentId}
          onSuccess={handleSuggestionSent}
          onCancel={() => setShowSuggestionForm(false)}
        />
      )}
    </div>
  );
}
