"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Student { id: string; full_name: string }

export function PrescribeResourceButton({
  resourceId,
  students,
}: {
  resourceId: string;
  students: Student[];
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  async function prescribe(studentId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from("resource_prescriptions").insert({
        student_id: studentId,
        counsellor_id: user.id,
        resource_id: resourceId
      });
    }

    setSent(true);
    setOpen(false);
    setTimeout(() => setSent(false), 2000);
  }

  if (sent) {
    return <p className="text-xs text-[#3DBE29] font-semibold">✓ Sent!</p>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs border border-[#3DBE29] text-[#3DBE29] px-3 py-1.5 rounded-lg hover:bg-[#F0FFF0] transition-colors font-semibold w-full"
      >
        Prescribe to student
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
          {students.length === 0 ? (
            <p className="p-3 text-xs text-[#6B7280]">No students found.</p>
          ) : (
            students.map((s) => (
              <button
                key={s.id}
                onClick={() => prescribe(s.id)}
                className="w-full text-left px-4 py-2.5 text-sm text-[#1E1E2E] hover:bg-[#F5FFF5] transition-colors"
              >
                {s.full_name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
