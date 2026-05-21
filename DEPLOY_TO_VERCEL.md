# Deploy to Vercel - Quick Guide

**Status**: ✅ Ready to deploy  
**Time Required**: 10-15 minutes

---

## 🚀 Quick Deployment (5 Steps)

### Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/mindsafe-india.git

# Push
git push -u origin main
```

---

### Step 2: Import to Vercel (1 minute)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your `mindsafe-india` repository
5. Click **"Import"**

Vercel will auto-detect Next.js configuration ✅

---

### Step 3: Configure Environment Variables (5 minutes)

In Vercel dashboard, go to **Project Settings → Environment Variables**

Add these **14 required variables**:

#### Supabase (3 variables)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Mistral AI (2 variables)
```
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_AGENT_ID=your_mistral_agent_id
```

#### Twilio (3 variables)
```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

#### Resend (2 variables)
```
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=your_email
```

#### Razorpay (3 variables)
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### App (1 variable)
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Important**: 
- Select **"Production"**, **"Preview"**, and **"Development"** for each variable
- You can update `NEXT_PUBLIC_APP_URL` after deployment with your actual URL

---

### Step 4: Deploy (2 minutes)

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will show: ✅ **"Deployment Ready"**

Your app is now live at: `https://your-project.vercel.app`

---

### Step 5: Verify Deployment (5 minutes)

Test these critical flows:

1. **Visit the URL** - Homepage should load
2. **Test Login** - Try logging in as student/counsellor/admin
3. **Test Signup** - Create a test account
4. **Test Dashboard** - Navigate to dashboard
5. **Test API** - Try chat, check-in, or resources
6. **Check Console** - Open browser console, verify no errors

---

## 🎯 Optional: Add Custom Domain

### Step 1: Add Domain in Vercel
1. Go to **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain: `mindsafe.yourdomain.com`

### Step 2: Configure DNS
Add these DNS records in your domain provider:

**For subdomain** (e.g., `mindsafe.yourdomain.com`):
```
Type: CNAME
Name: mindsafe
Value: cname.vercel-dns.com
```

**For root domain** (e.g., `yourdomain.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

### Step 3: Update Environment Variable
Update `NEXT_PUBLIC_APP_URL` in Vercel:
```
NEXT_PUBLIC_APP_URL=https://mindsafe.yourdomain.com
```

---

## 🔧 Optional: Add Security Variables

### CRON_SECRET (Recommended)
Protects cron endpoints from unauthorized access.

```bash
# Generate a secure secret
openssl rand -base64 32

# Add to Vercel
CRON_SECRET=your_generated_secret
```

### RAZORPAY_WEBHOOK_SECRET (Recommended)
Verifies Razorpay webhook signatures.

```
# Get from Razorpay Dashboard → Webhooks
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

## 📊 Monitoring Setup (Optional)

### 1. Vercel Analytics
- Go to **Project Settings → Analytics**
- Enable **Web Analytics** (free)
- Enable **Speed Insights** (free)

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 3. Uptime Monitoring
Use services like:
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

---

## 🐛 Troubleshooting

### Build Fails
**Check**:
1. Environment variables are set correctly
2. All variables are in "Production" environment
3. No typos in variable names

**Fix**: Review build logs in Vercel dashboard

---

### API Routes Return 500
**Check**:
1. Supabase connection works
2. Service role key is correct
3. Database migrations are applied

**Fix**: Check Vercel function logs

---

### Chat Not Working
**Check**:
1. `MISTRAL_API_KEY` is set
2. `MISTRAL_AGENT_ID` is set
3. API key has not exceeded rate limit

**Fix**: See [FIX_CHAT_FETCH_ERROR.md](./FIX_CHAT_FETCH_ERROR.md)

---

### Database Errors
**Check**:
1. All 34 migrations are applied in Supabase
2. RLS policies are enabled
3. Storage buckets are created

**Fix**: See [supabase/QUICK_START.md](./supabase/QUICK_START.md)

---

## 📋 Post-Deployment Checklist

- ⏳ Test all authentication flows
- ⏳ Test student dashboard features
- ⏳ Test counsellor dashboard features
- ⏳ Test admin dashboard features
- ⏳ Test ARIA assessment
- ⏳ Test Saathi chatbot
- ⏳ Test resource prescription
- ⏳ Test session booking
- ⏳ Test payment flow
- ⏳ Test NAAC evidence upload
- ⏳ Verify email notifications work
- ⏳ Verify SMS alerts work (if configured)
- ⏳ Check browser console for errors
- ⏳ Test on mobile devices
- ⏳ Set up monitoring
- ⏳ Configure custom domain (optional)

---

## 🎉 Success!

Your MindSafe India platform is now live on Vercel!

**Next Steps**:
1. Share the URL with stakeholders
2. Conduct user acceptance testing
3. Set up monitoring and analytics
4. Plan for scaling (if needed)

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Docs**: See [README.md](./README.md)

---

**Deployment Guide Version**: 1.0  
**Last Updated**: Current Session  
**Status**: ✅ **READY TO DEPLOY**

