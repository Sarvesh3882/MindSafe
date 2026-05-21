import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, role, collegeId } = await req.json();

    if (!fullName || !email || !role || !collegeId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Use service role to create users server-side
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Enforce Plan Limits for Counsellors
    if (role === "counsellor") {
      const { data: college } = await supabase.from("colleges").select("plan_tier").eq("id", collegeId).single();
      if (college) {
        const { count } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("college_id", collegeId).eq("role", "counsellor");
        
        const currentCount = count || 0;
        let limit = 0;
        if (college.plan_tier === "basic") limit = 1;
        else if (college.plan_tier === "growth") limit = 5;
        else if (college.plan_tier === "enterprise") limit = 9999;

        if (currentCount >= limit) {
          return NextResponse.json({ error: `Plan limit reached. Upgrade your subscription to add more than ${limit} counsellor(s).` }, { status: 403 });
        }
      }
    }

    // Create auth user with a temporary password
    const tempPassword = `MindSafe${Math.random().toString(36).slice(2, 10)}!`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      user_metadata: { full_name: fullName, role },
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert into users table
    await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
      college_id: collegeId,
    });

    // Send welcome email via Resend
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: "Welcome to MindSafe India",
          html: `<p>Hi ${fullName},</p><p>Your MindSafe India account has been created.</p><p>Email: ${email}<br>Temporary password: <strong>${tempPassword}</strong></p><p>Please change your password after first login.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Login →</a></p>`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboard error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
