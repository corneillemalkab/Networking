@echo off
echo =======================================================
echo   1-Click Automatic GitHub Sync - Networking Academy
echo =======================================================
echo.

cd /d "D:\Netowrking level 1"

echo [1/3] Checking for changes...
git add .

echo [2/3] Creating automatic update commit...
git commit -m "Auto update: %date% %time%"

echo [3/3] Uploading to GitHub...
git push origin main

echo.
echo =======================================================
echo   SUCCESS! Your live site is now updating on GitHub:
echo   https://corneillemalkab.github.io/Networking/
echo =======================================================
echo.
pause
