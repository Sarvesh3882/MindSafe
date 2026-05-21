"use client";

/**
 * @deprecated This component shows clinical mood tracking data and should NOT be used in student views.
 * It is preserved for potential counsellor dashboard use only.
 * 
 * For student views, use simple encouragement messages and streak counters instead.
 * See: src/app/student/progress/page.tsx for the simplified student progress view.
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const EMOTION_VALUE: Record<string, number> = {
  great: 5, good: 4, okay: 3, low: 2, stressed: 2, tired: 2,
};

const EMOTION_COLOR: Record<string, string> = {
  great: "#3DBE29", good: "#00C9A7", okay: "#6B7280",
  low: "#FF9F43", stressed: "#FF9F43", tired: "#FF9F43",
};

const Y_LABELS: Record<number, string> = {
  5: "Great", 4: "Good", 3: "Okay", 2: "Low", 1: "",
};

interface DataPoint { date: string; emotion: string }

export function StudentMoodHistory({ data }: { data: DataPoint[] }) {
  const chartData = data.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    value: EMOTION_VALUE[d.emotion] ?? 3,
    emotion: d.emotion,
    color: EMOTION_COLOR[d.emotion] ?? "#6B7280",
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} barSize={16}>
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, 5]}
          ticks={[2, 3, 4, 5]}
          tickFormatter={(v) => Y_LABELS[v] ?? ""}
          tick={{ fontSize: 10, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
          formatter={(_, __, props) => [props.payload?.emotion ?? "", "Feeling"]}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
