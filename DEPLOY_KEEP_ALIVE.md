# Deploy Keep-Alive System - Quick Guide

## Step 1: Commit and Push to GitHub

```powershell
# Navigate to MindSafe directory
cd "C:\Users\codex\OneDrive\Documents\MindSafe_India\MindSafe"

# Add the new files
git add .github/workflows/keep-alive.yml
git add src/app/api/cron/keep-alive/route.ts
git add SUPABASE_KEEP_ALIVE_SETUP.md
git add DEPLOY_KEEP_ALIVE.md

# Commit
git commit -m "Add Supabase keep-alive system to prevent database pausing"

# Push to GitHub
git push origin main
```

## Step 2: Wait for Vercel Deployment
- Vercel will automatically deploy when you push to GitHub
- Wait 2-3 minutes for deployment to complete
- Check Vercel dashboard for deployment status

## Step 3: Test the Endpoint

```powershell
curl https://mindsafe-india.vercel.app/api/cron/keep-alive
```

**Expected Response:**
```json
{
  "status": "alive",
  "message": "Database is active",
  "timestamp": "2026-05-24T...",
  "queryResult": "success"
}
```

## Step 4: Verify GitHub Actions

1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. You should see "Supabase Keep-Alive" workflow listed
3. Click on it
4. Click **"Run workflow"** button (top right)
5. Select branch: `main`
6. Click green **"Run workflow"** button
7. Wait 10-20 seconds, refresh the page
8. Click on the workflow run to see logs
9. Verify it shows ✅ success

## Step 5: Done! 🎉

Your database will now stay active automatically:
- ✅ Runs every Monday at 2:30 PM IST
- ✅ Zero maintenance required
- ✅ Free forever (GitHub Actions free tier)
- ✅ Email notifications if it fails

## Troubleshooting

### If endpoint returns 404:
- Wait for Vercel deployment to complete
- Check Vercel dashboard for deployment errors
- Verify the file is at: `src/app/api/cron/keep-alive/route.ts`

### If GitHub Actions workflow doesn't appear:
- Make sure you pushed `.github/workflows/keep-alive.yml`
- Check GitHub repository → Actions tab
- Verify Actions are enabled in repository settings

### If workflow fails:
- Check the workflow logs in GitHub Actions
- Verify Vercel deployment is successful
- Test the endpoint manually with curl

---

**Status**: Ready to deploy  
**Time Required**: 5 minutes  
**Cost**: $0 (completely free)
