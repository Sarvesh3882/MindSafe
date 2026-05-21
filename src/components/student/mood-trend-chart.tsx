"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Emotion → numeric value for chart rendering only (never shown as a number to student)
const EMOTION_VALUE: Record<string, number> = {
  great: 5, good: 4, okay: 3, low: 2, stressed: 2, tired: 2,
};

// Y-axis tick labels — friendly words, not numbers
const Y_LABELS: Record<number, string> = {
  5: "Great 😄",
  4: "Good 🙂",
  3: "Okay 😐",
  2: "Low 😔",
  1: "",
};

interface DataPoint {
  date: string;
  emotion: string;
}

export function MoodTrendChart({ data }: { data: DataPoint[] }) {
  const chartData = data.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" }),
    value: EMOTION_VALUE[d.emotion] ?? 3,
    emotion: d.emotion,
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        {/* Y-axis shows friendly words, not numbers */}
        <YAxis
          domain={[1, 5]}
          ticks={[2, 3, 4, 5]}
          tickFormatter={(v) => Y_LABELS[v] ?? ""}
          tick={{ fontSize: 10, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
          formatter={(_, __, props) => [
            // Show emotion word, never the number
            props.payload?.emotion ?? "",
            "Feeling",
          ]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3DBE29"
          strokeWidth={2.5}
          dot={{ fill: "#3DBE29", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
