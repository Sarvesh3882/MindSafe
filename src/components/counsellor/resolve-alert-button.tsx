"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ResolveAlertButton({ alertId }: { alertId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function resolve() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("alerts")
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq("id", alertId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={resolve}
      disabled={loading}
      className="text-xs border border-[#3DBE29] text-[#3DBE29] px-3 py-1.5 rounded-lg hover:bg-[#F0FFF0] transition-colors disabled:opacity-50 font-semibold"
    >
      {loading ? "..." : "Resolve"}
    </button>
  );
}
