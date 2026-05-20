<?php
// ══════════════════════════════════════════════
//  public_html/api/payment/PaymentProviderInterface.php
// ══════════════════════════════════════════════

interface PaymentProviderInterface
{
    public function getId(): string;
    public function getLabel(): string;
    public function getIcon(): string;
    public function isEnabled(): bool;

    /**
     * Створити сесію оплати.
     * @return array{redirect_url:string|null, payment_id:string, extra:array}
     */
    public function createPaymentSession(array $params): array;

    /** Верифікація підпису webhook */
    public function verifyWebhookSignature(string $rawBody, array $headers): bool;

    /**
     * Нормалізована подія з webhook payload:
     * [event, external_id, sub_id, user_id, email, plan_id, amount, currency, expires_at, raw]
     */
    public function parseWebhookEvent(string $rawBody, array $headers): array;

    /** Скасувати підписку у провайдері */
    public function cancelSubscription(string $externalSubId): bool;
}
