'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Evidence {
  id: string;
  title: string;
  description: string | null;
  category: string;
  naac_metric: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  activity_date: string | null;
  activity_type: string | null;
  participants_count: number | null;
  created_at: string;
}

interface EvidenceGalleryProps {
  evidence: Evidence[];
  onDelete: (id: string) => void;
}

export function EvidenceGallery({ evidence, onDelete }: EvidenceGalleryProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'criterion_v', label: 'Criterion V' },
    { value: 'criterion_vii', label: 'Criterion VII' },
    { value: 'ugc_compliance', label: 'UGC Compliance' },
    { value: 'activity', label: 'Activities' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'training', label: 'Training' },
  ];

  const filteredEvidence =
    filter === 'all' ? evidence : evidence.filter((e) => e.category === filter);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setDeleting(null);
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      criterion_v: 'bg-blue-100 text-blue-800',
      criterion_vii: 'bg-purple-100 text-purple-800',
      ugc_compliance: 'bg-green-100 text-green-800',
      activity: 'bg-orange-100 text-orange-800',
      infrastructure: 'bg-gray-100 text-gray-800',
      training: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    // Use a consistent format to avoid hydration mismatches
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-[#6B7280]">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                filter === cat.value
                  ? 'bg-[#3DBE29] text-white'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#3DBE29]'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredEvidence.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-[#E5E7EB] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-[#6B7280]">No documents uploaded yet</p>
            <p className="text-sm text-[#9CA3AF] mt-1">
              Upload your first document using the form above
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Preview */}
                <div className="relative h-48 bg-[#F4F7FB] flex items-center justify-center">
                  {item.file_type.startsWith('image/') ? (
                    <img
                      src={item.file_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 text-[#6B7280]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title and Category */}
                  <div>
                    <h3 className="font-semibold text-[#1E1E2E] line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getCategoryBadge(
                          item.category
                        )}`}
                      >
                        {item.category.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {item.naac_metric && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[#3DBE29]/10 text-[#3DBE29] font-medium">
                          {item.naac_metric}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">{item.description}</p>
                  )}

                  {/* Activity Details */}
                  {(item.activity_date || item.participants_count) && (
                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                      {item.activity_date && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(item.activity_date)}
                        </span>
                      )}
                      {item.participants_count && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {item.participants_count} participants
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB]">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 bg-[#3DBE29] text-white rounded-lg text-sm font-medium hover:bg-[#32A822] transition-colors"
                    >
                      {item.file_type.startsWith('image/') ? 'View' : 'Download'}
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deleting === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-[#6B7280] text-center">
        Showing {filteredEvidence.length} of {evidence.length} documents
      </div>
    </div>
  );
}
