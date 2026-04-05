// ─────────────────────────────────────────────────────────────
//  dashboard.js  —  Overview page logic
// ─────────────────────────────────────────────────────────────

let trendChart = null;
let donutChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initLayout('dashboard', 'Overview');

  const prefs = loadPrefs();
  const txs   = loadTransactions();
  const m     = prefs.selectedMonth;
  const prev  = m === '2026-03' ? '2026-02' : '2026-01';

  const s  = getSummary(txs, m);
  const ps = getSummary(txs, prev);

  // ── Summary cards ─────────────────────────────────────────
  document.getElementById('card-balance').textContent = fmt(s.income - s.expense);
  document.getElementById('card-income').textContent  = fmt(s.income);
  document.getElementById('card-expense').textContent = fmt(s.expense);
  document.getElementById('card-savings').textContent = s.savings + '%';

  const balDiff = ps.income
    ? Math.round(((s.income - s.expense) - (ps.income - ps.expense)) / Math.max(Math.abs(ps.income - ps.expense), 1) * 100)
    : 0;
  const incDiff = ps.income  ? Math.round((s.income  - ps.income)  / ps.income  * 100) : 0;
  const expDiff = ps.expense ? Math.round((s.expense - ps.expense) / ps.expense * 100) : 0;
  const savDiff = s.savings - ps.savings;

  setDiff('diff-balance', balDiff);
  setDiff('diff-income',  incDiff);
  setDiff('diff-expense', expDiff, true);   // invert: lower expense = good
  setDiff('diff-savings', savDiff);

  // ── Trend bar chart ───────────────────────────────────────
  const months = ['2026-01', '2026-02', '2026-03'];
  const labels = ['Jan', 'Feb', 'Mar'];
  const incomeData  = months.map(mo => getSummary(txs, mo).income);
  const expenseData = months.map(mo => getSummary(txs, mo).expense);

  trendChart = new Chart(document.getElementById('trendChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Income',  data: incomeData,  backgroundColor: '#d1ede3', borderColor: '#1d8f6a', borderWidth: 1.5, borderRadius: 5 },
        { label: 'Expense', data: expenseData, backgroundColor: '#f7d5d5', borderColor: '#c94040', borderWidth: 1.5, borderRadius: 5 },
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

  // ── Donut chart ───────────────────────────────────────────
  const breakdown = getCategoryBreakdown(txs, m).slice(0, 5);
  const COLORS    = ['#1d8f6a', '#2563c0', '#b07014', '#c94040', '#7c3aed'];
  const total     = breakdown.reduce((s, b) => s + b[1], 0);

  donutChart = new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: breakdown.map(b => b[0]),
      datasets: [{
        data: breakdown.map(b => b[1]),
        backgroundColor: COLORS,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } }
      }
    }
  });

  // Donut legend
  document.getElementById('donutLegend').innerHTML = breakdown.map((b, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${COLORS[i]}"></div>
        <span class="legend-name">${b[0]}</span>
      </div>
      <span class="legend-val">
        ${fmt(b[1])}
        <span style="color:var(--text-3);font-weight:400">(${total ? Math.round(b[1] / total * 100) : 0}%)</span>
      </span>
    </div>
  `).join('');
});

// ── Helper ────────────────────────────────────────────────────
function setDiff(id, pct, invert = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const up = invert ? pct < 0 : pct >= 0;
  el.className = 'card-sub ' + (up ? 'up' : 'down');
  el.textContent = (pct >= 0 ? '▲ ' : '▼ ') + Math.abs(pct) + '% vs last month';
}