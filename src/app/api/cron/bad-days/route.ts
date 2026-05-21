import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAlertAndNotify } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get critical assessments from the past 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const dateStr = threeDaysAgo.toISOString().split('T')[0];

    const { data: assessments, error } = await supabase
      .from("assessments")
      .select("user_id, date")
      .eq("risk_level", "critical")
      .gte("date", dateStr);

    if (error) throw error;

    if (!assessments || assessments.length === 0) {
      return NextResponse.json({ message: "No critical assessments found." });
    }

    // Group by user_id and count unique dates
    const userBadDays: Record<string, Set<string>> = {};
    for (const a of assessments) {
      if (!userBadDays[a.user_id]) userBadDays[a.user_id] = new Set();
      userBadDays[a.user_id].add(a.date);
    }

    let alertsTriggered = 0;

    for (const [userId, dates] of Object.entries(userBadDays)) {
      if (dates.size >= 3) {
        // Check if an alert was already triggered recently to avoid spamming
        const { data: existingAlerts } = await supabase
          .from("alerts")
          .select("id")
          .eq("student_id", userId)
          .eq("type", "consecutive_bad_days")
          .gte("triggered_at", threeDaysAgo.toISOString());
          
        if (!existingAlerts || existingAlerts.length === 0) {
          // Trigger the alert and send notifications
          await createAlertAndNotify({
            studentId: userId,
            type: "consecutive_bad_days",
            riskLevel: "critical",
            notes: "Automated alert: Student reported a critical risk level for 3 consecutive days."
          });
          alertsTriggered++;
        }
      }
    }

    return NextResponse.json({ success: true, alertsTriggered });
  } catch (error) {
    console.error("Bad days cron error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
