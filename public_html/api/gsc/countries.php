<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/countries.php
//  Повертає статистику по країнах
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

requireMethod('GET');
$uid  = (int)requireAuth()['sub'];
$days = max(1, min(365, (int)($_GET['days'] ?? 30)));
$limit = max(1, min(100, (int)($_GET['limit'] ?? 20)));

set_time_limit(0);

$siteIdsRaw = $_GET['site_ids'] ?? '';
$siteIds    = array_values(array_filter(array_map('intval', preg_split('/[,\s]+/', $siteIdsRaw))));

$hasGscUrl = gscHasGscUrlColumn();

$params = [$uid];
$where  = '';
if ($siteIds) {
    $where  = ' AND id IN (' . implode(',', array_fill(0, count($siteIds), '?')) . ')';
    $params = array_merge([$uid], $siteIds);
}

$sites = DB::all(
    "SELECT id, domain" . ($hasGscUrl ? ', gsc_url' : '') . "
     FROM sites WHERE user_id = ?{$where} ORDER BY id",
    $params
);

if (!$sites) {
    respondOk('OK', ['countries' => [], 'period_days' => $days]);
}

$token = gscGetAccessToken($uid);
$gscSiteList = gscListSites($uid, $token);
$gscEntries  = $gscSiteList['sites'] ?? [];

function resolveSiteUrl(string $domain, array $gscEntries, ?string $storedGscUrl): ?string {
    foreach ($gscEntries as $entry) {
        $siteUrl = $entry['siteUrl'] ?? '';
        if (($entry['permissionLevel'] ?? '') === 'siteUnverifiedUser') continue;
        if (gscDomainMatches($siteUrl, $domain)) return $siteUrl;
    }
    if ($storedGscUrl) {
        $normalized = gscNormalizeStoredGscUrl($storedGscUrl);
        if ($normalized && gscDomainMatches($normalized, $domain)) return $normalized;
    }
    return null;
}

$endDate   = date('Y-m-d', strtotime('-2 days'));
$startDate = date('Y-m-d', strtotime('-' . ($days + 1) . ' days'));

$multiRequests = [];
foreach ($sites as $site) {
    $stored  = $hasGscUrl ? ($site['gsc_url'] ?? null) : null;
    $siteUrl = resolveSiteUrl($site['domain'], $gscEntries, $stored);
    if (!$siteUrl) continue;

    $encoded = rawurlencode($siteUrl);
    $url     = "https://www.googleapis.com/webmasters/v3/sites/{$encoded}/searchAnalytics/query";

    $multiRequests[] = [
        'url' => $url,
        'payload' => json_encode([
            'startDate'  => $startDate,
            'endDate'    => $endDate,
            'dimensions' => ['country'],
            'rowLimit'   => $limit,
            'searchType' => 'web'
        ]),
    ];
}

$aggCountries = [];

$batchSize = 10;
$chunks = array_chunk($multiRequests, $batchSize);

$mh = curl_multi_init();
$headers = [
    'Authorization: Bearer ' . $token,
    'Accept: application/json',
    'Content-Type: application/json',
];

try {
    foreach ($chunks as $chunk) {
        $curlHandles = [];
        foreach ($chunk as $index => $req) {
            $ch = curl_init($req['url']);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 15,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $req['payload'],
                CURLOPT_HTTPHEADER     => $headers,
            ]);
            curl_multi_add_handle($mh, $ch);
            $curlHandles[$index] = $ch;
        }

        $active = null;
        do {
            $mrc = curl_multi_exec($mh, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);

        while ($active && $mrc == CURLM_OK) {
            if (curl_multi_select($mh) == -1) {
                usleep(100);
            }
            do {
                $mrc = curl_multi_exec($mh, $active);
            } while ($mrc == CURLM_CALL_MULTI_PERFORM);
        }

        foreach ($curlHandles as $index => $ch) {
            $body = curl_multi_getcontent($ch);
            $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);

            if ($code === 200) {
                $data = json_decode((string)$body, true);
                $rows = $data['rows'] ?? [];
                
                foreach ($rows as $row) {
                    $country = strtoupper($row['keys'][0] ?? '');
                    if (!$country) continue;
                    
                    if (!isset($aggCountries[$country])) {
                        $aggCountries[$country] = ['clicks' => 0, 'impressions' => 0, 'posSum' => 0, 'posCount' => 0];
                    }
                    $aggCountries[$country]['clicks']      += (int)round($row['clicks'] ?? 0);
                    $aggCountries[$country]['impressions'] += (int)round($row['impressions'] ?? 0);
                    if (($row['position'] ?? 0) > 0) {
                        $aggCountries[$country]['posSum']   += (float)$row['position'];
                        $aggCountries[$country]['posCount'] += 1;
                    }
                }
            }
        }
    }
} catch (\Throwable $e) {
    curl_multi_close($mh);
    respond(500, 'Countries Error: ' . $e->getMessage());
}
curl_multi_close($mh);

$countriesFormatted = [];
foreach ($aggCountries as $country => $vals) {
    if ($vals['impressions'] == 0 && $vals['clicks'] == 0) continue;
    $pos = $vals['posCount'] > 0 ? round($vals['posSum'] / $vals['posCount'], 2) : 0;
    $countriesFormatted[] = [
        'country'     => $country,
        'clicks'      => $vals['clicks'],
        'impressions' => $vals['impressions'],
        'ctr'         => $vals['impressions'] > 0 ? round($vals['clicks'] / $vals['impressions'], 4) : 0,
        'position'    => $pos,
    ];
}

usort($countriesFormatted, function($a, $b) {
    if ($a['clicks'] === $b['clicks']) {
        return $b['impressions'] <=> $a['impressions'];
    }
    return $b['clicks'] <=> $a['clicks'];
});

$topCountries = array_slice($countriesFormatted, 0, $limit);

respondOk('OK', [
    'countries'   => $topCountries,
    'period_days' => $days,
    'date_range'  => [
        'start' => $startDate,
        'end'   => $endDate,
    ]
]);
