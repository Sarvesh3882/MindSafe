"use client";

interface Assessment {
  date: string;
  emotion: string;
  risk_level?: string;
}

interface Props {
  assessments: Assessment[];
}

const EMOTION_EMOJI: Record<string, string> = {
  great: "😄",
  good: "🙂",
  okay: "😐",
  low: "😔",
  stressed: "😟",
  tired: "😴",
};

const EMOTION_COLOR: Record<string, string> = {
  great: "#3DBE29",
  good: "#00C9A7",
  okay: "#6B7280",
  low: "#FF9F43",
  stressed: "#FF6B6B",
  tired: "#9B59B6",
};

/**
 * Mood Timeline Component
 * Shows 30-day emotion-based timeline with risk levels
 * COUNSELLOR-ONLY COMPONENT - Do not use in student views
 */
export function MoodTimeline({ assessments }: Props) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-[#6B7280] text-sm">
        No mood data available
      </div>
    );
  }

  // Calculate good days vs tough days
  // Priority: Tough days first (any critical/attention risk OR negative emotion)
  // Then good days (positive emotion AND stable risk)
  // Finally okay days (everything else)
  
  const toughDays = assessments.filter((a) => {
    const emotion = a.emotion?.toLowerCase() || "";
    const riskLevel = a.risk_level?.toLowerCase() || "";
    // Tough day = negative emotion OR critical/attention risk
    return ["low", "stressed", "tired"].includes(emotion) || 
           ["critical", "attention"].includes(riskLevel);
  }).length;
  
  const goodDays = assessments.filter((a) => {
    const emotion = a.emotion?.toLowerCase() || "";
    const riskLevel = a.risk_level?.toLowerCase() || "";
    // Good day = positive emotion AND stable risk (not critical or attention)
    return ["great", "good"].includes(emotion) && 
           !["critical", "attention"].includes(riskLevel);
  }).length;
  
  const okayDays = assessments.length - goodDays - toughDays;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#F0FFF0] p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#3DBE29]">{goodDays}</div>
          <div className="text-xs text-[#6B7280] mt-1">Good days</div>
        </div>
        <div className="bg-[#F8F9FF] p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#6B7280]">{okayDays}</div>
          <div className="text-xs text-[#6B7280] mt-1">Okay days</div>
        </div>
        <div className="bg-[#FFF0F0] p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#FF6B6B]">{toughDays}</div>
          <div className="text-xs text-[#6B7280] mt-1">Tough days</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {assessments.slice().reverse().map((assessment, index) => {
          const emotion = assessment.emotion?.toLowerCase() || "okay";
          const emoji = EMOTION_EMOJI[emotion] || "😐";
          const color = EMOTION_COLOR[emotion] || "#6B7280";
          const date = new Date(assessment.date);
          const formattedDate = date.toLocaleDateString("en-IN", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
          });
          const dayOfWeek = date.toLocaleDateString("en-IN", { weekday: "short" });

          return (
            <div 
              key={`${assessment.date}-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FF] transition-colors"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: `${color}20` }}
              >
                {emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-sm font-semibold capitalize"
                    style={{ color }}
                  >
                    {emotion}
                  </span>
                  {assessment.risk_level && (
                    <span 
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        assessment.risk_level === "critical" 
                          ? "bg-red-100 text-red-700"
                          : assessment.risk_level === "attention"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {assessment.risk_level}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  {dayOfWeek}, {formattedDate}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs pt-3 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#3DBE29]"></div>
          <span className="text-[#6B7280]">Great/Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#6B7280]"></div>
          <span className="text-[#6B7280]">Okay</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
          <span className="text-[#6B7280]">Low/Stressed/Tired</span>
        </div>
      </div>
    </div>
  );
}
