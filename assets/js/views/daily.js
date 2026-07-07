/* ============================================================
   views/daily.js
   ============================================================ */
window.Views = window.Views || {};

Views.daily = function(root){
  const key = todayISO();
  const d = Store.data;
  if (!d.daily[key]) {
    d.daily[key] = { priorities:['','',''], todos:[], schedule:{}, dontForget:[], goal:'', goalDone:false };
  }
  const day = d.daily[key];
  while (day.priorities.length < 3) day.priorities.push('');

  const HOURS = [];
  for (let h=6; h<=22; h++) HOURS.push(h);

  const doneTodos = day.todos.filter(t=>t.done).length;
  const pct = day.todos.length ? Math.round(doneTodos/day.todos.length*100) : 0;

  function fmtHour(h){
    const ampm = h>=12 ? 'PM':'AM';
    const hh = h%12===0 ? 12 : h%12;
    return `${hh}:00 ${ampm}`;
  }

  root.innerHTML = `
    <div class="grid grid-12" style="margin-bottom:18px;">
      <div class="card span-4">
        <div class="card-head"><h3>Top 3 Priorities</h3></div>
        <div class="row-list">
          ${day.priorities.slice(0,3).map((p,i)=>`
            <div class="field" style="margin-bottom:8px;">
              <input type="text" data-priority="${i}" value="${esc(p)}" placeholder="Priority ${i+1}">
            </div>`).join('')}
        </div>
      </div>

      <div class="card span-4">
        <div class="card-head"><h3>Today's Goal</h3></div>
        <textarea id="dailyGoal" placeholder="What's the one thing that matters most today?" style="min-height:60px;">${esc(day.goal)}</textarea>
        <label class="check-row" style="margin-top:10px;cursor:pointer;">
          <input type="checkbox" id="goalDone" ${day.goalDone?'checked':''}>
          <span>Mark goal complete</span>
        </label>
      </div>

      <div class="card span-4">
        <div class="card-head"><h3>Progress</h3><span class="muted">${doneTodos}/${day.todos.length} done</span></div>
        <div style="display:flex;justify-content:center;padding:10px 0;">${ringSVG(pct, 96, 9)}</div>
        <div class="pbar"><span style="width:${pct}%"></span></div>
      </div>
    </div>
<br/>
    <div class="grid grid-12">
      <div class="card span-4">
        <div class="card-head"><h3>To-Do List</h3></div>
        <div class="row-list" id="todoList">
          ${day.todos.map(t=>`
            <div class="check-row ${t.done?'done':''}" data-id="${t.id}">
              <input type="checkbox" class="todo-check" ${t.done?'checked':''}>
              <span>${esc(t.text)}</span>
              <button class="row-del todo-del">${Icons.trash}</button>
            </div>`).join('') || `<div class="empty-state">Nothing on the list yet. Add your first task below.</div>`}
        </div>
        <div class="add-row">
          <input type="text" id="newTodo" placeholder="Add a task and press Enter">
          <button class="btn btn-primary btn-sm" id="addTodoBtn">${Icons.plus}Add</button>
        </div>
      </div>

      <div class="card span-4">
        <div class="card-head"><h3>Hourly Schedule</h3><span class="muted">6 AM – 10 PM</span></div>
        <div class="schedule" style="max-height:400px;overflow-y:auto;">
          ${HOURS.map(h=>`
            <div class="schedule-row">
              <div class="schedule-time">${fmtHour(h)}</div>
              <input type="text" data-hour="${h}" value="${esc(day.schedule[h]||'')}" placeholder="—">
            </div>`).join('')}
        </div>
      </div>

      <div class="card span-4">
        <div class="card-head"><h3>Don't Forget</h3></div>
        <div class="row-list" id="dontForgetList">
          ${day.dontForget.map((item,i)=>`
            <div class="check-row" data-i="${i}">
              <span class="badge warn">!</span><span>${esc(item)}</span>
              <button class="row-del df-del">${Icons.trash}</button>
            </div>`).join('') || `<div class="empty-state">Nothing pinned.</div>`}
        </div>
        <div class="add-row">
          <input type="text" id="newDontForget" placeholder="Add a reminder">
          <button class="btn btn-ghost btn-sm" id="addDfBtn">${Icons.plus}</button>
        </div>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }

  root.querySelectorAll('[data-priority]').forEach(inp=>{
    inp.addEventListener('input', ()=>{ day.priorities[+inp.dataset.priority] = inp.value; persist(); });
  });

  root.querySelectorAll('[data-hour]').forEach(inp=>{
    inp.addEventListener('input', ()=>{ day.schedule[inp.dataset.hour] = inp.value; persist(); });
  });

  document.getElementById('dailyGoal').addEventListener('input', (e)=>{ day.goal = e.target.value; persist(); });
  document.getElementById('goalDone').addEventListener('change', (e)=>{ day.goalDone = e.target.checked; persist(); App.refreshIfActive('dashboard'); });

  function renderTodos(){ App.switchView('daily'); }

  document.getElementById('addTodoBtn').addEventListener('click', addTodo);
  document.getElementById('newTodo').addEventListener('keydown', (e)=>{ if (e.key==='Enter') addTodo(); });
  function addTodo(){
    const inp = document.getElementById('newTodo');
    const v = inp.value.trim();
    if (!v) return;
    day.todos.push({ id: uid(), text:v, done:false });
    persist(); renderTodos();
  }

  root.querySelectorAll('.todo-check').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const row = cb.closest('.check-row');
      const t = day.todos.find(t=>t.id===row.dataset.id);
      t.done = cb.checked;
      persist(); renderTodos();
    });
  });
  root.querySelectorAll('.todo-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('.check-row');
      day.todos = day.todos.filter(t=>t.id!==row.dataset.id);
      persist(); renderTodos();
    });
  });

  document.getElementById('addDfBtn').addEventListener('click', addDf);
  document.getElementById('newDontForget').addEventListener('keydown', (e)=>{ if (e.key==='Enter') addDf(); });
  function addDf(){
    const inp = document.getElementById('newDontForget');
    const v = inp.value.trim();
    if (!v) return;
    day.dontForget.push(v);
    persist(); renderTodos();
  }
  root.querySelectorAll('.df-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('.check-row');
      day.dontForget.splice(+row.dataset.i, 1);
      persist(); renderTodos();
    });
  });
};
