'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentUploadFormProps {
  collegeId: string;
  onUploadComplete?: () => void;
}

const CATEGORIES = [
  { value: 'criterion_v', label: 'Criterion V - Student Support' },
  { value: 'criterion_vii', label: 'Criterion VII - Best Practices' },
  { value: 'ugc_compliance', label: 'UGC Compliance' },
  { value: 'activity', label: 'Activity Documentation' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'training', label: 'Training & Certificates' },
];

const NAAC_METRICS = [
  { value: '5.1.1', label: '5.1.1 - Scholarships/Freeships' },
  { value: '5.1.2', label: '5.1.2 - Capability Enhancement' },
  { value: '5.1.3', label: '5.1.3 - Career Counselling' },
  { value: '5.1.5', label: '5.1.5 - Grievance Redressal' },
  { value: '5.2', label: '5.2 - Student Progression' },
  { value: '5.3', label: '5.3 - Student Participation' },
  { value: '7.1.2', label: '7.1.2 - Gender Equity' },
  { value: '7.1.9', label: '7.1.9 - Code of Conduct' },
  { value: '7.2.1', label: '7.2.1 - Best Practices' },
  { value: '7.3.1', label: '7.3.1 - Institutional Distinctiveness' },
];

const ACTIVITY_TYPES = [
  'workshop',
  'awareness_program',
  'yoga_session',
  'counselling_session',
  'training_program',
  'seminar',
  'webinar',
  'cultural_event',
  'sports_event',
  'other',
];

export function DocumentUploadForm({ collegeId, onUploadComplete }: DocumentUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'activity',
    naacMetric: '',
    activityDate: '',
    activityType: '',
    participantsCount: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${collegeId}/${formData.category}/${fileName}`;

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('filePath', filePath);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('naacMetric', formData.naacMetric);
      formDataToSend.append('activityDate', formData.activityDate);
      formDataToSend.append('activityType', formData.activityType);
      formDataToSend.append('participantsCount', formData.participantsCount);
      formDataToSend.append('collegeId', collegeId);

      const response = await fetch('/api/admin/evidence/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'activity',
        naacMetric: '',
        activityDate: '',
        activityType: '',
        participantsCount: '',
      });
      setFile(null);
      
      // Show success message
      alert('Document uploaded successfully!');
      
      // Refresh the page to show the new document
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload NAAC Evidence</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              placeholder="e.g., Yoga and Wellness Workshop"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              rows={3}
              placeholder="Brief description of the activity or document"
            />
          </div>

          {/* Category and NAAC Metric */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
                NAAC Metric
              </label>
              <select
                value={formData.naacMetric}
                onChange={(e) => setFormData({ ...formData, naacMetric: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              >
                <option value="">Select metric (optional)</option>
                {NAAC_METRICS.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
                Activity Date
              </label>
              <input
                type="date"
                value={formData.activityDate}
                onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
                Activity Type
              </label>
              <select
                value={formData.activityType}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              >
                <option value="">Select type (optional)</option>
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
                Participants
              </label>
              <input
                type="number"
                min="0"
                value={formData.participantsCount}
                onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
                placeholder="Number"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E2E] mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
            />
            <p className="text-xs text-[#6B7280] mt-1">
              Accepted: JPG, PNG, PDF (Max 10MB)
            </p>
            {file && (
              <p className="text-sm text-[#3DBE29] mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-[#3DBE29] hover:bg-[#32A822] text-white"
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
