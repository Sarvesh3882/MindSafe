"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function EscalateToAdminButton({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);

  async function handleEscalate() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const res = await fetch("/api/alerts/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      if (res.ok) {
        setEscalated(true);
      }
    }
    setLoading(false);
  }

  if (escalated) {
    return (
      <span className="text-xs font-semibold text-[#FF6B6B] bg-[#FFF0F0] border border-[#FF6B6B]/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Escalated to Admin
      </span>
    );
  }

  return (
    <Button 
      variant="danger" 
      size="sm" 
      loading={loading} 
      onClick={handleEscalate}
      className="text-xs py-1.5 px-3 h-8 gap-1.5"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Escalate to Admin
    </Button>
  );
}
