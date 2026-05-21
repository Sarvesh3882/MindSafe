"use client";

import type { RiskLevel } from "@/lib/aria/engine";

interface Assessment {
  date: string;
  risk_level: string;
}

interface Props {
  assessments: Assessment[];
}

const RISK_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  stable: {
    label: "Stable",
    color: "#3DBE29",
    bg: "#F0FFF0",
    icon: "✓",
  },
  attention: {
    label: "Needs Attention",
    color: "#FF9F43",
    bg: "#FFF8F0",
    icon: "⚠",
  },
  critical: {
    label: "Critical",
    color: "#FF6B6B",
    bg: "#FFF0F0",
    icon: "!",
  },
};

/**
 * Risk Level History Component
 * Shows risk level changes over time with color-coded badges
 * COUNSELLOR-ONLY COMPONENT - Do not use in student views
 */
export function RiskLevelHistory({ assessments }: Props) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-[#6B7280] text-sm">
        No risk level data available
      </div>
    );
  }

  // Get risk level changes (only show when risk level changes)
  const riskChanges: { date: string; risk_level: string; previousRisk?: string }[] = [];
  let previousRisk: string | null = null;

  assessments.forEach((assessment) => {
    if (assessment.risk_level !== previousRisk) {
      riskChanges.push({
        date: assessment.date,
        risk_level: assessment.risk_level,
        previousRisk: previousRisk || undefined,
      });
      previousRisk = assessment.risk_level;
    }
  });

  // Current risk level
  const currentRisk = assessments[assessments.length - 1]?.risk_level || "stable";
  const currentConfig = RISK_CONFIG[currentRisk] || RISK_CONFIG.stable;

  // Count risk levels
  const stableCount = assessments.filter((a) => a.risk_level === "stable").length;
  const attentionCount = assessments.filter((a) => a.risk_level === "attention").length;
  const criticalCount = assessments.filter((a) => a.risk_level === "critical").length;

  return (
    <div className="space-y-4">
      {/* Current risk level */}
      <div 
        className="p-4 rounded-lg border-2"
        style={{ 
          backgroundColor: currentConfig.bg, 
          borderColor: currentConfig.color 
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ 
              backgroundColor: "white", 
              color: currentConfig.color 
            }}
          >
            {currentConfig.icon}
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-medium">Current Risk Level</p>
            <p 
              className="text-lg font-bold"
              style={{ color: currentConfig.color }}
            >
              {currentConfig.label}
            </p>
          </div>
        </div>
      </div>

      {/* Risk level distribution */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-[#F0FFF0] p-2 rounded text-center">
          <div className="font-bold text-[#3DBE29]">{stableCount}</div>
          <div className="text-[#6B7280]">Stable</div>
        </div>
        <div className="bg-[#FFF8F0] p-2 rounded text-center">
          <div className="font-bold text-[#FF9F43]">{attentionCount}</div>
          <div className="text-[#6B7280]">Attention</div>
        </div>
        <div className="bg-[#FFF0F0] p-2 rounded text-center">
          <div className="font-bold text-[#FF6B6B]">{criticalCount}</div>
          <div className="text-[#6B7280]">Critical</div>
        </div>
      </div>

      {/* Risk level changes timeline */}
      <div>
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
          Risk Level Changes
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {riskChanges.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-4">
              No risk level changes detected
            </p>
          ) : (
            riskChanges.slice().reverse().map((change, index) => {
              const config = RISK_CONFIG[change.risk_level] || RISK_CONFIG.stable;
              const previousConfig = change.previousRisk 
                ? RISK_CONFIG[change.previousRisk] 
                : null;
              const date = new Date(change.date);
              const formattedDate = date.toLocaleDateString("en-IN", { 
                day: "numeric", 
                month: "short" 
              });

              return (
                <div 
                  key={`${change.date}-${index}`}
                  className="flex items-center gap-3 p-2 rounded-lg border border-[#E5E7EB]"
                >
                  <div className="text-xs text-[#6B7280] w-16">{formattedDate}</div>
                  <div className="flex items-center gap-2 flex-1">
                    {previousConfig && (
                      <>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: previousConfig.bg, 
                            color: previousConfig.color 
                          }}
                        >
                          {previousConfig.label}
                        </span>
                        <span className="text-[#6B7280]">→</span>
                      </>
                    )}
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: config.bg, 
                        color: config.color 
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
