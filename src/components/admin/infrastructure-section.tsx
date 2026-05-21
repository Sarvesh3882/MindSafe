interface InfrastructureSectionProps {
  data: {
    totalStudents: number;
    counsellorsCount: number;
    mhpRatio: string;
    platformFeatures: string[];
    technicalCapabilities: string[];
  };
}

export function InfrastructureSection({ data }: InfrastructureSectionProps) {
  const requiredMHPs = Math.ceil(data.totalStudents / 500);
  const isRatioCompliant = data.counsellorsCount >= requiredMHPs;

  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#764BA2] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          Infrastructure & Resources
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Technical and human resource capabilities
        </p>
      </div>

      {/* Human Resources */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Mental Health Professional Staffing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1E1E2E]">Current MHPs</span>
              <span className={`text-xs font-medium ${isRatioCompliant ? 'text-green-600' : 'text-yellow-600'}`}>
                {isRatioCompliant ? '✓ Compliant' : '⚠ In Progress'}
              </span>
            </div>
            <p className="text-3xl font-bold text-[#764BA2] mb-1">{data.counsellorsCount}</p>
            <p className="text-xs text-[#6B7280]">Licensed professionals</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1E1E2E]">UGC Requirement</span>
              <span className="text-xs font-medium text-[#6B7280]">1:500 ratio</span>
            </div>
            <p className="text-3xl font-bold text-[#764BA2] mb-1">{requiredMHPs}</p>
            <p className="text-xs text-[#6B7280]">Minimum required MHPs</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1E1E2E]">Current Ratio</span>
              <span className="text-xs font-medium text-[#6B7280]">Per student</span>
            </div>
            <p className="text-3xl font-bold text-[#764BA2] mb-1">{data.mhpRatio}</p>
            <p className="text-xs text-[#6B7280]">MHP to student ratio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#F4F7FB] rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3">Professional Qualifications</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Clinical Psychologists (M.Phil., RCI registered)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Counselling Psychologists (M.A./M.Sc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Psychiatric Social Workers (M.Phil.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Minimum 1 year experience with youth</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-[#F4F7FB] rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3">Support Structure</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Faculty mentors (1:500 ratio)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Peer supporters (1:100 ratio)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>24×7 helpline operators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Administrative support staff</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Digital Platform Capabilities */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Digital Platform Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.platformFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-[#F4F7FB] rounded-lg">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-sm text-[#6B7280]">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Capabilities */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Technical Capabilities & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-[#1E1E2E] mb-3">Core Technologies</h4>
            <div className="space-y-2">
              {data.technicalCapabilities.map((capability, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-indigo-50 rounded">
                  <span className="text-indigo-600 mt-0.5">▸</span>
                  <span className="text-sm text-[#6B7280]">{capability}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#1E1E2E] mb-3">Security & Compliance</h4>
            <div className="space-y-2">
              {[
                'End-to-end encryption for all communications',
                'DPDP Act 2023 compliant data handling',
                'Role-based access control (RBAC)',
                'Secure authentication (Supabase Auth)',
                'Automated backup and disaster recovery',
                'HTTPS/TLS encryption for data in transit',
                'Database-level Row Level Security (RLS)',
                'Audit logging for all critical operations',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                  <span className="text-green-600 mt-0.5">🔒</span>
                  <span className="text-sm text-[#6B7280]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Response Infrastructure */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Crisis Response Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3 flex items-center gap-2">
              <span>🚨</span> Automated Alert System
            </h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Real-time risk assessment scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Immediate counsellor notification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>SMS/email alerts to designated staff</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Escalation protocols for non-response</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3 flex items-center gap-2">
              <span>📞</span> 24×7 Support Network
            </h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Institutional helpline (always available)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>TeleMANAS integration (14416)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>DMHP referral network</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Emergency hospital linkages</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy & Confidentiality Infrastructure */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Privacy & Confidentiality Measures</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-center mb-3">
              <span className="text-4xl">🔐</span>
            </div>
            <h4 className="font-medium text-[#1E1E2E] mb-2 text-center">Data Protection</h4>
            <ul className="space-y-1 text-xs text-[#6B7280]">
              <li>• Anonymized student IDs (STU-XXX)</li>
              <li>• Encrypted data storage</li>
              <li>• Access limited to authorized MHPs</li>
              <li>• Auto-deletion after graduation + 1 year</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-center mb-3">
              <span className="text-4xl">👁️</span>
            </div>
            <h4 className="font-medium text-[#1E1E2E] mb-2 text-center">Access Control</h4>
            <ul className="space-y-1 text-xs text-[#6B7280]">
              <li>• Role-based permissions</li>
              <li>• Multi-factor authentication</li>
              <li>• Session timeout policies</li>
              <li>• Audit trail for all access</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-center mb-3">
              <span className="text-4xl">📋</span>
            </div>
            <h4 className="font-medium text-[#1E1E2E] mb-2 text-center">Ethical Compliance</h4>
            <ul className="space-y-1 text-xs text-[#6B7280]">
              <li>• Informed consent protocols</li>
              <li>• Confidentiality agreements</li>
              <li>• Professional code of conduct</li>
              <li>• Ethics committee oversight</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Capacity Building & Training */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Capacity Building & Training Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#F4F7FB] rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3">Faculty Training</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Gatekeeper training for early identification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Mental health first aid certification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Crisis response protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Referral pathway training</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-[#F4F7FB] rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3">Student Programs</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Peer supporter training program</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Mental health awareness workshops</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Life skills development sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Stress management techniques</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Infrastructure Investment */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-4">Infrastructure Investment & Sustainability</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-[#6B7280] mb-2">Digital Platform</p>
              <p className="text-2xl font-bold text-[#3DBE29]">✓ Deployed</p>
              <p className="text-xs text-[#6B7280] mt-1">Cloud-based, scalable</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-[#6B7280] mb-2">Professional Staff</p>
              <p className="text-2xl font-bold text-[#3DBE29]">✓ Recruited</p>
              <p className="text-xs text-[#6B7280] mt-1">UGC ratio compliant</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-[#6B7280] mb-2">Training Programs</p>
              <p className="text-2xl font-bold text-[#3DBE29]">✓ Ongoing</p>
              <p className="text-xs text-[#6B7280] mt-1">Continuous capacity building</p>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mt-4">
            <strong>Sustainability Plan:</strong> The institution has committed to sustained funding 
            for mental health infrastructure, including annual budget allocation for platform maintenance, 
            professional development, and program expansion. Regular reviews ensure resource optimization 
            and alignment with evolving student needs.
          </p>
        </div>
      </div>
    </div>
  );
}
