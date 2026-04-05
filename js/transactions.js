// ─────────────────────────────────────────────────────────────
//  transactions.js  —  Transactions page logic
// ─────────────────────────────────────────────────────────────

let txState = {
  filterType:     'all',
  filterCategory: 'all',
  searchQuery:    '',
  sortField:      'date',
  sortDir:        'desc',
};

document.addEventListener('DOMContentLoaded', () => {
  initLayout('transactions', 'Transactions');

  const prefs = loadPrefs();

  // Admin-only: show add button
  if (prefs.role !== 'admin') {
    document.getElementById('addTxBtn').classList.add('hidden');
  }

  renderTable();

  // ── Filters ───────────────────────────────────────────────
  document.getElementById('txSearch').addEventListener('input', e => {
    txState.searchQuery = e.target.value;
    renderTable();
  });
  document.getElementById('txType').addEventListener('change', e => {
    txState.filterType = e.target.value;
    renderTable();
  });
  document.getElementById('txCategory').addEventListener('change', e => {
    txState.filterCategory = e.target.value;
    renderTable();
  });
  document.getElementById('txSort').addEventListener('change', e => {
    const [field, dir] = e.target.value.split('-');
    txState.sortField = field;
    txState.sortDir   = dir;
    renderTable();
  });

  // Column header sort
  document.querySelectorAll('thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (txState.sortField === field) {
        txState.sortDir = txState.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        txState.sortField = field;
        txState.sortDir   = 'asc';
      }
      renderTable();
    });
  });

  // ── Modal ─────────────────────────────────────────────────
  document.getElementById('addTxBtn').addEventListener('click', openModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('saveBtn').addEventListener('click', saveTransaction);
  document.getElementById('txModal').addEventListener('click', e => {
    if (e.target.id === 'txModal') closeModal();
  });
});

// ── Render table ──────────────────────────────────────────────
function renderTable() {
  const prefs = loadPrefs();
  let txs = loadTransactions();

  // Filter by selected month
  txs = txs.filter(t => t.date.startsWith(prefs.selectedMonth));

  // Filters
  if (txState.filterType !== 'all')     txs = txs.filter(t => t.type === txState.filterType);
  if (txState.filterCategory !== 'all') txs = txs.filter(t => t.category === txState.filterCategory);
  if (txState.searchQuery) {
    const q = txState.searchQuery.toLowerCase();
    txs = txs.filter(t => t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }

  // Sort
  txs.sort((a, b) => {
    const va = txState.sortField === 'amount' ? a.amount : a[txState.sortField];
    const vb = txState.sortField === 'amount' ? b.amount : b[txState.sortField];
    if (va < vb) return txState.sortDir === 'asc' ? -1 : 1;
    if (va > vb) return txState.sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const tbody = document.getElementById('txBody');

  if (txs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="no-data">No transactions found for this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = txs.map(t => {
    const c       = CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other;
    const sign    = t.type === 'income' ? '+' : '-';
    const amtCls  = t.type === 'income' ? 'income' : 'expense';
    const typeBg  = t.type === 'income' ? 'var(--green-bg)' : 'var(--red-bg)';
    const typeClr = t.type === 'income' ? 'var(--green)'    : 'var(--red)';
    const canEdit = prefs.role === 'admin';

    return `
      <tr>
        <td class="tx-date">${formatDate(t.date)}</td>
        <td>${t.desc}</td>
        <td><span class="tx-cat" style="background:${c.bg};color:${c.color}">${t.category}</span></td>
        <td>
          <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;
                       background:${typeBg};color:${typeClr}">
            ${t.type}
          </span>
        </td>
        <td class="tx-amount ${amtCls}">${sign}${fmt(t.amount)}</td>
        <td>
          ${canEdit
            ? `<button onclick="deleteTransaction(${t.id})"
                 style="background:none;border:none;cursor:pointer;color:var(--text-3);
                        font-size:15px;padding:2px 6px;border-radius:4px;"
                 title="Delete">✕</button>`
            : ''}
        </td>
      </tr>
    `;
  }).join('');
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal() {
  document.getElementById('txModal').classList.add('open');
  document.getElementById('txForm').reset();
}

function closeModal() {
  document.getElementById('txModal').classList.remove('open');
}

function saveTransaction() {
  const date     = document.getElementById('f-date').value;
  const desc     = document.getElementById('f-desc').value.trim();
  const category = document.getElementById('f-category').value;
  const type     = document.getElementById('f-type').value;
  const amount   = parseFloat(document.getElementById('f-amount').value);

  if (!date || !desc || !category || !type || isNaN(amount) || amount <= 0) {
    showToast('Please fill in all fields correctly.');
    return;
  }

  const txs = loadTransactions();
  txs.push({ id: getNextId(txs), date, desc, category, type, amount });
  saveTransactions(txs);
  closeModal();
  renderTable();
  showToast('Transaction added!');
}

function deleteTransaction(id) {
  const txs = loadTransactions().filter(t => t.id !== id);
  saveTransactions(txs);
  renderTable();
  showToast('Transaction deleted.');
}