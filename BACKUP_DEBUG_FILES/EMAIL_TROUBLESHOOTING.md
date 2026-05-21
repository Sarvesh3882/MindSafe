# Email Troubleshooting Guide

## Issue: Welcome Email Not Being Received

The welcome email after institutional onboarding is not being delivered to the admin's email address.

## Changes Made

### 1. Enhanced Email Service Logging
**File:** `src/lib/email-service.ts`

Added detailed logging to track email sending:
- ✅ Validates `RESEND_API_KEY` is configured
- ✅ Logs recipient email address
- ✅ Logs sender email address
- ✅ Logs Resend API response
- ✅ Logs detailed error information

### 2. Enhanced Registration API Response
**File:** `src/app/api/auth/register-institution/route.ts`

Now returns:
- ✅ `emailSent` boolean - indicates if email was sent successfully
- ✅ `temporaryPassword` - included in response for debugging
- ✅ Detailed error logging for email failures

### 3. Updated Success Screen
**File:** `src/app/demo/page.tsx`

Now displays:
- ✅ Temporary password on success screen (with copy button)
- ✅ Email status indicator (sent/not sent)
- ✅ Warning message if email failed to send

## How to Diagnose the Issue

### Step 1: Check Server Logs

After completing registration, check your terminal where `npm run dev` is running. Look for:

**If email sent successfully:**
```
Sending welcome email to: admin@college.edu.in
From email: onboarding@resend.dev
Email sent successfully: { id: 'xxx-xxx-xxx', ... }
Welcome email sent successfully to: admin@college.edu.in
```

**If email failed:**
```
Sending welcome email to: admin@college.edu.in
From email: onboarding@resend.dev
Resend API error: [Error details here]
Failed to send welcome email: [Error details here]
Email error details: { adminEmail: '...', collegeCode: '...', errorMessage: '...' }
```

### Step 2: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look at the registration response
4. Check if `emailSent: true` or `emailSent: false`

### Step 3: Check Success Screen

After registration completes, the success screen will show:
- ✅ **Green box with email icon** = Email sent successfully
- ❌ **Red box with email icon** = Email failed to send

If email failed, the temporary password will be displayed on screen so you can still login.

## Common Issues and Solutions

### Issue 1: RESEND_API_KEY Not Configured

**Symptoms:**
- Server logs show: "RESEND_API_KEY is not configured in environment variables"
- Email status shows "not sent"

**Solution:**
1. Check `.env.local` file
2. Verify `RESEND_API_KEY` is set
3. Current value: `re_DraacQii_DWc8CnYXKgiRyZZ256W7yjbG`
4. Restart development server after changing `.env.local`

### Issue 2: Invalid Resend API Key

**Symptoms:**
- Server logs show: "Invalid API key" or "Unauthorized"
- Email status shows "not sent"

**Solution:**
1. Go to https://resend.com/dashboard
2. Navigate to API Keys
3. Verify the key is active and not expired
4. Generate a new key if needed
5. Update `.env.local` with new key
6. Restart development server

### Issue 3: Invalid From Email Address

**Symptoms:**
- Server logs show: "Invalid from address" or "Domain not verified"
- Email status shows "not sent"

**Solution:**

Resend requires verified domains for production. For testing:

**Option A: Use Resend Test Email (Current)**
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```
This works for testing but emails may go to spam.

**Option B: Verify Your Domain**
1. Go to https://resend.com/dashboard
2. Click "Domains" → "Add Domain"
3. Add your domain (e.g., `mindsafe.in`)
4. Add DNS records as instructed
5. Wait for verification (can take up to 48 hours)
6. Update `.env.local`:
```env
RESEND_FROM_EMAIL=onboarding@mindsafe.in
```

**Option C: Use Resend's Test Domain (Recommended for Development)**
```env
RESEND_FROM_EMAIL=delivered@resend.dev
```

### Issue 4: Email Going to Spam

**Symptoms:**
- Email sent successfully (logs show success)
- But not in inbox
- Check spam/junk folder

**Solution:**
1. Check spam/junk folder
2. Mark as "Not Spam"
3. Add sender to contacts
4. For production, verify your domain (see Option B above)

### Issue 5: Rate Limiting

**Symptoms:**
- Server logs show: "Rate limit exceeded"
- Email status shows "not sent"

**Solution:**
- Resend free tier: 100 emails/day
- Wait 24 hours or upgrade plan
- Check usage at https://resend.com/dashboard

### Issue 6: Invalid Recipient Email

**Symptoms:**
- Server logs show: "Invalid recipient" or "Bounced"
- Email status shows "not sent"

**Solution:**
1. Verify email address is correct
2. Check for typos
3. Ensure email domain exists
4. Try with a different email address

## Testing Email Delivery

### Test 1: Check Resend Dashboard

1. Go to https://resend.com/dashboard
2. Click "Emails" in sidebar
3. Look for recent emails
4. Check status: Delivered, Bounced, or Failed
5. Click on email to see details

### Test 2: Use a Test Email Service

For testing, use a temporary email service:
- https://temp-mail.org
- https://10minutemail.com
- https://guerrillamail.com

Register with a temporary email and check if it arrives.

### Test 3: Send Test Email via API

Create a test script to send email directly:

```typescript
// test-email.ts
import { Resend } from 'resend';

const resend = new Resend('your-api-key-here');

async function testEmail() {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'your-email@example.com',
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmail();
```

Run: `npx tsx test-email.ts`

## Recommended Configuration for Development

Update your `.env.local`:

```env
# Resend (Email)
RESEND_API_KEY=re_DraacQii_DWc8CnYXKgiRyZZ256W7yjbG
RESEND_FROM_EMAIL=delivered@resend.dev
```

The `delivered@resend.dev` address is specifically designed for testing and has better deliverability than `onboarding@resend.dev`.

## Recommended Configuration for Production

1. **Verify your domain** at https://resend.com/dashboard
2. **Update `.env.local`:**
```env
RESEND_API_KEY=your-production-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

3. **Add SPF, DKIM, and DMARC records** as instructed by Resend
4. **Test thoroughly** before going live

## Fallback: Display Password on Screen

If email continues to fail, the success screen now displays:
- ✅ College Code (with copy button)
- ✅ Admin Email
- ✅ Temporary Password (with copy button)
- ⚠️ Warning to save credentials

This ensures admins can still login even if email fails.

## Next Steps

1. **Complete registration** on http://localhost:3000/demo
2. **Check server logs** for email sending details
3. **Check success screen** for email status
4. **Save temporary password** from success screen
5. **Check spam folder** if email shows as sent
6. **Login at** http://localhost:3000/login/admin

## Need More Help?

If email still doesn't work:

1. Share server logs from terminal
2. Share browser console logs
3. Share screenshot of success screen
4. Check Resend dashboard for email status
5. Verify API key is active at https://resend.com/dashboard

## Alternative: Use Different Email Service

If Resend continues to have issues, consider:
- **SendGrid** - https://sendgrid.com
- **Mailgun** - https://mailgun.com
- **AWS SES** - https://aws.amazon.com/ses
- **Postmark** - https://postmarkapp.com

All have similar APIs and can be integrated easily.
