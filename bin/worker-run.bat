@echo off
:: ══════════════════════════════════════════════
::  IndexFast — Ручний запуск воркера (Windows)
::  Запускай коли хочеш обробити чергу вручну
:: ══════════════════════════════════════════════

:: Змін ці шляхи під свій OpenServer
set PHP=C:\OpenServer\modules\php\PHP-8.1\php.exe
set WORKER=C:\OpenServer\domains\indexfast.local\worker\worker.php

echo [%TIME%] Запуск воркера...
"%PHP%" "%WORKER%"
echo [%TIME%] Завершено.
pause
