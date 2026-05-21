import { createClient } from "@/lib/supabase/server";
import twilio from "twilio";
import { Resend } from "resend";

const twilioClient = process.env.TWILIO_ACCOUNT_SID?.startsWith("AC") && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function createAlertAndNotify({
  studentId,
  type,
  riskLevel,
  notes
}: {
  studentId: string;
  type: string;
  riskLevel?: string;
  notes?: string;
}) {
  try {
    const supabase = await createClient();

    // 1. Get student & counsellor info
    const { data: student } = await supabase
      .from("users")
      .select("full_name, guardian_phone, college_id")
      .eq("id", studentId)
      .single();

    if (!student) return false;

    const { data: counsellor } = await supabase
      .from("users")
      .select("id, email, phone")
      .eq("college_id", student.college_id)
      .eq("role", "counsellor")
      .limit(1)
      .single();

    // 2. Insert alert
    await supabase.from("alerts").insert({
      student_id: studentId,
      counsellor_id: counsellor?.id,
      type: type,
      notes: notes
    });

    const isCritical = riskLevel === "critical" || type === "crisis_keyword" || type === "counsellor_escalation";

    // 3. Twilio SMS to Guardian
    if (isCritical && student.guardian_phone && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `MindSafe India: Your ward may need support today. Please check in with them. For help, contact the college counsellor.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: student.guardian_phone,
        });
      } catch (err) {
        console.error("Twilio SMS failed:", err);
      }
    }

    // 4. Resend Email to Counsellor
    if (counsellor?.email && resend && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: counsellor.email,
          subject: `MindSafe Alert: Student needs attention (${type})`,
          html: `<p>A student in your college has been flagged for <strong>${type}</strong>.</p>
                 <p>Risk Level: <strong>${riskLevel || "critical"}</strong></p>
                 <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/counsellor">Open Dashboard →</a></p>`,
        });
      } catch (err) {
        console.error("Resend email failed:", err);
      }
    }

    return true;
  } catch (error) {
    console.error("Alert creation/notification error:", error);
    return false;
  }
}
