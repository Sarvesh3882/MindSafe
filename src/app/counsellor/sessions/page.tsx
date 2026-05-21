import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { SessionStatusDropdown } from "@/components/counsellor/session-status-dropdown";
import { MeetingLink } from "@/components/meetings/MeetingLink";

export default async function CounsellorSessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const { data: upcoming } = await supabase
    .from("sessions")
    .select("*, student:student_id(full_name, department, year)")
    .eq("counsellor_id", user!.id)
    .gte("date", today)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  const { data: past } = await supabase
    .from("sessions")
    .select("*, student:student_id(full_name, department, year)")
    .eq("counsellor_id", user!.id)
    .lt("date", today)
    .order("date", { ascending: false })
    .limit(10); // Limit to last 10 sessions
  
  // Auto-generate meeting links for all scheduled sessions
  if (upcoming) {
    for (const session of upcoming) {
      if (session.status === 'scheduled' && !session.meeting_link) {
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
      .select("*, student:student_id(full_name, department, year)")
      .eq("counsellor_id", user!.id)
      .gte("date", today)
      .order("date", { ascending: true })
      .order("time", { ascending: true });
    
    if (refreshed) {
      upcoming.length = 0;
      upcoming.push(...refreshed);
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">Sessions</h1>
        <p className="text-[#6B7280] text-sm mt-1">Your upcoming and past counselling sessions.</p>
      </div>

      {/* Today */}
      <section>
        <h2 className="text-base font-semibold text-[#1E1E2E] mb-3">
          Today — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </h2>
        <SessionList sessions={upcoming?.filter((s) => s.date === today) ?? []} emptyMsg="No sessions today." />
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="text-base font-semibold text-[#1E1E2E] mb-3">Upcoming</h2>
        <SessionList sessions={upcoming?.filter((s) => s.date > today) ?? []} emptyMsg="No upcoming sessions." />
      </section>

      {/* Past */}
      <section>
        <h2 className="text-base font-semibold text-[#1E1E2E] mb-3">Past Sessions</h2>
        <SessionList sessions={past ?? []} emptyMsg="No past sessions." />
      </section>
    </div>
  );
}

function SessionList({ sessions, emptyMsg }: { sessions: Record<string, unknown>[]; emptyMsg: string }) {
  if (!sessions.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-[#6B7280]">{emptyMsg}</CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {sessions.map((s) => {
        const student = s.student as { full_name: string; department?: string; year?: number } | null;
        const status = s.status as string;
        const sessionDate = s.date as string;
        const sessionTime = s.time as string;
        
        // Create start and end times for the meeting link
        const [hours, minutes] = sessionTime.split(':');
        const startDateTime = new Date(`${sessionDate}T${hours}:${minutes}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour session
        
        return (
          <Card key={s.id as string}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3DBE29]/10 flex items-center justify-center text-[#3DBE29] font-bold text-sm">
                    {student?.full_name?.[0] ?? "S"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E2E]">{student?.full_name ?? "Student"}</p>
                    <p className="text-xs text-[#6B7280]">
                      {sessionDate} · {sessionTime} · {s.type as string}
                      {student?.department ? ` · ${student.department}` : ""}
                    </p>
                  </div>
                </div>
                <SessionStatusDropdown sessionId={s.id as string} initialStatus={status} />
              </div>
              
              {/* Meeting Link Component - only for scheduled sessions */}
              <MeetingLink
                sessionId={s.id as string}
                sessionStartTime={startDateTime.toISOString()}
                sessionEndTime={endDateTime.toISOString()}
                sessionStatus={status}
                initialMeetingLink={s.meeting_link as string | null}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
