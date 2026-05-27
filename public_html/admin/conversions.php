<?php
// public_html/admin/conversions.php
require_once __DIR__ . '/auth.php';

// ── KPI Метрики
$kpi = DB::row("
    SELECT 
        COUNT(*) as sent,
        COUNT(opened_at) as opened,
        COUNT(clicked_at) as clicked,
        COUNT(converted_at) as converted
    FROM email_logs
");

$sent      = (int)$kpi['sent'];
$opened    = (int)$kpi['opened'];
$clicked   = (int)$kpi['clicked'];
$converted = (int)$kpi['converted'];

$openRate = $sent > 0 ? round(($opened / $sent) * 100, 1) : 0;
$clickRate = $sent > 0 ? round(($clicked / $sent) * 100, 1) : 0;
$convRate = $sent > 0 ? round(($converted / $sent) * 100, 1) : 0;

// ── 1. Які шаблони листів працюють
$templates = DB::all("
    SELECT 
        email_type,
        email_subtype,
        COUNT(*) as sent,
        COUNT(opened_at) as opened,
        COUNT(clicked_at) as clicked,
        COUNT(converted_at) as converted
    FROM email_logs
    GROUP BY email_type, email_subtype
    ORDER BY email_type DESC, sent DESC
");

// ── 2. Які знижки працюють
$discounts = DB::all("
    SELECT 
        IFNULL(discount_percent, 0) as discount_percent,
        COUNT(*) as sent,
        COUNT(opened_at) as opened,
        COUNT(clicked_at) as clicked,
        COUNT(converted_at) as converted
    FROM email_logs
    WHERE email_type = 'upsell'
    GROUP BY discount_percent
    ORDER BY discount_percent ASC
");

// ── 3. Які години працюють
$hours = DB::all("
    SELECT 
        HOUR(created_at) as hr,
        COUNT(*) as sent,
        COUNT(converted_at) as converted
    FROM email_logs
    GROUP BY HOUR(created_at)
    ORDER BY hr ASC
");

// ── 4. Які дні тижня працюють
$weekdays = DB::all("
    SELECT 
        DAYOFWEEK(created_at) as dow,
        COUNT(*) as sent,
        COUNT(converted_at) as converted
    FROM email_logs
    GROUP BY DAYOFWEEK(created_at)
    ORDER BY dow ASC
");

$dowNames = [
    1 => 'Неділя',
    2 => 'Понеділок',
    3 => 'Вівторок',
    4 => 'Середа',
    5 => 'Четвер',
    6 => 'П\'ятниця',
    7 => 'Субота'
];

?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Конверсії — IndexFast Admin</title>
    <style>
        <?php readfile(__DIR__ . '/shared.css'); ?>
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .kpi-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        .kpi-card .label {
            font-size: .7rem;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 8px;
        }
        .kpi-card .value {
            font-size: 2.2rem;
            font-weight: 800;
            letter-spacing: -.03em;
        }
        .kpi-card .sub {
            font-size: .85rem;
            color: var(--muted);
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .kpi-card .rate {
            background: rgba(0, 255, 136, 0.1);
            color: var(--green);
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.75rem;
        }
        .kpi-card .rate.blue {
            background: rgba(147, 112, 219, 0.1);
            color: var(--purple);
        }
        .kpi-card .rate.gold {
            background: rgba(255, 208, 96, 0.1);
            color: var(--gold);
        }
        
        /* Funnel visualization */
        .funnel-wrap {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .funnel-bar {
            display: flex;
            height: 36px;
            border-radius: 8px;
            overflow: hidden;
            background: rgba(255,255,255,0.03);
            margin-top: 12px;
            border: 1px solid var(--border);
        }
        .funnel-segment {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--black);
            transition: width 0.3s ease;
        }
        .funnel-sent { background: #6a6a85; color: #fff; }
        .funnel-opened { background: #9370db; color: #fff; }
        .funnel-clicked { background: #ffd060; }
        .funnel-converted { background: #00ff88; }

        .timing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }
        @media(max-width: 900px) {
            .timing-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body class="sub">

<div style="display:flex;align-items:center;justify-content:between;margin-bottom:20px">
    <div>
        <div class="section-title">Аналітика маркетингу</div>
        <div style="font-size:1.6rem;font-weight:800;letter-spacing:-0.02em">Conversion Tracking</div>
    </div>
</div>

<!-- KPI Cards -->
<div class="kpi-grid">
    <div class="kpi-card">
        <div class="label">Надіслано листів</div>
        <div class="value"><?= number_format($sent) ?></div>
        <div class="sub">Всього тригерів inactivity/upsell</div>
    </div>
    <div class="kpi-card">
        <div class="label">Відкрито (Open Rate)</div>
        <div class="value"><?= number_format($opened) ?></div>
        <div class="sub">
            <span class="rate blue"><?= $openRate ?>%</span> відкриттів
        </div>
    </div>
    <div class="kpi-card">
        <div class="label">Кліки по лінках (CTR)</div>
        <div class="value"><?= number_format($clicked) ?></div>
        <div class="sub">
            <span class="rate gold"><?= $clickRate ?>%</span> переходів
        </div>
    </div>
    <div class="kpi-card">
        <div class="label">Оплати (Conversion Rate)</div>
        <div class="value" style="color:var(--green)"><?= number_format($converted) ?></div>
        <div class="sub">
            <span class="rate"><?= $convRate ?>%</span> успішних продажів
        </div>
    </div>
</div>

<!-- Funnel Visualization -->
<div class="funnel-wrap">
    <div class="section-title">Воронка конверсії (Funnel)</div>
    <div class="funnel-bar">
        <?php if ($sent > 0): ?>
            <div class="funnel-segment funnel-sent" style="width: 100%" title="Надіслано: <?= $sent ?>">Надіслано (100%)</div>
        <?php endif; ?>
    </div>
    <div style="display:flex; justify-content:space-between; margin-top:12px; font-size:0.75rem; color:var(--muted); flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:10px;height:10px;background:#6a6a85;border-radius:3px;"></div>
            <span>Надіслано: <?= $sent ?></span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:10px;height:10px;background:#9370db;border-radius:3px;"></div>
            <span>Відкрито: <?= $opened ?> (<?= $openRate ?>%)</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:10px;height:10px;background:#ffd060;border-radius:3px;"></div>
            <span>Перейшли: <?= $clicked ?> (<?= $clickRate ?>%)</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:10px;height:10px;background:#00ff88;border-radius:3px;"></div>
            <span>Оплатили: <?= $converted ?> (<?= $convRate ?>%)</span>
        </div>
    </div>
</div>

<!-- 1. Які листи працюють -->
<div class="section-title">1. Які шаблони листів працюють?</div>
<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>Тип листа</th>
                <th>Шаблон (Subtype)</th>
                <th>Надіслано</th>
                <th>Відкрито</th>
                <th>Open Rate</th>
                <th>Кліки</th>
                <th>CTR</th>
                <th>Оплати</th>
                <th>Conv. Rate</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($templates as $t): 
                $tOpenRate = $t['sent'] > 0 ? round(($t['opened'] / $t['sent']) * 100, 1) : 0;
                $tClickRate = $t['sent'] > 0 ? round(($t['clicked'] / $t['sent']) * 100, 1) : 0;
                $tConvRate = $t['sent'] > 0 ? round(($t['converted'] / $t['sent']) * 100, 1) : 0;
                $typeBadge = $t['email_type'] === 'upsell' ? 'badge-green' : 'badge-muted';
            ?>
            <tr>
                <td><span class="badge <?= $typeBadge ?>"><?= $t['email_type'] ?></span></td>
                <td style="font-family:monospace; font-weight:700"><?= htmlspecialchars($t['email_subtype']) ?></td>
                <td><?= number_format($t['sent']) ?></td>
                <td><?= number_format($t['opened']) ?></td>
                <td style="color:var(--purple)"><?= $tOpenRate ?>%</td>
                <td><?= number_format($t['clicked']) ?></td>
                <td style="color:var(--gold)"><?= $tClickRate ?>%</td>
                <td style="font-weight:700; color:var(--green)"><?= number_format($t['converted']) ?></td>
                <td style="font-weight:700; color:var(--green)"><?= $tConvRate ?>%</td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($templates)): ?>
            <tr><td colspan="9" style="text-align:center; color:var(--muted)">Дані про надіслані листи відсутні</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- 2. Які знижки працюють -->
<div class="section-title" style="margin-top:28px">2. Які знижки найкраще конвертують? (Лише Upsell)</div>
<div class="table-wrap">
    <table>
        <thead>
            <tr>
                <th>Знижка</th>
                <th>Надіслано</th>
                <th>Відкрито</th>
                <th>Open Rate</th>
                <th>Кліки</th>
                <th>CTR</th>
                <th>Оплати</th>
                <th>Conv. Rate</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($discounts as $d): 
                $dOpenRate = $d['sent'] > 0 ? round(($d['opened'] / $d['sent']) * 100, 1) : 0;
                $dClickRate = $d['sent'] > 0 ? round(($d['clicked'] / $d['sent']) * 100, 1) : 0;
                $dConvRate = $d['sent'] > 0 ? round(($d['converted'] / $d['sent']) * 100, 1) : 0;
                $discountLabel = $d['discount_percent'] > 0 ? "-{$d['discount_percent']}%" : "Без знижки";
                $discountBadge = $d['discount_percent'] > 0 ? 'badge-gold' : 'badge-muted';
            ?>
            <tr>
                <td><span class="badge <?= $discountBadge ?>"><?= $discountLabel ?></span></td>
                <td><?= number_format($d['sent']) ?></td>
                <td><?= number_format($d['opened']) ?></td>
                <td style="color:var(--purple)"><?= $dOpenRate ?>%</td>
                <td><?= number_format($d['clicked']) ?></td>
                <td style="color:var(--gold)"><?= $dClickRate ?>%</td>
                <td style="font-weight:700; color:var(--green)"><?= number_format($d['converted']) ?></td>
                <td style="font-weight:700; color:var(--green)"><?= $dConvRate ?>%</td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($discounts)): ?>
            <tr><td colspan="8" style="text-align:center; color:var(--muted)">Дані про знижки відсутні</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- 3 & 4. Який таймінг кращий -->
<div class="timing-grid" style="margin-top:28px">
    
    <!-- Години відправки -->
    <div class="table-wrap">
        <div style="padding:14px 20px; border-bottom:1px solid var(--border)">
            <h3 style="font-size:0.9rem; font-weight:700">🕒 3. Оптимальна година відправки (Timing)</h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Година</th>
                    <th>Надіслано</th>
                    <th>Оплати</th>
                    <th>Conv. Rate</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($hours as $h): 
                    $hConvRate = $h['sent'] > 0 ? round(($h['converted'] / $h['sent']) * 100, 1) : 0;
                    $hrFormatted = sprintf('%02d:00', $h['hr']);
                ?>
                <tr>
                    <td style="font-family:monospace; font-weight:700"><?= $hrFormatted ?></td>
                    <td><?= number_format($h['sent']) ?></td>
                    <td style="font-weight:700; color:var(--green)"><?= number_format($h['converted']) ?></td>
                    <td style="font-weight:700; color:var(--green)"><?= $hConvRate ?>%</td>
                </tr>
                <?php endforeach; ?>
                <?php if (empty($hours)): ?>
                <tr><td colspan="4" style="text-align:center; color:var(--muted)">Дані за годинами відсутні</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Дні тижня -->
    <div class="table-wrap">
        <div style="padding:14px 20px; border-bottom:1px solid var(--border)">
            <h3 style="font-size:0.9rem; font-weight:700">📅 4. Найкращий день відправки</h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th>День тижня</th>
                    <th>Надіслано</th>
                    <th>Оплати</th>
                    <th>Conv. Rate</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($weekdays as $w): 
                    $wConvRate = $w['sent'] > 0 ? round(($w['converted'] / $w['sent']) * 100, 1) : 0;
                    $dowName = $dowNames[$w['dow']] ?? 'Невідомо';
                ?>
                <tr>
                    <td style="font-weight:700"><?= $dowName ?></td>
                    <td><?= number_format($w['sent']) ?></td>
                    <td style="font-weight:700; color:var(--green)"><?= number_format($w['converted']) ?></td>
                    <td style="font-weight:700; color:var(--green)"><?= $wConvRate ?>%</td>
                </tr>
                <?php endforeach; ?>
                <?php if (empty($weekdays)): ?>
                <tr><td colspan="4" style="text-align:center; color:var(--muted)">Дані за днями тижня відсутні</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>
