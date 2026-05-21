"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnonymousEntryPage() {
  const router = useRouter();

  useEffect(() => {
    // Write directly to sessionStorage — no context dependency
    sessionStorage.setItem("mindsafe_anonymous_mode", "true");
    router.replace("/student");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#3DBE29] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#6B7280]">Setting up guest access...</p>
      </div>
    </div>
  );
}
