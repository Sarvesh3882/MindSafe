'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Student {
  id: string;
  fullName: string;
  email: string;
  anonymousId: string;
  department: string;
  enrollmentYear: number;
}

interface StudentRegistryTableProps {
  students: Student[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function StudentRegistryTable({
  students,
  currentPage,
  totalPages,
  totalCount,
}: StudentRegistryTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Client-side filtering - Simple search
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.anonymousId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Email', 'Student ID', 'Department', 'Enrollment Year'];
    const rows = filteredStudents.map((s) => [
      s.fullName,
      s.email,
      s.anonymousId,
      s.department,
      s.enrollmentYear.toString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-registry-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBE29]"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#3DBE29] text-white rounded-lg text-sm font-medium hover:bg-[#32A822] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F4F7FB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#6B7280]">
                      No students found matching your search
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#F4F7FB] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1E1E2E]">
                        {student.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {student.enrollmentYear}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            Showing {filteredStudents.length} of {totalCount} students
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/students?page=${currentPage - 1}`}
              className={`px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'text-[#9CA3AF] cursor-not-allowed'
                  : 'text-[#1E1E2E] hover:bg-[#F4F7FB]'
              }`}
              onClick={(e) => currentPage === 1 && e.preventDefault()}
            >
              Previous
            </Link>
            <span className="text-sm text-[#6B7280]">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={`/admin/students?page=${currentPage + 1}`}
              className={`px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'text-[#9CA3AF] cursor-not-allowed'
                  : 'text-[#1E1E2E] hover:bg-[#F4F7FB]'
              }`}
              onClick={(e) => currentPage === totalPages && e.preventDefault()}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
