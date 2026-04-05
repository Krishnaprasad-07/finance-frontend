// ─────────────────────────────────────────────────────────────
//  layout.js  —  injects sidebar + topbar, wires up shared UI
//  Call initLayout(pageId, pageTitle) at the top of each page script
// ─────────────────────────────────────────────────────────────

function initLayout(pageId, pageTitle) {
  const prefs = loadPrefs();

  // Resolve paths: index.html is at root, other pages are in /pages/
  const isRoot = pageId === 'dashboard';
  const base   = isRoot ? 'pages/' : '';
  const root   = isRoot ? ''       : '../';

  // ── Inject sidebar HTML ───────────────────────────────────
  document.getElementById('sidebar-mount').innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      </div>
      Fintrack
    </div>

    <nav class="nav-section">
      <div class="nav-label">Main</div>
      <a class="nav-item ${pageId === 'dashboard'    ? 'active' : ''}" href="${root}index.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Overview
      </a>
      <a class="nav-item ${pageId === 'transactions' ? 'active' : ''}" href="${base}transactions.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
        </svg>
        Transactions
      </a>
      <a class="nav-item ${pageId === 'insights'     ? 'active' : ''}" href="${base}insights.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Insights
      </a>
    </nav>

    <div class="sidebar-bottom">
      <div class="role-label">Active Role</div>
      <select id="roleSelect" class="role-select">
        <option value="admin"  ${prefs.role === 'admin'  ? 'selected' : ''}>Admin</option>
        <option value="viewer" ${prefs.role === 'viewer' ? 'selected' : ''}>Viewer</option>
      </select>
      <div id="roleBadge" class="role-badge ${prefs.role === 'viewer' ? 'viewer' : ''}">
        ${prefs.role === 'admin' ? 'Admin' : 'Viewer'}
      </div>
    </div>
  `;

  // ── Inject topbar HTML ────────────────────────────────────
  document.getElementById('topbar-mount').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="page-title">${pageTitle}</span>
    </div>
    <div class="topbar-right">
      <select id="monthSelect" class="month-select">
        <option value="2026-03" ${prefs.selectedMonth === '2026-03' ? 'selected' : ''}>March 2026</option>
        <option value="2026-02" ${prefs.selectedMonth === '2026-02' ? 'selected' : ''}>February 2026</option>
        <option value="2026-01" ${prefs.selectedMonth === '2026-01' ? 'selected' : ''}>January 2026</option>
      </select>
      <div class="avatar">AK</div>
    </div>
  `;

  // ── Mobile sidebar toggle ─────────────────────────────────
  document.getElementById('hamburger').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.sidebar-overlay').classList.toggle('open');
  });
  document.querySelector('.sidebar-overlay').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('open');
  });

  // ── Role switcher (persists across pages) ─────────────────
  document.getElementById('roleSelect').addEventListener('change', e => {
    const prefs = loadPrefs();
    prefs.role = e.target.value;
    savePrefs(prefs);
    // Reload so page re-renders with new role
    window.location.reload();
  });

  // ── Month switcher (persists across pages) ────────────────
  document.getElementById('monthSelect').addEventListener('change', e => {
    const prefs = loadPrefs();
    prefs.selectedMonth = e.target.value;
    savePrefs(prefs);
    window.location.reload();
  });

  // ── Toast helper (available globally) ────────────────────
  window.showToast = function(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  };
}