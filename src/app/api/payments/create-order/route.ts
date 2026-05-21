import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

const PRICES = {
  basic: 500000, // 5000 INR in paise
  growth: 1500000, // 15000 INR in paise
  enterprise: 5000000, // 50000 INR in paise
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role from database (not from auth object)
    const { data: profile } = await supabase
      .from("users")
      .select("role, college_id")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { tier } = await req.json();

    if (!PRICES[tier as keyof typeof PRICES]) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (!razorpay) {
      return NextResponse.json({ error: "Razorpay is not configured" }, { status: 500 });
    }

    const order = await razorpay.orders.create({
      amount: PRICES[tier as keyof typeof PRICES],
      currency: "INR",
      receipt: `receipt_${profile.college_id || 'unknown'}_${Date.now()}`,
      notes: {
        tier,
        college_id: profile.college_id,
        admin_id: user.id
      }
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
