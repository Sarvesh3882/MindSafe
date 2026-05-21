'use client';

// Wellness Suggestion Form Component
// Send wellness guidance suggestions to students
// Author: MindSafe India Development Team

import { useState } from 'react';
import { Lightbulb, AlertCircle, X } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface PrescriptionSuggestionFormProps {
  studentId: string;
  parentPrescriptionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const frequencyOptions = [
  'Daily practice',
  'Twice daily',
  'Weekly check-in',
  'As needed',
  'Other',
] as const;

export function PrescriptionSuggestionForm({ 
  studentId,
  parentPrescriptionId,
  onSuccess, 
  onCancel 
}: PrescriptionSuggestionFormProps) {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: 'Daily practice' as typeof frequencyOptions[number],
    duration: '',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Suggestion Title validation
    if (!formData.medicationName || formData.medicationName.trim().length < 2) {
      newErrors.medicationName = 'Suggestion title must be at least 2 characters';
    } else if (formData.medicationName.length > 200) {
      newErrors.medicationName = 'Suggestion title must not exceed 200 characters';
    }

    // Guidance Details validation (more descriptive requirement)
    if (!formData.dosage || formData.dosage.trim().length === 0) {
      newErrors.dosage = 'Guidance details are required';
    } else if (formData.dosage.trim().length < 5) {
      newErrors.dosage = 'Guidance details must be at least 5 characters (e.g., "10 minutes of journaling")';
    } else if (formData.dosage.length > 100) {
      newErrors.dosage = 'Guidance details must not exceed 100 characters';
    }

    // Support Period validation
    if (!formData.duration || formData.duration.trim().length === 0) {
      newErrors.duration = 'Support period is required';
    } else if (formData.duration.trim().length < 2) {
      newErrors.duration = 'Support period must be at least 2 characters (e.g., "2 weeks")';
    } else if (formData.duration.length > 50) {
      newErrors.duration = 'Support period must not exceed 50 characters';
    }

    // Reason validation (optional but has max length)
    if (formData.reason && formData.reason.length > 2000) {
      newErrors.reason = 'Reason must not exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/prescriptions/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          parentPrescriptionId: parentPrescriptionId || undefined,
          medicationName: formData.medicationName,
          dosage: formData.dosage,
          frequency: formData.frequency,
          duration: formData.duration,
          notes: formData.reason || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Suggestion sent successfully', 'success');
        onSuccess?.();
      } else {
        setErrors({ submit: data.error || 'Failed to send suggestion' });
        showToast(data.error || 'Failed to send suggestion', 'error');
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-900">Send Wellness Suggestion</h2>
            </div>
            <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Suggest a wellness activity or guidance adjustment to the student
          </p>

          {/* Validation Errors Summary */}
          {Object.keys(errors).length > 0 && !errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Validation failed</p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {errors.medicationName && <li>{errors.medicationName}</li>}
                    {errors.dosage && <li>{errors.dosage}</li>}
                    {errors.duration && <li>{errors.duration}</li>}
                    {errors.reason && <li>{errors.reason}</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Suggestion Title */}
          <div>
            <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-1">
              Suggestion Title *
            </label>
            <input
              type="text"
              id="medicationName"
              value={formData.medicationName}
              onChange={(e) => handleChange('medicationName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.medicationName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Try journaling before bed"
            />
            {errors.medicationName && <p className="mt-1 text-sm text-red-600">{errors.medicationName}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.medicationName.length}/200</p>
          </div>

          {/* Guidance Details */}
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
              Guidance Details *
            </label>
            <input
              type="text"
              id="dosage"
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.dosage ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 10 minutes of free writing each evening"
            />
            {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
            <p className="mt-1 text-xs text-gray-500">Describe the activity in detail (min 5 characters)</p>
          </div>

          {/* Follow-up Schedule */}
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Schedule *
            </label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2 weeks, 1 month, 4 weeks"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            <p className="mt-1 text-xs text-gray-500">How long should the student follow this guidance?</p>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Suggestion (Optional)
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Explain why you're suggesting this wellness activity..."
            />
            {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.reason.length}/2000</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
