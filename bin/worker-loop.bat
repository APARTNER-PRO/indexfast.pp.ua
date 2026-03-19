@echo off
:: ══════════════════════════════════════════════
::  IndexFast — Воркер в циклі (кожні 60 секунд)
::  Залиш це вікно відкритим під час розробки
::  Ctrl+C — зупинити
:: ══════════════════════════════════════════════

set PHP=D:\OSPanelNew\modules\php\PHP-8.1\PHP\php.exe
set WORKER=D:\OSPanelNew\home\indexfast.local

echo IndexFast Worker - run. Ctrl+C for stop.
echo.

:loop
echo [%DATE% %TIME%] Queue processing...
"%PHP%" "%WORKER%"
echo [%DATE% %TIME%] Waiting 60 seconds...
timeout /t 60 /nobreak >nul
goto loop
