<?php
// ══════════════════════════════════════════════
//  public_html/api/payment/PaymentManager.php
//  Реальна структура: public_html/api/ -> config.php, db.php
// ══════════════════════════════════════════════

require_once __DIR__ . '/PaymentProviderInterface.php';
require_once __DIR__ . '/providers/StripeProvider.php';
require_once __DIR__ . '/providers/PaddleProvider.php';
require_once __DIR__ . '/providers/PayPalProvider.php';
require_once __DIR__ . '/providers/LiqPayProvider.php';
require_once __DIR__ . '/providers/MonobankProvider.php';
require_once __DIR__ . '/providers/ManualTransferProvider.php';

class PaymentManager
{
    private static ?self $instance = null;

    /** @var PaymentProviderInterface[] */
    private array $providers = [];

    private static array $registry = [
        'stripe'   => StripeProvider::class,
        'paddle'   => PaddleProvider::class,
        'paypal'   => PayPalProvider::class,
        'liqpay'   => LiqPayProvider::class,
        'monobank' => MonobankProvider::class,
        'manual'   => ManualTransferProvider::class,
    ];

    private function __construct()
    {
        foreach (self::$registry as $id => $class) {
            $this->providers[$id] = new $class();
        }
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getProvider(string $id): ?PaymentProviderInterface
    {
        return $this->providers[$id] ?? null;
    }

    /** @return PaymentProviderInterface[] */
    public function getEnabledProviders(): array
    {
        return array_filter($this->providers, fn($p) => $p->isEnabled());
    }

    public function getEnabledProvidersInfo(): array
    {
        $result = [];
        foreach ($this->getEnabledProviders() as $p) {
            $result[] = ['id' => $p->getId(), 'label' => $p->getLabel(), 'icon' => $p->getIcon()];
        }
        return $result;
    }

    public function countEnabled(): int
    {
        return count($this->getEnabledProviders());
    }

    public function getSingleProvider(): ?PaymentProviderInterface
    {
        $enabled = array_values($this->getEnabledProviders());
        return count($enabled) === 1 ? $enabled[0] : null;
    }
}
