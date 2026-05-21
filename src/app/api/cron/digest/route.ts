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

    // Get all alerts from the past 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const { data: alerts, error } = await supabase
      .from("alerts")
      .select("counsellor_id, type")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (error) throw error;

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ message: "No alerts in the past 7 days" });
    }

    // Group by counsellor
    const counsellorAlerts: Record<string, number> = {};
    for (const alert of alerts) {
      if (alert.counsellor_id) {
        counsellorAlerts[alert.counsellor_id] = (counsellorAlerts[alert.counsellor_id] || 0) + 1;
      }
    }

    if (resend && process.env.RESEND_FROM_EMAIL) {
      for (const [counsellorId, count] of Object.entries(counsellorAlerts)) {
        // Get counsellor email
        const { data: counsellor } = await supabase
          .from("users")
          .select("email, full_name")
          .eq("id", counsellorId)
          .single();

        if (counsellor && counsellor.email) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: counsellor.email,
            subject: "MindSafe India: Weekly Wellness Digest",
            html: `<p>Hi ${counsellor.full_name},</p>
                   <p>This week, there were <strong>${count}</strong> crisis alerts triggered by students assigned to you.</p>
                   <p>Please log in to your dashboard to review them and ensure all high-risk students are supported.</p>
                   <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/counsellor">Go to Dashboard</a></p>`,
          });
        }
      }
    }

    return NextResponse.json({ success: true, counsellorsNotified: Object.keys(counsellorAlerts).length });
  } catch (error) {
    console.error("Digest cron error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
