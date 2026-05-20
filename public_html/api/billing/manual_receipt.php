<?php
// public_html/api/billing/manual_receipt.php
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../helpers.php';

requireMethod('POST');
$user  = requireAuth();
$subId = (int)($_POST['sub_id'] ?? (json_decode(file_get_contents('php://input'),true)['sub_id'] ?? 0));
$notes = trim($_POST['notes'] ?? '');

if (!$subId) respond(400, 'Не вказано ID підписки');

$sub = DB::row(
    "SELECT * FROM subscriptions WHERE id=? AND user_id=? AND status='awaiting_manual_confirmation'",
    [$subId, $user['id']]
);
if (!$sub) respond(404, 'Підписку не знайдено або вона не очікує підтвердження');

// Файл квитанції
$receiptPath = null; $receiptUrl = null;
if (!empty($_FILES['receipt']) && $_FILES['receipt']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['receipt'];
    $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg','jpeg','png','pdf','webp'], true)) respond(400, 'Дозволені: JPG, PNG, PDF');
    if ($file['size'] > 10*1024*1024) respond(400, 'Файл > 10 MB');

    // Зберігаємо поза public_html (безпечно)
    $dir = dirname(__DIR__, 3) . '/storage/receipts/';
    if (!is_dir($dir)) mkdir($dir, 0750, true);

    $filename    = 'receipt_'.$subId.'_'.time().'.'.$ext;
    $receiptPath = $dir.$filename;
    if (!move_uploaded_file($file['tmp_name'], $receiptPath)) respond(500, 'Помилка збереження файлу');
    $receiptUrl = '/storage/receipts/'.$filename;
}

DB::exec(
    "INSERT INTO manual_payment_requests
       (subscription_id, user_id, user_email, plan_id, period, amount, receipt_path, receipt_url, notes, status)
     VALUES (?,?,?,?,?,?,?,?,?,'pending')
     ON DUPLICATE KEY UPDATE receipt_path=VALUES(receipt_path),receipt_url=VALUES(receipt_url),notes=VALUES(notes),updated_at=NOW()",
    [$subId,$user['id'],$user['email'],$sub['plan_id'],$sub['period'],$sub['amount'],$receiptPath,$receiptUrl,$notes]
);

// Email адміну
$notify = env('PAYMENT_NOTIFICATION_EMAIL','');
if ($notify) {
    try {
        $planLabel  = Plans::CONFIG[$sub['plan_id']]['label'] ?? strtoupper($sub['plan_id']);
        $periodLabel= $sub['period']==='year'?'рік':'місяць';
        $amount     = number_format($sub['amount']??0,2,'.',' ');
        $adminUrl   = env('APP_URL').'/admin/';

        $html = <<<HTML
        <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
        <body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <table width="520" style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,.08);max-width:520px">
        <tr><td style="background:#050508;padding:20px 32px">
          <span style="font-size:18px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span>
          <span style="color:#ffd060;margin-left:12px">⚡ Нова заявка на оплату</span>
        </td></tr>
        <tr><td style="padding:28px;color:#c8c8d8;font-size:14px;line-height:1.8">
          <table width="100%">
            <tr><td style="color:#888;width:120px">Email:</td><td><strong style="color:#eeeef6">{$user['email']}</strong></td></tr>
            <tr><td style="color:#888">Тариф:</td><td><span style="color:#00ff88;font-weight:700">{$planLabel}</span> · {$periodLabel}</td></tr>
            <tr><td style="color:#888">Сума:</td><td><strong style="color:#eeeef6">{$amount} UAH</strong></td></tr>
            <tr><td style="color:#888">Sub ID:</td><td style="color:#555570">#{$subId}</td></tr>
            <tr><td style="color:#888">Примітка:</td><td>{$notes}</td></tr>
          </table>
          <p style="margin-top:20px;text-align:center">
            <a href="{$adminUrl}" style="background:#ffd060;color:#050508;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:700">Підтвердити в адмінці →</a>
          </p>
        </td></tr></table></td></tr></table></body></html>
        HTML;

        Mailer::send($notify, "💳 Нова заявка — {$user['email']} ({$planLabel})", $html);
    } catch (Throwable $e) {
        error_log('[manual_receipt] email: '.$e->getMessage());
    }
}

respond(200, 'Квитанцію отримано. Очікуйте підтвердження 1–24 год.', [
    'sub_id' => $subId, 'status' => 'awaiting_manual_confirmation',
]);
