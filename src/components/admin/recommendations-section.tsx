interface RecommendationsSectionProps {
  collegeName: string;
  data: {
    totalStudents: number;
    counsellorsCount: number;
    participationRate: number;
    criticalCases: number;
    sessionsCompleted: number;
  };
}

export function RecommendationsSection({ collegeName, data }: RecommendationsSectionProps) {
  const requiredMHPs = Math.ceil(data.totalStudents / 500);
  const isStaffingAdequate = data.counsellorsCount >= requiredMHPs;

  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#10B981] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          Recommendations & Action Plan
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Strategic recommendations for continuous improvement
        </p>
      </div>

      {/* Strengths */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💪</span>
          <h3 className="font-semibold text-[#1E1E2E]">Institutional Strengths</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3">Program Implementation</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Comprehensive digital mental health platform deployed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>100% student enrollment in mental health screening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>AI-powered early detection system operational</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>24×7 crisis response infrastructure active</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Full compliance with UGC and NAAC guidelines</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-[#1E1E2E] mb-3">Outcomes & Impact</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Stigma-free, anonymous access to mental health support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Immediate identification and intervention for at-risk students</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Data-driven decision making for institutional planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Privacy-protected, DPDP Act 2023 compliant system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Replicable model for other institutions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Areas for Improvement */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h3 className="font-semibold text-[#1E1E2E]">Areas for Enhancement</h3>
        </div>
        <div className="space-y-4">
          {!isStaffingAdequate && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👥</span>
                <div className="flex-1">
                  <h4 className="font-medium text-[#1E1E2E] mb-2">Mental Health Professional Staffing</h4>
                  <p className="text-sm text-[#6B7280] mb-3">
                    Current: {data.counsellorsCount} MHPs | Required: {requiredMHPs} MHPs (1:500 ratio)
                  </p>
                  <div className="bg-white p-3 rounded border border-yellow-300">
                    <p className="text-sm font-medium text-[#1E1E2E] mb-2">Recommended Actions:</p>
                    <ul className="space-y-1 text-sm text-[#6B7280]">
                      <li>• Recruit {requiredMHPs - data.counsellorsCount} additional licensed MHPs</li>
                      <li>• Prioritize candidates with youth counselling experience</li>
                      <li>• Consider part-time or visiting counsellor arrangements</li>
                      <li>• Establish partnerships with nearby mental health institutions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.participationRate < 80 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div className="flex-1">
                  <h4 className="font-medium text-[#1E1E2E] mb-2">Student Participation Rate</h4>
                  <p className="text-sm text-[#6B7280] mb-3">
                    Current participation: {data.participationRate}% | Target: 90%+
                  </p>
                  <div className="bg-white p-3 rounded border border-yellow-300">
                    <p className="text-sm font-medium text-[#1E1E2E] mb-2">Recommended Actions:</p>
                    <ul className="space-y-1 text-sm text-[#6B7280]">
                      <li>• Conduct awareness campaigns highlighting platform benefits</li>
                      <li>• Integrate mental health screening into orientation programs</li>
                      <li>• Provide incentives for assessment completion</li>
                      <li>• Address technical barriers (internet access, device availability)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔗</span>
              <div className="flex-1">
                <h4 className="font-medium text-[#1E1E2E] mb-2">External Partnerships & Referral Network</h4>
                <p className="text-sm text-[#6B7280] mb-3">
                  Strengthen linkages with external mental health service providers
                </p>
                <div className="bg-white p-3 rounded border border-blue-300">
                  <p className="text-sm font-medium text-[#1E1E2E] mb-2">Recommended Actions:</p>
                  <ul className="space-y-1 text-sm text-[#6B7280]">
                    <li>• Formalize MoUs with district hospitals and psychiatric facilities</li>
                    <li>• Establish clear referral pathways for severe cases</li>
                    <li>• Integrate with DMHP and NMHP networks</li>
                    <li>• Create emergency contact directory for crisis situations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div className="flex-1">
                <h4 className="font-medium text-[#1E1E2E] mb-2">Faculty & Staff Training</h4>
                <p className="text-sm text-[#6B7280] mb-3">
                  Expand capacity building programs for all stakeholders
                </p>
                <div className="bg-white p-3 rounded border border-purple-300">
                  <p className="text-sm font-medium text-[#1E1E2E] mb-2">Recommended Actions:</p>
                  <ul className="space-y-1 text-sm text-[#6B7280]">
                    <li>• Conduct annual gatekeeper training for all faculty</li>
                    <li>• Implement mental health first aid certification program</li>
                    <li>• Train administrative staff in crisis response protocols</li>
                    <li>• Develop peer supporter training curriculum</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Short-term Action Plan (0-6 months) */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚡</span>
          <h3 className="font-semibold text-[#1E1E2E]">Short-term Action Plan (0-6 months)</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              priority: 'High',
              action: 'Complete MHP recruitment to meet 1:500 ratio',
              timeline: '3 months',
              responsible: 'HR Department & MHWBMC',
            },
            {
              priority: 'High',
              action: 'Conduct campus-wide mental health awareness campaign',
              timeline: '2 months',
              responsible: 'MHWBC & Student Affairs',
            },
            {
              priority: 'Medium',
              action: 'Establish formal referral agreements with 3+ hospitals',
              timeline: '4 months',
              responsible: 'MHWBMC & Administration',
            },
            {
              priority: 'Medium',
              action: 'Train 50+ peer supporters across all departments',
              timeline: '3 months',
              responsible: 'MHWBC & MHPs',
            },
            {
              priority: 'Low',
              action: 'Develop mental health resource library (digital & physical)',
              timeline: '6 months',
              responsible: 'Library & MHWBC',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 bg-[#F4F7FB] rounded-lg">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.priority === 'High'
                    ? 'bg-red-100 text-red-800'
                    : item.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.priority}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1E1E2E]">{item.action}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-[#6B7280]">⏱️ {item.timeline}</span>
                  <span className="text-xs text-[#6B7280]">👤 {item.responsible}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-term Strategic Goals (6-24 months) */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h3 className="font-semibold text-[#1E1E2E]">Long-term Strategic Goals (6-24 months)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              goal: 'Achieve 95%+ student participation in mental health screening',
              icon: '📈',
              timeline: '12 months',
            },
            {
              goal: 'Establish dedicated Mental Health & Well-being Centre with physical space',
              icon: '🏥',
              timeline: '18 months',
            },
            {
              goal: 'Develop research program on student mental health outcomes',
              icon: '🔬',
              timeline: '24 months',
            },
            {
              goal: 'Create alumni mental health support network',
              icon: '🤝',
              timeline: '18 months',
            },
            {
              goal: 'Integrate mental health into curriculum (life skills courses)',
              icon: '📚',
              timeline: '12 months',
            },
            {
              goal: 'Achieve recognition as NAAC Best Practice model institution',
              icon: '🏆',
              timeline: '24 months',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1E1E2E] mb-2">{item.goal}</p>
                  <span className="text-xs text-[#6B7280]">Target: {item.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring & Evaluation Framework */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📊</span>
          <h3 className="font-semibold text-[#1E1E2E]">Monitoring & Evaluation Framework</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2 text-sm">Monthly Reviews</h4>
              <ul className="space-y-1 text-xs text-[#6B7280]">
                <li>• Participation rates</li>
                <li>• Crisis response times</li>
                <li>• Counselling session metrics</li>
                <li>• Platform usage analytics</li>
              </ul>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2 text-sm">Quarterly Assessments</h4>
              <ul className="space-y-1 text-xs text-[#6B7280]">
                <li>• Wellness trend analysis</li>
                <li>• Program effectiveness evaluation</li>
                <li>• Stakeholder feedback collection</li>
                <li>• Resource utilization review</li>
              </ul>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2 text-sm">Annual Reports</h4>
              <ul className="space-y-1 text-xs text-[#6B7280]">
                <li>• Comprehensive NAAC report</li>
                <li>• UGC compliance submission</li>
                <li>• Impact assessment study</li>
                <li>• Strategic plan revision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🌟</span>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1E1E2E] mb-3">Conclusion</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              {collegeName} has successfully established a comprehensive, technology-enabled mental 
              health ecosystem that serves as a model for other higher educational institutions. The 
              implementation of the MindSafe India platform demonstrates the institution's commitment 
              to student well-being and compliance with national guidelines.
            </p>
            <p className="text-sm text-[#6B7280] mb-4">
              The proactive approach to mental health—combining AI-powered early detection, professional 
              counselling support, crisis intervention, and data-driven decision making—positions the 
              institution as a leader in student welfare. With {data.totalStudents} students enrolled, 
              {data.sessionsCompleted} counselling sessions completed, and {data.criticalCases} critical 
              cases successfully identified and addressed, the program has demonstrated measurable impact.
            </p>
            <p className="text-sm text-[#6B7280]">
              By implementing the recommended actions and maintaining continuous improvement through 
              regular monitoring and evaluation, {collegeName} will further strengthen its mental health 
              infrastructure and achieve excellence in NAAC accreditation while fulfilling its primary 
              mission: ensuring the holistic well-being and success of every student.
            </p>
          </div>
        </div>
      </div>

      {/* Approval & Signatures */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <h3 className="font-semibold text-[#1E1E2E] mb-6">Report Approval</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-16 border-b-2 border-[#1E1E2E] mb-2"></div>
            <p className="text-sm font-medium text-[#1E1E2E]">Nodal Officer, MHWBMC</p>
            <p className="text-xs text-[#6B7280]">Mental Health & Well-being</p>
          </div>
          <div className="text-center">
            <div className="h-16 border-b-2 border-[#1E1E2E] mb-2"></div>
            <p className="text-sm font-medium text-[#1E1E2E]">Head, MHWBC</p>
            <p className="text-xs text-[#6B7280]">Mental Health & Well-being Centre</p>
          </div>
          <div className="text-center">
            <div className="h-16 border-b-2 border-[#1E1E2E] mb-2"></div>
            <p className="text-sm font-medium text-[#1E1E2E]">Principal/Director</p>
            <p className="text-xs text-[#6B7280]">{collegeName}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-[#6B7280]">
            Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
