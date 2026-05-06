@echo off
chcp 65001 >nul
cd /d "%~dp0"
title DECODER Server
echo =================================
echo   DECODER - Starting the server
echo =================================
echo.
echo Open in browser:
echo http://localhost:3000
echo.
echo To stop, close this window.
echo =================================
echo.

start "" http://localhost:3000
node server.js

echo.
echo Сервер остановлен.
timeout /t 2 >nul