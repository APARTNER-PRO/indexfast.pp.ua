<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/queries.php
//  Повертає топ пошукових запитів для сайтів
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

requireMethod('GET');
$uid  = (int)requireAuth()['sub'];
$days = max(1, min(365, (int)($_GET['days'] ?? 30)));
$limit = max(1, min(500, (int)($_GET['limit'] ?? 100)));

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
    respondOk('OK', ['queries' => [], 'period_days' => $days]);
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
            'dimensions' => ['query'],
            'rowLimit'   => $limit, // fetch top queries for each site
            'searchType' => 'web'
        ]),
        'site_id' => $site['id'],
        'domain'  => $site['domain']
    ];
}

$allQueries = [];
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
                
                $siteId = $chunk[$index]['site_id'];
                $domain = $chunk[$index]['domain'];
                
                foreach ($rows as $row) {
                    $query = $row['keys'][0] ?? null;
                    if (!$query) continue;
                    
                    $allQueries[] = [
                        'query'       => $query,
                        'site_id'     => $siteId,
                        'domain'      => $domain,
                        'clicks'      => (int)round($row['clicks'] ?? 0),
                        'impressions' => (int)round($row['impressions'] ?? 0),
                        'ctr'         => round($row['ctr'] ?? 0, 4),
                        'position'    => round($row['position'] ?? 0, 2),
                    ];
                }
            }
        }
    }
} catch (\Throwable $e) {
    curl_multi_close($mh);
    respond(500, 'Queries Error: ' . $e->getMessage());
}
curl_multi_close($mh);

// Sort all queries by clicks DESC
usort($allQueries, function($a, $b) {
    if ($a['clicks'] === $b['clicks']) {
        return $b['impressions'] <=> $a['impressions'];
    }
    return $b['clicks'] <=> $a['clicks'];
});

// Apply global limit
$topQueries = array_slice($allQueries, 0, $limit);

respondOk('OK', [
    'queries'     => $topQueries,
    'period_days' => $days,
    'date_range'  => [
        'start' => $startDate,
        'end'   => $endDate,
    ]
]);
