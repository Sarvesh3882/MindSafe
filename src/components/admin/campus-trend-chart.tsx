"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface TrendPoint {
  date: string;
  stable: number;
  attention: number;
  critical: number;
  checkins: number;
}

export function CampusTrendChart({ data }: { data: TrendPoint[] }) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center text-[#6B7280] text-sm">
        No trend data available yet. Students need to complete assessments.
      </div>
    );
  }

  // If only 1 data point, show a message
  if (data.length === 1) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-[#6B7280] text-sm space-y-2">
        <p className="font-semibold text-[#1E1E2E]">Limited trend data</p>
        <p>Only {data[0].checkins} check-in recorded on {data[0].date}</p>
        <p className="text-xs">More data will appear as students complete assessments</p>
        <div className="mt-4 flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#3DBE29]"></span>
            Stable: {data[0].stable}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#FF9F43]"></span>
            Attention: {data[0].attention}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#FF6B6B]"></span>
            Critical: {data[0].critical}
          </span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="stable" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3DBE29" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3DBE29" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="attention" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF9F43" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="critical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="stable" stroke="#3DBE29" fill="url(#stable)" strokeWidth={2} name="Stable" />
        <Area type="monotone" dataKey="attention" stroke="#FF9F43" fill="url(#attention)" strokeWidth={2} name="Needs Attention" />
        <Area type="monotone" dataKey="critical" stroke="#FF6B6B" fill="url(#critical)" strokeWidth={2} name="Critical" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
