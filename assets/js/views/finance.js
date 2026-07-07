/* ============================================================
   views/finance.js
   ============================================================ */
window.Views = window.Views || {};

Views.finance = function(root){
  const d = Store.data;
  const f = d.finance;
  const totalIncome = f.income.reduce((s,i)=>s+i.amount,0);
  const totalExpense = f.expenses.reduce((s,e)=>s+e.amount,0);
  const balance = totalIncome - totalExpense;
  const savingsPct = f.savingsGoal ? Math.min(100, Math.round(balance/f.savingsGoal*100)) : 0;

  root.innerHTML = `
    <div class="grid grid-4" style="margin-bottom:18px;">
      <div class="stat-card">
        <span class="stat-label">Total Income</span>
        <span class="stat-value">${fmtINR(totalIncome)}</span>
      </div>
      <div class="stat-card warm">
        <span class="stat-label">Total Expenses</span>
        <span class="stat-value">${fmtINR(totalExpense)}</span>
      </div>
      <div class="stat-card alt">
        <span class="stat-label">Balance</span>
        <span class="stat-value">${fmtINR(balance)}</span>
      </div>
      <div class="stat-card plain" style="align-items:center;flex-direction:row;justify-content:space-between;">
        <div><span class="stat-label">Savings Goal</span><br><span style="font-size:12px;color:var(--text-dim);">${fmtINR(balance)} / ${fmtINR(f.savingsGoal)}</span></div>
        ${ringSVG(savingsPct, 56, 6)}
      </div>
    </div>

    <div class="grid grid-12" style="margin-bottom:18px;">
      <div class="card span-6">
        <div class="card-head"><h3>Income</h3></div>
        <div class="row-list" id="incomeList">
          ${f.income.map(i=>`
            <div class="check-row" data-id="${i.id}">
              <span>${esc(i.source)}</span>
              <span style="margin-left:auto;font-family:var(--font-mono);font-weight:700;color:var(--success);">${fmtINR(i.amount)}</span>
              <button class="row-del income-del">${Icons.trash}</button>
            </div>`).join('') || `<div class="empty-state">No income sources yet.</div>`}
        </div>
        <div class="add-row">
          <input type="text" id="newIncomeSource" placeholder="Source">
          <input type="number" id="newIncomeAmount" placeholder="Amount" style="max-width:120px;">
          <button class="btn btn-primary btn-sm" id="addIncomeBtn">${Icons.plus}</button>
        </div>
      </div>
      <div class="card span-6">
        <div class="card-head"><h3>Expenses</h3></div>
        <div class="row-list" id="expenseList">
          ${f.expenses.map(e=>`
            <div class="check-row" data-id="${e.id}">
              <span>${esc(e.category)}</span>
              <span style="margin-left:auto;font-family:var(--font-mono);font-weight:700;color:var(--danger);">${fmtINR(e.amount)}</span>
              <button class="row-del expense-del">${Icons.trash}</button>
            </div>`).join('') || `<div class="empty-state">No expenses yet.</div>`}
        </div>
        <div class="add-row">
          <input type="text" id="newExpenseCat" placeholder="Category">
          <input type="number" id="newExpenseAmount" placeholder="Amount" style="max-width:120px;">
          <button class="btn btn-primary btn-sm" id="addExpenseBtn">${Icons.plus}</button>
        </div>
      </div>
    </div>

    <div class="grid grid-12" style="margin-bottom:18px;">
      <div class="card span-4">
        <div class="card-head"><h3>Savings Goal</h3></div>
        <label>Target amount</label>
        <input type="number" id="savingsGoalInput" value="${f.savingsGoal}">
        <div class="pbar" style="margin-top:14px;"><span style="width:${savingsPct}%"></span></div>
        <p style="font-size:12px;color:var(--text-dim);margin-top:8px;">${savingsPct}% of goal reached</p>
      </div>
      <div class="card span-4">
        <div class="card-head"><h3>Expense Breakdown</h3></div>
        <div class="chart-wrap sm"><canvas id="financeDoughnut"></canvas></div>
      </div>
      <div class="card span-4">
        <div class="card-head"><h3>6-Month Trend</h3></div>
        <div class="chart-wrap sm"><canvas id="financeTrend"></canvas></div>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('finance'); App.refreshIfActive('dashboard'); }

  document.getElementById('addIncomeBtn').addEventListener('click', ()=>{
    const src = document.getElementById('newIncomeSource');
    const amt = document.getElementById('newIncomeAmount');
    if (!src.value.trim() || !amt.value) return;
    f.income.push({ id:uid(), source:src.value.trim(), amount:Number(amt.value) });
    persist(); rerender();
  });
  root.querySelectorAll('.income-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.closest('.check-row').dataset.id;
      f.income = f.income.filter(i=>i.id!==id); persist(); rerender();
    });
  });

  document.getElementById('addExpenseBtn').addEventListener('click', ()=>{
    const cat = document.getElementById('newExpenseCat');
    const amt = document.getElementById('newExpenseAmount');
    if (!cat.value.trim() || !amt.value) return;
    f.expenses.push({ id:uid(), category:cat.value.trim(), amount:Number(amt.value) });
    persist(); rerender();
  });
  root.querySelectorAll('.expense-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.closest('.check-row').dataset.id;
      f.expenses = f.expenses.filter(e=>e.id!==id); persist(); rerender();
    });
  });

  document.getElementById('savingsGoalInput').addEventListener('input', (e)=>{
    f.savingsGoal = Number(e.target.value) || 0; persist(); App.refreshIfActive('dashboard');
  });

  ChartKit.doughnut('financeDoughnut', f.expenses.map(e=>e.category), f.expenses.map(e=>e.amount));
  ChartKit.line('financeTrend', f.history.map(h=>h.month), [{ label:'Income', data:f.history.map(h=>h.income) }]);
};
