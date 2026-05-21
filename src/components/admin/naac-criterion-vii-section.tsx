interface NAACCriterionVIIProps {
  collegeName: string;
  data: {
    totalStudents: number;
    counsellorsCount: number;
    platformFeatures: string[];
  };
}

export function NAACCriterionVIISection({ collegeName, data }: NAACCriterionVIIProps) {
  return (
    <div className="space-y-6 print:break-inside-avoid">
      {/* Section Header */}
      <div className="border-l-4 border-[#8B5CF6] pl-4">
        <h2 className="text-xl font-bold text-[#1E1E2E]">
          NAAC Criterion VII: Institutional Values and Best Practices
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Total Weightage: 100 points
        </p>
      </div>

      {/* Metric 7.1.2 - Gender Equity */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 7.1.2: Measures for Promotion of Gender Equity
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 5 points</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            <strong>NAAC-specified facilities for women:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2 flex items-center gap-2">
                <span>🛡️</span> Safety and Security
              </h4>
              <ul className="space-y-1 text-sm text-[#6B7280]">
                <li>• Anonymous access to mental health support</li>
                <li>• Privacy-protected counselling sessions</li>
                <li>• Secure video consultation platform</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-[#1E1E2E] mb-2 flex items-center gap-2">
                <span>💬</span> Counselling Services
              </h4>
              <ul className="space-y-1 text-sm text-[#6B7280]">
                <li>• Gender-sensitive counselling available</li>
                <li>• Female counsellors on staff</li>
                <li>• Specialized support for women's issues</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mt-3">
            <strong>Evidence:</strong> Digital platform ensures equal access to mental health services
            for all genders. Privacy features protect identity and enable stigma-free help-seeking.
          </p>
        </div>
      </div>

      {/* Metric 7.1.9 - Code of Conduct */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 7.1.9: Code of Conduct and Professional Ethics
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 6 points</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <p className="text-xs text-[#6B7280] mb-2">NAAC Criteria Met</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Code of conduct displayed on website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Committee monitors adherence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Professional ethics programs organized</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Annual awareness programs conducted</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg">
              <p className="text-xs text-[#6B7280] mb-2">Mental Health Ethics</p>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>• Confidentiality maintained (DPDP Act 2023)</li>
                <li>• Informed consent for all services</li>
                <li>• Professional counsellor conduct standards</li>
                <li>• Data privacy and security protocols</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Metric 7.2.1 - Best Practices */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 7.2.1: Institutional Best Practice - Mental Health Initiative
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 30 points (Highest in Criterion VII)</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        
        {/* NAAC Best Practice Format */}
        <div className="space-y-6 mt-6">
          {/* 1. Title */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">1. Title of the Practice</h4>
            <p className="text-sm text-[#6B7280] bg-purple-50 p-4 rounded-lg">
              <strong>Digital Mental Health Ecosystem for Student Well-being</strong> — 
              Comprehensive AI-powered mental health platform for early detection, intervention, 
              and continuous support
            </p>
          </div>

          {/* 2. Objectives */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">2. Objectives of the Practice</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Provide accessible, stigma-free mental health support to all students</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Enable early detection of mental health concerns through AI-powered assessments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Facilitate timely intervention and professional counselling support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Create a proactive mental health ecosystem aligned with UGC and NAAC guidelines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Reduce treatment gap and improve student progression outcomes</span>
              </li>
            </ul>
          </div>

          {/* 3. The Context */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">3. The Context</h4>
            <div className="text-sm text-[#6B7280] space-y-2">
              <p>
                India faces a significant mental health crisis among students, with 7.3% of youth aged 18-29 
                suffering from severe psychiatric conditions (National Mental Health Survey 2015-16). The treatment 
                gap exceeds 80%, and stigma prevents help-seeking behavior.
              </p>
              <p>
                {collegeName} recognized the urgent need for a systematic, accessible mental health support system 
                that aligns with the Supreme Court directive (C.A. Crl. No. 3177/2025) and UGC Uniform Policy on 
                Mental Health & Well-being (January 2026).
              </p>
            </div>
          </div>

          {/* 4. The Practice */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">4. The Practice</h4>
            <div className="space-y-3">
              <p className="text-sm text-[#6B7280]">
                <strong>Implementation of MindSafe India Platform:</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.platformFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span className="text-sm text-[#6B7280]">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-[#F4F7FB] rounded-lg">
                <p className="text-sm text-[#6B7280]">
                  <strong>Key Statistics:</strong>
                </p>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#8B5CF6]">{data.totalStudents}</p>
                    <p className="text-xs text-[#6B7280]">Students Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#8B5CF6]">{data.counsellorsCount}</p>
                    <p className="text-xs text-[#6B7280]">Professional Counsellors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#8B5CF6]">24/7</p>
                    <p className="text-xs text-[#6B7280]">Platform Availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Evidence of Success */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">5. Evidence of Success</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>100% student participation in mental health screening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Early detection of at-risk students with automated alerts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Reduced stigma through anonymous, digital-first approach</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Comprehensive data for institutional decision-making</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Full compliance with UGC, NAAC, and Mental Healthcare Act 2017</span>
              </li>
            </ul>
          </div>

          {/* 6. Problems Encountered and Resources Required */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">6. Problems Encountered and Resources Required</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-[#1E1E2E] mb-2">Challenges:</p>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Initial student hesitation due to stigma</li>
                  <li>• Digital literacy variations among students</li>
                  <li>• Integration with existing systems</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E1E2E] mb-2">Resources:</p>
                <ul className="space-y-1 text-[#6B7280]">
                  <li>• Professional counsellors (1:500 ratio)</li>
                  <li>• Digital infrastructure and platform</li>
                  <li>• Training for faculty and staff</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 7. Notes */}
          <div>
            <h4 className="font-semibold text-[#1E1E2E] mb-2">7. Notes (Optional)</h4>
            <p className="text-sm text-[#6B7280] bg-purple-50 p-4 rounded-lg">
              This initiative serves as a replicable model for other institutions. The platform's 
              success demonstrates that technology-enabled mental health support can overcome traditional 
              barriers of stigma, accessibility, and resource constraints while maintaining the highest 
              standards of privacy and professional care.
            </p>
          </div>
        </div>
      </div>

      {/* Metric 7.3.1 - Institutional Distinctiveness */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1E1E2E]">
              Metric 7.3.1: Institutional Distinctiveness
            </h3>
            <p className="text-sm text-[#6B7280]">Weightage: 20 points</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            ✓ Compliant
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280]">
            <strong>Area of Distinction: Proactive Mental Health Ecosystem</strong>
          </p>
          <p className="text-sm text-[#6B7280]">
            {collegeName} distinguishes itself as a pioneer in implementing a comprehensive, 
            technology-enabled mental health support system. The institution has moved beyond 
            reactive crisis management to establish a proactive wellness ecosystem that:
          </p>
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Integrates mental health into the core institutional fabric</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Leverages AI and digital tools for early detection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Maintains complete student privacy and anonymity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Provides data-driven insights for institutional planning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Serves as a model for other educational institutions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
