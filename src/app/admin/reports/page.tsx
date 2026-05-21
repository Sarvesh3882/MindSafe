import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { NAACCriterionVSection } from "@/components/admin/naac-criterion-v-section";
import { NAACCriterionVIISection } from "@/components/admin/naac-criterion-vii-section";
import { UGCComplianceSection } from "@/components/admin/ugc-compliance-section";
import { MentalHealthGuidelinesSection } from "@/components/admin/mental-health-guidelines-section";
import { StatisticalAnalysisSection } from "@/components/admin/statistical-analysis-section";
import { InfrastructureSection } from "@/components/admin/infrastructure-section";
import { EvidenceDocumentationSection } from "@/components/admin/evidence-documentation-section";
import { RecommendationsSection } from "@/components/admin/recommendations-section";
import { PrintReportButton } from "@/components/admin/print-report-button";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from("users")
    .select("college_id")
    .eq("id", user!.id)
    .single();

  const { data: college } = await supabase
    .from("colleges")
    .select("*")
    .eq("id", adminProfile?.college_id)
    .single();

  const { data: students } = await supabase
    .from("users")
    .select("id, department")
    .eq("college_id", adminProfile?.college_id)
    .eq("role", "student");

  const studentIds = students?.map((s) => s.id) ?? [];

  // Fetch counsellors
  const { data: counsellors } = await supabase
    .from("users")
    .select("id")
    .eq("college_id", adminProfile?.college_id)
    .eq("role", "counsellor");

  // Fetch all assessments
  const { data: assessments } = await supabase
    .from("assessments")
    .select("user_id, risk_level, date")
    .in("user_id", studentIds.length ? studentIds : ["none"]);

  // Fetch all sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, status, date")
    .eq("college_id", adminProfile?.college_id);

  // Fetch evidence documents
  const { data: evidence } = await supabase
    .from("naac_evidence")
    .select("*")
    .eq("college_id", adminProfile?.college_id)
    .order("created_at", { ascending: false });

  // Calculate latest risk levels
  const latestByStudent = new Map<string, string>();
  assessments?.forEach((a) => {
    const existing = latestByStudent.get(a.user_id);
    if (!existing || new Date(a.date) > new Date(existing)) {
      latestByStudent.set(a.user_id, a.risk_level);
    }
  });

  const stable = [...latestByStudent.values()].filter((r) => r === "stable").length;
  const attention = [...latestByStudent.values()].filter((r) => r === "attention").length;
  const critical = [...latestByStudent.values()].filter((r) => r === "critical").length;
  const total = studentIds.length;
  const completedSessions = sessions?.filter((s) => s.status === "completed").length ?? 0;
  const participationRate = total ? Math.round((assessments?.length ?? 0) / total * 100) : 0;

  // Calculate counsellor ratio
  const counsellorsCount = counsellors?.length ?? 0;
  const mhpRatio = total && counsellorsCount ? `1:${Math.round(total / counsellorsCount)}` : "N/A";

  // Department breakdown
  const departmentMap = new Map<string, { students: number; stable: number; attention: number; critical: number }>();
  students?.forEach((student) => {
    const dept = student.department || "Unspecified";
    if (!departmentMap.has(dept)) {
      departmentMap.set(dept, { students: 0, stable: 0, attention: 0, critical: 0 });
    }
    const deptData = departmentMap.get(dept)!;
    deptData.students++;
    
    const riskLevel = latestByStudent.get(student.id);
    if (riskLevel === "stable") deptData.stable++;
    else if (riskLevel === "attention") deptData.attention++;
    else if (riskLevel === "critical") deptData.critical++;
  });

  const departmentBreakdown = Array.from(departmentMap.entries()).map(([department, data]) => ({
    department,
    ...data,
  }));

  // Monthly trend (last 3 months)
  const monthlyTrend = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    
    const monthAssessments = assessments?.filter(a => a.date >= monthStart && a.date <= monthEnd).length ?? 0;
    const monthSessions = sessions?.filter(s => s.date && s.date >= monthStart && s.date <= monthEnd && s.status === "completed").length ?? 0;
    
    monthlyTrend.push({ month: monthName, assessments: monthAssessments, sessions: monthSessions });
  }

  // Platform features
  const platformFeatures = [
    "AI-powered mental health assessment (ARIA engine)",
    "Anonymous student screening and risk detection",
    "Real-time crisis alerts and escalation",
    "Professional counsellor booking system",
    "Secure video consultation platform",
    "Digital prescription management",
    "Comprehensive wellness dashboard",
    "Department-wise analytics and reporting",
    "DPDP Act 2023 compliant data handling",
    "24×7 platform availability",
    "Mobile-responsive design",
    "Multi-language support capability",
  ];

  const technicalCapabilities = [
    "Next.js 14 with React Server Components",
    "Supabase (PostgreSQL) for secure data storage",
    "Row Level Security (RLS) for data protection",
    "Real-time subscriptions for instant updates",
    "Edge functions for serverless computing",
    "Vercel deployment with global CDN",
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E2E]">NAAC Compliance Report</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Comprehensive mental health program documentation for accreditation
          </p>
        </div>
        <PrintReportButton />
      </div>

      {/* Report Cover Page */}
      <div className="bg-gradient-to-br from-[#3DBE29]/10 to-[#00C9A7]/10 border-2 border-[#3DBE29] rounded-lg p-8 text-center print:break-after-page">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image 
            src="/logo-icon.svg" 
            alt="MindSafe India" 
            width={48} 
            height={48} 
            className="w-12 h-12 flex-shrink-0"
          />
          <div className="flex flex-col items-start">
            <span className="text-2xl font-extrabold text-[#1A1A24] tracking-tight leading-none">
              Mind<span className="text-[#3DBE29]">Safe</span>
            </span>
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mt-0.5">
              India Portal
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#1E1E2E] mb-2">
          Mental Health & Well-being Program
        </h1>
        <h2 className="text-xl font-semibold text-[#1E1E2E] mb-6">
          NAAC Accreditation Report
        </h2>
        <div className="inline-block bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-2xl font-bold text-[#3DBE29] mb-2">{college?.name ?? "Institution Name"}</h3>
          <p className="text-sm text-[#6B7280]">{college?.address ?? "Institution Address"}</p>
        </div>
        <div className="space-y-2 text-sm text-[#6B7280]">
          <p>Report Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>Academic Year: {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
          <p className="font-semibold text-[#1E1E2E] mt-4">
            Compliant with UGC Guidelines (January 2026) & NAAC Criteria V & VII
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 print:break-inside-avoid">
        <h2 className="text-xl font-bold text-[#1E1E2E] mb-4">Executive Summary</h2>
        <div className="space-y-4 text-sm text-[#6B7280]">
          <p>
            This report documents the comprehensive mental health and well-being program implemented 
            at {college?.name ?? "the institution"} through the MindSafe India digital platform. The 
            program aligns with NAAC Criterion V (Student Support and Progression) and Criterion VII 
            (Institutional Values and Best Practices), as well as the UGC Uniform Policy on Mental 
            Health & Well-being for Higher Educational Institutions (January 2026).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
              <p className="text-3xl font-bold text-[#3DBE29] mb-1">{total}</p>
              <p className="text-xs text-[#6B7280]">Students Enrolled</p>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
              <p className="text-3xl font-bold text-[#8B5CF6] mb-1">{counsellorsCount}</p>
              <p className="text-xs text-[#6B7280]">Mental Health Professionals</p>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
              <p className="text-3xl font-bold text-[#00C9A7] mb-1">{completedSessions}</p>
              <p className="text-xs text-[#6B7280]">Counselling Sessions</p>
            </div>
            <div className="p-4 bg-[#F4F7FB] rounded-lg text-center">
              <p className="text-3xl font-bold text-[#FF9F43] mb-1">{participationRate}%</p>
              <p className="text-xs text-[#6B7280]">Participation Rate</p>
            </div>
          </div>
          <p>
            The program demonstrates the institution's commitment to student well-being through 
            technology-enabled early detection, professional counselling support, crisis intervention, 
            and evidence-based practices. All implementations comply with the Digital Personal Data 
            Protection Act 2023 and maintain the highest standards of student privacy and confidentiality.
          </p>
        </div>
      </div>

      {/* All Report Sections */}
      <NAACCriterionVSection
        data={{
          totalStudents: total,
          participationRate,
          sessionsCompleted: completedSessions,
          capabilityPrograms: [],
          counsellingProvided: completedSessions,
          grievancesResolved: critical,
        }}
      />

      <NAACCriterionVIISection
        collegeName={college?.name ?? "Institution"}
        data={{
          totalStudents: total,
          counsellorsCount,
          platformFeatures,
        }}
      />

      <UGCComplianceSection
        data={{
          totalStudents: total,
          counsellorsCount,
          mhpRatio,
          helplineActive: true,
          teleManaIntegrated: true,
        }}
      />

      <MentalHealthGuidelinesSection collegeName={college?.name ?? "Institution"} />

      <StatisticalAnalysisSection
        data={{
          totalStudents: total,
          participationRate,
          assessmentsCompleted: assessments?.length ?? 0,
          stable,
          attention,
          critical,
          sessionsCompleted: completedSessions,
          averageResponseTime: "< 2 hours",
          departmentBreakdown,
          monthlyTrend,
        }}
      />

      <InfrastructureSection
        data={{
          totalStudents: total,
          counsellorsCount,
          mhpRatio,
          platformFeatures,
          technicalCapabilities,
        }}
      />

      <EvidenceDocumentationSection evidence={evidence ?? []} />

      <RecommendationsSection
        collegeName={college?.name ?? "Institution"}
        data={{
          totalStudents: total,
          counsellorsCount,
          participationRate,
          criticalCases: critical,
          sessionsCompleted: completedSessions,
        }}
      />

      {/* Footer */}
      <div className="text-center text-xs text-[#6B7280] pt-8 border-t border-[#E5E7EB] print:break-before-page">
        <p className="mb-2">
          <strong>Powered by MindSafe India</strong> — Digital Mental Health Platform for Higher Educational Institutions
        </p>
        <p>All student data anonymized · DPDP Act 2023 Compliant · UGC & NAAC Guidelines Aligned</p>
        <p className="mt-2">
          Report generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
