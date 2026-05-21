import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/payment-verifier';
import { provisionCollege } from '@/lib/college-provisioner';
import { sendWelcomeEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      adminName,
      adminEmail,
      adminPhone,
      adminRole,
      collegeName,
      aisheCode,
      studentCount,
      planTier,
      paymentId,
      orderId,
      signature,
    } = body;

    // Validate required fields
    if (
      !adminName ||
      !adminEmail ||
      !adminPhone ||
      !adminRole ||
      !collegeName ||
      !aisheCode ||
      !studentCount ||
      !planTier ||
      !paymentId ||
      !orderId ||
      !signature
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 1: Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    
    if (!isValid) {
      console.error('Payment verification failed', { orderId, paymentId });
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Step 2: Provision college and admin account
    const provisionResult = await provisionCollege({
      adminName,
      adminEmail,
      adminPhone,
      adminRole,
      collegeName,
      aisheCode,
      studentCount,
      planTier,
      paymentId,
    });

    if (!provisionResult.success) {
      return NextResponse.json(
        { error: provisionResult.error },
        { status: 500 }
      );
    }

    // Step 3: Send welcome email (non-blocking)
    let emailSent = false;
    try {
      await sendWelcomeEmail({
        adminName,
        adminEmail,
        collegeName,
        collegeCode: provisionResult.collegeCode!,
        temporaryPassword: provisionResult.temporaryPassword!,
      });
      emailSent = true;
      console.log('Welcome email sent successfully to:', adminEmail);
    } catch (emailError) {
      // Log error but don't fail registration
      console.error('Failed to send welcome email:', emailError);
      console.error('Email error details:', {
        adminEmail,
        collegeCode: provisionResult.collegeCode,
        errorMessage: emailError instanceof Error ? emailError.message : 'Unknown error'
      });
    }

    // Success!
    return NextResponse.json({
      success: true,
      collegeCode: provisionResult.collegeCode,
      adminEmail: provisionResult.adminEmail,
      emailSent, // Include email status in response
      temporaryPassword: provisionResult.temporaryPassword, // Include password in response for now (for debugging)
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
