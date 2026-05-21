@echo off
REM Clear Today's Check-ins - Windows Batch Script
REM Double-click this file to run the script

echo.
echo ========================================
echo   Clear Today's Check-ins
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Run the script
node clear-todays-checkins.mjs

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
pause
