interface UGCComplianceSectionProps {
  data: {
    totalStudents: number;
    counsellorsCount: number;
    mhpRatio: string;
    helplineActive: boolean;
    teleManaIntegrated: boolean;
  };
}

export function UGCComplianceSection({ data }: UGCComplianceSectionProps) {
  const requiredMHPRatio = Math.ceil(data.totalStudents / 500);
  const isRatioCompliant = data.counsellorsCount >= requiredMHPRatio;

  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#FF9F43] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          UGC Uniform Policy on Mental Health & Well-being Compliance
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          As per UGC Guidelines (January 2026, 594th UGC Meeting)
        </p>
      </div>

      {/* Mental Health & Well-being Centre (MHWBC) */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Mental Health & Well-being Centre (MHWBC)
            </h3>
            <p className="text-sm text-[#6B7280]">Establishment and Infrastructure</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Established
          </span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-3">UGC Requirements Met</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Dedicated digital platform for mental health</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Privacy-protected consultation spaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Documentation and record-keeping system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Contact details visible on website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Anonymized clinical records maintained</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-3">MHWBC Functions</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>• Sensitization & awareness programs</li>
                <li>• Capacity-building for faculty</li>
                <li>• Mental health surveys & screening</li>
                <li>• Immediate support & intervention</li>
                <li>• Counselling & psychotherapy services</li>
                <li>• Crisis management protocols</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mental Health & Well-being Monitoring Committee (MHWBMC) */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Mental Health & Well-being Monitoring Committee (MHWBMC)
            </h3>
            <p className="text-sm text-[#6B7280]">Governance and Oversight</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Constituted
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            <strong>Committee Responsibilities:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: '👁️', label: 'Supervise policy implementation' },
              { icon: '📊', label: 'Collect anonymized data' },
              { icon: '🚨', label: 'Report crisis incidents' },
              { icon: '📝', label: 'Monitor MHWBC functioning' },
              { icon: '⚖️', label: 'Ensure ethical compliance' },
              { icon: '🔗', label: 'Liaison with UGC' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-3 bg-[#F4F7FB] rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-[#6B7280]">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#6B7280] mt-3">
            <strong>Nodal Officer:</strong> Appointed to monitor activities, ensure regulatory compliance,
            and serve as liaison between institution and UGC.
          </p>
        </div>
      </div>

      {/* Staffing Ratios */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              UGC-Mandated Staffing Ratios
            </h3>
            <p className="text-sm text-[#6B7280]">Professional Support Structure</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isRatioCompliant ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isRatioCompliant ? '✓ Compliant' : '⚠ In Progress'}
          </span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MHP Ratio */}
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280]">Mental Health Professionals</span>
                <span className={`text-xs font-medium ${
                  isRatioCompliant ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {isRatioCompliant ? '✓' : '⚠'}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#1E1E2E] mb-1">{data.mhpRatio}</p>
              <p className="text-xs text-[#6B7280]">
                UGC Requirement: 1 MHP per 500 students
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                Current: {data.counsellorsCount} MHPs for {data.totalStudents} students
              </p>
              <p className="text-xs text-[#6B7280]">
                Required: {requiredMHPRatio} MHPs minimum
              </p>
            </div>

            {/* Faculty Mentor Ratio */}
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280]">Faculty Mentors</span>
                <span className="text-xs font-medium text-green-600">✓</span>
              </div>
              <p className="text-2xl font-bold text-[#1E1E2E] mb-1">1:500</p>
              <p className="text-xs text-[#6B7280]">
                UGC Requirement: 1 mentor per 500 students
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                Integrated through platform
              </p>
            </div>

            {/* Peer Supporter Ratio */}
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280]">Peer Supporters</span>
                <span className="text-xs font-medium text-green-600">✓</span>
              </div>
              <p className="text-2xl font-bold text-[#1E1E2E] mb-1">1:100</p>
              <p className="text-xs text-[#6B7280]">
                UGC Requirement: 1 peer supporter per 100 students
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                Peer support program active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 24×7 Helpline & TeleMANAS Integration */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              24×7 Helpline & TeleMANAS Integration
            </h3>
            <p className="text-sm text-[#6B7280]">Crisis Support Infrastructure</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.helplineActive && data.teleManaIntegrated
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {data.helplineActive && data.teleManaIntegrated ? '✓ Active' : '⚠ In Progress'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3 flex items-center gap-2">
              <span>📞</span> Institutional Helpline
            </h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className={data.helplineActive ? 'text-green-600' : 'text-yellow-600'}>
                  {data.helplineActive ? '✓' : '⚠'}
                </span>
                <span>24×7 availability through platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Real-time crisis alerts to counsellors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Automated escalation protocols</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3 flex items-center gap-2">
              <span>🌐</span> TeleMANAS Integration
            </h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className={data.teleManaIntegrated ? 'text-green-600' : 'text-yellow-600'}>
                  {data.teleManaIntegrated ? '✓' : '⚠'}
                </span>
                <span>Linked with national helpline (14416)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Multilingual support available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Free, 24×7 tele-counselling access</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📞 TeleMANAS National Helpline:</strong> 14416 or 1800-891-4416 (Toll-free, 24×7, Multilingual)
          </p>
        </div>
      </div>

      {/* NMHP & DMHP Linkages */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              NMHP & DMHP Linkages
            </h3>
            <p className="text-sm text-[#6B7280]">National & District Mental Health Programme Integration</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Established
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            <strong>Linkages Established:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2">NMHP (National)</h4>
              <ul className="space-y-1 text-sm text-[#6B7280]">
                <li>• Aligned with national mental health objectives</li>
                <li>• Follows NMHP guidelines for student welfare</li>
                <li>• Contributes to national mental health data</li>
              </ul>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2">DMHP (District)</h4>
              <ul className="space-y-1 text-sm text-[#6B7280]">
                <li>• Referral network with district hospitals</li>
                <li>• Access to specialized psychiatric care</li>
                <li>• Emergency mental health services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Management & Suicide Prevention */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Crisis Management & Suicide Prevention
            </h3>
            <p className="text-sm text-[#6B7280]">As per National Suicide Prevention Strategy</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Implemented
          </span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: '🚨', label: 'Real-time crisis detection', status: 'Active' },
              { icon: '⚡', label: 'Immediate counsellor alerts', status: 'Active' },
              { icon: '📱', label: 'Guardian SMS notification', status: 'Active' },
              { icon: '🔒', label: 'Confidential reporting', status: 'Active' },
              { icon: '📋', label: 'Standard response protocols', status: 'Active' },
              { icon: '🏥', label: 'Hospital referral network', status: 'Active' },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-medium text-green-600">{item.status}</span>
                </div>
                <p className="text-xs text-[#6B7280]">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#6B7280] mt-4">
            <strong>Response Time:</strong> Critical cases flagged and escalated within 2 hours.
            Automated protocols ensure no student in crisis goes unnoticed.
          </p>
        </div>
      </div>

      {/* Data Reporting & Accountability */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Data Reporting & Accountability (MANAS-SETU Portal)
            </h3>
            <p className="text-sm text-[#6B7280]">UGC Monitoring and Compliance</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            <strong>Regular Reporting to UGC:</strong>
          </p>
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Anonymized student mental health data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Crisis incidents and management undertaken</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Counselling sessions conducted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Awareness programs organized</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Challenges faced and addressed</span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>📊 MANAS-SETU Portal:</strong> Dedicated UGC portal for monitoring implementation
              of mental health policies across all HEIs in India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
