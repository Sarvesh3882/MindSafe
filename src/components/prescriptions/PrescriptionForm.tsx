'use client';

// Recommendation Form Component
// Create wellness recommendations for students
// Author: MindSafe India Development Team

import { useState } from 'react';
import { FrequencyOption, RecommendationCategory } from '@/types/prescription';
import { Heart, AlertCircle, Sparkles } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface PrescriptionFormProps {
  studentId: string;
  onSuccess?: (prescription: any) => void;
  onCancel?: () => void;
}

export function PrescriptionForm({ studentId, onSuccess, onCancel }: PrescriptionFormProps) {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: 'Daily practice' as FrequencyOption,
    duration: '',
    notes: '',
    wellnessTips: '',
    category: '' as RecommendationCategory | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frequencyOptions: FrequencyOption[] = [
    'Daily practice',
    'Twice daily',
    'Weekly check-in',
    'As needed',
    'Other',
  ];

  const categoryOptions: RecommendationCategory[] = [
    'Academic Stress',
    'Anxiety Support',
    'Sleep Wellness',
    'Emotional Wellbeing',
    'Burnout Prevention',
    'Social Support',
    'Professional Referral',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.medicationName || formData.medicationName.length < 2) {
      newErrors.medicationName = 'Recommendation title must be at least 2 characters';
    }
    if (formData.medicationName.length > 200) {
      newErrors.medicationName = 'Recommendation title must not exceed 200 characters';
    }

    if (!formData.dosage) {
      newErrors.dosage = 'Guidance details are required';
    }
    if (formData.dosage.length > 100) {
      newErrors.dosage = 'Guidance details must not exceed 100 characters';
    }

    if (!formData.duration) {
      newErrors.duration = 'Support period is required';
    }
    if (formData.duration.length > 50) {
      newErrors.duration = 'Support period must not exceed 50 characters';
    }

    if (formData.notes && formData.notes.length > 2000) {
      newErrors.notes = 'Notes must not exceed 2000 characters';
    }

    if (formData.wellnessTips && formData.wellnessTips.length > 2000) {
      newErrors.wellnessTips = 'Wellness tips must not exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/prescriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          ...formData,
          category: formData.category || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Recommendation added successfully', 'success');
        onSuccess?.(data.prescription);
      } else {
        setErrors({ submit: data.error || 'Failed to add recommendation' });
        showToast(data.error || 'Failed to add recommendation', 'error');
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-6 h-6 text-[#3DBE29]" />
        <h2 className="text-2xl font-bold text-gray-900">Add Recommendation</h2>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Provide wellness guidance and support only. Do not prescribe medications or provide medical diagnoses.
          For students requiring professional help, select "Professional Referral" as the category.
        </p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#3DBE29]" />
            Wellness Category
          </span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent"
        >
          <option value="">Select a category (optional)</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Recommendation Title */}
      <div>
        <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-1">
          Recommendation Title *
        </label>
        <input
          type="text"
          id="medicationName"
          value={formData.medicationName}
          onChange={(e) => handleChange('medicationName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent ${
            errors.medicationName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Daily Mindfulness Practice"
        />
        {errors.medicationName && (
          <p className="mt-1 text-sm text-red-600">{errors.medicationName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{formData.medicationName.length}/200</p>
      </div>

      {/* Guidance Details and Follow-up Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
            Guidance Details *
          </label>
          <input
            type="text"
            id="dosage"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent ${
              errors.dosage ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 10-min morning meditation"
          />
          {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Follow-up Schedule *
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent"
          >
            {frequencyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Support Period */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
          Support Period *
        </label>
        <input
          type="text"
          id="duration"
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent ${
            errors.duration ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 4 weeks"
        />
        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
      </div>

      {/* Counselor Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Counselor Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent ${
            errors.notes ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Additional context, coping strategies, or follow-up instructions..."
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.notes.length}/2000</p>
      </div>

      {/* Wellness Tips */}
      <div>
        <label htmlFor="wellnessTips" className="block text-sm font-medium text-gray-700 mb-1">
          Wellness Tips (Optional)
        </label>
        <textarea
          id="wellnessTips"
          value={formData.wellnessTips}
          onChange={(e) => handleChange('wellnessTips', e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent ${
            errors.wellnessTips ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Self-care activities, campus resources, lifestyle suggestions..."
        />
        {errors.wellnessTips && (
          <p className="mt-1 text-sm text-red-600">{errors.wellnessTips}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{formData.wellnessTips.length}/2000</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-[#3DBE29] text-white rounded-lg hover:bg-[#32A822] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Recommendation'}
        </button>
      </div>
    </form>
  );
}
