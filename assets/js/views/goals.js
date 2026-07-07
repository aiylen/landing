/* ============================================================
   views/goals.js
   ============================================================ */
window.Views = window.Views || {};

Views.goals = function(root){
  const d = Store.data;

  function goalCard(g){
    const doneSteps = g.steps.filter(s=>s.done).length;
    const pct = g.steps.length ? Math.round(doneSteps/g.steps.length*100) : 0;
    return `
      <div class="card" data-goal-id="${g.id}" style="margin-bottom:16px;">
        <div class="card-head">
          <div style="flex:1;">
            <input type="text" class="goal-title" data-id="${g.id}" value="${esc(g.title)}" style="border:none;background:transparent;padding:0;font-family:var(--font-display);font-weight:700;font-size:16px;">
          </div>
          ${ringSVG(pct, 56, 6)}
          <button class="row-del goal-remove" data-id="${g.id}">${Icons.trash}</button>
        </div>

        <div class="grid grid-2" style="margin-bottom:14px;">
          <div>
            <label>Why this goal</label>
            <textarea class="goal-why" data-id="${g.id}" style="min-height:56px;">${esc(g.why)}</textarea>
          </div>
          <div>
            <label>Reward</label>
            <input type="text" class="goal-reward" data-id="${g.id}" value="${esc(g.reward)}">
            <label style="margin-top:10px;">Deadline</label>
            <input type="date" class="goal-deadline" data-id="${g.id}" value="${esc(g.deadline)}">
          </div>
        </div>

        <label style="margin-bottom:6px;">Action Steps</label>
        <div class="row-list">
          ${g.steps.map((s,i)=>`
            <div class="check-row ${s.done?'done':''}" data-step-i="${i}">
              <input type="checkbox" class="step-check" data-goal="${g.id}" data-i="${i}" ${s.done?'checked':''}>
              <span>${esc(s.text)}</span>
              <button class="row-del step-del" data-goal="${g.id}" data-i="${i}">${Icons.trash}</button>
            </div>`).join('')}
        </div>
        <div class="add-row">
          <input type="text" class="new-step" data-goal="${g.id}" placeholder="Add an action step">
          <button class="btn btn-ghost btn-sm add-step-btn" data-goal="${g.id}">${Icons.plus}</button>
        </div>
      </div>
    `;
  }

  root.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px;">
      <button class="btn btn-primary btn-sm" id="addGoalBtn">${Icons.plus}New Goal</button>
    </div>
    ${d.goals.map(goalCard).join('') || `<div class="empty-state">No goals yet. Create your first one.</div>`}
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('goals'); }
  function recalcProgress(g){
    g.progress = g.steps.length ? Math.round(g.steps.filter(s=>s.done).length/g.steps.length*100) : 0;
  }

  document.getElementById('addGoalBtn').addEventListener('click', ()=>{
    d.goals.push({ id:uid(), title:'New Goal', why:'', steps:[], deadline:'', reward:'', progress:0 });
    persist(); rerender();
  });

  root.querySelectorAll('.goal-title').forEach(inp=> inp.addEventListener('input', ()=>{
    d.goals.find(g=>g.id===inp.dataset.id).title = inp.value; persist();
  }));
  root.querySelectorAll('.goal-why').forEach(inp=> inp.addEventListener('input', ()=>{
    d.goals.find(g=>g.id===inp.dataset.id).why = inp.value; persist();
  }));
  root.querySelectorAll('.goal-reward').forEach(inp=> inp.addEventListener('input', ()=>{
    d.goals.find(g=>g.id===inp.dataset.id).reward = inp.value; persist();
  }));
  root.querySelectorAll('.goal-deadline').forEach(inp=> inp.addEventListener('input', ()=>{
    d.goals.find(g=>g.id===inp.dataset.id).deadline = inp.value; persist();
  }));
  root.querySelectorAll('.goal-remove').forEach(btn=> btn.addEventListener('click', ()=>{
    d.goals = d.goals.filter(g=>g.id!==btn.dataset.id); persist(); rerender();
  }));

  root.querySelectorAll('.add-step-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const inp = root.querySelector(`.new-step[data-goal="${btn.dataset.goal}"]`);
      if (!inp.value.trim()) return;
      const g = d.goals.find(g=>g.id===btn.dataset.goal);
      g.steps.push({ text: inp.value.trim(), done:false });
      recalcProgress(g); persist(); rerender();
    });
  });
  root.querySelectorAll('.step-check').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const g = d.goals.find(g=>g.id===cb.dataset.goal);
      g.steps[+cb.dataset.i].done = cb.checked;
      recalcProgress(g); persist(); rerender();
    });
  });
  root.querySelectorAll('.step-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const g = d.goals.find(g=>g.id===btn.dataset.goal);
      g.steps.splice(+btn.dataset.i, 1);
      recalcProgress(g); persist(); rerender();
    });
  });
};
