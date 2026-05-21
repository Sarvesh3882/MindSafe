import { Resend } from 'resend';

interface WelcomeEmailData {
  adminName: string;
  adminEmail: string;
  collegeName: string;
  collegeCode: string;
  temporaryPassword: string;
}

/**
 * Generates welcome email HTML content
 */
function generateWelcomeEmail(data: WelcomeEmailData): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginUrl = `${appUrl}/login`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1A1A24; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3DBE29 0%, #00C9A7 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .content { background: #F8FFF8; padding: 30px; border-radius: 0 0 12px 12px; }
    .info-box { background: white; border-left: 4px solid #3DBE29; padding: 15px; margin: 20px 0; border-radius: 8px; }
    .credentials { background: #F0FFF4; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #3DBE29; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Welcome to MindSafe India!</h1>
      <p style="margin: 10px 0 0 0;">Your college workspace is ready</p>
    </div>
    
    <div class="content">
      <p>Hi ${data.adminName},</p>
      
      <p>Congratulations! Your college has been successfully registered on MindSafe India. You can now start protecting student mental wellness at scale.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #3DBE29;">College Details</h3>
        <p><strong>College Name:</strong> ${data.collegeName}</p>
        <p><strong>College Code:</strong> <code style="background: #F0FFF4; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${data.collegeCode}</code></p>
        <p style="font-size: 13px; color: #6B7280;">Share this code with your counsellors and students to link their accounts to your institution.</p>
      </div>
      
      <div class="credentials">
        <h3 style="margin-top: 0;">Admin Login Credentials</h3>
        <p><strong>Email:</strong> ${data.adminEmail}</p>
        <p><strong>Temporary Password:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px;">${data.temporaryPassword}</code></p>
        <p style="font-size: 13px; color: #FF6B6B; margin-top: 15px;">⚠️ <strong>Important:</strong> Please change your password after your first login for security.</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${loginUrl}" class="button">Login to Dashboard</a>
      </div>
      
      <h3 style="color: #3DBE29;">What's Next?</h3>
      <ol style="padding-left: 20px;">
        <li>Login to your admin dashboard</li>
        <li>Add counsellor accounts</li>
        <li>Share the college code with students</li>
        <li>Start monitoring campus wellness</li>
      </ol>
      
      <p>Need help getting started? Reply to this email or visit our support center.</p>
      
      <p>Best regards,<br><strong>The MindSafe India Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2026 MindSafe India · Mental Health Support Platform for Indian Colleges</p>
      <p>This email was sent to ${data.adminEmail}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Sends welcome email to newly registered admin
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  // Validate environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not configured in environment variables');
    throw new Error('Email service not configured: RESEND_API_KEY missing');
  }

  // Initialize Resend client with API key
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev';
  
  console.log('📧 Sending welcome email...');
  console.log('   To:', data.adminEmail);
  console.log('   From:', fromEmail);
  console.log('   College:', data.collegeName);
  console.log('   College Code:', data.collegeCode);
  
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: data.adminEmail,
      subject: 'Welcome to MindSafe India - Your Account is Ready',
      html: generateWelcomeEmail(data),
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Email ID:', result.data?.id);
    console.log('   Status:', result.error ? 'Failed' : 'Success');
    
    if (result.error) {
      console.error('❌ Resend returned an error:', result.error);
      throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to send email');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('   Full error:', error);
    throw error;
  }
}
