import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StudentRegistryTable } from '@/components/admin/student-registry-table';

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Get admin profile
  const { data: adminProfile } = await supabase
    .from('users')
    .select('college_id, role')
    .eq('id', user.id)
    .single();

  if (!adminProfile || adminProfile.role !== 'admin') {
    redirect('/login');
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  // Get total count
  const { count: totalCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('college_id', adminProfile.college_id)
    .eq('role', 'student');

  // Fetch students with their basic info only
  const { data: students } = await supabase
    .from('users')
    .select('id, full_name, email, department, year, created_at')
    .eq('college_id', adminProfile.college_id)
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Format student data - SIMPLE: Just names and basic info
  const studentsData =
    students?.map((student, index) => {
      const globalIndex = offset + index;

      return {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        anonymousId: `STU-${String(globalIndex + 1).padStart(3, '0')}`,
        department: student.department || 'Not specified',
        enrollmentYear: student.year || new Date(student.created_at).getFullYear(),
      };
    }) || [];

  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E2E]">Student Registry</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Anonymized student list with wellness status · Total: {totalCount || 0} students
          </p>
        </div>
      </div>

      {/* Student Table */}
      <StudentRegistryTable
        students={studentsData}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount || 0}
      />
    </div>
  );
}
