<?php
// public_html/api/payment/providers/StripeProvider.php
// PHP 7.4+ / MySQL 5.7+ compatible

require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__) . '/PaymentProviderInterface.php';

class StripeProvider implements PaymentProviderInterface
{
    public function getId(): string    { return 'stripe'; }
    public function getLabel(): string { return 'Stripe'; }
    public function getIcon(): string  { return 'stripe'; }

    public function isEnabled(): bool
    {
        return env('STRIPE_ENABLED', 'false') === 'true' && !empty(env('STRIPE_SECRET_KEY'));
    }

    public function createPaymentSession(array $params): array
    {
        $secretKey   = env('STRIPE_SECRET_KEY');
        $isRecurring = ($params['period'] !== 'custom');
        $mode        = $isRecurring ? 'subscription' : 'payment';
        $interval    = in_array($params['period'], ['year', '3_years'], true) ? 'year' : 'month';

        $postFields = [
            'payment_method_types[]'                           => 'card',
            'mode'                                             => $mode,
            'customer_email'                                   => $params['email'],
            'line_items[0][price_data][currency]'              => strtolower($params['currency'] ?? 'uah'),
            'line_items[0][price_data][unit_amount]'           => (int)(($params['amount'] ?? 0) * 100),
            'line_items[0][price_data][product_data][name]'   => 'IndexFast ' . strtoupper($params['plan_id']),
            'line_items[0][quantity]'                          => 1,
            'metadata[user_id]'                               => $params['user_id'],
            'metadata[plan_id]'                               => $params['plan_id'],
            'metadata[sub_id]'                                => $params['sub_id'],
            'success_url'                                     => $params['success_url'],
            'cancel_url'                                      => $params['cancel_url'],
        ];

        if ($isRecurring) {
            $postFields['line_items[0][price_data][recurring][interval]'] = $interval;
            if ($params['period'] === '3_years') {
                $postFields['line_items[0][price_data][recurring][interval_count]'] = 3;
            }
        }

        $ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($postFields),
            CURLOPT_USERPWD        => $secretKey . ':',
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        if ($httpCode !== 200 || empty($data['id'])) {
            $msg = isset($data['error']['message']) ? $data['error']['message'] : 'Unknown error';
            throw new RuntimeException('Stripe: ' . $msg);
        }

        return [
            'redirect_url' => $data['url'],
            'payment_id'   => $data['id'],
            'extra'        => [],
        ];
    }

    public function verifyWebhookSignature(string $rawBody, array $headers): bool
    {
        $secret = env('STRIPE_WEBHOOK_SECRET', '');
        if (!$secret) return true;

        $sigHeader = isset($headers['stripe-signature']) ? $headers['stripe-signature'] : '';
        if (!$sigHeader) return false;

        $parts = [];
        foreach (explode(',', $sigHeader) as $part) {
            $kv = explode('=', $part, 2);
            if (count($kv) === 2) {
                $parts[$kv[0]] = $kv[1];
            }
        }

        $timestamp = isset($parts['t']) ? (int)$parts['t'] : 0;
        if (abs(time() - $timestamp) > 300) return false;

        $expected = hash_hmac('sha256', $timestamp . '.' . $rawBody, $secret);
        $received = isset($parts['v1']) ? $parts['v1'] : '';

        return hash_equals($expected, $received);
    }

    public function parseWebhookEvent(string $rawBody, array $headers): array
    {
        $data   = json_decode($rawBody, true);
        $type   = isset($data['type'])                      ? $data['type']                      : '';
        $object = isset($data['data']['object'])            ? $data['data']['object']            : [];
        $meta   = isset($object['metadata'])                ? $object['metadata']                : [];

        // PHP 7.4 compatible — switch instead of match
        switch ($type) {
            case 'checkout.session.completed':    $event = 'payment.success';       break;
            case 'invoice.payment_succeeded':     $event = 'subscription.renewed';  break;
            case 'invoice.payment_failed':        $event = 'payment.failed';        break;
            case 'charge.refunded':               $event = 'payment.refunded';      break;
            case 'customer.subscription.deleted': $event = 'subscription.cancelled'; break;
            default:                              $event = 'unknown';
        }

        $expiresAt = null;
        if (!empty($object['current_period_end'])) {
            $expiresAt = date('Y-m-d H:i:s', (int)$object['current_period_end']);
        }

        $extId = '';
        if (!empty($object['id']))             $extId = $object['id'];
        if (!empty($object['payment_intent'])) $extId = $object['payment_intent'];

        $subExtId = '';
        if (!empty($object['subscription'])) $subExtId = $object['subscription'];
        elseif (!empty($object['id']))        $subExtId = $object['id'];

        $email = '';
        if (!empty($object['customer_email']))                  $email = $object['customer_email'];
        elseif (!empty($object['customer_details']['email']))   $email = $object['customer_details']['email'];

        $amount = null;
        if (isset($object['amount_total'])) $amount = $object['amount_total'] / 100;
        elseif (isset($object['amount']))   $amount = $object['amount'] / 100;

        return [
            'event'       => $event,
            'external_id' => $extId,
            'sub_id'      => $subExtId,
            'user_id'     => isset($meta['user_id']) ? (int)$meta['user_id'] : null,
            'email'       => $email ?: null,
            'plan_id'     => isset($meta['plan_id']) ? $meta['plan_id'] : null,
            'amount'      => $amount,
            'currency'    => strtoupper(isset($object['currency']) ? $object['currency'] : ''),
            'expires_at'  => $expiresAt,
            'raw'         => $data,
        ];
    }

    public function cancelSubscription(string $externalSubId): bool
    {
        $ch = curl_init("https://api.stripe.com/v1/subscriptions/{$externalSubId}");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => 'DELETE',
            CURLOPT_USERPWD        => env('STRIPE_SECRET_KEY') . ':',
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $data = json_decode($response, true);
        return $httpCode === 200 && isset($data['status']) && $data['status'] === 'canceled';
    }
}
