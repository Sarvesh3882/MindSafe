"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface Student { id: string; department: string | null | undefined }
interface Assessment { user_id: string; risk_level: string }

export function DepartmentBreakdown({ students, assessments }: { students: Student[]; assessments: Assessment[] }) {
  // Build latest risk per student
  const latestByStudent = new Map<string, string>();
  assessments.forEach((a) => {
    latestByStudent.set(a.user_id, a.risk_level);
  });

  // Group by department
  const deptMap = new Map<string, { stable: number; attention: number; critical: number }>();
  students.forEach((s) => {
    const dept = s.department ?? "Unknown";
    const risk = latestByStudent.get(s.id) ?? "stable";
    const existing = deptMap.get(dept) ?? { stable: 0, attention: 0, critical: 0 };
    existing[risk as "stable" | "attention" | "critical"]++;
    deptMap.set(dept, existing);
  });

  const data = Array.from(deptMap.entries()).map(([dept, vals]) => ({
    dept: dept.length > 12 ? dept.slice(0, 12) + "…" : dept,
    Stable: vals.stable,
    "Needs Attention": vals.attention,
    Critical: vals.critical,
  }));

  if (!data.length) {
    return <p className="text-sm text-[#6B7280] py-4">No department data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Stable" fill="#3DBE29" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Needs Attention" fill="#FF9F43" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Critical" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
