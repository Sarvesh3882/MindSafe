import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { SessionsClient } from "@/components/student/sessions-client";
import { SessionsGate } from "@/components/student/sessions-gate";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-[#F0FFF0] text-[#3DBE29] border border-[#3DBE29]/20",
  completed: "bg-[#F8F9FF] text-[#6B7280] border border-[#E5E7EB]",
  cancelled: "bg-[#FFF0F0] text-[#FF6B6B] border border-[#FF6B6B]/20",
  no_show: "bg-[#FFF8F0] text-[#FF9F43] border border-[#FF9F43]/20",
};

export default async function StudentSessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Anonymous users have no sessions
  if (!user) {
    return (
      <SessionsGate>
        <SessionsClient upcoming={[]} past={[]} />
      </SessionsGate>
    );
  }

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, counsellor:counsellor_id(full_name, email)")
    .eq("student_id", user.id)
    .order("date", { ascending: false });

  const upcoming = sessions?.filter((s) => s.status === "scheduled") ?? [];
  const past = sessions?.filter((s) => s.status !== "scheduled") ?? [];
  
  // Auto-generate meeting links for all scheduled sessions
  if (upcoming.length > 0) {
    for (const session of upcoming) {
      if (!session.meeting_link) {
        try {
          await supabase.rpc('generate_meeting_link_for_session', {
            session_uuid: session.id
          });
        } catch (err) {
          console.error('Error auto-generating meeting link:', err);
        }
      }
    }
    
    // Refetch to get the generated links
    const { data: refreshed } = await supabase
      .from("sessions")
      .select("*, counsellor:counsellor_id(full_name, email)")
      .eq("student_id", user.id)
      .order("date", { ascending: false });
    
    if (refreshed) {
      upcoming.length = 0;
      upcoming.push(...refreshed.filter((s) => s.status === "scheduled"));
    }
  }

  return (
    <SessionsGate>
      <SessionsClient upcoming={upcoming} past={past} />
    </SessionsGate>
  );
}
