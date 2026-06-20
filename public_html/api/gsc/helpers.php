<?php

function gscHasColumn(string $table, string $column): bool {
    return ((int)DB::value(
        "SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
        [$table, $column]
    )) > 0;
}

function gscHasGscUrlColumn(): bool {
    return gscHasColumn('sites', 'gsc_url');
}

function gscHasRefreshTokenColumn(): bool {
    return gscHasColumn('users', 'gsc_refresh_token');
}

function gscErrorMessage(string $body, int $code): string {
    $data = json_decode($body, true) ?? [];
    return $data['error']['message']
        ?? ($data['error']['errors'][0]['message'] ?? "HTTP $code");
}

function gscSaveTokens(int $uid, string $accessToken, ?string $refreshToken, int $expiresIn): void {
    $expires = date('Y-m-d H:i:s', time() + max(60, (int)$expiresIn));

    if ($refreshToken && gscHasRefreshTokenColumn()) {
        DB::exec(
            "UPDATE users SET gsc_access_token = ?, gsc_refresh_token = ?, gsc_token_expires = ? WHERE id = ?",
            [$accessToken, $refreshToken, $expires, $uid]
        );
        return;
    }

    DB::exec(
        "UPDATE users SET gsc_access_token = ?, gsc_token_expires = ? WHERE id = ?",
        [$accessToken, $expires, $uid]
    );
}

function gscRefreshAccessToken(int $uid, string $refreshToken): ?array {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) return null;

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_POSTFIELDS     => http_build_query([
            'client_id'     => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'refresh_token' => $refreshToken,
            'grant_type'    => 'refresh_token',
        ]),
    ]);
    $body = (string)curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code !== 200) return null;

    $data = json_decode($body, true) ?? [];
    if (empty($data['access_token'])) return null;

    $accessToken = $data['access_token'];
    $expiresIn   = (int)($data['expires_in'] ?? 3600);
    $expires     = date('Y-m-d H:i:s', time() + max(60, $expiresIn));

    if (gscHasRefreshTokenColumn()) {
        DB::exec(
            "UPDATE users SET gsc_access_token = ?, gsc_token_expires = ? WHERE id = ?",
            [$accessToken, $expires, $uid]
        );
    } else {
        DB::exec(
            "UPDATE users SET gsc_access_token = ?, gsc_token_expires = ? WHERE id = ?",
            [$accessToken, $expires, $uid]
        );
    }

    return [
        'access_token' => $accessToken,
        'expires_at'   => $expires,
    ];
}

function gscGetAccessToken(int $uid): string {
    $hasRefresh = gscHasRefreshTokenColumn();
    $user = DB::row(
        "SELECT gsc_access_token, " . ($hasRefresh ? "gsc_refresh_token, " : "") . "gsc_token_expires FROM users WHERE id = ?",
        [$uid]
    );

    if (!$user || empty($user['gsc_access_token'])) {
        respond(403, 'Не підключено Google Search Console. Спочатку авторизуйте Google.');
    }

    if (!empty($user['gsc_token_expires']) && strtotime($user['gsc_token_expires']) <= time() + 60) {
        $refreshToken = $hasRefresh ? ($user['gsc_refresh_token'] ?? '') : '';
        $newToken = $refreshToken ? gscRefreshAccessToken($uid, $refreshToken) : null;

        if (!$newToken) {
            DB::exec(
                "UPDATE users SET gsc_access_token = NULL, gsc_token_expires = NULL WHERE id = ?",
                [$uid]
            );
            respond(403, 'GSC токен прострочений. Підключіть Google Search Console знову.');
        }

        return $newToken['access_token'];
    }

    return $user['gsc_access_token'];
}

function gscRequest(int $uid, string $url, string $method = 'GET', array $body = [], ?string $token = null): array {
    $token = $token ?? gscGetAccessToken($uid);
    $method = strtoupper($method);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
            'Content-Type: application/json',
        ],
    ]);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $response = (string)curl_exec($ch);
    $code     = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $code,
        'body' => $response,
        'json' => json_decode($response, true) ?? [],
    ];
}

function gscNormalizeDomain($value): string {
    $value = trim(strtolower((string)$value));
    if (!$value) return '';

    if (strpos($value, 'sc-domain:') === 0) {
        $value = substr($value, 10);
    }

    $value = preg_replace('/\s+.*/', '', $value) ?? $value;
    if (!$value) return '';

    if (!preg_match('#^https?://#i', $value)) {
        $value = 'https://' . $value;
    }

    $parsed = parse_url($value);
    $host = $parsed['host'] ?? '';
    $host = rtrim($host, '.');

    if (strpos($host, 'www.') === 0) {
        $host = substr($host, 4);
    }

    return $host;
}

function gscNormalizeStoredGscUrl(string $url): ?string {
    $url = trim($url);
    if (!$url) return null;

    if (strpos($url, 'sc-domain:') === 0) {
        return $url;
    }

    $parsed = parse_url($url);
    if (!$parsed || empty($parsed['scheme']) || empty($parsed['host'])) return null;

    $scheme = strtolower($parsed['scheme']);
    if (!in_array($scheme, ['http', 'https'], true)) return null;

    $host = rtrim($parsed['host'], '.');
    return $scheme . '://' . $host . '/';
}

function gscDomainMatches(string $siteUrl, string $domain): bool {
    $siteDomain = gscNormalizeDomain($siteUrl);
    $domain     = gscNormalizeDomain($domain);

    if (!$siteDomain || !$domain) return false;
    return $siteDomain === $domain;
}

