# Supabase Keep-Alive System

## Overview
Automated system to prevent Supabase free tier from pausing due to 90 days of inactivity.

## How It Works
1. **API Endpoint**: `/api/cron/keep-alive` makes a simple database query
2. **GitHub Actions**: Runs every Monday at 9:00 AM UTC (2:30 PM IST)
3. **Zero Maintenance**: Completely automated, no manual intervention needed

## Files Created
- `src/app/api/cron/keep-alive/route.ts` - Keep-alive endpoint
- `.github/workflows/keep-alive.yml` - GitHub Actions workflow

## Setup Instructions

### 1. Test the Endpoint Manually
```bash
curl https://mindsafe-india.vercel.app/api/cron/keep-alive
```

Expected response:
```json
{
  "status": "alive",
  "message": "Database is active",
  "timestamp": "2026-05-24T...",
  "queryResult": "success"
}
```

### 2. Commit and Push to GitHub
```bash
git add .github/workflows/keep-alive.yml
git add src/app/api/cron/keep-alive/route.ts
git commit -m "Add Supabase keep-alive system"
git push origin main
```

### 3. Verify GitHub Actions
1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "Supabase Keep-Alive" workflow
4. Click **Run workflow** to test it manually
5. Check that it completes successfully ✅

### 4. Monitor Weekly Runs
- GitHub Actions will run automatically every Monday
- Check the Actions tab to see run history
- You'll get email notifications if it fails

## Schedule
- **Frequency**: Weekly (every Monday)
- **Time**: 9:00 AM UTC / 2:30 PM IST
- **Trigger**: Automatic via GitHub Actions cron

## Benefits
✅ **100% Free** - GitHub Actions provides 2,000 minutes/month free  
✅ **Zero Maintenance** - Set it and forget it  
✅ **Reliable** - GitHub's infrastructure handles scheduling  
✅ **Transparent** - View all runs in GitHub Actions tab  
✅ **Manual Override** - Can trigger manually anytime  

## Troubleshooting

### If the workflow fails:
1. Check GitHub Actions logs for error details
2. Verify Vercel deployment is running
3. Test the endpoint manually with curl
4. Check Supabase dashboard for any issues

### If you need to change the schedule:
Edit `.github/workflows/keep-alive.yml` and modify the cron expression:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

Cron format: `minute hour day-of-month month day-of-week`

## Cost
- **GitHub Actions**: FREE (2,000 minutes/month, this uses ~1 minute/week)
- **Vercel**: FREE (API route calls don't count against limits)
- **Supabase**: FREE (simple query keeps database active)

## Security
- No sensitive data exposed
- Read-only database query
- Public endpoint (safe, just counts users)

## Status
✅ **ACTIVE** - System is configured and ready to run

---

**Last Updated**: May 24, 2026  
**Status**: Production Ready
