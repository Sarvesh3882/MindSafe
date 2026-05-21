"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface Assessment {
  date: string;
  scores: Record<string, number>;
  risk_level: string;
}

export function StudentTrendChart({ assessments }: { assessments: Assessment[] }) {
  const data = assessments.map((a) => ({
    date: new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    Depression: a.scores?.depression ?? 0,
    Anxiety: a.scores?.anxiety ?? 0,
    Stress: a.scores?.stress ?? 0,
    Sleep: a.scores?.sleep ?? 0,
  }));

  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center text-[#6B7280] text-sm">
        No assessment data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Depression" stroke="#FF6B6B" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Anxiety" stroke="#FF9F43" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Stress" stroke="#3DBE29" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Sleep" stroke="#00C9A7" strokeWidth={2} dot={false} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}
