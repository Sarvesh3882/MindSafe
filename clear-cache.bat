@echo off
echo ========================================
echo  Clearing Next.js Build Cache
echo ========================================
echo.

echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Deleting .next folder...
if exist .next (
    rmdir /s /q .next
    echo ✓ .next folder deleted
) else (
    echo ✓ .next folder doesn't exist
)

echo.
echo Deleting node_modules cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ node_modules\.cache deleted
) else (
    echo ✓ node_modules\.cache doesn't exist
)

echo.
echo ========================================
echo  Cache Cleared Successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Hard refresh your browser: Ctrl + Shift + R
echo 2. Run: npm run dev
echo 3. Test the app in incognito mode if issues persist
echo.
pause
