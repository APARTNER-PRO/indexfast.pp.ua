<?php
// ══════════════════════════════════════════════
//  PATCH /api/user/profile.php
//  Оновлює профіль: name, surname, email, password
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

requireMethod('PATCH');
$uid  = (int)requireAuth()['sub'];
$body = getBody();

$user = DB::row(
    "SELECT id, name, surname, email, email_verified, password_hash, google_id
     FROM users WHERE id = ?",
    [$uid]
);
if (!$user) respond(404, 'Користувача не знайдено');

$updates = [];
$params  = [];
$emailChanged   = false;
$passwordChanged = false;

// ── Ім'я і прізвище
if (isset($body['name'])) {
    $name = trim(sanitize($body['name']));
    if (strlen($name) < 2) respond(422, "Ім'я має бути мінімум 2 символи");
    $updates[] = "name = ?";
    $params[]  = $name;
}
if (isset($body['surname'])) {
    $updates[] = "surname = ?";
    $params[]  = trim(sanitize($body['surname']));
}

// ── Email
if (isset($body['email'])) {
    $newEmail = strtolower(trim($body['email']));
    if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL))
        respond(422, 'Невалідна email адреса');

    if ($newEmail !== $user['email']) {
        // Перевіряємо чи не зайнятий
        if (DB::row("SELECT id FROM users WHERE email = ? AND id != ?", [$newEmail, $uid]))
            respond(409, 'Цей email вже використовується');

        $updates[]    = "email = ?";
        $updates[]    = "email_verified = 0"; // при зміні email → потрібна повторна верифікація
        $params[]     = $newEmail;
        $emailChanged = true;
    }
}

// ── Пароль
if (isset($body['new_password'])) {
    $currentPass = $body['current_password'] ?? '';
    $newPass     = $body['new_password'];

    // Якщо є поточний пароль — перевіряємо
    if ($user['password_hash']) {
        if (!$currentPass) respond(422, 'Введіть поточний пароль');
        if (!password_verify($currentPass, $user['password_hash']))
            respond(401, 'Поточний пароль невірний');
    }

    if (strlen($newPass) < PASSWORD_MIN_LENGTH)
        respond(422, 'Новий пароль має бути мінімум ' . PASSWORD_MIN_LENGTH . ' символів');

    $updates[]       = "password_hash = ?";
    $params[]        = password_hash($newPass, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
    $passwordChanged = true;
}

if (empty($updates)) respond(422, 'Немає полів для оновлення');

// ── Застосовуємо зміни
$params[] = $uid;
DB::exec(
    "UPDATE users SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?",
    $params
);

// ── Якщо email змінився — надсилаємо підтвердження
if ($emailChanged) {
    $newUser = DB::row("SELECT email, name FROM users WHERE id = ?", [$uid]);
    $verifyToken = Token::create($uid, 'email_verify');
    Mailer::verifyEmail($newUser['email'], $newUser['name'], $verifyToken);

    // Інвалідуємо всі refresh токени (примусовий перелогін після зміни email)
    DB::exec(
        "UPDATE tokens SET used_at = NOW()
         WHERE user_id = ? AND type = 'refresh' AND used_at IS NULL",
        [$uid]
    );
}

// ── Повертаємо оновлений профіль
$updated = DB::row(
    "SELECT id, name, surname, email, email_verified, plan, avatar_url FROM users WHERE id = ?",
    [$uid]
);

$message = 'Профіль оновлено';
if ($emailChanged)    $message = 'Профіль оновлено. Підтвердіть новий email.';
if ($passwordChanged) $message = 'Пароль змінено. Увійдіть знову.';

respondOk($message, [
    'user'            => [
        'id'             => (int)$updated['id'],
        'name'           => $updated['name'],
        'surname'        => $updated['surname'],
        'email'          => $updated['email'],
        'email_verified' => (bool)$updated['email_verified'],
        'plan'           => $updated['plan'],
        'avatar_url'     => $updated['avatar_url'],
    ],
    'email_changed'    => $emailChanged,
    'password_changed' => $passwordChanged,
]);
