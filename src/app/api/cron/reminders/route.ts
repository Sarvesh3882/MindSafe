import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find sessions in the next 24 to 25 hours (hourly cron)
    const now = new Date();
    const startRange = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endRange = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select(`
        id,
        scheduled_at,
        counsellor:users!counsellor_id(full_name, email),
        student:users!student_id(full_name, email)
      `)
      .gte("scheduled_at", startRange.toISOString())
      .lt("scheduled_at", endRange.toISOString())
      .eq("status", "scheduled");

    if (error) throw error;

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ message: "No reminders to send" });
    }

    if (resend && process.env.RESEND_FROM_EMAIL) {
      for (const session of sessions) {
        const student = session.student as any;
        const counsellor = session.counsellor as any;
        
        // Email Student
        if (student && student.email) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: student.email,
            subject: "Reminder: Your MindSafe India Session is Tomorrow",
            html: `<p>Hi ${student.full_name},</p><p>This is a reminder that you have a session scheduled with ${counsellor.full_name} tomorrow at ${new Date(session.scheduled_at).toLocaleTimeString()}.</p>`,
          });
        }
        
        // Email Counsellor
        if (counsellor && counsellor.email) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: counsellor.email,
            subject: "Reminder: Upcoming Student Session",
            html: `<p>Hi ${counsellor.full_name},</p><p>This is a reminder that you have a session scheduled with ${student.full_name} tomorrow at ${new Date(session.scheduled_at).toLocaleTimeString()}.</p>`,
          });
        }
      }
    }

    return NextResponse.json({ success: true, count: sessions.length });
  } catch (error) {
    console.error("Reminder cron error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
