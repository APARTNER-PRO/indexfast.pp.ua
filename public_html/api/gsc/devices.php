<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/devices.php
//  Повертає статистику по пристроях
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

requireMethod('GET');
$uid  = (int)requireAuth()['sub'];
$days = max(1, min(365, (int)($_GET['days'] ?? 30)));

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
    respondOk('OK', ['devices' => [], 'period_days' => $days]);
}

$token = gscGetAccessToken($uid);
$gscSiteList = gscListSites($uid, $token);
$gscEntries  = $gscSiteList['sites'] ?? [];

require_once __DIR__ . '/cache.php';
$cachedDevices = gscGetCachedMetrics($uid, array_column($sites, 'id'), $days, 'devices');

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

$aggDevices = [
    'DESKTOP' => ['clicks' => 0, 'impressions' => 0, 'posSum' => 0, 'posCount' => 0],
    'MOBILE'  => ['clicks' => 0, 'impressions' => 0, 'posSum' => 0, 'posCount' => 0],
    'TABLET'  => ['clicks' => 0, 'impressions' => 0, 'posSum' => 0, 'posCount' => 0],
];

function aggregateDevices(array $rows, array &$aggDevices) {
    foreach ($rows as $row) {
        $device = strtoupper($row['keys'][0] ?? '');
        if (!isset($aggDevices[$device])) continue;
        
        $aggDevices[$device]['clicks']      += (int)round($row['clicks'] ?? 0);
        $aggDevices[$device]['impressions'] += (int)round($row['impressions'] ?? 0);
        if (($row['position'] ?? 0) > 0) {
            $aggDevices[$device]['posSum']   += (float)$row['position'];
            $aggDevices[$device]['posCount'] += 1;
        }
    }
}

$multiRequests = [];
$freshDevicesData = [];

foreach ($sites as $site) {
    $siteId = (int)$site['id'];
    if (isset($cachedDevices[$siteId])) {
        aggregateDevices($cachedDevices[$siteId], $aggDevices);
        continue;
    }

    $stored  = $hasGscUrl ? ($site['gsc_url'] ?? null) : null;
    $siteUrl = resolveSiteUrl($site['domain'], $gscEntries, $stored);
    if (!$siteUrl) continue;

    $encoded = rawurlencode($siteUrl);
    $url     = "https://www.googleapis.com/webmasters/v3/sites/{$encoded}/searchAnalytics/query";

    $multiRequests[] = [
        'site_id' => $siteId,
        'url' => $url,
        'payload' => json_encode([
            'startDate'  => $startDate,
            'endDate'    => $endDate,
            'dimensions' => ['device'],
            'rowLimit'   => 10,
            'searchType' => 'web'
        ]),
    ];
}

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
                
                aggregateDevices($rows, $aggDevices);
                $freshDevicesData[$siteId] = $rows;
            }
        }
    }
} catch (\Throwable $e) {
    curl_multi_close($mh);
    respond(500, 'Devices Error: ' . $e->getMessage());
}
curl_multi_close($mh);

foreach ($freshDevicesData as $siteId => $rows) {
    gscSetCachedMetrics($uid, $siteId, $days, $rows, 'devices');
}

$devicesFormatted = [];
foreach ($aggDevices as $key => $vals) {
    if ($vals['impressions'] == 0 && $vals['clicks'] == 0) continue;
    $pos = $vals['posCount'] > 0 ? round($vals['posSum'] / $vals['posCount'], 2) : 0;
    $devicesFormatted[] = [
        'device'      => $key,
        'clicks'      => $vals['clicks'],
        'impressions' => $vals['impressions'],
        'ctr'         => $vals['impressions'] > 0 ? round($vals['clicks'] / $vals['impressions'], 4) : 0,
        'position'    => $pos,
    ];
}

respondOk('OK', [
    'devices'     => $devicesFormatted,
    'period_days' => $days,
    'date_range'  => [
        'start' => $startDate,
        'end'   => $endDate,
    ]
]);
