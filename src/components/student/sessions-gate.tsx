"use client";

import { useState } from "react";
import { useAnonymous } from "@/lib/anonymous-context";
import { SubscriptionPopup } from "@/components/student/subscription-popup";
import { useRouter } from "next/navigation";

export function SessionsGate({ children }: { children: React.ReactNode }) {
  const { isAnonymous } = useAnonymous();
  const [open, setOpen] = useState(true);
  const router = useRouter();

  if (!isAnonymous) return <>{children}</>;

  return (
    <>
      <SubscriptionPopup
        open={open}
        onClose={() => { setOpen(false); router.push("/student"); }}
        feature="sessions"
      />
      {/* Blurred background content */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>
    </>
  );
}
