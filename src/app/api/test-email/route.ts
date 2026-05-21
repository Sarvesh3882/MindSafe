import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Test endpoint to verify email sending
 * Visit: http://localhost:3000/api/test-email?to=your-email@example.com
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toEmail = searchParams.get('to') || 'test@example.com';
  
  console.log('=== Email Test Endpoint ===');
  console.log('Testing email sending to:', toEmail);
  
  // Check environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not configured');
    return NextResponse.json({
      success: false,
      error: 'RESEND_API_KEY not configured in environment variables',
    }, { status: 500 });
  }
  
  console.log('✅ RESEND_API_KEY is configured');
  console.log('   From email:', process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev');
  
  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev';
  
  try {
    console.log('📧 Sending test email...');
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'MindSafe India - Test Email',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3DBE29;">✅ Email Test Successful!</h1>
          <p>This is a test email from MindSafe India.</p>
          <p>If you received this, your email configuration is working correctly.</p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 14px;">
            <strong>Sent to:</strong> ${toEmail}<br>
            <strong>From:</strong> ${fromEmail}<br>
            <strong>Timestamp:</strong> ${new Date().toISOString()}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Email ID:', result.data?.id);
    
    if (result.error) {
      console.error('❌ Resend returned an error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.data?.id,
      to: toEmail,
      from: fromEmail,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Failed to send email');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('   Full error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    }, { status: 500 });
  }
}
