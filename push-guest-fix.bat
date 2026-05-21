@echo off
echo ========================================
echo  Push Guest User Fix to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Checking git status...
git status
echo.

echo ========================================
echo Files to be committed:
echo ========================================
echo [Modified]
echo   - src/app/student/layout.tsx
echo   - src/app/counsellor/layout.tsx
echo   - src/app/admin/layout.tsx
echo.
echo [New]
echo   - supabase/migrations/039_ensure_all_users_have_profiles.sql
echo   - GUEST_USER_FIX_COMPLETE.md
echo   - PUSH_GUEST_FIX_TO_GITHUB.md
echo   - GUEST_FIX_SUMMARY.md
echo   - push-guest-fix.bat
echo.
echo [Updated]
echo   - FIX_GUEST_USERS.sql
echo.

set /p confirm="Do you want to stage and commit these files? (y/n): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b
)

echo.
echo Staging files...
git add src/app/student/layout.tsx
git add src/app/counsellor/layout.tsx
git add src/app/admin/layout.tsx
git add supabase/migrations/039_ensure_all_users_have_profiles.sql
git add FIX_GUEST_USERS.sql
git add GUEST_USER_FIX_COMPLETE.md
git add PUSH_GUEST_FIX_TO_GITHUB.md
git add GUEST_FIX_SUMMARY.md
git add push-guest-fix.bat

echo.
echo Committing...
git commit -m "fix: resolve intermittent Guest user display issue

- Disable Next.js caching in all role layouts (force-dynamic)
- Replace .single() with .maybeSingle() to handle missing profiles
- Add improved fallback to auth metadata when profile missing
- Create migration 039 to ensure all auth users have profiles
- Fix FIX_GUEST_USERS.sql to handle NULL college_id properly"

if errorlevel 1 (
    echo.
    echo ERROR: Commit failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Commit successful!
echo ========================================
echo.

set /p push="Do you want to push to GitHub now? (y/n): "
if /i not "%push%"=="y" (
    echo.
    echo Commit created but not pushed.
    echo Run 'git push origin main' when ready.
    pause
    exit /b
)

echo.
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo Check your internet connection and GitHub credentials.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Vercel will auto-deploy (check dashboard)
echo 2. Run migration 039 in Supabase SQL Editor
echo 3. Test production site after deployment
echo.
pause
