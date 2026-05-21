// Test script to verify Resend email sending
// Run with: node test-email.js

const { Resend } = require('resend');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('=== Resend Email Test ===\n');
  
  // Check environment variables
  console.log('1. Checking environment variables...');
  console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('   RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev');
  console.log('');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set in .env.local');
    process.exit(1);
  }
  
  // Test email sending
  console.log('2. Sending test email...');
  const testEmail = process.argv[2] || 'test@example.com';
  console.log('   To:', testEmail);
  console.log('   From:', process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev');
  console.log('');
  
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'delivered@resend.dev',
      to: testEmail,
      subject: 'MindSafe India - Test Email',
      html: `
        <h1>Test Email from MindSafe India</h1>
        <p>This is a test email to verify Resend integration.</p>
        <p>If you received this, email sending is working correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Email ID:', result.id);
    console.log('');
    console.log('3. Next steps:');
    console.log('   - Check your inbox (may take 1-2 minutes)');
    console.log('   - Check spam/junk folder');
    console.log('   - Check Resend dashboard: https://resend.com/dashboard');
    console.log('');
    
  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('');
    console.error('Error details:');
    console.error('   Message:', error.message);
    console.error('   Name:', error.name);
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    console.error('');
    console.error('Common issues:');
    console.error('   - Invalid API key (check .env.local)');
    console.error('   - API key expired or revoked');
    console.error('   - Rate limit exceeded (100 emails/day on free tier)');
    console.error('   - Invalid from email address');
    console.error('');
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the test
console.log('Usage: node test-email.js [your-email@example.com]');
console.log('');
testEmail();
