import * as React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: "up" | "down" };
  color?: string;
  className?: string;
  subtext?: string;
}

export function StatCard({ label, value, icon, trend, color = "#3DBE29", className, subtext }: StatCardProps) {
  return (
    <div className={cn("panel-surface interactive-card shimmer-surface rounded-2xl p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#5A6678] font-semibold">{label}</p>
          <p className="text-3xl font-bold text-[#1E1E2E] mt-1">{value}</p>
          {subtext && <p className="text-xs text-[#6B7280] mt-1">{subtext}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn("text-xs font-semibold", trend.direction === "up" ? "text-[#3DBE29]" : "text-[#FF6B6B]")}>
                {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-[#6B7280]">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: `${color}24`, color, border: `1px solid ${color}2f` }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
