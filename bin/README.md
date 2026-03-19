# Запуск воркера — варіанти

## Варіант 1: OpenServer Panel (рекомендовано)

Відкрий **OpenServer → Додатково → Планувальник завдань**
і додай рядки з файлу `openserver-cron.ini`.

Або помісти `openserver-cron.ini` в папку:
```
C:\OpenServer\userdata\cron\indexfast.ini
```

Замін у файлі:
- `{php_bin}` → шлях до php.exe, наприклад `C:\OpenServer\modules\php\PHP-8.1`
- `{base_dir}` → корінь OpenServer, наприклад `C:\OpenServer`

---

## Варіант 2: Ручний запуск (для тестування)

Запусти `worker-run.bat` — обробить поточну чергу один раз.

---

## Варіант 3: Цикл під час розробки

Запусти `worker-loop.bat` — запускає воркер кожні 60 секунд.
Залиш вікно cmd відкритим.

---

## Варіант 4: Windows Task Scheduler (без OpenServer)

1. Відкрий `Планувальник завдань` (taskschd.msc)
2. Дія → Створити просту задачу
3. Тригер → Щодня → Повторювати кожні 1 хвилину
4. Дія → Запустити програму:
   - Програма: `C:\OpenServer\modules\php\PHP-8.1\php.exe`
   - Аргументи: `C:\OpenServer\domains\indexfast.local\worker\worker.php`
