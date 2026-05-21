import { NextRequest, NextResponse } from "next/server";
import { createAlertAndNotify } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const { userId, type, riskLevel } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const success = await createAlertAndNotify({
      studentId: userId,
      type: type ?? "score_spike",
      riskLevel
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
    }
  } catch (error) {
    console.error("Alert trigger error:", error);
    return NextResponse.json({ error: "Failed to trigger alert" }, { status: 500 });
  }
}
