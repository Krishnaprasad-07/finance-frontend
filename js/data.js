// ─────────────────────────────────────────────────────────────
//  data.js  —  shared data store & helpers (all pages import this)
// ─────────────────────────────────────────────────────────────

const DEFAULT_TRANSACTIONS = [
  { id:1,  date:'2026-03-01', desc:'Monthly Salary',      category:'Salary',        type:'income',  amount:5200 },
  { id:2,  date:'2026-03-02', desc:'Rent Payment',        category:'Housing',       type:'expense', amount:1400 },
  { id:3,  date:'2026-03-03', desc:'Grocery Store',       category:'Food',          type:'expense', amount:127  },
  { id:4,  date:'2026-03-04', desc:'Freelance Project',   category:'Freelance',     type:'income',  amount:800  },
  { id:5,  date:'2026-03-05', desc:'Netflix',             category:'Entertainment', type:'expense', amount:18   },
  { id:6,  date:'2026-03-06', desc:'Uber Ride',           category:'Transport',     type:'expense', amount:24   },
  { id:7,  date:'2026-03-08', desc:'Pharmacy',            category:'Health',        type:'expense', amount:55   },
  { id:8,  date:'2026-03-09', desc:'Amazon Shopping',     category:'Shopping',      type:'expense', amount:210  },
  { id:9,  date:'2026-03-10', desc:'Dividend Income',     category:'Investment',    type:'income',  amount:340  },
  { id:10, date:'2026-03-11', desc:'Restaurant Dinner',   category:'Food',          type:'expense', amount:76   },
  { id:11, date:'2026-03-13', desc:'Bus Pass',            category:'Transport',     type:'expense', amount:40   },
  { id:12, date:'2026-03-14', desc:'Gym Membership',      category:'Health',        type:'expense', amount:50   },
  { id:13, date:'2026-03-15', desc:'Online Course',       category:'Other',         type:'expense', amount:99   },
  { id:14, date:'2026-03-17', desc:'Coffee & Snacks',     category:'Food',          type:'expense', amount:34   },
  { id:15, date:'2026-03-18', desc:'Electricity Bill',    category:'Housing',       type:'expense', amount:95   },
  { id:16, date:'2026-03-20', desc:'Concert Tickets',     category:'Entertainment', type:'expense', amount:140  },
  { id:17, date:'2026-03-22', desc:'Clothing Store',      category:'Shopping',      type:'expense', amount:185  },
  { id:18, date:'2026-03-24', desc:'Consulting Fee',      category:'Freelance',     type:'income',  amount:600  },
  { id:19, date:'2026-03-26', desc:'Supermarket',         category:'Food',          type:'expense', amount:98   },
  { id:20, date:'2026-03-28', desc:'Taxi',                category:'Transport',     type:'expense', amount:18   },
  { id:21, date:'2026-02-01', desc:'Monthly Salary',      category:'Salary',        type:'income',  amount:5200 },
  { id:22, date:'2026-02-03', desc:'Rent Payment',        category:'Housing',       type:'expense', amount:1400 },
  { id:23, date:'2026-02-05', desc:'Grocery Store',       category:'Food',          type:'expense', amount:145  },
  { id:24, date:'2026-02-08', desc:'Transport Card',      category:'Transport',     type:'expense', amount:50   },
  { id:25, date:'2026-02-10', desc:'Doctor Visit',        category:'Health',        type:'expense', amount:80   },
  { id:26, date:'2026-02-12', desc:'Streaming Services',  category:'Entertainment', type:'expense', amount:30   },
  { id:27, date:'2026-02-14', desc:'Valentine Dinner',    category:'Food',          type:'expense', amount:120  },
  { id:28, date:'2026-02-18', desc:'Freelance Project',   category:'Freelance',     type:'income',  amount:450  },
  { id:29, date:'2026-02-22', desc:'Shopping Mall',       category:'Shopping',      type:'expense', amount:230  },
  { id:30, date:'2026-02-25', desc:'Electricity Bill',    category:'Housing',       type:'expense', amount:88   },
];

// ── Category meta ─────────────────────────────────────────────
const CATEGORY_COLORS = {
  Food:          { bg: '#fdf3e3', color: '#b07014' },
  Transport:     { bg: '#e8effc', color: '#2563c0' },
  Housing:       { bg: '#e6f5ef', color: '#1d8f6a' },
  Entertainment: { bg: '#fbeaea', color: '#c94040' },
  Health:        { bg: '#f0ecfa', color: '#7c3aed' },
  Shopping:      { bg: '#fce8f5', color: '#a7278f' },
  Salary:        { bg: '#e6f5ef', color: '#1d8f6a' },
  Freelance:     { bg: '#e8effc', color: '#2563c0' },
  Investment:    { bg: '#fdf3e3', color: '#b07014' },
  Other:         { bg: '#f2f0ec', color: '#6b6a65' },
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

// ── Persistence ───────────────────────────────────────────────
function loadTransactions() {
  try {
    const stored = localStorage.getItem('fintrack_transactions');
    return stored ? JSON.parse(stored) : DEFAULT_TRANSACTIONS;
  } catch { return DEFAULT_TRANSACTIONS; }
}

function saveTransactions(txs) {
  localStorage.setItem('fintrack_transactions', JSON.stringify(txs));
}

function getNextId(txs) {
  return txs.length ? Math.max(...txs.map(t => t.id)) + 1 : 1;
}

// ── App-wide preferences (role, month) ───────────────────────
function loadPrefs() {
  try {
    const stored = localStorage.getItem('fintrack_prefs');
    return stored ? JSON.parse(stored) : { role: 'admin', selectedMonth: '2026-03' };
  } catch { return { role: 'admin', selectedMonth: '2026-03' }; }
}

function savePrefs(prefs) {
  localStorage.setItem('fintrack_prefs', JSON.stringify(prefs));
}

// ── Calculation helpers ───────────────────────────────────────
function getMonthTx(txs, month) {
  return txs.filter(t => t.date.startsWith(month));
}

function getSummary(txs, month) {
  const tx      = getMonthTx(txs, month);
  const income  = tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income > 0 ? Math.round((income - expense) / income * 100) : 0;
  return { income, expense, balance: income - expense, savings };
}

function getCategoryBreakdown(txs, month) {
  const tx  = getMonthTx(txs, month).filter(t => t.type === 'expense');
  const map = {};
  tx.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// ── Formatting ────────────────────────────────────────────────
const fmt = n => '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0 });

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}