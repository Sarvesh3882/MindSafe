import { NextRequest, NextResponse } from "next/server";
import { createAlertAndNotify } from "@/lib/notifications";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.role !== "counsellor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await createAlertAndNotify({
      studentId: studentId,
      type: "counsellor_escalation",
      riskLevel: "critical",
      notes: "Manually escalated by counsellor for administrative review."
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
    }
  } catch (error) {
    console.error("Escalation trigger error:", error);
    return NextResponse.json({ error: "Failed to trigger escalation" }, { status: 500 });
  }
}
