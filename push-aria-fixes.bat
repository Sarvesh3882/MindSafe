@echo off
echo ========================================
echo  ARIA Fixes - GitHub Push Script
echo ========================================
echo.

echo Step 1: Checking Git status...
git status
echo.

echo Step 2: Staging all ARIA changes...
git add src/lib/aria/engine.ts
git add src/app/student/checkin/page.tsx
git add src/app/student/checkin/state-machine.ts
git add src/lib/aria/insights.ts
git add ARIA_*.md
git add test-aria-*.ts
git add supabase/migrations/038_verify_and_fix_maps_to.sql
git add CHECK_MAPS_TO*.sql
echo Done!
echo.

echo Step 3: Committing changes...
git commit -m "fix: ARIA assessment system - escalation, tips, and crisis detection - Fixed baseline assessment guarantee (always run PHQ-9 + GAD-7) - Fixed premature completion for stable users - Fixed wellness tips personalization based on scores - Fixed isStable calculation to use final risk level - Added comprehensive debug logging and test suites"
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo  Push Complete!
echo ========================================
echo.
echo Check your GitHub repo:
echo https://github.com/Sarvesh3882/mindsafe-india.v1
echo.

pause
