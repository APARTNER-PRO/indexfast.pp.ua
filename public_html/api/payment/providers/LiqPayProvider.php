<?php
// public_html/api/payment/providers/LiqPayProvider.php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__) . '/PaymentProviderInterface.php';

class LiqPayProvider implements PaymentProviderInterface
{
    public function getId(): string    { return 'liqpay'; }
    public function getLabel(): string { return 'LiqPay'; }
    public function getIcon(): string  { return 'liqpay'; }

    public function isEnabled(): bool
    {
        return env('LIQPAY_ENABLED', 'false') === 'true'
            && !empty(env('LIQPAY_PUBLIC_KEY'))
            && !empty(env('LIQPAY_PRIVATE_KEY'));
    }

    public function createPaymentSession(array $params): array
    {
        $pub    = env('LIQPAY_PUBLIC_KEY');
        $priv   = env('LIQPAY_PRIVATE_KEY');
        $period = in_array($params['period'], ['year', '3_years'], true) ? 'year' : 'month';

        $data = [
            'version'              => 3,
            'public_key'           => $pub,
            'action'               => 'subscribe',
            'amount'               => number_format($params['amount'] ?? 0, 2, '.', ''),
            'currency'             => strtoupper($params['currency'] ?? 'UAH'),
            'description'          => 'IndexFast ' . strtoupper($params['plan_id']) . ' (' . $period . ')',
            'order_id'             => 'sub_' . $params['sub_id'] . '_' . time(),
            'result_url'           => $params['success_url'],
            'server_url'           => env('APP_URL') . '/api/payment/webhooks/liqpay_webhook.php',
            'subscribe_date_start' => date('Y-m-d H:i:s'),
            'subscribe_periodicity'=> $period,
            'info'                 => json_encode([
                'user_id' => $params['user_id'],
                'plan_id' => $params['plan_id'],
                'sub_id'  => $params['sub_id'],
            ]),
        ];

        $enc = base64_encode(json_encode($data));
        $sig = base64_encode(sha1($priv . $enc . $priv, true));

        return [
            'redirect_url' => null,
            'payment_id'   => 'sub_' . $params['sub_id'],
            'extra'        => [
                'method'      => 'form_post',
                'form_action' => 'https://www.liqpay.ua/api/3/checkout',
                'data'        => $enc,
                'signature'   => $sig,
            ],
        ];
    }

    public function verifyWebhookSignature(string $rawBody, array $headers): bool
    {
        $priv = env('LIQPAY_PRIVATE_KEY', '');
        $data = isset($_POST['data'])      ? $_POST['data']      : '';
        $sig  = isset($_POST['signature']) ? $_POST['signature'] : '';
        if (!$data || !$sig) return false;
        return hash_equals(base64_encode(sha1($priv . $data . $priv, true)), $sig);
    }

    public function parseWebhookEvent(string $rawBody, array $headers): array
    {
        $data    = isset($_POST['data']) ? $_POST['data'] : '';
        $decoded = json_decode(base64_decode($data), true);
        if (!is_array($decoded)) $decoded = [];
        $info    = json_decode(isset($decoded['info']) ? $decoded['info'] : '{}', true);
        if (!is_array($info)) $info = [];

        $status = isset($decoded['status']) ? $decoded['status'] : '';
        switch ($status) {
            case 'success':
            case 'subscribed':   $event = 'payment.success';       break;
            case 'failure':
            case 'error':        $event = 'payment.failed';        break;
            case 'reversed':     $event = 'payment.refunded';      break;
            case 'unsubscribed': $event = 'subscription.cancelled'; break;
            default:             $event = 'unknown';
        }

        return [
            'event'       => $event,
            'external_id' => isset($decoded['payment_id']) ? (string)$decoded['payment_id'] : '',
            'sub_id'      => isset($decoded['order_id'])   ? $decoded['order_id'] : '',
            'user_id'     => isset($info['user_id'])       ? $info['user_id']     : null,
            'email'       => null,
            'plan_id'     => isset($info['plan_id'])       ? $info['plan_id']     : null,
            'amount'      => isset($decoded['amount'])     ? (float)$decoded['amount'] : null,
            'currency'    => strtoupper(isset($decoded['currency']) ? $decoded['currency'] : ''),
            'expires_at'  => null,
            'raw'         => $decoded,
        ];
    }

    public function cancelSubscription(string $externalSubId): bool
    {
        throw new RuntimeException('LiqPay: cancellation must be done via LiqPay dashboard');
    }
}
