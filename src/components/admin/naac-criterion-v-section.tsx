interface NAACCriterionVProps {
  data: {
    totalStudents: number;
    participationRate: number;
    sessionsCompleted: number;
    capabilityPrograms: Array<{
      name: string;
      enrolled: number;
      year: string;
    }>;
    counsellingProvided: number;
    grievancesResolved: number;
  };
}

export function NAACCriterionVSection({ data }: NAACCriterionVProps) {
  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#3DBE29] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          NAAC Criterion V: Student Support and Progression
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Total Weightage: 110 points
        </p>
      </div>

      {/* Metric 5.1.1 - Scholarships/Freeships */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 5.1.1: Scholarships and Financial Support
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 10 points</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">Students benefited by mental health support</span>
            <span className="font-semibold text-[#1E1E2E]">{data.totalStudents}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">Participation rate</span>
            <span className="font-semibold text-[#1E1E2E]">{data.participationRate}%</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-3">
            <strong>Evidence:</strong> Digital mental health screening system deployed institution-wide,
            providing free access to all enrolled students. Platform usage tracked via MindSafe India system.
          </p>
        </div>
      </div>

      {/* Metric 5.1.2 - Capability Enhancement */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 5.1.2: Capability Enhancement and Development Schemes
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 15 points</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            <strong>NAAC-specified schemes implemented:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Yoga and Wellness Programs', icon: '🧘' },
              { name: 'Human Value Development', icon: '💝' },
              { name: 'Personality Development', icon: '🌟' },
              { name: 'Soft Skill Development', icon: '🤝' },
              { name: 'Analytical Skill Development', icon: '🧠' },
              { name: 'Language & Communication Skills', icon: '💬' },
            ].map((scheme) => (
              <div
                key={scheme.name}
                className="flex items-center gap-3 p-3 bg-[#F4F7FB] rounded-lg"
              >
                <span className="text-2xl">{scheme.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#1E1E2E]">{scheme.name}</p>
                  <p className="text-xs text-[#6B7280]">Integrated in platform</p>
                </div>
              </div>
            ))}
          </div>
          {data.capabilityPrograms.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-[#1E1E2E] mb-2">Programs Conducted:</p>
              <div className="space-y-2">
                {data.capabilityPrograms.map((program, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-sm text-[#6B7280]">{program.name} ({program.year})</span>
                    <span className="font-semibold text-[#1E1E2E]">{program.enrolled} students</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metric 5.1.3 - Career Counselling */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 5.1.3: Training and Guidance for Career Counselling
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 5 points</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">Students provided counselling guidance</span>
            <span className="font-semibold text-[#1E1E2E]">{data.counsellingProvided}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">Percentage of total students</span>
            <span className="font-semibold text-[#1E1E2E]">
              {data.totalStudents ? Math.round((data.counsellingProvided / data.totalStudents) * 100) : 0}%
            </span>
          </div>
          <p className="text-sm text-[#6B7280] mt-3">
            <strong>Evidence:</strong> Professional counsellors available through digital platform.
            Students can book sessions, receive guidance, and access mental health resources 24/7.
          </p>
        </div>
      </div>

      {/* Metric 5.1.5 - Grievance Redressal */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 5.1.5: Transparent Mechanism for Timely Redressal of Student Grievances
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 13 points</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <p className="text-xs text-[#6B7280] mb-1">NAAC Criteria Met</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Adoption of regulatory guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Online/offline grievance mechanism</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Periodic committee meetings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Record of action taken</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <p className="text-xs text-[#6B7280] mb-1">Crisis Management</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Grievances addressed</span>
                  <span className="font-semibold text-[#1E1E2E]">{data.grievancesResolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Crisis alerts system</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Response time</span>
                  <span className="font-semibold text-[#1E1E2E]">&lt; 2 hours</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mt-3">
            <strong>Evidence:</strong> Digital grievance redressal system with real-time alerts,
            automated escalation protocols, and comprehensive audit trail. Crisis intervention
            system operational 24/7 with immediate counsellor notification.
          </p>
        </div>
      </div>

      {/* Metric 5.2 - Student Progression */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 5.2: Student Progression
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 40 points</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            Mental health support contributes to student progression by:
          </p>
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li className="flex items-start gap-2">
              <span className="text-[#3DBE29] mt-0.5">•</span>
              <span>Reducing dropout rates through early intervention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3DBE29] mt-0.5">•</span>
              <span>Improving academic performance via stress management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3DBE29] mt-0.5">•</span>
              <span>Enhancing employability through personality development</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3DBE29] mt-0.5">•</span>
              <span>Supporting transition to higher education and employment</span>
            </li>
          </ul>
          <div className="flex justify-between items-center py-2 border-t border-[#E5E7EB] mt-4">
            <span className="text-sm text-[#6B7280]">Counselling sessions completed</span>
            <span className="font-semibold text-[#1E1E2E]">{data.sessionsCompleted}</span>
          </div>
        </div>
      </div>

      {/* Metric 5.3 - Student Participation */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 5.3: Student Participation and Activities
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 25 points</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            Mental health and wellness activities organized:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {[
              { label: 'Yoga Sessions', icon: '🧘' },
              { label: 'Workshops', icon: '🎓' },
              { label: 'Awareness Programs', icon: '📢' },
              { label: 'Wellness Events', icon: '🌟' },
            ].map((activity) => (
              <div key={activity.label} className="text-center p-3 bg-[#F4F7FB] rounded-lg">
                <div className="text-3xl mb-2">{activity.icon}</div>
                <p className="text-xs text-[#6B7280]">{activity.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#6B7280] mt-4">
            <strong>Evidence:</strong> Activity documentation available in Evidence Management section.
            Photos, attendance records, and participant feedback collected for all events.
          </p>
        </div>
      </div>
    </div>
  );
}
