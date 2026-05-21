interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  naac_metric: string;
  file_url: string;
  file_name: string;
  file_type: string;
  activity_date: string;
  activity_type: string;
  participants_count: number;
  created_at: string;
}

interface EvidenceDocumentationSectionProps {
  evidence: EvidenceItem[];
}

export function EvidenceDocumentationSection({ evidence }: EvidenceDocumentationSectionProps) {
  // Group evidence by category
  const groupedEvidence = evidence.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EvidenceItem[]>);

  const categories = Object.keys(groupedEvidence);

  // Category icons and colors
  const categoryConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
    'Workshop': { icon: '🎓', color: 'text-blue-800', bgColor: 'bg-blue-50' },
    'Awareness Program': { icon: '📢', color: 'text-purple-800', bgColor: 'bg-purple-50' },
    'Counselling Session': { icon: '💬', color: 'text-green-800', bgColor: 'bg-green-50' },
    'Training': { icon: '📚', color: 'text-orange-800', bgColor: 'bg-orange-50' },
    'Event': { icon: '🌟', color: 'text-pink-800', bgColor: 'bg-pink-50' },
    'Activity': { icon: '🎯', color: 'text-indigo-800', bgColor: 'bg-indigo-50' },
    'Report': { icon: '📊', color: 'text-teal-800', bgColor: 'bg-teal-50' },
    'Certificate': { icon: '🏆', color: 'text-yellow-800', bgColor: 'bg-yellow-50' },
    'Other': { icon: '📄', color: 'text-gray-800', bgColor: 'bg-gray-50' },
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#F59E0B] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          Evidence Documentation
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Supporting documents, photographs, and activity records for NAAC submission
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Evidence Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
            <p className="text-3xl font-bold text-[#F59E0B] mb-1">{evidence.length}</p>
            <p className="text-xs text-[#6B7280]">Total Documents</p>
          </div>
          <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
            <p className="text-3xl font-bold text-[#3DBE29] mb-1">{categories.length}</p>
            <p className="text-xs text-[#6B7280]">Categories</p>
          </div>
          <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
            <p className="text-3xl font-bold text-[#8B5CF6] mb-1">
              {evidence.reduce((sum, item) => sum + (item.participants_count || 0), 0)}
            </p>
            <p className="text-xs text-[#6B7280]">Total Participants</p>
          </div>
          <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
            <p className="text-3xl font-bold text-[#00C9A7] mb-1">
              {new Set(evidence.map(e => e.naac_metric)).size}
            </p>
            <p className="text-xs text-[#6B7280]">NAAC Metrics Covered</p>
          </div>
        </div>
      </div>

      {/* Evidence by Category */}
      {evidence.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="font-semibold text-[#1E1E2E] mb-2">No Evidence Uploaded Yet</h3>
          <p className="text-sm text-[#6B7280]">
            Upload supporting documents, photographs, and activity records through the Evidence Management page.
          </p>
        </div>
      ) : (
        categories.map((category) => {
          const items = groupedEvidence[category];
          const config = categoryConfig[category] || categoryConfig['Other'];

          return (
            <div key={category} className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{config.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#1E1E2E]">{category}</h3>
                  <p className="text-xs text-[#6B7280]">{items.length} document{items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 ${config.bgColor} border border-${config.color.replace('text-', '')}-200 rounded-lg`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xl">{getFileIcon(item.file_type)}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#1E1E2E] text-sm">{item.title}</h4>
                            <p className="text-xs text-[#6B7280] mt-1">{item.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          <div>
                            <p className="text-xs text-[#6B7280]">NAAC Metric</p>
                            <p className="text-xs font-semibold text-[#1E1E2E]">{item.naac_metric}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Activity Date</p>
                            <p className="text-xs font-semibold text-[#1E1E2E]">
                              {new Date(item.activity_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Activity Type</p>
                            <p className="text-xs font-semibold text-[#1E1E2E]">{item.activity_type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Participants</p>
                            <p className="text-xs font-semibold text-[#1E1E2E]">
                              {item.participants_count || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-[#6B7280]">File:</span>
                          <span className="text-xs font-mono text-[#1E1E2E] bg-white px-2 py-1 rounded">
                            {item.file_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* NAAC Metric Coverage */}
      {evidence.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h3 className="font-semibold text-[#1E1E2E] mb-4">NAAC Metric Coverage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from(new Set(evidence.map(e => e.naac_metric))).map((metric) => {
              const count = evidence.filter(e => e.naac_metric === metric).length;
              return (
                <div key={metric} className="flex items-center justify-between p-3 bg-[#F4F7FB] rounded-lg">
                  <span className="text-sm font-medium text-[#1E1E2E]">{metric}</span>
                  <span className="px-3 py-1 bg-[#3DBE29] text-white rounded-full text-xs font-semibold">
                    {count} document{count !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Documentation Guidelines */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">NAAC Documentation Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-[#1E1E2E] mb-3">Required Evidence Types</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Photographs of activities and events</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Attendance sheets and participant lists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Activity reports and minutes of meetings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Certificates and award letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Feedback forms and evaluation reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Policy documents and guidelines</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#1E1E2E] mb-3">Best Practices</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Clearly label all documents with date and event name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Include participant count and demographics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Map each document to specific NAAC metric</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Maintain chronological organization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Ensure all documents are signed/authenticated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Keep digital and physical copies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>📋 NAAC Submission Note:</strong> All evidence documents uploaded through the 
          platform are automatically organized by NAAC metric and category. Ensure each document 
          includes complete metadata (title, description, date, participants) for seamless NAAC 
          report generation. Additional evidence can be uploaded through the Evidence Management page.
        </p>
      </div>
    </div>
  );
}
