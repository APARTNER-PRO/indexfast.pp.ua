'use client';

import { useState } from 'react';

export default function RoiCalculator() {
  const [pages, setPages] = useState(500);
  const [newPages, setNewPages] = useState(50);
  const [rate, setRate] = useState(500);
  const [minsPer, setMinsPer] = useState(3);

  const fmt = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'к';
    return Math.round(n).toLocaleString('en-US');
  };
  const fmtMoney = (n) => '₴' + Math.round(n).toLocaleString('en-US');

  const savedMins = newPages * minsPer;
  const savedHours = savedMins / 60;
  const savedMoney = savedHours * rate;
  const proCost = 9.99;
  const profit = savedMoney - proCost;

  return (
    <section className="roi-section" id="roi" aria-labelledby="roi-title">
      <div className="container roi-wrap">
        <div className="roi-grid">
          <div>
            <p className="roi-label reveal">Calculator</p>
            <h2 className="roi-title reveal" id="roi-title">
              How much you save<br />with IndexFast?
            </h2>
            <p className="roi-sub reveal">
              Customize the settings for your business — and you&apos;ll see a real benefit in time and money.
            </p>
            <div className="roi-field reveal">
              <div className="roi-field-top">
                <label className="roi-field-name" htmlFor="rPages">Pages on the site</label>
                <span className="roi-field-val">{fmt(pages)}</span>
              </div>
              <input type="range" className="roi-range" id="rPages" min="50" max="5000" step="50" value={pages} onChange={(e) => setPages(+e.target.value)} />
            </div>
            <div className="roi-field reveal">
              <div className="roi-field-top">
                <label className="roi-field-name" htmlFor="rNew">New pages per month</label>
                <span className="roi-field-val">{fmt(newPages)}</span>
              </div>
              <input type="range" className="roi-range" id="rNew" min="5" max="500" step="5" value={newPages} onChange={(e) => setNewPages(+e.target.value)} />
            </div>
            <div className="roi-field reveal">
              <div className="roi-field-top">
                <label className="roi-field-name" htmlFor="rRate">Your rate (₴/hour)</label>
                <span className="roi-field-val">{fmt(rate)} ₴</span>
              </div>
              <input type="range" className="roi-range" id="rRate" min="100" max="3000" step="50" value={rate} onChange={(e) => setRate(+e.target.value)} />
            </div>
            <div className="roi-field reveal">
              <div className="roi-field-top">
                <label className="roi-field-name" htmlFor="rMin">Minutes to manually index 1 URL</label>
                <span className="roi-field-val">{minsPer} min</span>
              </div>
              <input type="range" className="roi-range" id="rMin" min="1" max="10" step="1" value={minsPer} onChange={(e) => setMinsPer(+e.target.value)} />
            </div>
          </div>
          <div className="roi-results reveal">
            <p className="roi-res-title">Your savings for the month</p>
            <div className="roi-metrics">
              <div className="roi-metric">
                <div className="roi-metric-label">Time saved on indexing</div>
                <div className="roi-metric-val">{savedHours >= 1 ? savedHours.toFixed(1) + ' hours' : savedMins + ' min'}</div>
                <div className="roi-metric-sub">{savedHours >= 1 ? 'hours per month' : 'minutes per month'}</div>
              </div>
              <div className="roi-metric">
                <div className="roi-metric-label">The cost of this time</div>
                <div className="roi-metric-val">{fmtMoney(savedMoney)}</div>
                <div className="roi-metric-sub">at your rate</div>
              </div>
              <div className="roi-metric">
                <div className="roi-metric-label">Acceleration of indexing</div>
                <div className="roi-metric-val" style={{ fontSize: '1.6rem' }}>up to 14×</div>
                <div className="roi-metric-sub">from weeks to 24 hours</div>
              </div>
            </div>
            <div className="roi-total">
              <p>Net benefit (savings - cost of PRO)</p>
              <strong style={{ color: profit > 0 ? 'var(--green)' : '#ff9955' }}>
                {fmtMoney(Math.abs(profit))}
              </strong>
              <span>{profit > 0 ? 'net profit per month' : 'difference (consider PRO for larger volumes)'}</span>
            </div>
            <a href="#pricing" className="roi-action">Get this benefit →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
