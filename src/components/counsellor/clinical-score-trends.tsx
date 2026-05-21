"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AssessmentScore } from "@/lib/aria/engine";

interface Assessment {
  date: string;
  scores: AssessmentScore;
}

interface Props {
  assessments: Assessment[];
}

/**
 * Clinical Score Trends Chart
 * Shows PHQ-9, GAD-7, PSS-10, and ISI scores over time
 * COUNSELLOR-ONLY COMPONENT - Do not use in student views
 */
export function ClinicalScoreTrends({ assessments }: Props) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#6B7280] text-sm">
        No assessment data available
      </div>
    );
  }

  // Transform data for chart
  const chartData = assessments.map((a) => ({
    date: new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    fullDate: a.date,
    depression: a.scores.depression || 0,
    anxiety: a.scores.anxiety || 0,
    stress: a.scores.stress || 0,
    sleep: a.scores.sleep || 0,
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#E5E7EB"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#E5E7EB"
            domain={[0, 30]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "1px solid #E5E7EB", 
              borderRadius: "8px",
              fontSize: "12px"
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Legend 
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="depression" 
            stroke="#4A90E2" 
            strokeWidth={2}
            name="Depression (PHQ-9)"
            dot={{ fill: "#4A90E2", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="anxiety" 
            stroke="#FF9F43" 
            strokeWidth={2}
            name="Anxiety (GAD-7)"
            dot={{ fill: "#FF9F43", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="stress" 
            stroke="#FF6B6B" 
            strokeWidth={2}
            name="Stress (PSS-10)"
            dot={{ fill: "#FF6B6B", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="sleep" 
            stroke="#9B59B6" 
            strokeWidth={2}
            name="Sleep (ISI)"
            dot={{ fill: "#9B59B6", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Score reference guide */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-[#F8F9FF] p-3 rounded-lg">
          <p className="font-semibold text-[#4A90E2] mb-1">Depression (PHQ-9)</p>
          <p className="text-[#6B7280]">0-4: Minimal · 5-9: Mild · 10-14: Moderate · 15+: Severe</p>
        </div>
        <div className="bg-[#FFF8F0] p-3 rounded-lg">
          <p className="font-semibold text-[#FF9F43] mb-1">Anxiety (GAD-7)</p>
          <p className="text-[#6B7280]">0-4: Minimal · 5-9: Mild · 10-14: Moderate · 15+: Severe</p>
        </div>
        <div className="bg-[#FFF0F0] p-3 rounded-lg">
          <p className="font-semibold text-[#FF6B6B] mb-1">Stress (PSS-10)</p>
          <p className="text-[#6B7280]">0-13: Low · 14-17: Moderate · 18-25: High · 26+: Very High</p>
        </div>
        <div className="bg-[#F5F0FF] p-3 rounded-lg">
          <p className="font-semibold text-[#9B59B6] mb-1">Sleep (ISI)</p>
          <p className="text-[#6B7280]">0-7: None · 8-14: Subthreshold · 15-21: Moderate · 22+: Severe</p>
        </div>
      </div>
    </div>
  );
}
