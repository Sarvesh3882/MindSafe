"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-[#F0FFF0] text-[#3DBE29]",
  completed: "bg-[#F8F9FF] text-[#6B7280]",
  cancelled: "bg-[#FFF0F0] text-[#FF6B6B]",
  no_show: "bg-[#FFF8F0] text-[#FF9F43]",
};

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

export function SessionStatusDropdown({
  sessionId,
  initialStatus,
}: {
  sessionId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);
    setLoading(true);

    const supabase = createClient();
    await supabase.from("sessions").update({ status: newStatus }).eq("id", sessionId);

    setLoading(false);
  }

  const colorClass = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600";
  // Extract just the text color part for the SVG icon, or default to gray
  const textColorClass = colorClass.includes("text-") 
    ? colorClass.split(" ").find(c => c.startsWith("text-")) 
    : "text-gray-600";

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
        disabled={loading}
        className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-7 rounded-full outline-none cursor-pointer border border-transparent transition-colors ${colorClass} ${loading ? "opacity-50" : ""}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-[#1E1E2E]">
            {opt.label}
          </option>
        ))}
      </select>
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 ${textColorClass}`}>
        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
