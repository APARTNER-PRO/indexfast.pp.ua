<?php
// public_html/api/payment/providers/PayPalProvider.php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__) . '/PaymentProviderInterface.php';

class PayPalProvider implements PaymentProviderInterface
{
    private string $base;

    public function __construct()
    {
        $this->base = env('PAYPAL_MODE', 'live') === 'sandbox'
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';
    }

    public function getId(): string    { return 'paypal'; }
    public function getLabel(): string { return 'PayPal'; }
    public function getIcon(): string  { return 'paypal'; }

    public function isEnabled(): bool
    {
        return env('PAYPAL_ENABLED', 'false') === 'true'
            && !empty(env('PAYPAL_CLIENT_ID'))
            && !empty(env('PAYPAL_CLIENT_SECRET'));
    }

    public function createPaymentSession(array $params): array
    {
        $token = $this->getToken();
        $payload = [
            'intent'         => 'CAPTURE',
            'purchase_units' => [[
                'custom_id'   => json_encode([
                    'user_id' => $params['user_id'],
                    'sub_id'  => $params['sub_id'],
                    'plan_id' => $params['plan_id'],
                ]),
                'amount'      => [
                    'currency_code' => strtoupper($params['currency'] ?? 'USD'),
                    'value'         => number_format($params['amount'] ?? 0, 2, '.', ''),
                ],
                'description' => 'IndexFast ' . strtoupper($params['plan_id']),
            ]],
            'application_context' => [
                'return_url' => $params['success_url'],
                'cancel_url' => $params['cancel_url'],
                'brand_name' => 'IndexFast',
                'user_action'=> 'PAY_NOW',
            ],
        ];

        $ch = curl_init($this->base . '/v2/checkout/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
                'Prefer: return=representation',
            ],
        ]);
        $r    = json_decode(curl_exec($ch), true);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code !== 201 || empty($r['id'])) {
            throw new RuntimeException('PayPal: ' . json_encode(isset($r['details']) ? $r['details'] : $r));
        }

        $approveUrl = '';
        foreach ((isset($r['links']) ? $r['links'] : []) as $link) {
            if ($link['rel'] === 'approve') {
                $approveUrl = $link['href'];
                break;
            }
        }

        return ['redirect_url' => $approveUrl, 'payment_id' => $r['id'], 'extra' => []];
    }

    public function verifyWebhookSignature(string $rawBody, array $headers): bool
    {
        $wid = env('PAYPAL_WEBHOOK_ID', '');
        if (!$wid) return true;

        $token   = $this->getToken();
        $payload = [
            'auth_algo'         => isset($headers['paypal-auth-algo'])      ? $headers['paypal-auth-algo']      : '',
            'cert_url'          => isset($headers['paypal-cert-url'])       ? $headers['paypal-cert-url']       : '',
            'transmission_id'   => isset($headers['paypal-transmission-id'])? $headers['paypal-transmission-id']: '',
            'transmission_sig'  => isset($headers['paypal-transmission-sig'])? $headers['paypal-transmission-sig']:'',
            'transmission_time' => isset($headers['paypal-transmission-time'])? $headers['paypal-transmission-time']:'',
            'webhook_id'        => $wid,
            'webhook_event'     => json_decode($rawBody, true),
        ];

        $ch = curl_init($this->base . '/v1/notifications/verify-webhook-signature');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $token, 'Content-Type: application/json'],
        ]);
        $r = json_decode(curl_exec($ch), true);
        curl_close($ch);
        return isset($r['verification_status']) && $r['verification_status'] === 'SUCCESS';
    }

    public function parseWebhookEvent(string $rawBody, array $headers): array
    {
        $data = json_decode($rawBody, true);
        $et   = isset($data['event_type']) ? $data['event_type'] : '';
        $res  = isset($data['resource'])   ? $data['resource']   : [];
        $cid  = json_decode(isset($res['custom_id']) ? $res['custom_id'] : '{}', true);

        switch ($et) {
            case 'CHECKOUT.ORDER.APPROVED':
            case 'PAYMENT.CAPTURE.COMPLETED':  $event = 'payment.success';       break;
            case 'PAYMENT.CAPTURE.DENIED':
            case 'PAYMENT.CAPTURE.DECLINED':   $event = 'payment.failed';        break;
            case 'PAYMENT.CAPTURE.REFUNDED':   $event = 'payment.refunded';      break;
            case 'BILLING.SUBSCRIPTION.CANCELLED': $event = 'subscription.cancelled'; break;
            case 'PAYMENT.SALE.COMPLETED':     $event = 'subscription.renewed';  break;
            default:                           $event = 'unknown';
        }

        $amount = null;
        if (!empty($res['amount']['value'])) $amount = (float)$res['amount']['value'];

        return [
            'event'       => $event,
            'external_id' => isset($res['id']) ? $res['id'] : '',
            'sub_id'      => isset($res['billing_agreement_id']) ? $res['billing_agreement_id'] : '',
            'user_id'     => isset($cid['user_id']) ? $cid['user_id'] : null,
            'email'       => isset($res['payer']['email_address']) ? $res['payer']['email_address'] : null,
            'plan_id'     => isset($cid['plan_id']) ? $cid['plan_id'] : null,
            'amount'      => $amount,
            'currency'    => strtoupper(isset($res['amount']['currency_code']) ? $res['amount']['currency_code'] : ''),
            'expires_at'  => null,
            'raw'         => $data,
        ];
    }

    public function cancelSubscription(string $externalSubId): bool
    {
        $ch = curl_init($this->base . "/v1/billing/subscriptions/{$externalSubId}/cancel");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(['reason' => 'Cancelled by user']),
            CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $this->getToken(), 'Content-Type: application/json'],
        ]);
        curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $code === 204;
    }

    private function getToken(): string
    {
        $ch = curl_init($this->base . '/v1/oauth2/token');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
            CURLOPT_USERPWD        => env('PAYPAL_CLIENT_ID') . ':' . env('PAYPAL_CLIENT_SECRET'),
            CURLOPT_HTTPHEADER     => ['Accept: application/json'],
        ]);
        $r = json_decode(curl_exec($ch), true);
        curl_close($ch);
        if (empty($r['access_token'])) throw new RuntimeException('PayPal: cannot get token');
        return $r['access_token'];
    }
}
