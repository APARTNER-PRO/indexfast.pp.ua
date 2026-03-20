@echo off
:: ══════════════════════════════════════════════
::  IndexFast — Воркер в циклі (кожні 60 секунд)
::  Залиш це вікно відкритим під час розробки
::  Ctrl+C — зупинити
:: ══════════════════════════════════════════════

set PHP=C:\OpenServer\modules\php\PHP-8.1\php.exe
set WORKER=C:\OpenServer\domains\indexfast.local\worker\worker.php

echo IndexFast Worker — запущено. Ctrl+C для зупинки.
echo.

:loop
echo [%DATE% %TIME%] Обробка черги...
"%PHP%" "%WORKER%"
echo [%DATE% %TIME%] Очікування 60 секунд...
timeout /t 60 /nobreak >nul
goto loop
