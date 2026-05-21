import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CounsellorPrescriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login/counsellor");
  }

  // Get counsellor's college
  const { data: profile } = await supabase
    .from("users")
    .select("college_id")
    .eq("id", user.id)
    .single();

  // Get all students in the same college
  const { data: students } = await supabase
    .from("users")
    .select("id, full_name, email, department, year")
    .eq("college_id", profile?.college_id)
    .eq("role", "student")
    .order("full_name", { ascending: true });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3DBE29] to-[#32A822] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Student Recommendations</h1>
            <p className="text-white/90 text-sm">
              Select a student to view and manage their wellness recommendations
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="font-semibold text-sm">{students?.length || 0} Students</span>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Wellness Support Notice</p>
          <p>
            Provide wellness guidance and support only. Do not prescribe medications or provide medical diagnoses. 
            For students requiring professional mental health services, use the "Professional Referral" category.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#3DBE29] to-[#32A822] rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Recommendations</h3>
          </div>
          <p className="text-sm text-white/90">Create and manage wellness guidance for students</p>
        </div>

        <div className="bg-gradient-to-br from-[#00C9A7] to-[#00B396] rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Messaging</h3>
          </div>
          <p className="text-sm text-white/90">Communicate with students about their wellness journey</p>
        </div>

        <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Meeting Links</h3>
          </div>
          <p className="text-sm text-white/90">Generate video meeting links for sessions</p>
        </div>
      </div>

      {/* Students List */}
      <Card className="border-[#E2E8F0] shadow-sm">
        <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFB] to-white">
          <CardTitle className="text-[#1E293B]">Select a Student</CardTitle>
          <p className="text-sm text-[#64748B] mt-1">Click on a student to manage their wellness recommendations</p>
        </CardHeader>
        <CardContent className="p-0">
          {!students || students.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} className="w-12 h-12">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-[#64748B] text-sm font-medium">No students found</p>
              <p className="text-[#94A3B8] text-xs mt-1">Students will appear here once assigned to your college</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {students.map((student) => (
                <Link
                  key={student.id}
                  href={`/counsellor/prescriptions/${student.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F0FDF4] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3DBE29] to-[#32A822] flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {student.full_name?.[0]?.toUpperCase() ?? "S"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1E293B] group-hover:text-[#3DBE29] transition-colors">
                        {student.full_name}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {student.email} · {student.department ?? "—"} · Year {student.year ?? "—"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[#F3F4F6] text-[#64748B] px-3 py-1.5 rounded-full font-medium group-hover:bg-[#3DBE29] group-hover:text-white transition-colors">
                      View Recommendations
                    </span>
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#64748B" 
                      strokeWidth={2} 
                      className="w-4 h-4 group-hover:stroke-[#3DBE29] transition-colors"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
