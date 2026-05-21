import * as React from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "stable" | "attention" | "critical" | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-700",
      stable: "bg-[#F0FFF0] text-[#3DBE29]",
      attention: "bg-[#FFF8F0] text-[#FF9F43]",
      critical: "bg-[#FFF0F0] text-[#FF6B6B]",
      outline: "border border-[#E5E7EB] text-[#6B7280] bg-white",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = {
    stable: { variant: "stable" as const, label: "Stable", icon: "🟢" },
    attention: { variant: "attention" as const, label: "Needs Attention", icon: "🟠" },
    critical: { variant: "critical" as const, label: "Critical", icon: "🔴" },
  };
  const { variant, label, icon } = config[level];
  return (
    <Badge variant={variant}>
      {icon} {label}
    </Badge>
  );
}

export { Badge };
