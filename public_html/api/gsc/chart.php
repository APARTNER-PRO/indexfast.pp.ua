<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/chart.php
//  Повертає дані по датах для побудови графіку
//  Підтримує поточний і попередній period (порівняння)
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

requireMethod('GET');
$uid  = (int)requireAuth()['sub'];
$days = max(7, min(365, (int)($_GET['days'] ?? 30)));

set_time_limit(0);

$siteIdsRaw = $_GET['site_ids'] ?? '';
$siteIds    = array_values(array_filter(array_map('intval', preg_split('/[,\s]+/', $siteIdsRaw))));

$hasGscUrl = gscHasGscUrlColumn();

// ── Отримуємо сайти з БД
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
    respondOk('OK', ['current' => [], 'previous' => [], 'period_days' => $days]);
}

$token = gscGetAccessToken($uid);

// ── Отримуємо список GSC сайтів ОДИН РАЗ (не в кожній ітерації)
$gscSiteList = gscListSites($uid, $token);
$gscEntries  = $gscSiteList['sites'] ?? [];

require_once __DIR__ . '/cache.php';
$cachedChart = gscGetCachedMetrics($uid, array_column($sites, 'id'), $days, 'chart');

// ── Будуємо map: normalized_domain → siteUrl (з кешованого списку)
function resolveSiteUrl(string $domain, array $gscEntries, ?string $storedGscUrl): ?string {
    // 1) Шукаємо по домену серед GSC записів
    foreach ($gscEntries as $entry) {
        $siteUrl = $entry['siteUrl'] ?? '';
        if (($entry['permissionLevel'] ?? '') === 'siteUnverifiedUser') continue;
        if (gscDomainMatches($siteUrl, $domain)) {
            return $siteUrl;
        }
    }
    // 2) Fallback на збережений gsc_url з БД
    if ($storedGscUrl) {
        $normalized = gscNormalizeStoredGscUrl($storedGscUrl);
        if ($normalized && gscDomainMatches($normalized, $domain)) {
            return $normalized;
        }
    }
    return null;
}

// ── Агрегуємо масив рядків по ключу date
function aggregateByDate(array $rows, array &$agg): void {
    foreach ($rows as $row) {
        $date = $row['keys'][0] ?? null;
        if (!$date) continue;
        if (!isset($agg[$date])) {
            $agg[$date] = ['clicks' => 0, 'impressions' => 0, 'posSum' => 0, 'posCount' => 0];
        }
        $agg[$date]['clicks']      += (float)($row['clicks']      ?? 0);
        $agg[$date]['impressions'] += (float)($row['impressions']  ?? 0);
        if (($row['position'] ?? 0) > 0) {
            $agg[$date]['posSum']   += (float)$row['position'];
            $agg[$date]['posCount'] += 1;
        }
    }
}

// ── Дати
$endCurrent   = date('Y-m-d', strtotime('-2 days')); // GSC має 2-3 дні затримки
$startCurrent = date('Y-m-d', strtotime('-' . ($days + 1) . ' days'));
$endPrev      = date('Y-m-d', strtotime('-' . ($days + 2) . ' days'));
$startPrev    = date('Y-m-d', strtotime('-' . ($days * 2 + 2) . ' days'));

// Формуємо масив запитів для curl_multi
$multiRequests = [];
$aggCurrent = [];
$aggPrev    = [];
$freshChartData = [];

try {
    foreach ($sites as $site) {
        $siteId = (int)$site['id'];
        if (isset($cachedChart[$siteId])) {
            aggregateByDate($cachedChart[$siteId]['current'] ?? [], $aggCurrent);
            aggregateByDate($cachedChart[$siteId]['previous'] ?? [], $aggPrev);
            continue;
        }

        $stored  = $hasGscUrl ? ($site['gsc_url'] ?? null) : null;
        $siteUrl = resolveSiteUrl($site['domain'], $gscEntries, $stored);
        if (!$siteUrl) continue;

        $encoded = rawurlencode($siteUrl);
        $url     = "https://www.googleapis.com/webmasters/v3/sites/{$encoded}/searchAnalytics/query";

        // Поточний період
        $multiRequests[] = [
            'site_id' => $siteId,
            'url' => $url,
            'payload' => json_encode(['startDate' => $startCurrent, 'endDate' => $endCurrent, 'dimensions' => ['date'], 'rowLimit' => 500, 'searchType' => 'web']),
            'period' => 'current'
        ];

        // Попередній період
        $multiRequests[] = [
            'site_id' => $siteId,
            'url' => $url,
            'payload' => json_encode(['startDate' => $startPrev, 'endDate' => $endPrev, 'dimensions' => ['date'], 'rowLimit' => 500, 'searchType' => 'web']),
            'period' => 'previous'
        ];
    }

    // Виконуємо запити паралельно партіями (batching) щоб не отримати rate limit
    $batchSize = 10;
    $chunks = array_chunk($multiRequests, $batchSize);

    $mh = curl_multi_init();
    $headers = [
        'Authorization: Bearer ' . $token,
        'Accept: application/json',
        'Content-Type: application/json',
    ];

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
            $errorStr = curl_error($ch);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);

            if ($code === 200) {
                $data = json_decode((string)$body, true);
                $rows = $data['rows'] ?? [];
                $siteId = $chunk[$index]['site_id'];
                
                if (!isset($freshChartData[$siteId])) {
                    $freshChartData[$siteId] = ['current' => [], 'previous' => []];
                }
                
                if ($chunk[$index]['period'] === 'current') {
                    aggregateByDate($rows, $aggCurrent);
                    $freshChartData[$siteId]['current'] = $rows;
                } else {
                    aggregateByDate($rows, $aggPrev);
                    $freshChartData[$siteId]['previous'] = $rows;
                }
            } else if ($code !== 200) {
                // If Google returns 403 or 401 we just ignore it for this site so it doesn't break the whole chart
                // But we could log it.
            }
        }
    }
    curl_multi_close($mh);
    
    foreach ($freshChartData as $siteId => $data) {
        gscSetCachedMetrics($uid, $siteId, $days, $data, 'chart');
    }
} catch (\Throwable $e) {
    respond(500, 'Chart Error: ' . $e->getMessage() . ' on line ' . $e->getLine());
}


// ── Форматуємо фінальні масиви (відсортовані по даті)
function formatRows(array $agg): array {
    ksort($agg);
    $result = [];
    foreach ($agg as $date => $vals) {
        $impr = $vals['impressions'];
        $clk  = $vals['clicks'];
        $pos  = $vals['posCount'] > 0 ? round($vals['posSum'] / $vals['posCount'], 2) : 0;
        $result[] = [
            'date'        => $date,
            'clicks'      => (int)round($clk),
            'impressions' => (int)round($impr),
            'ctr'         => $impr > 0 ? round($clk / $impr, 4) : 0,
            'position'    => $pos,
        ];
    }
    return $result;
}

respondOk('OK', [
    'current'     => formatRows($aggCurrent),
    'previous'    => formatRows($aggPrev),
    'period_days' => $days,
    'date_range'  => [
        'current'  => ['start' => $startCurrent, 'end' => $endCurrent],
        'previous' => ['start' => $startPrev,    'end' => $endPrev],
    ],
]);
