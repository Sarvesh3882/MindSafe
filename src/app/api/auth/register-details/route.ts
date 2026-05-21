import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, fullName, role, collegeId, collegeName, planTier } = body;

    if (!id || !email || !role || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Initialize Supabase with Service Role Key to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    let finalCollegeId = collegeId;

    // If Admin, create the college first
    if (role === "admin" && collegeName) {
      const { data: newCollege, error: collegeError } = await supabaseAdmin
        .from("colleges")
        .insert({ name: collegeName, plan_tier: planTier || "basic" })
        .select("id")
        .single();
      
      if (collegeError) {
        console.error("Failed to create college:", collegeError);
        return NextResponse.json({ error: "Failed to create college workspace" }, { status: 500 });
      }
      finalCollegeId = newCollege.id;
    }

    // Insert into users table
    const { error: userError } = await supabaseAdmin.from("users").insert({
      id,
      email,
      full_name: fullName,
      role,
      college_id: finalCollegeId || null,
    });

    if (userError) {
      console.error("Failed to create user profile:", userError);
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration details error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
