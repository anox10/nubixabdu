@echo off
echo ========================================
echo   CLINORA - Deploy to Vercel
echo ========================================
echo.

cd /d C:\Users\SYED\my-project\nubixabdu\frontend

echo Checking if we're in the right directory...
if not exist "dist" (
    echo ERROR: dist folder not found!
    echo Please run 'npm run build' first.
    pause
    exit /b 1
)

echo ✓ Found dist folder
echo.
echo Starting Vercel deployment...
echo.

vercel --prod

echo.
echo ========================================
echo Deployment complete!
echo ========================================
pause
