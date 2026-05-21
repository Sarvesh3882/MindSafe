import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#1E1E2E] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1E1E2E] placeholder:text-[#6B7280]",
              "focus:outline-none focus:ring-2 focus:ring-[#3DBE29] focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-150",
              icon && "pl-10",
              error && "border-[#FF6B6B] focus:ring-[#FF6B6B]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-[#FF6B6B]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
