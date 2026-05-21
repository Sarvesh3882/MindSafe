interface MentalHealthGuidelinesSectionProps {
  collegeName: string;
}

export function MentalHealthGuidelinesSection({ collegeName }: MentalHealthGuidelinesSectionProps) {
  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#00C9A7] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          Alignment with National Mental Health Guidelines
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Compliance with Government of India Mental Health Frameworks
        </p>
      </div>

      {/* National Mental Health Programme (NMHP) */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              National Mental Health Programme (NMHP)
            </h3>
            <p className="text-sm text-[#6B7280]">Ministry of Health and Family Welfare</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Aligned
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            {collegeName} aligns with NMHP objectives to ensure availability and accessibility of 
            minimum mental health care for all, particularly vulnerable sections of the population.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-teal-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2">NMHP Objectives Met</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Early detection and treatment of mental illness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Application of mental health knowledge in general healthcare</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Community participation in mental health service development</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2">DMHP Integration</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Linkage with District Mental Health Programme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Referral network with district hospitals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Access to specialized psychiatric care</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* WHO Mental Health Action Plan 2013-2030 */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              WHO Mental Health Action Plan 2013-2030
            </h3>
            <p className="text-sm text-[#6B7280]">Sustainable Development Goal 3 (SDG 3)</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Aligned
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            <strong>SDG 3 Target 3.4:</strong> By 2030, reduce by one-third premature mortality from 
            non-communicable diseases through prevention and treatment, and promote mental health and well-being.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { icon: '🏛️', label: 'Effective leadership and governance', status: 'Active' },
              { icon: '🏥', label: 'Comprehensive services in community settings', status: 'Active' },
              { icon: '🔬', label: 'Promotion and prevention strategies', status: 'Active' },
              { icon: '📊', label: 'Information systems and research', status: 'Active' },
            ].map((objective) => (
              <div key={objective.label} className="p-3 bg-[#F4F7FB] rounded-lg text-center">
                <div className="text-2xl mb-2">{objective.icon}</div>
                <p className="text-xs text-[#6B7280] mb-1">{objective.label}</p>
                <span className="text-xs font-medium text-green-600">{objective.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mental Healthcare Act 2017 */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Mental Healthcare Act 2017
            </h3>
            <p className="text-sm text-[#6B7280]">Rights-based approach to mental healthcare</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            The platform ensures compliance with the Mental Healthcare Act 2017, which provides for 
            mental healthcare and services for persons with mental illness and protects, promotes, 
            and fulfills the rights of such persons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-3">Rights Protected</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Right to access mental healthcare</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Right to confidentiality and privacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Right to community living</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Right to protection from cruel treatment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Right to equality and non-discrimination</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-3">Implementation</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Informed consent for all services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Advance directive provisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Nominated representative system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Confidential record maintenance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Grievance redressal mechanism</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* National Education Policy (NEP) 2020 */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              National Education Policy (NEP) 2020
            </h3>
            <p className="text-sm text-[#6B7280]">Ministry of Education, Government of India</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Aligned
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            <strong>NEP 2020 Mandate:</strong> Learning environments must be conducive to students' 
            flourishing, providing access to reliable, safe, and stigma-free counselling services by 
            licensed mental health professionals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {[
              { icon: '🎓', label: 'Holistic development of learners', color: 'bg-purple-50' },
              { icon: '🧠', label: 'Social-emotional learning', color: 'bg-purple-50' },
              { icon: '💪', label: 'Life skills and resilience', color: 'bg-purple-50' },
              { icon: '🤝', label: 'Counselling and guidance', color: 'bg-purple-50' },
              { icon: '🌱', label: 'Well-being and mental health', color: 'bg-purple-50' },
              { icon: '🏫', label: 'Safe learning environment', color: 'bg-purple-50' },
            ].map((item) => (
              <div key={item.label} className={`p-3 ${item.color} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs text-[#6B7280]">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UMMEED Guidelines */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              UMMEED Guidelines (2023)
            </h3>
            <p className="text-sm text-[#6B7280]">
              Understand, Motivate, Manage, Empathise, Empower, Develop
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Implemented
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Ministry of Education guidelines for mental health in educational institutions, 
            providing a comprehensive framework for student well-being.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { letter: 'U', word: 'Understand', desc: 'Student mental health needs' },
              { letter: 'M', word: 'Motivate', desc: 'Positive help-seeking behavior' },
              { letter: 'M', word: 'Manage', desc: 'Mental health concerns effectively' },
              { letter: 'E', word: 'Empathise', desc: 'With students in distress' },
              { letter: 'E', word: 'Empower', desc: 'Students with coping skills' },
              { letter: 'D', word: 'Develop', desc: 'Resilience and well-being' },
            ].map((item) => (
              <div key={item.word} className="p-3 bg-[#F4F7FB] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-[#00C9A7]">{item.letter}</span>
                  <span className="text-sm font-semibold text-[#1E1E2E]">{item.word}</span>
                </div>
                <p className="text-xs text-[#6B7280]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MANODARPAN Initiative */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              MANODARPAN Initiative
            </h3>
            <p className="text-sm text-[#6B7280]">Ministry of Education Psychosocial Support Program</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Integrated
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            MANODARPAN provides psychological support to students, families, and teachers through 
            a national toll-free helpline, directory of mental health professionals, and regular 
            interactive sessions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2">MANODARPAN Components</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">•</span>
                  <span>National toll-free helpline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">•</span>
                  <span>Directory of mental health professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">•</span>
                  <span>Sahyog (live interactive sessions)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">•</span>
                  <span>Paricharcha (counselling sessions)</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2">Integration with Platform</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>MANODARPAN helpline linked on platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Awareness programs conducted regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Faculty trained in MANODARPAN protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Students informed about available resources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* National Suicide Prevention Strategy */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              National Suicide Prevention Strategy (2022)
            </h3>
            <p className="text-sm text-[#6B7280]">Ministry of Health and Family Welfare</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            <strong>Goal:</strong> Reduce suicide mortality by 10% by 2030 through comprehensive 
            prevention strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: '🚨', label: 'Early identification of at-risk individuals', status: 'Active' },
              { icon: '⚡', label: 'Immediate crisis intervention', status: 'Active' },
              { icon: '🔒', label: 'Means restriction and safety planning', status: 'Active' },
              { icon: '📱', label: '24×7 helpline availability', status: 'Active' },
              { icon: '🏥', label: 'Referral to specialized care', status: 'Active' },
              { icon: '👨‍👩‍👧', label: 'Family involvement and support', status: 'Active' },
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
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>🚨 Crisis Response:</strong> Platform implements automated crisis detection, 
              immediate counsellor alerts, and guardian notification within 2 hours for all critical cases.
            </p>
          </div>
        </div>
      </div>

      {/* Supreme Court Directive */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Supreme Court Directive (2025)
            </h3>
            <p className="text-sm text-[#6B7280]">
              Sukdeb Saha v. State of Andhra Pradesh, C.A. (Crl.) No. 3177/2025
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            The Supreme Court of India (Judgment dated 25.07.2025) directed the Government of India 
            to frame a <strong>Uniform Mental Health Policy for Higher Educational Institutions</strong> 
            based on UMMEED Guidelines, MANODARPAN Initiative, and National Suicide Prevention Strategy.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>⚖️ Legal Mandate:</strong> {collegeName} implements this platform in direct 
              compliance with the Supreme Court directive and UGC Uniform Policy (January 2026), 
              ensuring evidence-based practices translate into measurable outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
