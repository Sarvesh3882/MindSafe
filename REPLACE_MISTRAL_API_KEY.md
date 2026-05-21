# Replace Mistral API Key - Quick Guide

## Problem
Your current Mistral API key has hit the rate limit:
```
Error: "Service tier capacity exceeded for this model" (Status 429)
```

## Solution: Get a New API Key

### Option 1: Create a New Mistral Account (Recommended for Testing)
1. Go to https://console.mistral.ai/
2. Sign up with a different email address
3. Verify your email
4. Go to "API Keys" section
5. Create a new API key
6. Copy the key

### Option 2: Upgrade Your Current Plan
1. Go to https://console.mistral.ai/
2. Log in to your account
3. Go to "Billing" or "Subscription"
4. Upgrade to a paid plan (starts at ~$5/month)
5. Your existing API key will have higher limits

### Option 3: Wait for Rate Limit Reset
- Free tier limits usually reset after 24 hours
- Not recommended if you need to test now

## Update Your .env.local File

1. Open `.env.local` in your project root
2. Find the line with `MISTRAL_API_KEY`
3. Replace the old key with your new key:

```env
# OLD (rate limited)
MISTRAL_API_KEY=old_key_here

# NEW (replace with your new key)
MISTRAL_API_KEY=your_new_api_key_here
```

4. Save the file

## Restart Your Development Server

**Important**: Environment variables are loaded when the server starts, so you MUST restart:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then start it again:
npm run dev
```

## Verify It Works

After restarting, run the test script:

```bash
node test-mistral-api.mjs
```

You should see:
```
✅ SUCCESS! Mistral API is working correctly
```

## Update Agent ID (If Needed)

If you created a new Mistral account, you'll also need to create a new agent:

1. Go to https://console.mistral.ai/agents
2. Click "Create Agent"
3. Configure your agent:
   - **Name**: Saathi
   - **Model**: Choose a model (e.g., mistral-small-latest)
   - **System Prompt**: 
   ```
   You are Saathi, a compassionate AI wellness companion for Indian college students. 
   You provide empathetic, culturally-aware mental health support. You listen without 
   judgment, validate feelings, and gently guide students toward healthy coping strategies. 
   You never diagnose or replace professional help. You encourage students to reach out 
   to their counsellors when needed. You are warm, supportive, and use simple language.
   ```
4. Save the agent
5. Copy the Agent ID (starts with `ag_`)
6. Update `.env.local`:
   ```env
   MISTRAL_AGENT_ID=your_new_agent_id_here
   ```

## Test the Chat

1. Restart your dev server
2. Log in as a student
3. Click on the chat/Saathi
4. Send a test message
5. You should get a response!

## Troubleshooting

### Still getting 429 error?
- Make sure you saved `.env.local`
- Make sure you restarted the dev server
- Try the test script again
- Check if the new API key is correct

### Getting 401 error?
- API key is invalid
- Copy the key again from Mistral console
- Make sure there are no extra spaces

### Getting 404 error?
- Agent ID doesn't exist
- Create a new agent in Mistral console
- Update the Agent ID in `.env.local`

## Cost Considerations

### Free Tier Limits (Approximate)
- ~100-200 requests per day
- Good for testing and development
- Resets every 24 hours

### Paid Plans
- **Starter**: ~$5-10/month
  - Higher rate limits
  - Good for small deployments
- **Pro**: ~$20-50/month
  - Much higher limits
  - Good for production

### Recommendation
- **For Development**: Use free tier with multiple accounts
- **For Production**: Upgrade to paid plan
- **For Demo**: Free tier is fine if you don't test too much

## Alternative: Use Different AI Provider

If Mistral continues to be expensive or limited, you could switch to:
- **OpenAI GPT-4** (more expensive but very good)
- **Anthropic Claude** (good for empathetic responses)
- **Google Gemini** (free tier available)
- **Groq** (very fast, free tier)

Let me know if you want help switching to a different provider!

## Quick Commands

```bash
# Test Mistral API
node test-mistral-api.mjs

# Restart dev server
npm run dev

# Check if env vars are loaded
curl http://localhost:3000/api/check-env
```

## Summary

1. ✅ Get new Mistral API key from console.mistral.ai
2. ✅ Update `MISTRAL_API_KEY` in `.env.local`
3. ✅ Restart dev server (`npm run dev`)
4. ✅ Test with `node test-mistral-api.mjs`
5. ✅ Try the chat in your app

That's it! The chat should work after replacing the API key.
