/* ============================================================
   views/monthly.js
   ============================================================ */
window.Views = window.Views || {};

Views.monthly = function(root){
  const d = Store.data;
  const now = new Date();
  const mk = monthKey(now);
  if (!d.monthly[mk]) d.monthly[mk] = { focus:'', importantDates:[], notes:'' };
  const month = d.monthly[mk];

  const year = now.getFullYear(), monthIdx = now.getMonth();
  const firstDay = new Date(year, monthIdx, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, monthIdx+1, 0).getDate();
  const monthName = now.toLocaleDateString(undefined, { month:'long', year:'numeric' });
  const todayDate = now.getDate();

  const datesByDay = {};
  month.importantDates.forEach(ev=>{
    const dayNum = parseInt(ev.date.split('-')[2], 10);
    datesByDay[dayNum] = datesByDay[dayNum] || [];
    datesByDay[dayNum].push(ev);
  });

  let cells = '';
  for (let i=0; i<firstDay; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let day=1; day<=daysInMonth; day++){
    const isToday = day === todayDate;
    const hasEvent = !!datesByDay[day];
    cells += `<div class="cal-cell ${isToday?'today':''}">${day}${hasEvent?'<span class="cal-dot"></span>':''}</div>`;
  }

  root.innerHTML = `
    <div class="grid grid-12" style="margin-bottom:18px;">
      <div class="card span-8">
        <div class="card-head"><h3>${monthName}</h3><span class="muted">Interactive calendar</span></div>
        <div class="cal-grid" style="margin-bottom:8px;">
          ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=>`<div class="cal-dow">${x}</div>`).join('')}
        </div>
        <div class="cal-grid">${cells}</div>
      </div>
      <div class="card span-4">
        <div class="card-head"><h3>Monthly Focus</h3></div>
        <textarea id="monthFocus" placeholder="What's your theme for the month?" style="min-height:90px;">${esc(month.focus)}</textarea>
        <div class="card-head" style="margin-top:16px;"><h3>Notes</h3></div>
        <textarea id="monthNotes" placeholder="Extra notes..." style="min-height:90px;">${esc(month.notes)}</textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Important Dates</h3></div>
      <div class="row-list" id="impDatesList">
        ${month.importantDates.map(ev=>`
          <div class="check-row" data-id="${ev.id}">
            <span class="badge pin">${ev.date.split('-')[2]}</span>
            <span>${esc(ev.label)}</span>
            <button class="row-del imp-del">${Icons.trash}</button>
          </div>`).join('') || `<div class="empty-state">No important dates added yet.</div>`}
      </div>
      <div class="add-row">
        <input type="date" id="newImpDate" value="${mk}-01">
        <input type="text" id="newImpLabel" placeholder="What's happening?">
        <button class="btn btn-primary btn-sm" id="addImpBtn">${Icons.plus}Add</button>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('monthly'); }

  document.getElementById('monthFocus').addEventListener('input', (e)=>{ month.focus = e.target.value; persist(); });
  document.getElementById('monthNotes').addEventListener('input', (e)=>{ month.notes = e.target.value; persist(); });

  document.getElementById('addImpBtn').addEventListener('click', ()=>{
    const dateInp = document.getElementById('newImpDate');
    const labelInp = document.getElementById('newImpLabel');
    if (!dateInp.value || !labelInp.value.trim()) return;
    month.importantDates.push({ id:uid(), date:dateInp.value, label:labelInp.value.trim() });
    persist(); rerender();
  });
  root.querySelectorAll('.imp-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.closest('.check-row').dataset.id;
      month.importantDates = month.importantDates.filter(e=>e.id!==id);
      persist(); rerender();
    });
  });
};
