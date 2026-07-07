/* ============================================================
   views/weekly.js
   ============================================================ */
window.Views = window.Views || {};

Views.weekly = function(root){
  const d = Store.data;
  const wk = d.weekly.current;
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const doneTasks = wk.tasks.filter(t=>t.done).length;

  root.innerHTML = `
    <div class="grid grid-12" style="margin-bottom:18px;">
      <div class="card span-8">
        <div class="card-head"><h3>Weekly Goals</h3></div>
        <div class="row-list" id="weeklyGoals">
          ${wk.goals.map((g,i)=>`
            <div class="check-row" data-i="${i}">
              <span style="font-family:var(--font-mono);color:var(--primary);font-weight:700;">0${i+1}</span>
              <input type="text" data-goal="${i}" value="${esc(g)}" style="border:none;background:transparent;padding:0;">
              <button class="row-del goal-del">${Icons.trash}</button>
            </div>`).join('')}
        </div>
        <div class="add-row">
          <input type="text" id="newWeekGoal" placeholder="Add a weekly goal">
          <button class="btn btn-primary btn-sm" id="addWeekGoalBtn">${Icons.plus}Add</button>
        </div>
      </div>
      <div class="card span-4" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div class="card-head" style="width:100%;"><h3>Weekly Tasks</h3></div>
        ${ringSVG(wk.tasks.length ? Math.round(doneTasks/wk.tasks.length*100) : 0, 92, 9)}
        <p style="font-size:12.5px;color:var(--text-dim);margin-top:8px;">${doneTasks}/${wk.tasks.length} complete</p>
      </div>
    </div>

    <div class="card" style="margin-bottom:18px;">
      <div class="card-head"><h3>Monday – Sunday Planning</h3></div>
      <div class="week-grid">
        ${DAYS.map(day=>`
          <div>
            <div style="font-family:var(--font-display);font-weight:700;font-size:12.5px;margin-bottom:8px;text-align:center;">${day}</div>
            <div class="row-list" data-day="${day}" style="min-height:40px;">
              ${(wk.days[day]||[]).map((item,i)=>`
                <div class="check-row" style="font-size:12px;padding:6px 8px;" data-day-item="${day}:${i}">
                  <span>${esc(item)}</span>
                  <button class="row-del day-item-del">${Icons.trash}</button>
                </div>`).join('')}
            </div>
            <button class="btn btn-ghost btn-sm day-add-btn" data-day-add="${day}" style="width:100%;margin-top:6px;justify-content:center;">${Icons.plus}</button>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="grid grid-12">
      <div class="card span-6">
        <div class="card-head"><h3>Weekly Tasks List</h3></div>
        <div class="row-list" id="weekTaskList">
          ${wk.tasks.map(t=>`
            <div class="check-row ${t.done?'done':''}" data-id="${t.id}">
              <input type="checkbox" class="week-task-check" ${t.done?'checked':''}>
              <span>${esc(t.text)}</span>
              <button class="row-del week-task-del">${Icons.trash}</button>
            </div>`).join('') || `<div class="empty-state">No tasks yet.</div>`}
        </div>
        <div class="add-row">
          <input type="text" id="newWeekTask" placeholder="Add a task">
          <button class="btn btn-primary btn-sm" id="addWeekTaskBtn">${Icons.plus}Add</button>
        </div>
      </div>
      <div class="card span-6">
        <div class="card-head"><h3>Notes</h3></div>
        <textarea id="weekNotes" style="min-height:150px;" placeholder="Anything else worth remembering this week?">${esc(wk.notes)}</textarea>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('weekly'); }

  root.querySelectorAll('[data-goal]').forEach(inp=>{
    inp.addEventListener('input', ()=>{ wk.goals[+inp.dataset.goal] = inp.value; persist(); });
  });
  root.querySelectorAll('.goal-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = +btn.closest('.check-row').dataset.i;
      wk.goals.splice(i,1); persist(); rerender();
    });
  });
  document.getElementById('addWeekGoalBtn').addEventListener('click', ()=>{
    const inp = document.getElementById('newWeekGoal');
    if (!inp.value.trim()) return;
    wk.goals.push(inp.value.trim()); persist(); rerender();
  });

  root.querySelectorAll('.day-add-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const day = btn.dataset.dayAdd;
      const text = prompt(`Add item to ${day}:`);
      if (text && text.trim()){
        wk.days[day] = wk.days[day] || [];
        wk.days[day].push(text.trim());
        persist(); rerender();
      }
    });
  });
  root.querySelectorAll('.day-item-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const [day,i] = btn.closest('[data-day-item]').dataset.dayItem.split(':');
      wk.days[day].splice(+i,1); persist(); rerender();
    });
  });

  document.getElementById('addWeekTaskBtn').addEventListener('click', ()=>{
    const inp = document.getElementById('newWeekTask');
    if (!inp.value.trim()) return;
    wk.tasks.push({ id:uid(), text:inp.value.trim(), done:false });
    persist(); rerender();
  });
  root.querySelectorAll('.week-task-check').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const row = cb.closest('.check-row');
      wk.tasks.find(t=>t.id===row.dataset.id).done = cb.checked;
      persist(); rerender();
    });
  });
  root.querySelectorAll('.week-task-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('.check-row');
      wk.tasks = wk.tasks.filter(t=>t.id!==row.dataset.id);
      persist(); rerender();
    });
  });

  document.getElementById('weekNotes').addEventListener('input', (e)=>{ wk.notes = e.target.value; persist(); });
};
