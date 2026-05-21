"use client";

import { useEffect, useState } from "react";

interface Props {
  nextAvailableTime: string;
}

export function CheckinCountdown({ nextAvailableTime }: Props) {
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const next = new Date(nextAvailableTime);
      const diff = next.getTime() - now.getTime();

      if (diff <= 0) {
        // Time's up! Refresh the page to allow check-in
        window.location.reload();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining({ hours, minutes });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every minute
    const interval = setInterval(calculateTimeRemaining, 60 * 1000);

    return () => clearInterval(interval);
  }, [nextAvailableTime]);

  if (!timeRemaining) {
    return <span className="text-sm text-[#6B7280]">Calculating...</span>;
  }

  return (
    <div className="flex items-center gap-2" role="timer" aria-live="polite" aria-atomic="true">
      <span className="text-sm text-[#6B7280]">
        Come back in{" "}
        <strong className="text-[#3DBE29]">
          {timeRemaining.hours > 0 && `${timeRemaining.hours}h `}
          {timeRemaining.minutes}m
        </strong>
      </span>
    </div>
  );
}
