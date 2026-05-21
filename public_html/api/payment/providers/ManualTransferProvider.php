<?php
// public_html/api/payment/providers/ManualTransferProvider.php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__) . '/PaymentProviderInterface.php';

class ManualTransferProvider implements PaymentProviderInterface
{
    public function getId(): string    { return 'manual'; }
    public function getLabel(): string { return 'Банківський переказ'; }
    public function getIcon(): string  { return 'bank'; }

    public function isEnabled(): bool
    {
        return env('MANUAL_TRANSFER_ENABLED', 'false') === 'true';
    }

    public function createPaymentSession(array $params): array
    {
        $period = ($params['period'] === 'year') ? 'рік' : (($params['period'] === '3_years') ? '3 роки' : 'місяць');
        return [
            'redirect_url' => null,
            'payment_id'   => 'manual_' . $params['sub_id'] . '_' . time(),
            'extra'        => [
                'method'      => 'manual',
                'card_number' => env('MANUAL_TRANSFER_CARD_NUMBER', ''),
                'iban'        => env('MANUAL_TRANSFER_IBAN', ''),
                'recipient'   => env('MANUAL_TRANSFER_RECIPIENT', 'IndexFast'),
                'bank'        => env('MANUAL_TRANSFER_BANK', ''),
                'amount'      => isset($params['amount'])   ? $params['amount']   : 0,
                'currency'    => isset($params['currency']) ? $params['currency'] : 'UAH',
                'description' => 'IndexFast ' . strtoupper($params['plan_id']) . ' — ' . $period,
                'comment'     => 'Підписка IndexFast. Sub ID: ' . $params['sub_id'],
            ],
        ];
    }

    public function verifyWebhookSignature(string $rawBody, array $headers): bool
    {
        return true;
    }

    public function parseWebhookEvent(string $rawBody, array $headers): array
    {
        $data = json_decode($rawBody, true);
        if (!is_array($data)) $data = [];
        return [
            'event'       => 'payment.success',
            'external_id' => isset($data['payment_id']) ? $data['payment_id'] : '',
            'sub_id'      => isset($data['sub_id'])     ? $data['sub_id']     : '',
            'user_id'     => isset($data['user_id'])    ? $data['user_id']    : null,
            'email'       => isset($data['email'])      ? $data['email']      : null,
            'plan_id'     => isset($data['plan_id'])    ? $data['plan_id']    : null,
            'amount'      => isset($data['amount'])     ? $data['amount']     : null,
            'currency'    => isset($data['currency'])   ? $data['currency']   : 'UAH',
            'expires_at'  => isset($data['expires_at']) ? $data['expires_at'] : null,
            'raw'         => $data,
        ];
    }

    public function cancelSubscription(string $externalSubId): bool
    {
        return true;
    }

    public function getRequisites(): array
    {
        return [
            'card_number' => env('MANUAL_TRANSFER_CARD_NUMBER', ''),
            'iban'        => env('MANUAL_TRANSFER_IBAN', ''),
            'recipient'   => env('MANUAL_TRANSFER_RECIPIENT', 'IndexFast'),
            'bank'        => env('MANUAL_TRANSFER_BANK', ''),
        ];
    }
}
