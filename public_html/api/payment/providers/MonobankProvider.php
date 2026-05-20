<?php
// public_html/api/payment/providers/MonobankProvider.php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__) . '/PaymentProviderInterface.php';

class MonobankProvider implements PaymentProviderInterface
{
    public function getId(): string    { return 'monobank'; }
    public function getLabel(): string { return 'Monobank'; }
    public function getIcon(): string  { return 'monobank'; }

    public function isEnabled(): bool
    {
        return env('MONOBANK_ENABLED', 'false') === 'true' && !empty(env('MONOBANK_TOKEN'));
    }

    public function createPaymentSession(array $params): array
    {
        $kopecks = (int)(($params['amount'] ?? 0) * 100);
        $payload = [
            'amount'  => $kopecks,
            'ccy'     => 980,
            'merchantPaymInfo' => [
                'reference'   => 'sub_' . $params['sub_id'],
                'destination' => 'IndexFast ' . strtoupper($params['plan_id']),
                'basketOrder' => [[
                    'name'  => 'IndexFast ' . strtoupper($params['plan_id']),
                    'qty'   => 1,
                    'sum'   => $kopecks,
                    'unit'  => 'шт.',
                    'code'  => $params['plan_id'],
                ]],
            ],
            'redirectUrl' => $params['success_url'],
            'webHookUrl'  => env('APP_URL') . '/api/payment/webhooks/monobank_webhook.php',
            'validity'    => 3600,
            'comment'     => 'user_id:' . $params['user_id'] . ';plan:' . $params['plan_id'] . ';sub:' . $params['sub_id'],
        ];

        $ch = curl_init('https://api.monobank.ua/api/merchant/invoice/create');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => [
                'X-Token: ' . env('MONOBANK_TOKEN'),
                'Content-Type: application/json',
            ],
        ]);
        $r    = json_decode(curl_exec($ch), true);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code !== 200 || empty($r['invoiceId'])) {
            throw new RuntimeException('Monobank: ' . (isset($r['errText']) ? $r['errText'] : json_encode($r)));
        }

        return ['redirect_url' => $r['pageUrl'], 'payment_id' => $r['invoiceId'], 'extra' => []];
    }

    public function verifyWebhookSignature(string $rawBody, array $headers): bool
    {
        $pub = env('MONOBANK_PUBLIC_KEY', '');
        if (!$pub) return true;

        $sig = isset($headers['x-sign']) ? $headers['x-sign'] : '';
        if (!$sig) return false;

        if (function_exists('sodium_crypto_sign_verify_detached')) {
            return sodium_crypto_sign_verify_detached(
                base64_decode($sig),
                $rawBody,
                base64_decode($pub)
            );
        }
        return true;
    }

    public function parseWebhookEvent(string $rawBody, array $headers): array
    {
        $data    = json_decode($rawBody, true);
        $comment = isset($data['comment']) ? $data['comment'] : '';

        preg_match('/user_id:(\d+)/', $comment, $m1);
        preg_match('/plan:([a-z]+)/',  $comment, $m2);

        $status = isset($data['status']) ? $data['status'] : '';
        switch ($status) {
            case 'success':  $event = 'payment.success';  break;
            case 'failure':
            case 'expired':  $event = 'payment.failed';   break;
            case 'reversed': $event = 'payment.refunded'; break;
            default:         $event = 'unknown';
        }

        return [
            'event'       => $event,
            'external_id' => isset($data['invoiceId']) ? $data['invoiceId'] : '',
            'sub_id'      => '',
            'user_id'     => isset($m1[1]) ? (int)$m1[1] : null,
            'email'       => null,
            'plan_id'     => isset($m2[1]) ? $m2[1] : null,
            'amount'      => isset($data['amount']) ? $data['amount'] / 100 : null,
            'currency'    => 'UAH',
            'expires_at'  => null,
            'raw'         => $data,
        ];
    }

    public function cancelSubscription(string $externalSubId): bool
    {
        throw new RuntimeException('Monobank: no recurring subscription API');
    }
}
