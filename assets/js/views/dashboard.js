/* ============================================================
   views/dashboard.js
   ============================================================ */
window.Views = window.Views || {};

Views.dashboard = function(root){
  const d = Store.data;
  const today = d.daily[todayISO()] || { priorities:[], todos:[], goal:'', goalDone:false };
  const doneTodos = today.todos.filter(t=>t.done).length;
  const todoPct = today.todos.length ? Math.round(doneTodos/today.todos.length*100) : 0;

  const water = d.water[todayISO()] || { glasses:0, goal:8 };
  const waterPct = Math.round(water.glasses/water.goal*100);

  const habitDay = new Date().getDate();
  const habitList = d.habits.list;
  const habitDoneToday = habitList.filter(h => d.habits.grid[h] && d.habits.grid[h][habitDay]).length;
  const habitPct = habitList.length ? Math.round(habitDoneToday/habitList.length*100) : 0;

  const totalIncome = d.finance.income.reduce((s,i)=>s+i.amount,0);
  const totalExpense = d.finance.expenses.reduce((s,e)=>s+e.amount,0);
  const balance = totalIncome - totalExpense;

  const activeGoal = d.goals[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  root.innerHTML = `
    <div class="quote-banner" style="margin-bottom:18px;">
      <p>${esc(Store.quote())}<span>${greeting}, Asad — here's your day at a glance.</span></p>
      ${ringSVG(todoPct, 72, 7)}
    </div>

    <div class="grid grid-4" style="margin-bottom:18px;">
      <div class="stat-card">
        <span class="stat-label">Today's Tasks</span>
        <span class="stat-value">${doneTodos}/${today.todos.length}</span>
      </div>
      <div class="stat-card alt">
        <span class="stat-label">Habits Today</span>
        <span class="stat-value">${habitDoneToday}/${habitList.length}</span>
      </div>
      <div class="stat-card plain">
        <span class="stat-label">Balance</span>
        <span class="stat-value">${fmtINR(balance)}</span>
      </div>
      <div class="stat-card warm">
        <span class="stat-label">Water Today</span>
        <span class="stat-value">${water.glasses}/${water.goal} glasses</span>
      </div>
    </div>

    <div class="grid grid-12" style="margin-bottom:18px;">
      <div class="card span-4">
        <div class="card-head"><h3>Top 3 Priorities</h3><span class="muted">Today</span></div>
        <div class="row-list">
          ${today.priorities.length ? today.priorities.map((p,i)=>`
            <div class="check-row"><span style="font-family:var(--font-mono);color:var(--primary);font-weight:700;">0${i+1}</span><span>${esc(p)}</span></div>
          `).join('') : `<div class="empty-state">No priorities set for today yet.</div>`}
        </div>
      </div>

      <div class="card span-4" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;">
        <div class="card-head" style="width:100%;"><h3>Today's Goal</h3></div>
        ${ringSVG(today.goalDone ? 100 : 40, 92, 9)}
        <p style="text-align:center;font-size:13px;color:var(--text-dim);">${esc(today.goal || 'No goal set for today')}</p>
      </div>

      <div class="card span-4">
        <div class="card-head"><h3>Habit Streaks</h3></div>
        <div class="row-list">
          ${habitList.map(h=>{
            const grid = d.habits.grid[h] || {};
            let streak = 0;
            for (let day = habitDay; day >= 1; day--){ if (grid[day]) streak++; else break; }
            return `<div class="check-row"><span>${esc(h)}</span><span class="badge success" style="margin-left:auto;">${streak}d streak</span></div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="grid grid-12">
      <div class="card span-7">
        <div class="card-head"><h3>Income vs Expenses</h3><span class="muted">Last 6 months</span></div>
        <div class="chart-wrap"><canvas id="dashTrendChart"></canvas></div>
      </div>
      <div class="card span-5">
        <div class="card-head"><h3>Expense Breakdown</h3><span class="muted">This month</span></div>
        <div class="chart-wrap"><canvas id="dashExpenseChart"></canvas></div>
      </div>
    </div>
  `;

  ChartKit.line('dashTrendChart', d.finance.history.map(h=>h.month), [
    { label:'Income', data:d.finance.history.map(h=>h.income) },
    { label:'Expense', data:d.finance.history.map(h=>h.expense) }
  ]);
  ChartKit.doughnut('dashExpenseChart', d.finance.expenses.map(e=>e.category), d.finance.expenses.map(e=>e.amount));
};
