'use client';

import { useState } from 'react';

type TimeRange = '7d' | '30d' | '90d';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  return (
    <div className="inline-flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-[#E5E7EB]">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${
              value === range.value
                ? 'bg-[#3DBE29] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#1E1E2E] hover:bg-[#F4F7FB]'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
