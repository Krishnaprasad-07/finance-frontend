# Fintrack — Finance Dashboard

A clean, interactive finance dashboard built with plain HTML, CSS, and JavaScript. No frameworks, no build tools — just open and run.

---

## Live Demo

[View on GitHub Pages](https://YOUR_USERNAME.github.io/finance-dashboard/)

> Replace the link above with your actual GitHub Pages URL after deployment.

---

## Features Implemented

- Dashboard Overview with Summary Cards (Total Balance, Income, Expenses, Savings Rate)
- Time-Based Visualization — monthly Income vs Expenses bar chart
- Categorical Visualization — spending breakdown donut chart
- Transaction List with date, amount, category, and type
- Transaction Filtering — by type (income/expense) and category
- Transaction Sorting and Search — sort by date or amount, search by description
- Role-Based UI — Admin can add and delete transactions; Viewer is read-only
- Insights Section — top spending category, month-over-month comparison, savings rate
- State Management — via localStorage, persists across pages
- Responsive Design — works on mobile, tablet, and desktop

---

## Project Structure

```
fintrack/
├── index.html              # Overview / Dashboard page
├── style.css               # All shared styles (one file for all pages)
├── pages/
│   ├── transactions.html   # Transactions page
│   └── insights.html       # Insights page
└── js/
    ├── data.js             # Mock data, localStorage, shared helpers
    ├── layout.js           # Sidebar + topbar (injected into every page)
    ├── dashboard.js        # Overview page logic
    ├── transactions.js     # Transactions page logic
    └── insights.js         # Insights page logic
```

Each page loads only its own JS file. Shared state (role, selected month, transactions) flows through `data.js` via localStorage.

---

## How to Run Locally

**Option 1 — VS Code Live Server (recommended)**
1. Open the `fintrack` folder in VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`

**Option 2 — Python**
```bash
cd fintrack
python -m http.server 3000
```
Open `http://localhost:3000`

**Option 3 — Node.js**
```bash
cd fintrack
npx serve .
```

> Do not open `index.html` by double-clicking — use a local server so localStorage and relative paths work correctly across pages.

---

## Role-Based UI

Switch roles using the dropdown in the sidebar bottom:

| Feature              | Admin | Viewer |
|----------------------|-------|--------|
| View dashboard       | ✅    | ✅     |
| View transactions    | ✅    | ✅     |
| Add transaction      | ✅    | ❌     |
| Delete transaction   | ✅    | ❌     |
| View insights        | ✅    | ✅     |

Role selection persists across page navigations via localStorage.

---

## Pages

### Overview (`index.html`)
- 4 summary cards: Total Balance, Income, Expenses, Savings Rate
- Month-over-month percentage change on each card
- Bar chart: Income vs Expenses over 3 months
- Donut chart: Spending breakdown by category with legend

### Transactions (`pages/transactions.html`)
- Full transaction table with date, description, category, type, amount
- Search by description or category
- Filter by type (income / expense) and by category
- Sort by date or amount (ascending / descending)
- Add new transactions via modal (Admin only)
- Delete transactions (Admin only)

### Insights (`pages/insights.html`)
- Highest spending category with percentage of total spend
- Month-over-month income and expense comparison bars
- Savings rate with contextual advice
- Side-by-side bar chart comparing this month vs last month

---

## Technical Decisions

- **Plain HTML/CSS/JS** — no framework, no build step, runs anywhere
- **Separate HTML pages** — each page is a real file, not a JS-rendered view
- **localStorage** — shared state across pages without a backend
- **CSS custom properties** — consistent design tokens across all pages
- **Chart.js via CDN** — professional charts with zero build configuration
- **layout.js** — sidebar and topbar are injected once, shared by all pages

---

## Mock Data

The app ships with 30 sample transactions across March 2026 and February 2026. All data is stored in `js/data.js` and loaded into localStorage on first visit. Transactions added or deleted during a session are persisted in localStorage.

---

## Tech Stack

| Layer      | Choice              |
|------------|---------------------|
| Markup     | HTML5               |
| Styling    | CSS3 (Vanilla)      |
| Logic      | JavaScript (ES6+)   |
| Charts     | Chart.js 4.4        |
| Fonts      | DM Sans, DM Mono    |
| Storage    | localStorage        |
| Hosting    | GitHub Pages        |
