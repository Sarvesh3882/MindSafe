import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

const PLAN_AMOUNTS = {
  basic: 1500000,  // ₹15,000 in paise
  growth: 3500000, // ₹35,000 in paise
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collegeName, planTier, adminEmail, adminName } = body;

    // Validate required fields
    if (!collegeName || !planTier || !adminEmail || !adminName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate plan tier
    if (!PLAN_AMOUNTS[planTier as keyof typeof PLAN_AMOUNTS]) {
      return NextResponse.json(
        { error: 'Invalid plan tier' },
        { status: 400 }
      );
    }

    // Check if Razorpay is configured
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNTS[planTier as keyof typeof PLAN_AMOUNTS],
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        collegeName,
        planTier,
        adminEmail,
        adminName,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { error: 'Order creation failed' },
      { status: 500 }
    );
  }
}
