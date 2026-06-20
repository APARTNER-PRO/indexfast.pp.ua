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
    $missing = [];

    // Поточний та попередній period
    $endCur   = date('Y-m-d', strtotime('-2 days'));
    $startCur = date('Y-m-d', strtotime('-' . ($days + 1) . ' days'));
    $endPrev  = date('Y-m-d', strtotime('-' . ($days + 2) . ' days'));
    $startPrev = date('Y-m-d', strtotime('-' . ($days * 2 + 2) . ' days'));

    // Список GSC сайтів (один запит)
    $gscList    = gscListSites($uid, $token);
    $gscEntries = $gscList['sites'] ?? [];

    // Складаємо масив запитів (current + previous для кожного сайту)
    $requests = [];
    $missingSet = [];
    foreach ($sites as $site) {
        $siteId = (int)$site['id'];
        $stored = $hasGscUrl ? ($site['gsc_url'] ?? null) : null;

        $resolvedUrl = null;
        foreach ($gscEntries as $entry) {
            $entryUrl = $entry['siteUrl'] ?? '';
            if (($entry['permissionLevel'] ?? '') === 'siteUnverifiedUser') continue;
            if (gscDomainMatches($entryUrl, $site['domain'])) { $resolvedUrl = $entryUrl; break; }
        }
        if (!$resolvedUrl && $stored) {
            $normalized = gscNormalizeStoredGscUrl($stored);
            if ($normalized && gscDomainMatches($normalized, $site['domain'])) $resolvedUrl = $normalized;
        }

        if (!$resolvedUrl) {
            $missing[] = ['site_id' => $siteId, 'domain' => $site['domain'], 'reason' => 'gsc_resource_not_found'];
            continue;
        }

        if ($hasGscUrl && ($site['gsc_url'] ?? '') !== $resolvedUrl) {
            DB::exec("UPDATE sites SET gsc_url = ?, updated_at = NOW() WHERE id = ?", [$resolvedUrl, $siteId]);
        }

        $encoded = rawurlencode($resolvedUrl);
        $apiUrl  = "https://www.googleapis.com/webmasters/v3/sites/{$encoded}/searchAnalytics/query";

        $requests[] = ['site_id' => $siteId, 'domain' => $site['domain'], 'period' => 'cur', 'url' => $apiUrl,
            'payload' => json_encode(['startDate' => $startCur, 'endDate' => $endCur, 'dimensions' => [], 'rowLimit' => 1, 'searchType' => 'web'])];
        $requests[] = ['site_id' => $siteId, 'domain' => $site['domain'], 'period' => 'prev', 'url' => $apiUrl,
            'payload' => json_encode(['startDate' => $startPrev, 'endDate' => $endPrev, 'dimensions' => [], 'rowLimit' => 1, 'searchType' => 'web'])];
    }

    $curData  = [];
    $prevData = [];
    $batchSize = 20;
    $chunks = array_chunk($requests, $batchSize);
    $mh = curl_multi_init();
    $httpHeaders = ['Authorization: Bearer ' . $token, 'Accept: application/json', 'Content-Type: application/json'];

    foreach ($chunks as $chunk) {
        $handles = [];
        foreach ($chunk as $idx => $req) {
            $ch = curl_init($req['url']);
            curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
                CURLOPT_POST => true, CURLOPT_POSTFIELDS => $req['payload'], CURLOPT_HTTPHEADER => $httpHeaders]);
            curl_multi_add_handle($mh, $ch);
            $handles[$idx] = $ch;
        }
        $active = null;
        do { $mrc = curl_multi_exec($mh, $active); } while ($mrc == CURLM_CALL_MULTI_PERFORM);
        while ($active && $mrc == CURLM_OK) {
            if (curl_multi_select($mh) == -1) usleep(100);
            do { $mrc = curl_multi_exec($mh, $active); } while ($mrc == CURLM_CALL_MULTI_PERFORM);
        }
        foreach ($handles as $idx => $ch) {
            $body   = curl_multi_getcontent($ch);
            $code   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);

            $req    = $chunk[$idx];
            $siteId = $req['site_id'];

            if ($code === 200) {
                $json = json_decode((string)$body, true);
                $row  = ($json['rows'] ?? [])[0] ?? [];
                $entry = [
                    'clicks'      => round((float)($row['clicks']      ?? 0), 2),
                    'impressions' => round((float)($row['impressions']  ?? 0), 2),
                    'ctr'         => round((float)($row['ctr']          ?? 0), 4),
                    'position'    => round((float)($row['position']     ?? 0), 2),
                ];
                if ($req['period'] === 'cur') $curData[$siteId]  = $entry;
                else                          $prevData[$siteId] = $entry;
            } elseif ($req['period'] === 'cur') {
                $errJson = json_decode((string)$body, true);
                $errMsg  = $errJson['error']['message'] ?? "HTTP $code";
                $missing[] = ['site_id' => $siteId, 'domain' => $req['domain'], 'reason' => $errMsg];
            }
        }
    }
    curl_multi_close($mh);

    $metrics = [];
    foreach ($curData as $siteId => $cur) {
        $prev = $prevData[$siteId] ?? null;
        $metrics[$siteId] = [
            'clicks'           => $cur['clicks'],
            'impressions'      => $cur['impressions'],
            'ctr'              => $cur['ctr'],
            'position'         => $cur['position'],
            'prev_clicks'      => $prev['clicks']      ?? null,
            'prev_impressions' => $prev['impressions']  ?? null,
            'prev_ctr'         => $prev['ctr']          ?? null,
            'prev_position'    => $prev['position']     ?? null,
            'period_days'      => $days,
            'updated_at'       => date('c'),
        ];
    }

    return ['metrics' => $metrics, 'missing' => $missing, 'period_days' => $days];
}

