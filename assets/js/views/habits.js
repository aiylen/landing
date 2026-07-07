/* ============================================================
   views/habits.js
   ============================================================ */
window.Views = window.Views || {};

Views.habits = function(root){
  const d = Store.data;
  const h = d.habits;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const today = now.getDate();

  function pctFor(habit){
    const grid = h.grid[habit] || {};
    let done = 0, total = 0;
    for (let day=1; day<=today; day++){ total++; if (grid[day]) done++; }
    return total ? Math.round(done/total*100) : 0;
  }
  function streakFor(habit){
    const grid = h.grid[habit] || {};
    let streak = 0;
    for (let day=today; day>=1; day--){ if (grid[day]) streak++; else break; }
    return streak;
  }

  root.innerHTML = `
    <div class="grid grid-4" style="margin-bottom:18px;">
      ${h.list.map(habit=>`
        <div class="card" style="text-align:center;">
          <div style="font-weight:700;font-size:13.5px;margin-bottom:10px;">${esc(habit)}</div>
          <div style="display:flex;justify-content:center;">${ringSVG(pctFor(habit), 76, 7)}</div>
          <div class="badge success" style="margin-top:10px;">${streakFor(habit)} day streak</div>
        </div>
      `).join('')}
    </div>

    <div class="grid grid-12">
      <div class="card span-8">
        <div class="card-head"><h3>Monthly Habit Grid</h3><span class="muted">${now.toLocaleDateString(undefined,{month:'long'})}</span></div>
        <div style="overflow-x:auto;">
          <table class="habit-table">
            <thead><tr><th></th>${Array.from({length:daysInMonth},(_,i)=>`<th>${i+1}</th>`).join('')}</tr></thead>
            <tbody>
              ${h.list.map(habit=>`
                <tr>
                  <td class="habit-name">${esc(habit)}</td>
                  ${Array.from({length:daysInMonth},(_,i)=>{
                    const day = i+1;
                    const on = !!(h.grid[habit] && h.grid[habit][day]);
                    return `<td><div class="habit-cell ${on?'on':''}" data-habit="${esc(habit)}" data-day="${day}"></div></td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="add-row">
          <input type="text" id="newHabit" placeholder="Add a new habit to track">
          <button class="btn btn-primary btn-sm" id="addHabitBtn">${Icons.plus}Add</button>
        </div>
      </div>
      <div class="card span-4">
        <div class="card-head"><h3>Completion Rate</h3></div>
        <div class="chart-wrap sm"><canvas id="habitChart"></canvas></div>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('habits'); }

  root.querySelectorAll('.habit-cell').forEach(cell=>{
    cell.addEventListener('click', ()=>{
      const habit = cell.dataset.habit, day = cell.dataset.day;
      h.grid[habit] = h.grid[habit] || {};
      h.grid[habit][day] = !h.grid[habit][day];
      persist(); rerender(); App.refreshIfActive('dashboard');
    });
  });

  document.getElementById('addHabitBtn').addEventListener('click', ()=>{
    const inp = document.getElementById('newHabit');
    const v = inp.value.trim();
    if (!v || h.list.includes(v)) return;
    h.list.push(v); h.grid[v] = {};
    persist(); rerender();
  });

  ChartKit.bar('habitChart', h.list, [{ label:'Completion %', data: h.list.map(pctFor) }]);
};
