// ─────────────────────────────────────────────────────────────
//  insights.js  —  Insights page logic
// ─────────────────────────────────────────────────────────────

let monthlyChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initLayout('insights', 'Insights');

  const prefs = loadPrefs();
  const txs   = loadTransactions();
  const m     = prefs.selectedMonth;
  const prev  = m === '2026-03' ? '2026-02' : '2026-01';

  const s  = getSummary(txs, m);
  const ps = getSummary(txs, prev);
  const bd = getCategoryBreakdown(txs, m);

  // ── Highest spending category ─────────────────────────────
  if (bd.length > 0) {
    document.getElementById('ins-top-cat').textContent = bd[0][0];
    document.getElementById('ins-top-amt').textContent = fmt(bd[0][1]);
    document.getElementById('ins-top-pct').textContent = s.expense
      ? Math.round(bd[0][1] / s.expense * 100) + '% of total spending this month'
      : '';
  } else {
    document.getElementById('ins-top-cat').textContent = 'No data';
  }

  // ── Month-over-month bars ─────────────────────────────────
  const barRows = [
    { label: 'Income',   cur: s.income,  prev: ps.income,  color: '#1d8f6a' },
    { label: 'Expenses', cur: s.expense, prev: ps.expense, color: '#c94040' },
  ];

  document.getElementById('ins-monthly-bars').innerHTML = barRows.map(r => {
    const max     = Math.max(r.cur, r.prev, 1);
    const curPct  = Math.round(r.cur  / max * 100);
    const diff    = r.prev ? Math.round((r.cur - r.prev) / r.prev * 100) : 0;
    const sign    = diff >= 0 ? '+' : '';
    const diffClr = diff >= 0 ? 'var(--green)' : 'var(--red)';

    return `
      <div class="monthly-bar-row">
        <div class="monthly-bar-label">
          <span>${r.label}</span>
          <span style="color:${diffClr}">${sign}${diff}% vs last month</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${curPct}%;background:${r.color}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-top:2px">
          <span>This: ${fmt(r.cur)}</span>
          <span>Last: ${fmt(r.prev)}</span>
        </div>
      </div>
    `;
  }).join('');

  // ── Savings rate ──────────────────────────────────────────
  document.getElementById('ins-savings-rate').textContent = s.savings + '%';
  document.getElementById('ins-savings-msg').textContent  = s.savings >= 20
    ? 'Great job! You\'re saving over 20% of your income.'
    : s.savings >= 10
    ? 'You\'re on track. Try to push savings above 20%.'
    : 'Consider reducing discretionary spending to boost your savings rate.';

  // ── Monthly comparison chart ──────────────────────────────
  monthlyChart = new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses', 'Net'],
      datasets: [
        {
          label: 'This month',
          data: [s.income, s.expense, s.income - s.expense],
          backgroundColor: ['#d1ede3', '#f7d5d5', '#dce8fb'],
          borderColor:     ['#1d8f6a', '#c94040', '#2563c0'],
          borderWidth: 1.5,
          borderRadius: 5,
        },
        {
          label: 'Last month',
          data: [ps.income, ps.expense, ps.income - ps.expense],
          backgroundColor: ['rgba(29,143,106,0.12)', 'rgba(201,64,64,0.12)', 'rgba(37,99,192,0.12)'],
          borderColor:     ['#1d8f6a', '#c94040', '#2563c0'],
          borderWidth: 1.5,
          borderRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 }, color: '#9e9d98' } },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { family: 'DM Sans', size: 11 }, color: '#9e9d98', callback: v => '₹' + (v / 1000).toFixed(0) + 'k' }
        }
      }
    }
  });
});