function gscListSites(int $uid, ?string $token = null): array {
    $res = gscRequest($uid, 'https://www.googleapis.com/webmasters/v3/sites', 'GET', [], $token);
    if ($res['code'] !== 200) {
        return ['error' => gscErrorMessage($res['body'], $res['code'])];
    }

    return ['sites' => $res['json']['siteEntry'] ?? []];
}

function gscFindSiteUrl(int $uid, string $domain, ?string $storedGscUrl = null, ?string $token = null): ?array {
    $list = gscListSites($uid, $token);
    if (!isset($list['error'])) {
        foreach ($list['sites'] as $item) {
            $siteUrl = $item['siteUrl'] ?? '';
            if (($item['permissionLevel'] ?? '') === 'siteUnverifiedUser') continue;
            if (gscDomainMatches($siteUrl, $domain)) {
                return [
                    'siteUrl'    => $siteUrl,
                    'permission' => $item['permissionLevel'] ?? '',
                ];
            }
        }
    }

    if ($storedGscUrl) {
        $normalized = gscNormalizeStoredGscUrl($storedGscUrl);
        if ($normalized && gscDomainMatches($normalized, $domain)) {
            return [
                'siteUrl'    => $normalized,
                'permission' => 'stored',
            ];
        }
    }

    return null;
}

function gscSearchAnalytics(int $uid, string $siteUrl, int $days, ?string $token = null): array {
    $days = max(1, min(365, (int)$days));
    $encoded = rawurlencode($siteUrl);
    $url = "https://www.googleapis.com/webmasters/v3/sites/{$encoded}/searchAnalytics/query";

    $res = gscRequest($uid, $url, 'POST', [
        'startDate'  => date('Y-m-d', strtotime('-' . max(1, $days - 1) . ' days')),
        'endDate'    => date('Y-m-d'),
        'dimensions' => [],
        'rowLimit'   => 1,
        'searchType' => 'web',
    ], $token);

    if ($res['code'] !== 200) {
        return ['error' => gscErrorMessage($res['body'], $res['code']), 'gsc_url' => $siteUrl];
    }

    $row = ($res['json']['rows'] ?? [])[0] ?? [];
    return [
        'clicks'      => round((float)($row['clicks'] ?? 0), 2),
        'impressions' => round((float)($row['impressions'] ?? 0), 2),
        'ctr'         => round((float)($row['ctr'] ?? 0), 4),
        'position'    => round((float)($row['position'] ?? 0), 2),
        'period_days' => $days,
        'gsc_url'     => $siteUrl,
        'updated_at'  => date('c'),
    ];
}

function gscMetricsForSites(int $uid, array $siteIds, int $days): array {
    $days = max(1, min(365, (int)$days));
    $hasGscUrl = gscHasGscUrlColumn();

    $params = [$uid];
    $where  = '';
    if ($siteIds) {
        $ids = array_map('intval', array_filter($siteIds));
        if (!$ids) return ['metrics' => [], 'missing' => [], 'period_days' => $days];
        $where = ' AND id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')';
        $params = array_merge([$uid], $ids);
    }

    $sites = DB::all(
        "SELECT id, domain, sitemap_url" . ($hasGscUrl ? ', gsc_url' : '') . "
         FROM sites
         WHERE user_id = ?{$where}
         ORDER BY id",
        $params
    );

    if (!$sites) return ['metrics' => [], 'missing' => [], 'period_days' => $days];

    $token   = gscGetAccessToken($uid);
    $metrics = [];
    $missing = [];

    // ── Отримуємо список GSC сайтів ОДИН РАЗ для всіх ітерацій
    $gscList    = gscListSites($uid, $token);
    $gscEntries = $gscList['sites'] ?? [];

    foreach ($sites as $site) {
        $siteId = (int)$site['id'];
        $stored = $hasGscUrl ? ($site['gsc_url'] ?? null) : null;

        // Шукаємо siteUrl в кешованому списку (без додаткового API-запиту)
        $resolvedUrl = null;
        foreach ($gscEntries as $entry) {
            $entryUrl = $entry['siteUrl'] ?? '';
            if (($entry['permissionLevel'] ?? '') === 'siteUnverifiedUser') continue;
            if (gscDomainMatches($entryUrl, $site['domain'])) {
                $resolvedUrl = $entryUrl;
                break;
            }
        }
        // Fallback на збережений gsc_url
        if (!$resolvedUrl && $stored) {
            $normalized = gscNormalizeStoredGscUrl($stored);
            if ($normalized && gscDomainMatches($normalized, $site['domain'])) {
                $resolvedUrl = $normalized;
            }
        }

        if (!$resolvedUrl) {
            $missing[] = [
                'site_id' => $siteId,
                'domain'  => $site['domain'],
                'reason'  => 'gsc_resource_not_found',
            ];
            continue;
        }

        $data = gscSearchAnalytics($uid, $resolvedUrl, $days, $token);

        if (isset($data['error'])) {
            $missing[] = [
                'site_id' => $siteId,
                'domain'  => $site['domain'],
                'reason'  => isset($data['gsc_url']) ? $data['error'] . ' (' . $data['gsc_url'] . ')' : $data['error'],
            ];
            continue;
        }

        $metrics[$siteId] = $data;

        if ($hasGscUrl && ($site['gsc_url'] ?? '') !== $resolvedUrl) {
            DB::exec(
                "UPDATE sites SET gsc_url = ?, updated_at = NOW() WHERE id = ?",
                [$resolvedUrl, $siteId]
            );
        }
    }

    return [
        'metrics'     => $metrics,
        'missing'     => $missing,
        'period_days' => $days,
    ];
}

