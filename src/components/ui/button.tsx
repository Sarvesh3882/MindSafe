import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3DBE29] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
      primary: "bg-[#3DBE29] text-white hover:bg-[#32A822] shadow-sm hover:shadow-md",
      secondary: "bg-transparent border-2 border-[#3DBE29] text-[#3DBE29] hover:bg-[#F0FFF0]",
      ghost: "bg-transparent text-[#6B7280] hover:bg-gray-100",
      danger: "bg-[#FF6B6B] text-white hover:bg-red-600",
      outline: "bg-white border border-[#E5E7EB] text-[#1E1E2E] hover:bg-gray-50",
    };

    const sizes = {
      sm: "text-xs px-3 py-2 h-8",
      md: "text-sm px-6 py-3 h-10",
      lg: "text-base px-8 py-4 h-12",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
